/**
 * Цели Яндекс.Метрики.
 *
 * Идентификаторы должны совпадать с полем «Идентификатор цели» в интерфейсе
 * Метрики (счётчик 111228357) — цели заведены через Management API 01.08.2026.
 * Меняешь строку здесь — меняй и цель в Метрике, иначе она перестанет считаться.
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

type YM = (id: number, action: string, goal?: string, params?: unknown) => void;

/**
 * Отправка цели. Молча ничего не делает, если Метрика не загрузилась
 * (блокировщик, отказ от cookie в браузере) — аналитика не должна ломать сценарий.
 */
export function reachGoal(goal: GoalName, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const id = Number(process.env.NEXT_PUBLIC_YM_ID) || 0;
  const ym = (window as unknown as { ym?: YM }).ym;
  if (!id || typeof ym !== "function") return;
  try {
    ym(id, "reachGoal", goal, params);
  } catch {
    /* аналитика не должна ронять интерфейс */
  }
}
