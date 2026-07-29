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
  const steps = SEED_PRODUCTS.filter(
    (p) => p.brand === "Paradyz" && p.product_type === "step_system",
  );
  const els = (code: string) =>
    steps.flatMap((p) =>
      (p.elements ?? []).filter((e) => e.code === code).map((e) => ({ id: p.id, ...e })),
    );
  const fronts = els("front");
  const notches = els("front_notch");

  test("в каталоге есть и капиносные, и насечные фронтальные ступени", () => {
    expect(fronts.length).toBeGreaterThan(0);
    expect(notches.length).toBeGreaterThan(0);
  });

  /**
   * Регрессия 29.07.2026: генератор оставлял по одному элементу на код и брал
   * «самый длинный», поэтому насечная ступень 600 мм вытесняла капиносную
   * 300 мм — у 14 коллекций капиноса в карточке не оставалось вовсе.
   */
  test("у коллекций, где есть оба исполнения, они оба доезжают до карточки", () => {
    const both = steps.filter(
      (p) =>
        p.elements?.some((e) => e.code === "front") &&
        p.elements?.some((e) => e.code === "front_notch"),
    );
    expect(both.length).toBeGreaterThan(10);
  });

  test("напольная плитка выложена в двух форматах", () => {
    const twoFormats = steps.filter(
      (p) => (p.elements ?? []).filter((e) => e.code === "base").length > 1,
    );
    expect(twoFormats.length).toBeGreaterThan(0);
  });

  test.each(fronts.map((f) => [f.id, f] as const))("капинос %s", (_id, f) => {
    const dims = f.size_mm.split("x").map(Number);
    // капиносная: глубина проступи (330) больше ширины, вдоль кромки — меньшая
    expect(f.name).toContain("капиносом");
    expect(dims[dims.length - 1]).toBeGreaterThanOrEqual(10);
    expect(f.length_m).toBeCloseTo(Math.min(dims[0], dims[1]) / 1000, 3);
  });

  test.each(notches.map((f) => [`${f.id} ${f.size_mm}`, f] as const))(
    "насечки %s",
    (_id, f) => {
      const dims = f.size_mm.split("x").map(Number);
      // насечки нанесены вдоль длинной стороны — она и лежит вдоль кромки
      expect(f.name).toContain("насечками");
      expect(f.length_m).toBeCloseTo(Math.max(dims[0], dims[1]) / 1000, 3);
    },
  );

  test("у каждого элемента своё фото", () => {
    const withPhotos = steps.flatMap((p) => p.elements ?? []).filter((e) => e.photo);
    const unique = new Set(withPhotos.map((e) => e.photo));
    expect(withPhotos.length).toBeGreaterThan(100);
    expect(unique.size).toBe(withPhotos.length);
  });
});
