// Minimal in-memory rate limiter. Sufficient for a single-instance MVP.
// For production (serverless/multi-region) swap for @upstash/ratelimit.

import { ApiError } from "./api";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    const secs = Math.ceil((bucket.resetAt - now) / 1000);
    throw new ApiError(`Too many requests. Try again in ${secs}s.`, 429);
  }

  bucket.count += 1;
  return { remaining: limit - bucket.count };
}

export function ipFromRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}
