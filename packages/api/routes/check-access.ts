import { Router } from "oak";
import { getEthosScore, getEthosProfile, getTier } from "../services/ethos.ts";
import { AuthError, issueAccessToken, verifyAccessToken, verifySignedRequest } from "../services/auth.ts";

export const checkAccessRouter = new Router();

checkAccessRouter.post("/api/check-access", async (ctx) => {
  try {
    const body = ctx.state.parsedBody ?? await ctx.request.body({ type: "json" }).value;

    // Input validation
    if (!body || typeof body !== "object") {
      ctx.response.status = 400;
      ctx.response.body = { error: "Request body must be a JSON object" };
      return;
    }

    const {
      address,
      minScore: rawMinScore,
      signature,
      nonce,
      issuedAt,
      issueToken: rawIssueToken,
      token
    } = body;

    // Validate and sanitize minScore
    const minScore = typeof rawMinScore === "number" ? Math.max(0, Math.min(rawMinScore, 2500)) : 0;

    // Validate issueToken is boolean
    const issueToken = rawIssueToken === true;

    // Validate token format if provided
    if (token !== undefined && typeof token !== "string") {
      ctx.response.status = 400;
      ctx.response.body = { error: "Token must be a string" };
      return;
    }

    let resolvedAddress = address as string | undefined;

    if (token) {
      try {
        const payload = await verifyAccessToken(token);
        resolvedAddress = payload.address as string;
      } catch {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid or expired token" };
        return;
      }
    }

    if (!resolvedAddress) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Address is required" };
      return;
    }

    // Validate address format
    if (typeof resolvedAddress !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(resolvedAddress)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid Ethereum address format" };
      return;
    }

    // Normalize address to lowercase for consistency
    resolvedAddress = resolvedAddress.toLowerCase() as `0x${string}`;

    if (!token && signature) {
      await verifySignedRequest({ address: resolvedAddress, signature, nonce, issuedAt });
    } else if (address && resolvedAddress !== address.toLowerCase()) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Token does not match requested address" };
      return;
    }

    // Sanitized logging - mask address for privacy
    const maskedAddr = `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`;
    console.log(`[Request] Check access for ${maskedAddr} (minScore: ${minScore})`);

    const [score, profile] = await Promise.all([getEthosScore(resolvedAddress), getEthosProfile(resolvedAddress)]);

    const tier = getTier(score);
    const hasAccess = score >= minScore;

    const response: Record<string, unknown> = {
      address: resolvedAddress,
      score,
      tier,
      hasAccess,
      vouches: profile?.vouchCount || 0,
      reviews: profile?.reviewCount || 0,
      positiveReviews: profile?.positiveReviewCount || 0,
      negativeReviews: profile?.negativeReviewCount || 0
    };

    if (issueToken) {
      if (!signature && !token) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Signature required to issue token" };
        return;
      }
      response.token = await issueAccessToken({ address: resolvedAddress, score, tier });
    }

    // Sanitized logging - mask address for privacy
    console.log(`[Response] ${maskedAddr}: score=${score}, tier=${tier}, hasAccess=${hasAccess}`);

    ctx.response.body = response;
  } catch (error) {
    if (error instanceof AuthError) {
      ctx.response.status = error.status;
      ctx.response.body = { error: error.message };
      return;
    }

    // Log full error internally but don't expose details to client
    console.error("[Error] check-access:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Internal server error",
      message: "An unexpected error occurred. Please try again later."
    };
  }
});
