/**
 * Запросы к каталогу: категории, выборки по бренду/применению, промо-логика.
 * Чистые функции над сид-массивом (в проде — над данными CMS).
 */

import type { ApplicationCode, Product, ProductCategory, ProductPromo } from "./types";
import { SEED_PRODUCTS } from "./seed";
import { diversify } from "./diversify";
import { frontElement } from "./elements";
import { applyOverrideCached } from "./overrides-cache";

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

/*
 * Единственная точка, где сид встречается с правками из админки: цены, тексты,
 * фото, промо, наличие и скрытие применяются здесь — и дальше их «видят» все
 * листинги, фасеты, карточки и калькулятор, ничего не зная про БД.
 * Правки берутся из кэша, который серверная страница обновляет вызовом
 * primeOverrides() (см. lib/store/products.ts). Кэш пуст (нет БД) → чистый сид.
 */
export function activeProducts(): Product[] {
  return SEED_PRODUCTS.map(applyOverrideCached).filter((p) => p.active);
}

/** Товары калькулятора — через activeProducts(), т.е. с ценами из админки. */
export function stepProductsForCalc(): Product[] {
  return activeProducts().filter((p) => p.product_type === "step_system");
}

/** Режим B — только Paradyz (решение 30.07.2026, см. getProductsByCategory). */
export function slabProductsForCalc(): Product[] {
  return activeProducts().filter((p) => p.product_type === "slab" && p.brand === "Paradyz");
}

export function getProductById(id: string): Product | undefined {
  const p = SEED_PRODUCTS.find((x) => x.id === id);
  return p ? applyOverrideCached(p) : undefined;
}

/* Листинги отдаются через diversify(): генерированный каталог лежит блоками
   (бренд за брендом, коллекция за коллекцией), и без перемешивания страница
   из 24 карточек была одной коллекцией. Порядок детерминированный — важно
   для пагинации и гидрации (см. diversify.ts). */

/**
 * Paradyz — основной бренд со своими ценами (решение Кирилла, 30.07.2026):
 * листинги с пагинацией открываются его позициями, остальные бренды — следом.
 * Внутри каждой части порядок разнесён diversify (соседние карточки — разные
 * коллекции), поэтому первые страницы — Paradyz, но не «4 цвета одной серии».
 */
function paradyzFirst(list: Product[]): Product[] {
  const own = list.filter((p) => p.brand === "Paradyz");
  const rest = list.filter((p) => p.brand !== "Paradyz");
  return [...diversify(own), ...diversify(rest)];
}

/** Полный листинг каталога (/catalog): Paradyz на первых страницах. */
export function getCatalogProducts(): Product[] {
  return paradyzFirst(activeProducts());
}

export function getProductsByCategory(cat: CategoryKey): Product[] {
  return paradyzFirst(
    activeProducts().filter(
      (p) =>
        productCategory(p) === cat &&
        // Решение Кирилла 30.07.2026: в «Террасных пластинах» витрина только
        // Paradyz. Чужие плиты остаются в каталоге (бренд/поиск/карточки),
        // но из категории-хаба убраны.
        (cat !== "terrasnye-plastiny" || p.brand === "Paradyz"),
    ),
  );
}

export function getProductsByBrand(name: string): Product[] {
  return diversify(activeProducts().filter((p) => p.brand === name));
}

export function getProductsByApplication(app: ApplicationCode): Product[] {
  return paradyzFirst(activeProducts().filter((p) => p.application.includes(app)));
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
