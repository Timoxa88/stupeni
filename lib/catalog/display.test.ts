import { describe, expect, test } from "bun:test";
import { productTitle, displayColor } from "./display";
import { SEED_PRODUCTS } from "./seed";
import type { Product } from "./types";

const stub = (collection: string, color: string) =>
  ({ collection, specs: { color } }) as unknown as Product;

describe("productTitle: коллекция + цвет без дублей", () => {
  test("цвет латиницей уже в конце коллекции — не дублируем", () => {
    expect(productTitle(stub("Eremite Crema", "Crema"))).toBe("Eremite Crema");
  });

  test("цвет кириллицей = транслит хвоста коллекции — не дублируем", () => {
    expect(productTitle(stub("Mattone Pietra Grafit", "Графит"))).toBe(
      "Mattone Pietra Grafit",
    );
  });

  test("русский перевод цвета из генератора — тоже дубль", () => {
    expect(productTitle(stub("Eremite Beige", "Бежевый"))).toBe("Eremite Beige");
    expect(productTitle(stub("Eremite Sand", "Песочный"))).toBe("Eremite Sand");
    expect(productTitle(stub("Cloud Brown", "Коричневый"))).toBe("Cloud Brown");
  });

  test("самостоятельный цвет печатается", () => {
    expect(productTitle(stub("Keraplatte Aera", "717 anthra"))).toBe(
      "Keraplatte Aera 717 anthra",
    );
    expect(displayColor(stub("Scandiano", "Ochra"))).toBe("Ochra");
  });
});

describe("ступени Paradyz: тип элемента соответствует геометрии", () => {
  const fronts = SEED_PRODUCTS.filter(
    (p) => p.brand === "Paradyz" && p.product_type === "step_system",
  ).flatMap((p) =>
    (p.elements ?? [])
      .filter((e) => e.code === "front")
      .map((e) => ({ id: p.id, ...e })),
  );

  test("в каталоге есть и капиносные, и простые фронтальные", () => {
    expect(fronts.length).toBeGreaterThan(0);
  });

  test.each(fronts.map((f) => [f.id, f] as const))("%s", (_id, f) => {
    const dims = f.size_mm.split("x").map(Number);
    const thick = dims[dims.length - 1];
    if (thick < 10) {
      // тонкая — «простая с насечками», кромка — длинная сторона (300x600 → 0.6)
      expect(f.name).toContain("насечками");
      expect(f.length_m).toBeCloseTo(Math.max(dims[0], dims[1]) / 1000, 3);
    } else {
      // капиносная: глубина (330) в размере первая, вдоль кромки — меньшая сторона
      expect(f.name).toContain("капиносом");
      expect(f.length_m).toBeCloseTo(Math.min(dims[0], dims[1]) / 1000, 3);
    }
  });
});
