import rateLimit, { ipKeyGenerator, type RateLimitRequestHandler } from "express-rate-limit";
import { type Request } from "express";

/**
 * Rate limits are keyed by authenticated user id so that one abusive account
 * cannot burn the shared Anthropic budget. Unauthenticated requests never reach
 * these handlers (every AI route checks `isAuthenticated` first), but we fall
 * back to the request IP just in case that ordering ever changes.
 */
function keyByUser(req: Request): string {
  if (req.user?.id) return `user:${req.user.id}`;
  // ipKeyGenerator normalizes IPv6 to its /64 prefix; without it a client with
  // an IPv6 range could rotate addresses to reset the counter.
  return `ip:${ipKeyGenerator(req.ip ?? "")}`;
}

const common = {
  standardHeaders: true as const,
  legacyHeaders: false as const,
  keyGenerator: keyByUser,
  message: { error: "Rate limit exceeded. Please wait a moment and try again." },
};

/** Conversational endpoint: bursty by nature, so allow a short burst per minute. */
export const chatLimiter: RateLimitRequestHandler = rateLimit({
  ...common,
  windowMs: 60_000,
  limit: 10,
});

/** One-shot generators (NAICS, grants, capability statement) are far more expensive. */
export const generationLimiter: RateLimitRequestHandler = rateLimit({
  ...common,
  windowMs: 60_000,
  limit: 5,
});

/** Backstop across all AI endpoints so no single account can run all day. */
export const dailyAiLimiter: RateLimitRequestHandler = rateLimit({
  ...common,
  windowMs: 24 * 60 * 60_000,
  limit: 300,
  message: {
    error:
      "Daily AI usage limit reached for this account. It resets in 24 hours.",
  },
});
