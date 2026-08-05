/**
 * Общая точка правды о счётчиках Яндекс.Метрики на клиенте.
 *
 * Счётчиков на сайте ДВА (05.08.2026): свой 111228357 (в нём заведены цели
 * и живёт вся статистика с 01.08) и 102026434 из набора кодов hc-sftk.ru.
 * Номера приходят из настроек админки, то есть на сборке они неизвестны —
 * поэтому init-скрипт публикует фактически проинициализированные номера в
 * `window.__ymCounters`, а всё остальное (цели, Core Web Vitals) читает их
 * отсюда. Раньше цели брали номер из отдельной переменной
 * `NEXT_PUBLIC_YM_ID`, и она могла разойтись с `NEXT_PUBLIC_YM_COUNTER_ID`,
 * которой инициализируется счётчик — тогда цели молча уходили в никуда.
 * Переменная осталась только запасным вариантом.
 */

type YmFn = (id: number, action: string, ...rest: unknown[]) => void;

declare global {
  interface Window {
    ym?: YmFn;
    /** Номера счётчиков, реально проинициализированных на странице. */
    __ymCounters?: number[];
    /** Очередь GTM. */
    dataLayer?: Record<string, unknown>[];
  }
}

/** Номера счётчиков, которым имеет смысл слать события. */
export function ymCounters(): number[] {
  if (typeof window === "undefined") return [];
  const live = window.__ymCounters;
  if (live?.length) return live.filter((id) => Number.isFinite(id) && id > 0);
  const fallback = Number(process.env.NEXT_PUBLIC_YM_ID) || 0;
  return fallback ? [fallback] : [];
}

/**
 * Вызов `ym(...)` по всем счётчикам. Молча ничего не делает, если Метрика не
 * загрузилась (блокировщик, отказ от cookie) — аналитика не должна ломать
 * сценарий пользователя.
 */
export function ymCall(action: string, ...rest: unknown[]): void {
  if (typeof window === "undefined") return;
  const ym = window.ym;
  if (typeof ym !== "function") return;
  for (const id of ymCounters()) {
    try {
      ym(id, action, ...rest);
    } catch {
      /* аналитика не должна ронять интерфейс */
    }
  }
}
