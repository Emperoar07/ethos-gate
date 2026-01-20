import { create, getNumericDate, verify } from "djwt";
import { getAddress, verifyMessage } from "npm:ethers@6.12.1";
import { isNonceUsed, markNonceUsed } from "./nonceStore.ts";

const JWT_TTL_SECONDS = 5 * 60;
const MAX_SIGNATURE_AGE_MS = 60 * 1000; // 60 seconds - industry standard

// JWT_SECRET is required for production security
const secret = Deno.env.get("JWT_SECRET");
if (!secret) {
  console.error("❌ JWT_SECRET environment variable is required!");
  console.error("Set JWT_SECRET in your .env file to a secure random string.");
  console.error("Generate one with: openssl rand -base64 32");
  Deno.exit(1);
}

const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(secret),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

export class AuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface SignedRequest {
  address: string;
  signature: string;
  nonce: string;
  issuedAt: string;
}

export async function verifySignedRequest({ address, signature, nonce, issuedAt }: SignedRequest) {
  if (!signature) {
    throw new AuthError(401, "Signature is required");
  }

  if (!nonce) {
    throw new AuthError(400, "Nonce is required");
  }

  if (!issuedAt) {
    throw new AuthError(400, "issuedAt is required");
  }

  const issuedAtMs = Date.parse(issuedAt);
  if (Number.isNaN(issuedAtMs)) {
    throw new AuthError(400, "Invalid issuedAt timestamp");
  }

  if (Math.abs(Date.now() - issuedAtMs) > MAX_SIGNATURE_AGE_MS) {
    throw new AuthError(401, "Signature expired");
  }

  const nonceKey = `${address.toLowerCase()}:${nonce}`;
  if (await isNonceUsed(nonceKey)) {
    throw new AuthError(401, "Nonce already used");
  }

  const expectedMessage =
    `EthosGate Score Check\nAddress: ${address}\nNonce: ${nonce}\nIssued At: ${issuedAt}`;
  const recovered = verifyMessage(expectedMessage, signature);

  if (recovered.toLowerCase() !== address.toLowerCase()) {
    throw new AuthError(401, "Signature does not match address");
  }

  await markNonceUsed(nonceKey);
}

export async function issueAccessToken(payload: Record<string, unknown>): Promise<string> {
  return await create(
    { alg: "HS256", typ: "JWT" },
    { ...payload, exp: getNumericDate(JWT_TTL_SECONDS), iat: getNumericDate(0) },
    key
  );
}

export async function verifyAccessToken(token: string): Promise<Record<string, unknown>> {
  const payload = await verify(token, key);
  return payload as Record<string, unknown>;
}

/**
 * Validates and normalizes an Ethereum address using EIP-55 checksum
 * @param address - The address to validate
 * @returns The checksummed address
 * @throws AuthError if the address is invalid
 */
export function validateAndNormalizeAddress(address: string): string {
  if (!address || typeof address !== "string") {
    throw new AuthError(400, "Address is required");
  }

  // Basic format check
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new AuthError(400, "Invalid Ethereum address format");
  }

  try {
    // getAddress validates checksum and returns checksummed address
    // If checksum is invalid but address is otherwise valid, it still returns checksummed version
    return getAddress(address);
  } catch {
    throw new AuthError(400, "Invalid Ethereum address");
  }
}
