"use client";

import { useEffect } from "react";
import { GOALS, reachGoal } from "@/lib/analytics/goals";

/**
 * Клики по телефону, почте и мессенджерам — одним делегированным слушателем
 * на документе.
 *
 * Альтернатива — вешать onClick на каждую ссылку, но телефоны раскиданы по
 * шапке, подвалу, мобильному бару, главной и контактам, и половина этих файлов —
 * серверные компоненты: ради обработчика их пришлось бы делать клиентскими и
 * тащить в бандл. Слушатель на document ловит и те ссылки, которые появятся позже.
 *
 * Слушаем в фазе перехвата (capture): ссылка уводит со страницы, и обычный
 * всплывающий обработчик может не успеть отработать.
 */
export function GoalTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a[href]");
      if (!el) return;
      const href = (el as HTMLAnchorElement).getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        reachGoal(GOALS.phone, { number: href.slice(4) });
      } else if (href.startsWith("mailto:")) {
        reachGoal(GOALS.email);
      } else if (/^https?:\/\/(wa\.me|t\.me|api\.whatsapp\.com)/i.test(href)) {
        reachGoal(GOALS.messenger, { href });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
