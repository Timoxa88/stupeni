import { ymCall } from "./ym";

/**
 * Цели Яндекс.Метрики.
 *
 * Идентификаторы должны совпадать с полем «Идентификатор цели» в интерфейсе
 * Метрики (счётчик 111228357) — цели заведены через Management API 01.08.2026.
 * Меняешь строку здесь — меняй и цель в Метрике, иначе она перестанет считаться.
 *
 * С 05.08.2026 событие уходит во ВСЕ подключённые счётчики (их два, см.
 * lib/analytics/ym.ts) и дублируется в `dataLayer` для Google Tag Manager.
 * Во втором счётчике целей с такими идентификаторами пока нет — событие туда
 * приходит и просто не учитывается, пока цель не заведут; вреда от этого нет.
 */
export const GOALS = {
  /** Заявка ушла успешно — из любой формы сайта. */
  lead: "lead_submit",
  /** Клик по номеру телефона (tel:). */
  phone: "phone_click",
  /** Клик по адресу почты (mailto:). */
  email: "email_click",
  /** Пользователь довёл калькулятор до результата. */
  calc: "calc_result",
  /** Открыт мессенджер (WhatsApp/Telegram). */
  messenger: "messenger_click",
} as const;

export type GoalName = (typeof GOALS)[keyof typeof GOALS];

/**
 * Отправка цели. Молча ничего не делает, если Метрика не загрузилась
 * (блокировщик, отказ от cookie в браузере) — аналитика не должна ломать сценарий.
 */
export function reachGoal(goal: GoalName, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  ymCall("reachGoal", goal, params);

  // GTM: то же событие под тем же именем — триггеры настраиваются в интерфейсе.
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: goal, ...(params ?? {}) });
  } catch {
    /* аналитика не должна ронять интерфейс */
  }
}
