/**
 * In-memory rate limit / дедуп (ТЗ §15). Одного процесса pm2 достаточно;
 * при масштабировании на несколько инстансов — Redis/KV.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const rec = buckets.get(key);

  if (!rec || rec.resetAt <= now) {
    // Сборка мусора: карта не должна расти бесконечно от уникальных IP.
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  rec.count += 1;
  return { ok: rec.count <= limit, remaining: Math.max(0, limit - rec.count), resetAt: rec.resetAt };
}
