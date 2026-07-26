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
import { WOOD_HC_PRODUCTS, WOOD_HC_COLLECTIONS } from "./generated/wood-hc";

/**
 * Коллекции «под дерево» берём с hit-ceramics.ru — это свой сайт заказчика, значит
 * цены свои, а не рыночные (характеристики к ним подмешаны из карточек Славдома).
 * Записи тех же коллекций из общего каталога вытесняются, чтобы не было дублей.
 */
const REPLACED = WOOD_HC_COLLECTIONS.map((c) => c.toLowerCase());
const isReplaced = (p: Product) =>
  REPLACED.some((c) => p.id.includes(c));

export const SEED_PRODUCTS: Product[] = [
  ...REAL_PRODUCTS.filter((p) => !isReplaced(p)),
  ...WOOD_HC_PRODUCTS,
];

export function getStepProducts(): Product[] {
  return SEED_PRODUCTS.filter((p) => p.product_type === "step_system" && p.active);
}

export function getSlabProducts(): Product[] {
  return SEED_PRODUCTS.filter((p) => p.product_type === "slab" && p.active);
}
