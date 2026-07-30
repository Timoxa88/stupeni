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

const pluralRu = new Intl.PluralRules("ru-RU");

/**
 * «162 позиции»: plural(162, "позиция", "позиции", "позиций").
 * Формы — им. падеж; для родительного («от 3 производителей») передавать
 * его формы: plural(n, "производителя", "производителей", "производителей").
 */
export function plural(n: number, one: string, few: string, many: string): string {
  switch (pluralRu.select(n)) {
    case "one":
      return one;
    case "few":
      return few;
    default:
      return many;
  }
}

export { num };
