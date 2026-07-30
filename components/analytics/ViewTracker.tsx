"use client";

import { useEffect } from "react";
import { withBase } from "@/lib/base";

/**
 * Маячок просмотра карточки товара → «Топ артикулов» в админке.
 * Страницы товара кэшируются (ISR), поэтому серверный рендер на каждый визит
 * не выполняется — считаем на клиенте. Дедуп по (IP, артикул) — на сервере.
 */
export function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetch(withBase("/api/view"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        keepalive: true,
      }).catch(() => {});
    }, 1500); // не считаем случайные переходы
    return () => clearTimeout(timer);
  }, [id]);

  return null;
}
