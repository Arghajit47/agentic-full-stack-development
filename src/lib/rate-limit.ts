/** Simple in-memory rate limiter keyed by client IP hash. */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

export function resetRateLimitStore(): void {
  store.clear();
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const newBucket: Bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, newBucket);
    return { allowed: true, remaining: maxRequests - 1, resetAt: newBucket.resetAt };
  }

  if (bucket.count < maxRequests) {
    bucket.count += 1;
    return { allowed: true, remaining: maxRequests - bucket.count, resetAt: bucket.resetAt };
  }

  return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
}

export function hashIp(ip: string): string {
  // Simple non-cryptographic hash for IP tracking; sufficient for rate-limit accounting.
  let h = 0;
  for (let i = 0; i < ip.length; i += 1) {
    h = (h << 5) - h + ip.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  // @ts-expect-error — NextRequest exposes .ip in some runtime environments
  return request.ip ?? "127.0.0.1";
}
