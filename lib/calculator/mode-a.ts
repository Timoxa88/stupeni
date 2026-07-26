/**
 * Режим A — лестница/крыльцо: поэлементный расчёт ступеней по маршам (ТЗ §9.1).
 *
 * Формулы §9.1.3 (запас k = 5%, ×1.05; суммируется по всем маршам).
 * Сверено с примером §9.1.4.
 */

import { calcMaterials, materialsTotal, materialsWeightKg } from "./materials";
import { STEP_WASTE_FACTOR, TILE_PER_SQM } from "./reference";
import type {
  CalcResult,
  MarchInput,
  MarchResult,
  ModeADetail,
  ModeAInput,
  ProductLine,
  StepElementCode,
} from "./types";

const ELEMENT_NAMES: Record<StepElementCode, string> = {
  front: "Ступень фронтальная",
  corner: "Угловая ступень (L/R)",
  riser: "Подступёнок",
  base: "Базовая плитка",
  plinth: "Плинтус ступенчатый",
};

/** Расчёт одного марша (ТЗ §9.1.3). */
export function calcMarch(
  march: MarchInput,
  geometry: ModeAInput["geometry"],
  opts: { cladRisers: boolean; cladSides: boolean; waste: number },
): MarchResult {
  const { steps: n, width: w, treadDepth: d, riserHeight: h } = march;
  const k = 1 + opts.waste;

  // Pпро = N × W
  const treadRunningMeters = n * w;
  // Aугл = N × внешних_углов
  const corners = n * march.externalCorners;
  // Fфр = ceil( (Pпро − Aугл × Wугл) / Lф × 1.05 )
  const frontSpan = Math.max(
    0,
    treadRunningMeters - corners * geometry.cornerWidth,
  );
  const fronts =
    geometry.frontLength > 0
      ? Math.ceil((frontSpan / geometry.frontLength) * k)
      : 0;
  // Fпод = ceil( Pпро / Lп × 1.05 ), если включены подступёнки
  const risers =
    opts.cladRisers && geometry.riserLength > 0
      ? Math.ceil((treadRunningMeters / geometry.riserLength) * k)
      : 0;
  // Lнакл = N × √(d² + h²)
  const inclineLength = n * Math.sqrt(d * d + h * h);
  // Fпл = ceil( 2 × Lнакл / Lпл × 1.05 ), если боковины
  const plinths =
    opts.cladSides && geometry.plinthLength > 0
      ? Math.ceil(((2 * inclineLength) / geometry.plinthLength) * k)
      : 0;

  return {
    id: march.id,
    name: march.name,
    treadRunningMeters,
    corners,
    fronts,
    risers,
    inclineLength,
    plinths,
  };
}

export function calcModeA(input: ModeAInput): CalcResult {
  const waste = input.wasteFactor ?? STEP_WASTE_FACTOR;
  const k = 1 + waste;

  const marchResults = input.marches.map((m) =>
    calcMarch(m, input.geometry, {
      cladRisers: input.cladRisers,
      cladSides: input.cladSides,
      waste,
    }),
  );

  // Суммы по типам элементов (ТЗ §9.1.3 «Итоги»)
  const totals = marchResults.reduce(
    (acc, r) => {
      acc.corners += r.corners;
      acc.fronts += r.fronts;
      acc.risers += r.risers;
      acc.plinths += r.plinths;
      return acc;
    },
    { corners: 0, fronts: 0, risers: 0, plinths: 0 },
  );

  // Базовая плитка площадки: Fбаз = ceil( Дпл × Шпл × шт_м²(размер) × 1.05 )
  const platformArea = input.platform
    ? input.platform.length * input.platform.width
    : 0;
  const baseTiles =
    platformArea > 0
      ? Math.ceil(platformArea * TILE_PER_SQM[input.baseTileSize] * k)
      : 0;

  // Позиции продукции
  const lineDefs: Array<{ code: StepElementCode; qty: number; price: number }> =
    [
      { code: "front", qty: totals.fronts, price: input.prices.front },
      { code: "corner", qty: totals.corners, price: input.prices.corner },
      { code: "riser", qty: totals.risers, price: input.prices.riser },
      { code: "plinth", qty: totals.plinths, price: input.prices.plinth },
      { code: "base", qty: baseTiles, price: input.prices.base },
    ];

  const product: ProductLine[] = lineDefs
    .filter((l) => l.qty > 0)
    .map((l) => {
      const weightPer = input.weights?.[l.code];
      return {
        code: l.code,
        name: ELEMENT_NAMES[l.code],
        quantity: l.qty,
        unit: "шт",
        unitPrice: l.price,
        total: l.qty * l.price,
        weightKg: weightPer != null ? weightPer * l.qty : undefined,
      };
    });

  const productTotal = product.reduce((s, l) => s + l.total, 0);

  // Поддоны (ТЗ §9.1.3): ceil(кол-во_по_типу / шт_поддон) суммарно
  let pallets: number | undefined;
  if (input.pallets) {
    pallets = 0;
    for (const l of lineDefs) {
      const perPallet = input.pallets[l.code];
      if (perPallet && l.qty > 0) pallets += Math.ceil(l.qty / perPallet);
    }
  }

  // Площадь облицовки для сопутствующих материалов (ТЗ §9.1.3):
  // площадка + проступи (Pпро × d) + подступёнки (Pпро × h, если облицовываются)
  const cladArea = input.marches.reduce((sum, m) => {
    const tread = m.steps * m.width * m.treadDepth;
    const riser = input.cladRisers ? m.steps * m.width * m.riserHeight : 0;
    return sum + tread + riser;
  }, platformArea);

  const materials = calcMaterials(cladArea, input.city, input.materials);
  const extrasTotal = materialsTotal(materials);

  const productWeightKg = product.reduce(
    (s, l) => s + (l.weightKg ?? 0),
    0,
  );
  const weightTons =
    (productWeightKg + materialsWeightKg(materials)) / 1000;

  const detail: ModeADetail = {
    kind: "A",
    marches: marchResults,
    baseTiles,
    cladArea,
  };

  return {
    mode: "A",
    city: input.city,
    product,
    materials,
    pallets,
    productTotal,
    extrasTotal,
    grandTotal: productTotal + extrasTotal,
    weightTons,
    detail,
  };
}
