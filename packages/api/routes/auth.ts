import { Router } from "oak";
import { AuthError, issueAccessToken, validateAndNormalizeAddress, verifyAccessToken, verifySignedRequest } from "../services/auth.ts";
import { getEthosScore, getEthosProfile, getTier } from "../services/ethos.ts";

export const authRouter = new Router();

authRouter.post("/api/access-token", async (ctx) => {
  try {
    const body = await ctx.request.body({ type: "json" }).value;
    const { address, signature, nonce, issuedAt } = body;

    if (!address) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Address is required" };
      return;
    }

    // Validate address format and checksum using EIP-55
    const validatedAddress = validateAndNormalizeAddress(address);
    const normalizedAddress = validatedAddress.toLowerCase();

    await verifySignedRequest({ address: normalizedAddress, signature, nonce, issuedAt });

    const [score, profile] = await Promise.all([getEthosScore(normalizedAddress), getEthosProfile(normalizedAddress)]);
    const tier = getTier(score);

    const token = await issueAccessToken({ address: normalizedAddress, score, tier });

    ctx.response.body = {
      token,
      address: normalizedAddress,
      score,
      tier,
      vouches: profile?.vouchCount || 0,
      reviews: profile?.reviewCount || 0
    };
  } catch (error) {
    if (error instanceof AuthError) {
      ctx.response.status = error.status;
      ctx.response.body = { error: error.message };
      return;
    }

    console.error("[Error] access-token:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

authRouter.post("/api/verify-token", async (ctx) => {
  try {
    const body = await ctx.request.body({ type: "json" }).value;
    const { token } = body;

    if (!token || typeof token !== "string") {
      ctx.response.status = 400;
      ctx.response.body = { error: "Token is required" };
      return;
    }

    const payload = await verifyAccessToken(token);
    ctx.response.body = payload;
  } catch (error) {
    console.error("[Error] verify-token:", error);
    ctx.response.status = 401;
    ctx.response.body = { error: "Invalid token" };
  }
});
