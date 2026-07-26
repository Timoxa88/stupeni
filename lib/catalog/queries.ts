/**
 * Запросы к каталогу: категории, выборки по бренду/применению, промо-логика.
 * Чистые функции над сид-массивом (в проде — над данными CMS).
 */

import type { ApplicationCode, Product, ProductPromo } from "./types";
import { SEED_PRODUCTS } from "./seed";

/** Три продуктовые категории-хаба (ТЗ §3). */
export type CategoryKey =
  | "terrasnyy-klinker"
  | "terrasnye-plastiny"
  | "plastiny-pod-derevo";

/** Категория артикула выводится из типа и поверхности (ТЗ §1). */
export function productCategory(p: Product): CategoryKey {
  if (p.product_type === "step_system") return "terrasnyy-klinker";
  if (p.specs.surface === "wood") return "plastiny-pod-derevo";
  return "terrasnye-plastiny";
}

export function activeProducts(): Product[] {
  return SEED_PRODUCTS.filter((p) => p.active);
}

export function getProductById(id: string): Product | undefined {
  return SEED_PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(cat: CategoryKey): Product[] {
  return activeProducts().filter((p) => productCategory(p) === cat);
}

export function getProductsByBrand(name: string): Product[] {
  return activeProducts().filter((p) => p.brand === name);
}

export function getProductsByApplication(app: ApplicationCode): Product[] {
  return activeProducts().filter((p) => p.application.includes(app));
}

/** Похожие: тот же сценарий применения, другой артикул (ТЗ §8.4 вкладка 7). */
export function getRelatedProducts(p: Product, limit = 4): Product[] {
  return activeProducts()
    .filter((x) => x.id !== p.id && x.application.some((a) => p.application.includes(a)))
    .slice(0, limit);
}

// ── Промо (ТЗ §8.1) ──────────────────────────────────────────────────────────

/**
 * Возвращает промо, если оно активно (нет дедлайна или дедлайн в будущем).
 * По истечении `ends_at` акция гаснет автоматически — карточка показывает
 * базовую цену. `now` параметризуем для тестов/детерминизма.
 */
export function activePromo(
  p: Product,
  now: number = Date.now(),
): ProductPromo | undefined {
  const promo = p.promo;
  if (!promo) return undefined;
  if (promo.ends_at) {
    const end = Date.parse(promo.ends_at);
    if (Number.isFinite(end) && end <= now) return undefined;
  }
  return promo;
}

/** Базовая «от» цена артикула, ₽ (для витрины). */
export function basePrice(p: Product): number {
  if (p.product_type === "step_system") {
    const front = p.elements?.find((e) => e.code === "front");
    return front?.price_rub ?? p.elements?.[0]?.price_rub ?? 0;
  }
  const f = p.formats?.[0];
  return f?.price_rub_pcs ?? f?.price_rub_sqm ?? 0;
}

/** Единица измерения цены для витрины («за шт. с НДС» и т.п., ТЗ §8.1). */
export function priceUnitLabel(p: Product): string {
  if (p.product_type === "step_system") return "за шт. с НДС";
  const f = p.formats?.[0];
  return f?.price_rub_pcs ? "за шт. с НДС" : "за м² с НДС";
}
