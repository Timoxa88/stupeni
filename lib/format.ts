/** Форматирование чисел и цен (ru-RU). */

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

/** «12 345 ₽» */
export function formatRub(value: number): string {
  return rub.format(Math.round(value));
}

/** «23,21» */
export function formatNum(value: number, digits = 2): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: digits,
  }).format(value);
}

export { num };
