/**
 * Тесты движка калькулятора — сверка с примерами ТЗ §9.1.4, §9.2.7, §9.2.8.
 * Запуск: `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { calcModeA } from "./mode-a";
import { calcModeB } from "./mode-b";
import { pedestalsPerSqm } from "./reference";
import { calcSummary } from "./summary";
import type { ModeAInput, ModeBInput } from "./types";

const close = (a: number, b: number, eps = 0.01) =>
  expect(Math.abs(a - b)).toBeLessThanOrEqual(eps);

describe("Режим A — пример §9.1.4 (два марша)", () => {
  const input: ModeAInput = {
    city: "msk",
    marches: [
      {
        id: "m1",
        name: "Крыльцо",
        steps: 5,
        width: 1.5,
        treadDepth: 0.3,
        riserHeight: 0.15,
        externalCorners: 2,
      },
      {
        id: "m2",
        name: "Короткий",
        steps: 3,
        width: 1.2,
        treadDepth: 0.3,
        riserHeight: 0.15,
        externalCorners: 2,
      },
    ],
    cladRisers: true,
    cladSides: true,
    platform: { length: 1.5, width: 1.2 },
    baseTileSize: "30x30",
    geometry: {
      frontLength: 1.2,
      riserLength: 1.2,
      plinthLength: 0.3,
      cornerWidth: 0.32,
    },
    prices: { front: 1000, corner: 800, riser: 500, base: 200, plinth: 300 },
  };

  const result = calcModeA(input);
  const detail = result.detail as Extract<typeof result.detail, { kind: "A" }>;
  const [m1, m2] = detail.marches;

  test("Марш 1: погонаж, углы, фронт, подступёнки, плинтус", () => {
    close(m1.treadRunningMeters, 7.5);
    expect(m1.corners).toBe(10);
    expect(m1.fronts).toBe(4);
    expect(m1.risers).toBe(7);
    close(m1.inclineLength, 1.677, 0.01);
    expect(m1.plinths).toBe(12);
  });

  test("Марш 2: погонаж, углы, фронт, подступёнки, плинтус", () => {
    close(m2.treadRunningMeters, 3.6);
    expect(m2.corners).toBe(6);
    expect(m2.fronts).toBe(2);
    expect(m2.risers).toBe(4);
    close(m2.inclineLength, 1.006, 0.01);
    expect(m2.plinths).toBe(8);
  });

  test("Базовая плитка площадки 30×30 → 21 шт", () => {
    expect(detail.baseTiles).toBe(21);
  });

  test("Итоги по типам: углов 16, фронт 6, подступ. 11, плинт. 20, баз. 21", () => {
    const qty = (code: string) =>
      result.product.find((p) => p.code === code)?.quantity ?? 0;
    expect(qty("corner")).toBe(16);
    expect(qty("front")).toBe(6);
    expect(qty("riser")).toBe(11);
    expect(qty("plinth")).toBe(20);
    expect(qty("base")).toBe(21);
  });
});

describe("Режим B — пример §9.2.7 (терраса на опоры)", () => {
  const input: ModeBInput = {
    city: "msk",
    areas: [{ id: "a1", length: 5, width: 4 }],
    format: { code: "600x600", widthMm: 600, heightMm: 600, weightKg: 16 },
    method: "pedestals",
    layout: "straight",
    pricePerPiece: 1500,
    pedestalPrice: 250,
  };

  const result = calcModeB(input);
  const detail = result.detail as Extract<typeof result.detail, { kind: "B" }>;

  test("Sнетто = 20, Sзап = 21", () => {
    close(detail.netArea, 20);
    close(detail.areaWithWaste, 21);
  });

  test("Плит = 59", () => {
    expect(detail.slabs).toBe(59);
  });

  test("Расход опор 600×600 на 20 м² = 6.80", () => {
    expect(pedestalsPerSqm("600x600", 20)).toBe(6.8);
    close(detail.pedestalsPerSqm ?? 0, 6.8);
  });

  test("Опор = 136", () => {
    expect(detail.pedestals).toBe(136);
  });
});

describe("Режим B — пример §9.2.8 (терраса на клей, Москва)", () => {
  const input: ModeBInput = {
    city: "msk",
    areas: [{ id: "a1", length: 6, width: 4 }],
    deductions: [{ id: "d1", shape: "circle", diameter: 1.0 }],
    format: {
      code: "600x1200",
      widthMm: 600,
      heightMm: 1200,
      weightKg: 32,
      perPallet: 40,
    },
    method: "glue",
    layout: "straight",
    pricePerPiece: 3000,
    withMaterials: true,
  };

  const result = calcModeB(input);
  const detail = result.detail as Extract<typeof result.detail, { kind: "B" }>;

  test("Sнетто ≈ 23.21, Sзап ≈ 24.37", () => {
    close(detail.netArea, 23.21, 0.01);
    close(detail.areaWithWaste, 24.37, 0.01);
  });

  test("Плит = 34, поддонов = 1", () => {
    expect(detail.slabs).toBe(34);
    expect(result.pallets).toBe(1);
  });

  test("Материалы: 5 мешков клея, 1 грунт, 4 гидро, 1 затирка", () => {
    const packs = (code: string) =>
      result.materials.find((m) => m.code === code)?.packs ?? 0;
    expect(packs("glue")).toBe(5);
    expect(packs("primer")).toBe(1);
    expect(packs("waterproofing")).toBe(4);
    expect(packs("grout")).toBe(1);
  });

  test("Сумма материалов ≈ 20 989 ₽ (Москва)", () => {
    close(result.extrasTotal, 20989.4, 1);
  });

  test("СПб дороже Москвы (другая колонка цен §9.3)", () => {
    const spb = calcModeB({ ...input, city: "spb" });
    expect(spb.extrasTotal).toBeGreaterThan(result.extrasTotal);
  });
});

describe("Граничные случаи", () => {
  test("Нестандартный формат на опоры → нет расхода (индивидуальный расчёт)", () => {
    expect(pedestalsPerSqm("123x456", 20)).toBeNull();
  });

  test("Площадь < 20 м² использует колонку 20 м²", () => {
    expect(pedestalsPerSqm("600x600", 5)).toBe(6.8);
  });

  test("Большая площадь использует колонку 1000 м²", () => {
    expect(pedestalsPerSqm("600x600", 2000)).toBe(5.6);
  });

  test("Запас на подрез растёт с раскладкой", () => {
    const base: ModeBInput = {
      city: "msk",
      areas: [{ id: "a", length: 10, width: 10 }],
      format: { code: "600x600", widthMm: 600, heightMm: 600 },
      method: "gravel",
      layout: "straight",
      pricePerPiece: 1000,
    };
    const straight = calcModeB(base);
    const diagonal = calcModeB({ ...base, layout: "diagonal" });
    expect(diagonal.detail).toMatchObject({ wasteFactor: 0.1 });
    expect(
      (diagonal.detail as { slabs: number }).slabs,
    ).toBeGreaterThan((straight.detail as { slabs: number }).slabs);
  });
});

describe("Сводка расчёта для менеджера (ТЗ §12.3)", () => {
  const input: ModeBInput = {
    city: "msk",
    areas: [{ id: "a1", length: 6, width: 4 }],
    deductions: [{ id: "d1", shape: "circle", diameter: 1.0 }],
    format: { code: "600x1200", widthMm: 600, heightMm: 1200, weightKg: 32, perPallet: 40 },
    method: "glue",
    layout: "straight",
    pricePerPiece: 3000,
    withMaterials: true,
  };
  const summary = calcSummary(calcModeB(input), {
    article: "Paradyz Scandiano Brown",
    extra: "Укладка: на клей, раскладка: прямая",
  });

  test("в сводке есть режим, город, артикул и способ укладки", () => {
    expect(summary).toContain("терраса/площадка");
    expect(summary).toContain("Москва");
    expect(summary).toContain("Paradyz Scandiano Brown");
    expect(summary).toContain("на клей");
  });

  test("в сводке есть площадь, состав, материалы и итог", () => {
    expect(summary).toContain("23,21 м² нетто");
    expect(summary).toContain("34 шт");          // плит
    expect(summary).toContain("Клей Flex FKC");
    expect(summary).toContain("5 уп.");
    expect(summary).toContain("ИТОГО");
    expect(summary).toContain("Вес поставки");
  });

  test("итог в сводке совпадает с расчётом", () => {
    const r = calcModeB(input);
    const total = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })
      .format(Math.round(r.grandTotal));
    expect(summary).toContain(`ИТОГО: ${total} ₽`);
  });
});
