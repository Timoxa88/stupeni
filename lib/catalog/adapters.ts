/**
 * Адаптеры: товар из каталога → входные данные калькулятора.
 * Реализуют правило §9.1.2/§9.2.2: используются только элементы/форматы,
 * которые есть у артикула.
 *
 * Выбор элемента вынесен в lib/catalog/elements: у одного кода бывает несколько
 * элементов (плитка 300×300 и 600×300), а фронтальная ступень — двух исполнений
 * (капинос / насечки). Просто `find(e => e.code === code)` брал первый попавшийся.
 */

import type {
  SlabFormat,
  StepElementPrices,
  StepElementPallets,
  StepElementWeights,
  StepGeometry,
} from "@/lib/calculator";
import type { Product, ProductFormat } from "./types";
import {
  baseElement,
  cornerElement,
  elementsOf,
  findElement,
  frontElement,
  parseSize,
  perSqmOf,
  shortSize,
  stepFrontTypes,
  type StepFrontType,
} from "./elements";

export type { StepFrontType } from "./elements";

/**
 * Переключатель исполнения ступени для UI: показывается, только если у артикула
 * есть оба варианта (капинос и насечки — разные цена, кромка и вес).
 */
export function stepTypeOptions(p: Product): { value: StepFrontType; label: string }[] {
  const labels: Record<StepFrontType, string> = {
    front: "С капиносом",
    front_notch: "С насечками",
  };
  return stepFrontTypes(p).map((value) => ({ value, label: labels[value] }));
}

/** Геометрия элементов (м) из артикула ступеней. */
export function toStepGeometry(p: Product, stepType?: StepFrontType): StepGeometry {
  const front = frontElement(p, stepType);
  const riser = findElement(p, "riser");
  const plinth = findElement(p, "plinth");
  const corner = cornerElement(p, stepType);
  const cornerWidth = corner ? parseSize(corner.size_mm)[0] / 1000 : 0;
  return {
    frontLength: front?.length_m ?? 0,
    riserLength: riser?.length_m ?? 0,
    plinthLength: plinth?.length_m ?? 0,
    cornerWidth,
  };
}

export function toStepPrices(
  p: Product,
  baseSize?: string,
  stepType?: StepFrontType,
): StepElementPrices {
  return {
    front: frontElement(p, stepType)?.price_rub ?? 0,
    corner: cornerElement(p, stepType)?.price_rub ?? 0,
    riser: findElement(p, "riser")?.price_rub ?? 0,
    base: baseElement(p, baseSize)?.price_rub ?? 0,
    plinth: findElement(p, "plinth")?.price_rub ?? 0,
  };
}

export function toStepWeights(
  p: Product,
  baseSize?: string,
  stepType?: StepFrontType,
): StepElementWeights {
  return {
    front: frontElement(p, stepType)?.weight_kg,
    corner: cornerElement(p, stepType)?.weight_kg,
    riser: findElement(p, "riser")?.weight_kg,
    base: baseElement(p, baseSize)?.weight_kg,
    plinth: findElement(p, "plinth")?.weight_kg,
  };
}

export function toStepPallets(
  p: Product,
  baseSize?: string,
  stepType?: StepFrontType,
): StepElementPallets {
  return {
    front: frontElement(p, stepType)?.per_pallet,
    corner: cornerElement(p, stepType)?.per_pallet,
    riser: findElement(p, "riser")?.per_pallet,
    base: baseElement(p, baseSize)?.per_pallet,
    plinth: findElement(p, "plinth")?.per_pallet,
  };
}

/**
 * Норма базовой плитки артикула, шт/м² (ТЗ §8.3) — для выбранного формата.
 * Без неё калькулятор считал площадку по норме переключателя 30×30 независимо от
 * реального формата плитки — на 300×600 это ровно двукратное завышение.
 */
export function toBasePerSqm(p: Product, baseSize?: string): number | undefined {
  return perSqmOf(baseElement(p, baseSize));
}

/** Человекочитаемый формат базовой плитки артикула («300×600 мм»). */
export function baseTileLabel(p: Product, baseSize?: string): string | undefined {
  const base = baseElement(p, baseSize);
  return base ? `${shortSize(base.size_mm)} мм` : undefined;
}

/** Форматы напольной плитки артикула — для переключателя в калькуляторе. */
export function baseTileOptions(p: Product): { value: string; label: string }[] {
  return elementsOf(p, "base").map((e) => ({
    value: e.size_mm,
    label: `${shortSize(e.size_mm)} мм`,
  }));
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
    hasRisers: !!findElement(p, "riser"),
    hasPlinth: !!findElement(p, "plinth"),
    hasBase: !!baseElement(p),
    hasCorners: !!cornerElement(p),
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
