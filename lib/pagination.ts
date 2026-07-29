/**
 * Пагинация листингов (ТЗ B.3: страницы пагинации обходятся, canonical — на себя).
 *
 * Зачем: после замены демо-каталога на реальный в «Террасном клинкере» стало
 * 150+ товаров одной страницей — это сотни изображений в разметке и тяжёлый первый
 * рендер. Плюс Яндексу нужна предсказуемая структура пагинации для индексации.
 */

export const PER_PAGE = 24;

export interface Paged<T> {
  items: T[];
  /** Текущая страница, 1-based и всегда в пределах [1, pages]. */
  page: number;
  pages: number;
  total: number;
  perPage: number;
}

/** Нормализует ?page=… (мусор и выход за границы → 1 или последняя страница). */
export function parsePage(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(v ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function paginate<T>(items: T[], page: number, perPage = PER_PAGE): Paged<T> {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    pages,
    total,
    perPage,
  };
}

/** URL страницы листинга: первая — без параметра (иначе дубль главной страницы
 *  раздела). `query` — активные фильтры каталога, идут перед page. */
export function pageHref(base: string, page: number, query?: string): string {
  const parts = [query, page > 1 ? `page=${page}` : ""].filter(Boolean);
  return parts.length ? `${base}?${parts.join("&")}` : base;
}

/** Суффикс к title/description на страницах со второй и далее (против дублей). */
export function pageSuffix(page: number, pages: number): string {
  return page > 1 ? ` — страница ${page} из ${pages}` : "";
}
