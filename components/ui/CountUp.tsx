"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Анимированный счётчик при попадании в viewport (ТЗ §5/§6: живые счётчики).
 * Поддерживает префикс/суффикс и нечисловые значения (тогда показывает как есть).
 */
export function CountUp({
  value,
  duration = 1400,
  className = "",
}: {
  value: string; // напр. "11+", "85", "20 мм", "6"
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const match = value.match(/^(\d[\d\s]*)(.*)$/);
  const target = match ? parseInt(match[1].replace(/\s/g, ""), 10) : NaN;
  const suffix = match ? match[2] : value;
  const [display, setDisplay] = useState(Number.isNaN(target) ? value : "0");

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(target)) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setDisplay(String(target) + suffix);
      return;
    }

    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(target * eased) + (t === 1 ? suffix : ""));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, suffix, duration]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {display}
    </span>
  );
}
