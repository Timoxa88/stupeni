import { describe, expect, test } from "bun:test";
import { diversify } from "./diversify";
import { activeProducts, getProductsByCategory } from "./queries";
import { collectionBase } from "./taxonomy";
import type { Product } from "./types";

const key = (p: Product) => `${p.brand}|${collectionBase(p)}`;

function adjacentSameCollection(list: Product[]): number {
  let n = 0;
  for (let i = 1; i < list.length; i++) if (key(list[i]) === key(list[i - 1])) n++;
  return n;
}

describe("diversify", () => {
  const all = activeProducts();

  test("перестановка без потерь: тот же состав, вход не мутирует", () => {
    const before = all.map((p) => p.id);
    const out = diversify(all);
    expect(out.length).toBe(all.length);
    expect(new Set(out.map((p) => p.id)).size).toBe(all.length);
    expect([...out.map((p) => p.id)].sort()).toEqual([...before].sort());
    expect(all.map((p) => p.id)).toEqual(before);
  });

  test("детерминизм: два вызова дают одинаковый порядок", () => {
    expect(diversify(all).map((p) => p.id)).toEqual(diversify(all).map((p) => p.id));
  });

  test("полный каталог: соседи никогда не из одной коллекции", () => {
    expect(adjacentSameCollection(diversify(all))).toBe(0);
  });

  test("листинги категорий: соседи не из одной коллекции", () => {
    for (const cat of [
      "terrasnyy-klinker",
      "terrasnye-plastiny",
      "plastiny-pod-derevo",
    ] as const) {
      const list = getProductsByCategory(cat);
      // Если в категории доминирует одна коллекция (>50%), нулевая смежность
      // недостижима математически — тогда допускаем вынужденный минимум.
      const counts = new Map<string, number>();
      for (const p of list) counts.set(key(p), (counts.get(key(p)) ?? 0) + 1);
      const max = Math.max(...counts.values());
      const forced = Math.max(0, 2 * max - list.length - 1);
      expect(adjacentSameCollection(list)).toBeLessThanOrEqual(forced);
    }
  });

  test("бренды чередуются заметно чаще, чем в исходном блочном порядке", () => {
    const out = diversify(all);
    let switches = 0;
    for (let i = 1; i < out.length; i++) if (out[i].brand !== out[i - 1].brand) switches++;
    // В блочном исходнике переключений бренда — единицы; после разнесения
    // их должно быть не меньше трети переходов.
    expect(switches).toBeGreaterThan(out.length / 3);
  });
});
