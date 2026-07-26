/**
 * Расчёт сопутствующих материалов по площади и городу (ТЗ §9.3).
 * Используется обоими режимами калькулятора.
 */

import { FLOOR_MATS } from "./reference";
import type { City, MaterialCode, MaterialLine } from "./types";

/**
 * Считает сопутствующие материалы для площади `areaSqm` в городе `city`.
 * `enabled` — какие материалы включены (по умолчанию все из FLOOR_MATS).
 *
 * Логика (ТЗ §9.3): расход × площадь → масса; округление вверх до целых
 * упаковок; стоимость = упаковки × цена выбранного города.
 */
export function calcMaterials(
  areaSqm: number,
  city: City,
  enabled?: Partial<Record<MaterialCode, boolean>>,
): MaterialLine[] {
  if (areaSqm <= 0) return [];

  return FLOOR_MATS.filter((m) => enabled?.[m.code] ?? true).map((m) => {
    const requiredKg = m.perSqm * areaSqm;
    const packs = Math.ceil(requiredKg / m.packKg);
    const unitPrice = m.price[city];
    return {
      code: m.code,
      name: m.name,
      pack: m.pack,
      requiredKg,
      packs,
      totalKg: packs * m.packKg,
      unitPrice,
      total: packs * unitPrice,
    };
  });
}

/** Суммарная стоимость материалов, ₽. */
export function materialsTotal(lines: MaterialLine[]): number {
  return lines.reduce((sum, l) => sum + l.total, 0);
}

/** Суммарная масса материалов, кг (по фактической массе упаковок). */
export function materialsWeightKg(lines: MaterialLine[]): number {
  return lines.reduce((sum, l) => sum + l.totalKg, 0);
}
