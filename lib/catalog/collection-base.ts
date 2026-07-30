/**
 * Общая логика «базы коллекции» — единственный источник правила для taxonomy
 * и diversify. Раньше diversify держал СВОЮ копию префиксной логики без
 * Duro-правила: «Cloud Rosa Duro» и «Cloud Brown Duro» уходили в разные
 * корзины («Cloud Rosa» / «Cloud Brown»), и на узких срезах (блок Paradyz
 * в листинге) такие пары вставали рядом — для taxonomy это одна коллекция
 * «Cloud Duro». Модуль без runtime-импортов — не замыкает цикл
 * queries → diversify → taxonomy → queries.
 */

/**
 * Технические серии, стоящие в конце имени коллекции. «Duro» у Paradyz — не
 * цвет, а исполнение (плотнее и толще), и продаётся оно в тех же цветах.
 */
export const SERIES_SUFFIX = ["Duro"];

export function splitSeries(collection: string): { head: string; series?: string } {
  for (const s of SERIES_SUFFIX) {
    if (collection.endsWith(" " + s)) {
      return { head: collection.slice(0, -(s.length + 1)), series: s };
    }
  }
  return { head: collection };
}

/** Самый длинный префикс из слов, который встречается у ≥2 имён среди siblings. */
export function computeBase(name: string, siblings: string[]): string {
  const toks = name.split(/\s+/).filter(Boolean);
  for (let k = toks.length; k > 0; k--) {
    const pref = toks.slice(0, k).join(" ");
    const hits = siblings.filter((s) => s === pref || s.startsWith(pref + " ")).length;
    if (hits >= 2) return pref;
  }
  return name;
}

/**
 * База коллекции с учётом серии: сравниваем только со «своими» (та же серия),
 * серия возвращается в хвост базы («Cloud Brown Duro» → «Cloud Duro»).
 * `siblings` — коллекции того же бренда из рассматриваемого списка.
 */
export function collectionBaseOf(collection: string, siblings: string[]): string {
  const { head, series } = splitSeries(collection);
  const own = siblings
    .map(splitSeries)
    .filter((x) => x.series === series)
    .map((x) => x.head);
  const base = computeBase(head, own);
  return series ? `${base} ${series}` : base;
}
