/**
 * Tiny in-memory token bucket. Per-process — replace with Redis/Upstash for
 * multi-instance deployments. Used by API routes to defend against abuse.
 */

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export function rateLimit(
  key: string,
  opts: { capacity?: number; refillPerMinute?: number } = {}
): RateLimitResult {
  const capacity = opts.capacity ?? 30;
  const refillPerMinute = opts.refillPerMinute ?? 30;
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: capacity, updatedAt: now };

  const elapsedMin = (now - bucket.updatedAt) / 60_000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsedMin * refillPerMinute);
  bucket.updatedAt = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetMs: ((capacity - bucket.tokens) / refillPerMinute) * 60_000,
    };
  }
  buckets.set(key, bucket);
  return {
    allowed: false,
    remaining: 0,
    resetMs: ((1 - bucket.tokens) / refillPerMinute) * 60_000,
  };
}

export function ipFromRequest(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
