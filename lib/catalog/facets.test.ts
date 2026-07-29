import { describe, expect, test } from "bun:test";
import {
  catalogQueryString,
  colorGroupOf,
  facetsOf,
  filterProducts,
  parseCatalogQuery,
  sortProducts,
} from "./facets";
import { activeProducts, basePrice } from "./queries";
import type { Product } from "./types";

const stub = (collection: string, color: string, hex?: string) =>
  ({ collection, specs: { color, color_hex: hex }, photos: [] }) as unknown as Product;

describe("colorGroupOf", () => {
  test("известные имена цветов раскладываются по группам", () => {
    expect(colorGroupOf(stub("Eremite", "Crema"))).toBe("bezhevyy");
    expect(colorGroupOf(stub("Mattone Pietra", "Графит"))).toBe("grafit");
    expect(colorGroupOf(stub("Keraplatte Aera", "717 anthra"))).toBe("grafit");
    expect(colorGroupOf(stub("Cloud", "Brown"))).toBe("korichnevyy");
    expect(colorGroupOf(stub("Cotto", "Naturale"))).toBe("krasnyy");
  });

  test("незнакомое имя классифицируется по hex", () => {
    expect(colorGroupOf(stub("X", "Zzz", "#2E2E2C"))).toBe("grafit");
    expect(colorGroupOf(stub("X", "Zzz", "#C9B79C"))).toBe("bezhevyy");
  });

  test("каждый товар витрины получает цветовую группу", () => {
    const missed = activeProducts().filter((p) => !colorGroupOf(p));
    expect(missed.map((p) => p.id)).toEqual([]);
  });
});

describe("фильтрация и сортировка", () => {
  const all = activeProducts();

  test("фильтр по цвету отдаёт только товары этой группы", () => {
    const q = parseCatalogQuery({ color: "bezhevyy" });
    const out = filterProducts(all, q);
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((p) => colorGroupOf(p) === "bezhevyy")).toBe(true);
  });

  test("фильтр по стране Германия — только немецкие бренды", () => {
    const out = filterProducts(all, parseCatalogQuery({ country: "germaniya" }));
    expect(out.length).toBeGreaterThan(0);
    expect(new Set(out.map((p) => p.brand)).has("Paradyz")).toBe(false);
  });

  test("цена по возрастанию монотонна и не теряет товары", () => {
    const out = sortProducts(all, "price-asc");
    expect(out.length).toBe(all.length);
    for (let i = 1; i < out.length; i++) {
      expect(basePrice(out[i])).toBeGreaterThanOrEqual(basePrice(out[i - 1]));
    }
  });

  test("популярные: Scandiano выше хвоста без веса", () => {
    const out = sortProducts(all, "popular");
    const idx = (pred: (p: Product) => boolean) => out.findIndex(pred);
    expect(idx((p) => p.collection.startsWith("Scandiano"))).toBeLessThan(
      idx((p) => p.brand === "Маркастрой"),
    );
  });

  test("query-строка: только не-дефолтные значения", () => {
    expect(catalogQueryString(parseCatalogQuery({}))).toBe("");
    expect(
      catalogQueryString(parseCatalogQuery({ sort: "price-asc", color: "seryy" })),
    ).toBe("sort=price-asc&color=seryy");
    expect(parseCatalogQuery({ sort: "мусор" }).sort).toBe("recommended");
  });

  test("счётчики фасетов согласованы с фильтром", () => {
    const q = parseCatalogQuery({ color: "seryy" });
    const facets = facetsOf(all, q);
    const grey = facets.colors.find((o) => o.value === "seryy");
    expect(grey?.count).toBe(filterProducts(all, q).length);
  });
});
