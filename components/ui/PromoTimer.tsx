"use client";

import { useEffect, useState } from "react";

/**
 * Обратный отсчёт до конца акции (ТЗ §8.1). По истечении сам исчезает —
 * цена и бейдж возвращаются к базовым (логика гашения — в activePromo).
 */
export function PromoTimer({
  endsAt,
  className = "",
}: {
  endsAt: string;
  className?: string;
}) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = Date.parse(endsAt);
    if (!Number.isFinite(end)) return;
    const tick = () => setLeft(end - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (left === null || left <= 0) return null;

  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className={`tabular inline-flex items-center gap-1.5 text-sm font-semibold text-clinker ${className}`}
      role="timer"
      aria-label="До конца акции"
    >
      <span aria-hidden>⏱</span>
      <span>
        {d > 0 ? `${d} дн ` : ""}
        {pad(h)}:{pad(m)}:{pad(sec)}
      </span>
    </div>
  );
}
