import { Router } from "oak";
import { AuthError, issueAccessToken, verifyAccessToken, verifySignedRequest } from "../services/auth.ts";
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

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid Ethereum address format" };
      return;
    }

    await verifySignedRequest({ address, signature, nonce, issuedAt });

    const [score, profile] = await Promise.all([getEthosScore(address), getEthosProfile(address)]);
    const tier = getTier(score);

    const token = await issueAccessToken({ address, score, tier });

    ctx.response.body = {
      token,
      address,
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
