/**
 * Единый источник правды по отображаемой цене (ТЗ §8.1, критерий приёмки «акция
 * гаснет по истечении даты»).
 *
 * Почему один модуль: до 26.07.2026 цена считалась в трёх местах по-разному, и один
 * SKU показывался по четырём ценам одновременно — витрина 1 883 ₽, карточка 1 625 ₽,
 * JSON-LD 1 883 ₽, а калькулятор и КП менеджера считали по 1 890 ₽ из каталога.
 *
 * Правило: **текущая цена всегда та, что лежит в каталоге** (элемент/формат) — ровно
 * её берёт калькулятор. `promo.old_price` — это ЗАЧЁРКНУТАЯ (прежняя) цена, а не база
 * для вычитания процента. Процент скидки выводится из пары цен, а не применяется к ним.
 */

import type { Product } from "./types";
import { activePromo } from "./queries";

export interface PriceView {
  /** Текущая цена, ₽ — из каталога, совпадает с калькулятором. */
  price: number;
  /** Прежняя цена для зачёркивания (только при активной акции и old_price > price). */
  oldPrice?: number;
  /** Скидка, % — округлённая, посчитанная из old/price. */
  discountPct?: number;
  /** Метка акции из CMS. */
  label?: string;
  /** Дедлайн акции (для таймера); отсутствует — акции нет или она без срока. */
  endsAt?: string;
}

/**
 * `unitPrice` — цена выбранного элемента/формата (из карточки) либо базовая «от».
 * `now` параметризуется для тестов.
 */
export function priceView(
  p: Product,
  unitPrice: number,
  now: number = Date.now(),
): PriceView {
  const promo = activePromo(p, now);
  if (!promo) return { price: unitPrice };

  const old = promo.old_price;
  const hasOld = typeof old === "number" && old > unitPrice;
  const discountPct = hasOld
    ? Math.round((1 - unitPrice / (old as number)) * 100)
    : promo.discount_percent;

  return {
    price: unitPrice,
    oldPrice: hasOld ? old : undefined,
    discountPct: discountPct && discountPct > 0 ? discountPct : undefined,
    label: promo.label,
    endsAt: promo.ends_at,
  };
}
