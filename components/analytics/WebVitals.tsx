"use client";

import { useEffect } from "react";
import type { Metric } from "web-vitals";
import { withBase } from "@/lib/base";
import { ymCall } from "@/lib/analytics/ym";

/**
 * RUM Core Web Vitals (ТЗ §15/§16): LCP / INP / CLS с атрибуцией через
 * библиотеку `web-vitals`, бикон в аналитику. Особый фокус — INP < 200 мс
 * (калькулятор, Режим A). Грузится динамически, чтобы не влиять на сам INP.
 *
 * Метрики уходят во все подключённые счётчики (см. lib/analytics/ym.ts);
 * раньше номер брался из отдельной переменной NEXT_PUBLIC_YM_ID и мог
 * разойтись с тем, чем счётчик инициализирован.
 */
export function WebVitals() {
  useEffect(() => {
    let cancelled = false;

    import("web-vitals/attribution")
      .then(({ onCLS, onINP, onLCP }) => {
        if (cancelled) return;

        const report = (metric: Metric) => {
          const a =
            (metric as { attribution?: Record<string, unknown> }).attribution ?? {};
          const target =
            (a.interactionTarget as string) ||
            (a.element as string) ||
            (a.largestShiftTarget as string) ||
            undefined;
          const body = JSON.stringify({
            name: metric.name,
            value: Math.round(metric.value * 1000) / 1000,
            rating: metric.rating,
            id: metric.id,
            navigationType: metric.navigationType,
            path: location.pathname,
            target,
          });

          const endpoint = withBase("/api/vitals");
          if (typeof navigator.sendBeacon === "function") {
            navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
          } else {
            fetch(endpoint, {
              method: "POST",
              body,
              keepalive: true,
              headers: { "Content-Type": "application/json" },
            }).catch(() => {});
          }

          ymCall("params", { [`cwv_${metric.name}`]: metric.value });
        };

        onLCP(report);
        onINP(report);
        onCLS(report);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
