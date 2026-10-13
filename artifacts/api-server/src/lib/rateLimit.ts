import { type Request, type Response, type NextFunction } from "express";

// Simple in-memory per-user limiter. Good enough for a single instance;
// move to a shared store if the API is scaled horizontally.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const hits = new Map<string, number[]>();

setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [key, times] of hits) {
    const recent = times.filter((t) => t > cutoff);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
}, 60 * 1000).unref();

export function aiRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.user?.id ?? req.ip ?? "anon";
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => t > now - WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    res.status(429).json({ error: "Too many AI requests. Please wait a few minutes and try again." });
    return;
  }
  recent.push(now);
  hits.set(key, recent);
  next();
}
