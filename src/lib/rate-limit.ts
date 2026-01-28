const rateMap = new Map<string, number[]>();

/**
 * In-memory sliding window rate limiter.
 * Returns { success: true } if under limit, { success: false } if over.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean } {
  const now = Date.now();
  const timestamps = rateMap.get(key) ?? [];

  // Remove entries outside the window
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= limit) {
    rateMap.set(key, valid);
    return { success: false };
  }

  valid.push(now);
  rateMap.set(key, valid);
  return { success: true };
}
