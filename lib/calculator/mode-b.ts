/**
 * Режим B — терраса/площадка/дорожки: расчёт по площади (ТЗ §9.2).
 *
 * Формулы §9.2.6. Способы укладки: клей / опоры HILST / гравий.
 * Сверено с примерами §9.2.7 (опоры) и §9.2.8 (клей, Москва).
 */

import { calcMaterials, materialsTotal, materialsWeightKg } from "./materials";
import { formatKey, pedestalsPerSqm, WASTE_FACTOR } from "./reference";
import type {
  CalcResult,
  DeductionInput,
  ModeBDetail,
  ModeBInput,
  ProductLine,
} from "./types";

/** Площадь одного вычета, м² (ТЗ §9.2.1). */
function deductionArea(d: DeductionInput): number {
  if (d.shape === "circle") {
    const r = (d.diameter ?? 0) / 2;
    return Math.PI * r * r;
  }
  return (d.length ?? 0) * (d.width ?? 0);
}

/** Площадь плиты, м², из размеров формата. */
export function slabArea(widthMm: number, heightMm: number): number {
  return (widthMm / 1000) * (heightMm / 1000);
}

export function calcModeB(input: ModeBInput): CalcResult {
  const waste = WASTE_FACTOR[input.layout];

  // Sнетто = Σ(Дi×Шi) − Σ вычеты
  const gross = input.areas.reduce((s, a) => s + a.length * a.width, 0);
  const deducted = (input.deductions ?? []).reduce(
    (s, d) => s + deductionArea(d),
    0,
  );
  const netArea = Math.max(0, gross - deducted);

  // Sзап = Sнетто × (1 + запас)
  const areaWithWaste = netArea * (1 + waste);

  const sPlate = slabArea(input.format.widthMm, input.format.heightMm);
  // Плит = ceil( Sзап / Sплиты )
  const slabs = sPlate > 0 ? Math.ceil(areaWithWaste / sPlate) : 0;

  // Стоимость плитки: плит × цена_шт (приоритет) или Sзап × цена_м²
  let slabTotal: number;
  let slabUnit: string;
  let slabUnitPrice: number;
  let slabQuantity: number;
  if (input.pricePerPiece != null) {
    slabTotal = slabs * input.pricePerPiece;
    slabUnit = "шт";
    slabUnitPrice = input.pricePerPiece;
    slabQuantity = slabs;
  } else {
    const perSqm = input.pricePerSqm ?? 0;
    slabTotal = areaWithWaste * perSqm;
    slabUnit = "м²";
    slabUnitPrice = perSqm;
    slabQuantity = areaWithWaste;
  }

  const product: ProductLine[] = [
    {
      code: input.format.code,
      name: `Пластина ${input.format.widthMm}×${input.format.heightMm} мм`,
      quantity: slabQuantity,
      unit: slabUnit,
      unitPrice: slabUnitPrice,
      total: slabTotal,
      weightKg:
        input.format.weightKg != null
          ? input.format.weightKg * slabs
          : undefined,
    },
  ];

  // Поддоны: ceil(плит / шт_поддон)
  const pallets =
    input.format.perPallet && input.format.perPallet > 0
      ? Math.ceil(slabs / input.format.perPallet)
      : undefined;

  // Опоры (если на опоры): ceil( Sнетто × опор_м²(формат, площадь) )
  let pedestals: number | undefined;
  let perSqmSupports: number | undefined;
  let extrasTotal = 0;
  const materials =
    input.method === "glue" && input.withMaterials
      ? calcMaterials(netArea, input.city, input.materials)
      : [];

  if (input.method === "pedestals") {
    const key = formatKey(input.format.widthMm, input.format.heightMm);
    const rate = pedestalsPerSqm(key, netArea);
    if (rate != null) {
      perSqmSupports = rate;
      pedestals = Math.ceil(netArea * rate);
      const price = input.pedestalPrice ?? 0;
      extrasTotal = pedestals * price;
      product.push({
        code: "pedestal",
        name: "Опора регулируемая HILST",
        quantity: pedestals,
        unit: "опора",
        unitPrice: price,
        total: extrasTotal,
      });
    }
  } else {
    extrasTotal = materialsTotal(materials);
  }

  const productTotal = slabTotal;

  // Вес поставки (т): (плит × вес_плиты + материалы) / 1000
  const slabWeightKg =
    input.format.weightKg != null ? input.format.weightKg * slabs : 0;
  const weightTons = (slabWeightKg + materialsWeightKg(materials)) / 1000;

  const detail: ModeBDetail = {
    kind: "B",
    netArea,
    areaWithWaste,
    wasteFactor: waste,
    slabs,
    pedestals,
    pedestalsPerSqm: perSqmSupports,
  };

  return {
    mode: "B",
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
