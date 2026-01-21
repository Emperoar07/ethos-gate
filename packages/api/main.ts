import { Application, Router } from "oak";
import { checkAccessRouter } from "./routes/check-access.ts";
import { authRouter } from "./routes/auth.ts";

const app = new Application();
const router = new Router();

// Allowed origins for CORS - configure via environment variable
const rawAllowedOrigins = Deno.env.get("ALLOWED_ORIGINS");
const isProd = (Deno.env.get("DENO_ENV") || "").toLowerCase() === "production";
const ALLOWED_ORIGINS = (rawAllowedOrigins
  ? rawAllowedOrigins.split(",")
  : (isProd ? [] : ["http://localhost:5173", "http://localhost:3000"])
).map(o => o.trim()).filter(Boolean).filter(o => o !== "*");

if (rawAllowedOrigins?.includes("*")) {
  console.warn("[CORS] Wildcard '*' is not allowed. Use explicit origins in ALLOWED_ORIGINS.");
}

if (isProd && ALLOWED_ORIGINS.length === 0) {
  console.warn("[CORS] No ALLOWED_ORIGINS set in production. Requests with Origin will be blocked.");
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_MAX_PER_ADDRESS = 30; // Stricter limit per wallet address
const RATE_LIMIT_STORE_MAX_SIZE = 10000; // Prevent memory bloat
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup of expired rate limit entries (runs every 5 minutes)
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function cleanupRateLimitStore(): void {
  const now = Date.now();
  // Only run cleanup periodically
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  let cleanedCount = 0;
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`[RateLimit] Cleaned ${cleanedCount} expired entries`);
  }
}

function getRateLimitEntry(key: string, now: number, maxCount: number): { allowed: boolean; remaining: number } {
  // Run cleanup opportunistically
  cleanupRateLimitStore();

  // Enforce max store size (evict oldest entries if needed)
  if (rateLimitStore.size >= RATE_LIMIT_STORE_MAX_SIZE) {
    const entriesToDelete = Math.floor(RATE_LIMIT_STORE_MAX_SIZE * 0.1); // Remove 10%
    let deleted = 0;
    for (const oldKey of rateLimitStore.keys()) {
      rateLimitStore.delete(oldKey);
      deleted++;
      if (deleted >= entriesToDelete) break;
    }
    console.log(`[RateLimit] Store at capacity, evicted ${deleted} entries`);
  }

  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: maxCount - 1 };
  }

  if (entry.count >= maxCount) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  // Move to end (most recently used) to keep insertion order fresh
  rateLimitStore.delete(key);
  rateLimitStore.set(key, entry);
  return { allowed: true, remaining: maxCount - entry.count };
}

// Security headers middleware
app.use(async (ctx, next) => {
  // Security headers
  ctx.response.headers.set("X-Content-Type-Options", "nosniff");
  ctx.response.headers.set("X-Frame-Options", "DENY");
  ctx.response.headers.set("X-XSS-Protection", "1; mode=block");
  ctx.response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  ctx.response.headers.set("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none'");
  ctx.response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  await next();
});

// CORS middleware with origin validation
app.use(async (ctx, next) => {
  const origin = ctx.request.headers.get("Origin");

  // Check if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    ctx.response.headers.set("Access-Control-Allow-Origin", origin);
    ctx.response.headers.set("Vary", "Origin");
  }

  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  ctx.response.headers.set("Access-Control-Max-Age", "86400");

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }

  await next();
});

// Logging middleware - sanitized to not expose sensitive data
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // Only log path, not query params which might contain addresses
  const path = ctx.request.url.pathname;
  console.log(`${ctx.request.method} ${path} - ${ctx.response.status} - ${ms}ms`);
});

// Enhanced rate limiting middleware (by IP + optional address)
app.use(async (ctx, next) => {
  const ip = ctx.request.ip || "unknown";
  const now = Date.now();

  // IP-based rate limiting
  const ipResult = getRateLimitEntry(`ip:${ip}`, now, RATE_LIMIT_MAX);
  if (!ipResult.allowed) {
    ctx.response.status = 429;
    ctx.response.headers.set("Retry-After", "60");
    ctx.response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
    ctx.response.headers.set("X-RateLimit-Remaining", "0");
    ctx.response.body = { error: "Rate limit exceeded. Please try again later." };
    return;
  }

  // Add rate limit headers for successful requests
  ctx.response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
  ctx.response.headers.set("X-RateLimit-Remaining", String(ipResult.remaining));

  // For POST requests, also rate limit by combined IP+address
  if (ctx.request.method === "POST" && ctx.request.url.pathname === "/api/check-access") {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      ctx.state.parsedBody = body;
      const address = body?.address?.toLowerCase();
      if (address && /^0x[a-fA-F0-9]{40}$/.test(address)) {
        // Combined IP+address key prevents abuse from same IP with different addresses
        const combinedKey = `combo:${ip}:${address}`;
        const comboResult = getRateLimitEntry(combinedKey, now, RATE_LIMIT_MAX_PER_ADDRESS);
        if (!comboResult.allowed) {
          ctx.response.status = 429;
          ctx.response.headers.set("Retry-After", "60");
          ctx.response.body = { error: "Rate limit exceeded for this address. Please try again later." };
          return;
        }
      }
    } catch {
      // Body parsing failed, continue without address rate limiting
    }
  }

  await next();
});

router.get("/health", (ctx) => {
  ctx.response.body = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "ethos-reputation-gate-api"
  };
});

router.get("/", (ctx) => {
  ctx.response.body = {
    name: "Ethos Reputation Gate API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      checkAccess: "POST /api/check-access"
    },
    documentation: "https://github.com/ethos/reputation-gate"
  };
});

app.use(checkAccessRouter.routes());
app.use(checkAccessRouter.allowedMethods());
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (evt) => {
  console.error("[Server Error]", evt.error);
});

const PORT = parseInt(Deno.env.get("PORT") || "8000");

console.log("========================================");
console.log("🚀 Ethos Reputation Gate API");
console.log("========================================");
console.log(`📡 Server: http://localhost:${PORT}`);
console.log(`💚 Health: http://localhost:${PORT}/health`);
console.log(`📚 Docs:   http://localhost:${PORT}/`);
console.log("========================================");

await app.listen({ port: PORT });
