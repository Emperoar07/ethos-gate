import { Application, Router } from "oak";
import { checkAccessRouter } from "./routes/check-access.ts";
import { authRouter } from "./routes/auth.ts";

const app = new Application();
const router = new Router();

// Allowed origins for CORS - configure via environment variable
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "http://localhost:5173,http://localhost:3000").split(",").map(o => o.trim());

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_MAX_PER_ADDRESS = 30; // Stricter limit per wallet address
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

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
  const ipEntry = rateLimitStore.get(`ip:${ip}`);
  if (!ipEntry || now > ipEntry.resetAt) {
    rateLimitStore.set(`ip:${ip}`, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else if (ipEntry.count >= RATE_LIMIT_MAX) {
    ctx.response.status = 429;
    ctx.response.body = { error: "Rate limit exceeded. Please try again later." };
    return;
  } else {
    ipEntry.count += 1;
    rateLimitStore.set(`ip:${ip}`, ipEntry);
  }

  // For POST requests, also rate limit by wallet address if provided
  if (ctx.request.method === "POST" && ctx.request.url.pathname === "/api/check-access") {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const address = body?.address?.toLowerCase();
      if (address && /^0x[a-fA-F0-9]{40}$/.test(address)) {
        const addrEntry = rateLimitStore.get(`addr:${address}`);
        if (!addrEntry || now > addrEntry.resetAt) {
          rateLimitStore.set(`addr:${address}`, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        } else if (addrEntry.count >= RATE_LIMIT_MAX_PER_ADDRESS) {
          ctx.response.status = 429;
          ctx.response.body = { error: "Rate limit exceeded for this address. Please try again later." };
          return;
        } else {
          addrEntry.count += 1;
          rateLimitStore.set(`addr:${address}`, addrEntry);
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
