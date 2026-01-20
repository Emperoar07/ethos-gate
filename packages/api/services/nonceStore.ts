import { Cache } from "./cache.ts";

const NONCE_TTL_MS = 5 * 60 * 1000;
const memoryCache = new Cache<boolean>(5);

let kv: Deno.Kv | null = null;
try {
  kv = await Deno.openKv();
} catch {
  kv = null;
}

export async function isNonceUsed(key: string): Promise<boolean> {
  if (kv) {
    const result = await kv.get(["nonce", key]);
    return result.value === true;
  }

  return memoryCache.get(key) ?? false;
}

export async function markNonceUsed(key: string): Promise<void> {
  if (kv) {
    await kv.set(["nonce", key], true, { expireIn: NONCE_TTL_MS });
    return;
  }

  memoryCache.set(key, true);
}
