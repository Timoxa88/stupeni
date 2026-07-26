/**
 * Каталог товаров.
 *
 * До 26.07.2026 здесь лежали 11 демо-артикулов с пометкой «цены демонстрационные».
 * Теперь данные реальные — сгенерированы из карточек slavdom.ru (см.
 * `generated/products.ts`): состав элементов, размеры, вес, шт/поддон, шт/м²,
 * марка морозостойкости и R-класс — с карточек товара; цены рыночные (розница
 * дистрибьютора) и до решения по прайсу ЗЕ ВАН показываются как справочные.
 *
 * Наличие (`stock_status`) намеренно не заполнено: остатки дистрибьютора — не наши.
 * Источник правды по остаткам и итоговой цене — 1С (ТЗ B.9).
 *
 * Демо-каталог остался в истории git (коммит 6a0ac83) на случай сверки.
 */

import type { Product } from "./types";
import { REAL_PRODUCTS } from "./generated/products";
import { PARADYZ_PRICE_PRODUCTS } from "./generated/paradyz-price";

/**
 * Источники каталога:
 *  - **Paradyz** — из прайса «Прайс Paradyz полный от 01.06.26», цены РОЗНИЧНЫЕ
 *    (артикул, размер, вес, шт/м², шт/поддон — оттуда же; R/F/водопоглощение —
 *    из карточек Славдома; фото — с hit-ceramics.ru и paradyz.com);
 *  - **остальные бренды** — из карточек Славдома (цены рыночные, помечены справочными).
 *
 * Paradyz из общего каталога вытесняется полностью, чтобы не было дублей и чужих цен.
 */
export const SEED_PRODUCTS: Product[] = [
  ...REAL_PRODUCTS.filter((p) => p.brand !== "Paradyz"),
  ...PARADYZ_PRICE_PRODUCTS,
];

export function getStepProducts(): Product[] {
  return SEED_PRODUCTS.filter((p) => p.product_type === "step_system" && p.active);
}

export function getSlabProducts(): Product[] {
  return SEED_PRODUCTS.filter((p) => p.product_type === "slab" && p.active);
}
