/**
 * Запросы к каталогу: категории, выборки по бренду/применению, промо-логика.
 * Чистые функции над сид-массивом (в проде — над данными CMS).
 */

import type { ApplicationCode, Product, ProductCategory, ProductPromo } from "./types";
import { SEED_PRODUCTS } from "./seed";
import { diversify } from "./diversify";
import { frontElement } from "./elements";

/** Три продуктовые категории-хаба (ТЗ §3). */
export type CategoryKey = ProductCategory;

/**
 * Категория артикула: приоритет — явное поле `category` (его проставляет генератор
 * каталога по толщине и материалу), иначе вывод из типа и поверхности (ТЗ §1).
 */
export function productCategory(p: Product): CategoryKey {
  if (p.category) return p.category;
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

/* Листинги отдаются через diversify(): генерированный каталог лежит блоками
   (бренд за брендом, коллекция за коллекцией), и без перемешивания страница
   из 24 карточек была одной коллекцией. Порядок детерминированный — важно
   для пагинации и гидрации (см. diversify.ts). */

export function getProductsByCategory(cat: CategoryKey): Product[] {
  return diversify(activeProducts().filter((p) => productCategory(p) === cat));
}

export function getProductsByBrand(name: string): Product[] {
  return diversify(activeProducts().filter((p) => p.brand === name));
}

export function getProductsByApplication(app: ApplicationCode): Product[] {
  return diversify(activeProducts().filter((p) => p.application.includes(app)));
}

/** Похожие: тот же сценарий применения, другой артикул (ТЗ §8.4 вкладка 7);
 *  за счёт diversify — четыре разные коллекции, а не четыре цвета одной. */
export function getRelatedProducts(p: Product, limit = 4): Product[] {
  return diversify(
    activeProducts().filter(
      (x) => x.id !== p.id && x.application.some((a) => p.application.includes(a)),
    ),
  ).slice(0, limit);
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
    // Карточка называется «Клинкерные ступени», поэтому и цена в витрине —
    // ступени: сначала капиносная, если её нет у коллекции — насечная
    // (см. frontElement), и лишь затем первый попавшийся элемент.
    return frontElement(p)?.price_rub ?? p.elements?.[0]?.price_rub ?? 0;
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

/**
 * Сравнимая между брендами цена: у ступеней витринная цена — штука фронтальной
 * (а штуки разной длины), у плит — то за шт., то за м². Приводим к общей мере:
 * ступени — ₽ за погонный метр кромки (цена / length_m), плиты — ₽/м².
 * Чистая арифметика от данных артикула; нет исходных величин — строки нет.
 */
export function comparableUnitPrice(p: Product): string | undefined {
  if (p.product_type === "step_system") {
    const front = frontElement(p);
    if (!front?.length_m || !front.price_rub) return undefined;
    const perM = Math.round(front.price_rub / front.length_m);
    return `≈ ${perM.toLocaleString("ru-RU")} ₽/пог. м кромки`;
  }
  const f = p.formats?.[0];
  if (!f) return undefined;
  const perSqm = f.price_rub_sqm || (f.price_rub_pcs && f.per_sqm ? f.price_rub_pcs * f.per_sqm : 0);
  if (!perSqm) return undefined;
  return `≈ ${Math.round(perSqm).toLocaleString("ru-RU")} ₽/м²`;
}
