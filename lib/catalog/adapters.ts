/**
 * Адаптеры: товар из каталога → входные данные калькулятора.
 * Реализуют правило §9.1.2/§9.2.2: используются только элементы/форматы,
 * которые есть у артикула.
 */

import type {
  SlabFormat,
  StepElementPrices,
  StepElementPallets,
  StepElementWeights,
  StepGeometry,
} from "@/lib/calculator";
import type { ElementCode, Product, ProductFormat } from "./types";

function parseSize(size_mm: string): [number, number] {
  const [w, h] = size_mm.split("x").map((v) => parseInt(v, 10));
  return [w || 0, h || 0];
}

const findEl = (p: Product, code: ElementCode) =>
  p.elements?.find((e) => e.code === code);

/** Геометрия элементов (м) из артикула ступеней. */
export function toStepGeometry(p: Product): StepGeometry {
  const front = findEl(p, "front");
  const riser = findEl(p, "riser");
  const plinth = findEl(p, "plinth");
  const corner = findEl(p, "corner_l") ?? findEl(p, "corner_r");
  const cornerWidth = corner ? parseSize(corner.size_mm)[0] / 1000 : 0;
  return {
    frontLength: front?.length_m ?? 0,
    riserLength: riser?.length_m ?? 0,
    plinthLength: plinth?.length_m ?? 0,
    cornerWidth,
  };
}

export function toStepPrices(p: Product): StepElementPrices {
  return {
    front: findEl(p, "front")?.price_rub ?? 0,
    corner: findEl(p, "corner_l")?.price_rub ?? 0,
    riser: findEl(p, "riser")?.price_rub ?? 0,
    base: findEl(p, "base")?.price_rub ?? 0,
    plinth: findEl(p, "plinth")?.price_rub ?? 0,
  };
}

export function toStepWeights(p: Product): StepElementWeights {
  return {
    front: findEl(p, "front")?.weight_kg,
    corner: findEl(p, "corner_l")?.weight_kg,
    riser: findEl(p, "riser")?.weight_kg,
    base: findEl(p, "base")?.weight_kg,
    plinth: findEl(p, "plinth")?.weight_kg,
  };
}

export function toStepPallets(p: Product): StepElementPallets {
  return {
    front: findEl(p, "front")?.per_pallet,
    corner: findEl(p, "corner_l")?.per_pallet,
    riser: findEl(p, "riser")?.per_pallet,
    base: findEl(p, "base")?.per_pallet,
    plinth: findEl(p, "plinth")?.per_pallet,
  };
}

/**
 * Норма базовой плитки артикула, шт/м² (ТЗ §8.3). Берётся из элемента `base`:
 * сначала явный `per_sqm` из тех. листа, иначе считается из размера.
 * Без неё калькулятор считал площадку по норме переключателя 30×30 независимо от
 * реального формата плитки — на 300×600 это ровно двукратное завышение.
 */
export function toBasePerSqm(p: Product): number | undefined {
  const base = findEl(p, "base");
  if (!base) return undefined;
  if (base.per_sqm && base.per_sqm > 0) return base.per_sqm;
  const [w, h] = parseSize(base.size_mm);
  if (w > 0 && h > 0) return 1 / ((w / 1000) * (h / 1000));
  return undefined;
}

/** Человекочитаемый формат базовой плитки артикула («300×600 мм»). */
export function baseTileLabel(p: Product): string | undefined {
  const base = findEl(p, "base");
  if (!base) return undefined;
  const [w, h] = parseSize(base.size_mm);
  return w && h ? `${w}×${h} мм` : base.size_mm;
}

/** Какие элементы реально есть у артикула (для скрытия опций в UI). */
export interface StepAvailability {
  hasRisers: boolean;
  hasPlinth: boolean;
  hasBase: boolean;
  hasCorners: boolean;
}

export function stepAvailability(p: Product): StepAvailability {
  return {
    hasRisers: !!findEl(p, "riser"),
    hasPlinth: !!findEl(p, "plinth"),
    hasBase: !!findEl(p, "base"),
    hasCorners: !!(findEl(p, "corner_l") || findEl(p, "corner_r")),
  };
}

/** Формат пластины → вход калькулятора (Режим B). */
export function toSlabFormat(f: ProductFormat): SlabFormat {
  const [w, h] = parseSize(f.size_mm);
  return {
    code: f.code,
    widthMm: w,
    heightMm: h,
    thicknessMm: f.thickness_mm,
    weightKg: f.weight_kg,
    perPallet: f.per_pallet,
  };
}
