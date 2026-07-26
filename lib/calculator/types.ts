/**
 * Калькулятор Hit Ceramics — доменные типы (ТЗ §9).
 *
 * Два режима:
 *  - Режим A — лестница/крыльцо: поэлементный расчёт ступеней по маршам.
 *  - Режим B — терраса/площадка: расчёт по площади (клей / опоры HILST / гравий).
 *
 * Все денежные величины — в рублях (number, копейки допустимы).
 * Все размеры — в метрах, если не указано иное.
 */

export type City = "msk" | "spb";

/** Размер базовой плитки для расчёта в штуках (ТЗ §8.3 / §9.1.2). */
export type BaseTileSize = "30x30" | "30x60";

/** Способ укладки террасы (ТЗ §9.2.2). */
export type LayingMethod = "glue" | "pedestals" | "gravel";

/** Раскладка и соответствующий запас на подрез (ТЗ §9.2.3). */
export type LayoutPattern = "straight" | "offset" | "diagonal" | "complex";

/** Коды сопутствующих материалов (ТЗ §9.3). */
export type MaterialCode = "glue" | "primer" | "waterproofing" | "grout";

// ── Опоры HILST ──────────────────────────────────────────────────────────────

/** Модель регулируемой опоры HILST LIFT Self-Leveling (источник: hilst.ru). */
export interface HilstPedestal {
  /** Артикул, напр. "HL2". */
  code: string;
  /** Диапазон высоты, мм. */
  heightMin: number;
  heightMax: number;
  /** Цена за штуку, ₽. */
  price: number;
}

// ── Сопутствующие материалы ────────────────────────────────────────────────

export interface MaterialSpec {
  code: MaterialCode;
  name: string;
  /** Фасовка, человекочитаемо: «мешок 25 кг». */
  pack: string;
  /** Масса упаковки, кг. */
  packKg: number;
  /** Расход, кг/м². */
  perSqm: number;
  /** Цена упаковки по городу, ₽. */
  price: Record<City, number>;
}

export interface MaterialLine {
  code: MaterialCode;
  name: string;
  pack: string;
  /** Требуемая масса, кг (расход × площадь). */
  requiredKg: number;
  /** Упаковок (округление вверх). */
  packs: number;
  /** Масса по упаковкам, кг (packs × packKg). */
  totalKg: number;
  /** Цена за упаковку в выбранном городе, ₽. */
  unitPrice: number;
  /** Стоимость строки, ₽. */
  total: number;
}

// ── Режим A: ступени ────────────────────────────────────────────────────────

/** Один лестничный марш (ТЗ §9.1.1). */
export interface MarchInput {
  id: string;
  name?: string;
  /** N — число ступеней в марше. */
  steps: number;
  /** W — ширина марша по фронту, м. */
  width: number;
  /** d — глубина проступи, м. */
  treadDepth: number;
  /** h — высота подступёнка, м. */
  riserHeight: number;
  /** Внешних углов марша: 0 / 1 / 2. */
  externalCorners: 0 | 1 | 2;
}

/** Геометрия элементов артикула, м (ТЗ §9.1.2). */
export interface StepGeometry {
  /** Lф — длина фронтального элемента. */
  frontLength: number;
  /** Lп — длина подступёнка. */
  riserLength: number;
  /** Lпл — длина плинтуса. */
  plinthLength: number;
  /** Wугл — ширина угловой ступени. */
  cornerWidth: number;
}

/** Коды элементов системы ступеней. */
export type StepElementCode =
  | "front"
  | "corner"
  | "riser"
  | "base"
  | "plinth";

export interface StepElementPrices {
  front: number;
  corner: number;
  riser: number;
  base: number;
  plinth: number;
}

/** Масса штуки элемента, кг (опционально). */
export type StepElementWeights = Partial<Record<StepElementCode, number>>;

/** Шт/поддон по элементу (опционально). */
export type StepElementPallets = Partial<Record<StepElementCode, number>>;

export interface ModeAInput {
  city: City;
  marches: MarchInput[];
  /** Облицовывать подступёнки? */
  cladRisers: boolean;
  /** Боковины марша (плинтус)? */
  cladSides: boolean;
  /** Верхняя площадка крыльца, м (опц.). */
  platform?: { length: number; width: number };
  /** Размер базовой плитки площадки (используется, если у артикула нет своей нормы). */
  baseTileSize: BaseTileSize;
  /**
   * Фактическая норма базовой плитки артикула, шт/м² (ТЗ §8.3: «если у артикула задан
   * точный per_sqm из тех. листа — берётся он»). Приоритетнее baseTileSize.
   * Без этого поля площадка из плитки 300×600 считалась по норме 30×30 — ровно вдвое больше.
   */
  basePerSqm?: number;
  geometry: StepGeometry;
  prices: StepElementPrices;
  weights?: StepElementWeights;
  pallets?: StepElementPallets;
  /** Какие сопутствующие материалы считать (по умолчанию — все). */
  materials?: Partial<Record<MaterialCode, boolean>>;
  /** Запас на подрез (по умолчанию 0.05 = 5%). */
  wasteFactor?: number;
}

/** Расчёт по одному маршу (диагностика/детализация). */
export interface MarchResult {
  id: string;
  name?: string;
  /** Pпро — погонаж проступи, м. */
  treadRunningMeters: number;
  /** Aугл — угловые элементы, шт. */
  corners: number;
  /** Fфр — фронтальные элементы, шт. */
  fronts: number;
  /** Fпод — подступёнки, шт. */
  risers: number;
  /** Lнакл — длина наклона марша, м. */
  inclineLength: number;
  /** Fпл — плинтус, шт. */
  plinths: number;
}

// ── Режим B: терраса ──────────────────────────────────────────────────────────

export interface AreaInput {
  id: string;
  name?: string;
  /** Длина, м. */
  length: number;
  /** Ширина, м. */
  width: number;
}

export type DeductionShape = "rect" | "circle";

export interface DeductionInput {
  id: string;
  shape: DeductionShape;
  /** Для rect — длина; для circle игнорируется. */
  length?: number;
  /** Для rect — ширина. */
  width?: number;
  /** Для circle — диаметр, м. */
  diameter?: number;
}

/** Формат пластины (ТЗ §8.3 / §17). */
export interface SlabFormat {
  /** Нормализованный ключ, напр. "600x600" (мм). */
  code: string;
  /** Размеры, мм. */
  widthMm: number;
  heightMm: number;
  thicknessMm?: number;
  /** Масса штуки, кг (опц.). */
  weightKg?: number;
  /** Шт/поддон (опц.). */
  perPallet?: number;
}

export interface ModeBInput {
  city: City;
  areas: AreaInput[];
  deductions?: DeductionInput[];
  format: SlabFormat;
  method: LayingMethod;
  layout: LayoutPattern;
  /** Цена за штуку, ₽ (приоритетно). */
  pricePerPiece?: number;
  /** Цена за м², ₽ (если задана вместо штучной). */
  pricePerSqm?: number;
  /** Цена опоры HILST, ₽/шт (если method = pedestals). */
  pedestalPrice?: number;
  /** Считать сопутствующие материалы (если method = glue). */
  withMaterials?: boolean;
  /** Какие материалы считать (по умолчанию — все). */
  materials?: Partial<Record<MaterialCode, boolean>>;
}

// ── Общие результаты ──────────────────────────────────────────────────────────

export interface ProductLine {
  code: string;
  name: string;
  quantity: number;
  /** Единица: «шт», «м²», «опора». */
  unit: string;
  unitPrice: number;
  total: number;
  weightKg?: number;
}

export interface CalcResult {
  mode: "A" | "B";
  city: City;
  /** Позиции по плитке/элементам. */
  product: ProductLine[];
  /** Сопутствующие материалы (если считались). */
  materials: MaterialLine[];
  /** Поддонов всего (если данные есть). */
  pallets?: number;
  /** Стоимость продукции (плитка/элементы), ₽. */
  productTotal: number;
  /** Стоимость материалов/опор, ₽. */
  extrasTotal: number;
  /** Итого материалы, ₽. */
  grandTotal: number;
  /** Вес поставки, т. */
  weightTons: number;
  /** Детализация по режиму. */
  detail: ModeADetail | ModeBDetail;
}

export interface ModeADetail {
  kind: "A";
  marches: MarchResult[];
  /** Базовая плитка площадки, шт. */
  baseTiles: number;
  /** Площадь облицовки для материалов, м². */
  cladArea: number;
}

export interface ModeBDetail {
  kind: "B";
  /** Sнетто, м². */
  netArea: number;
  /** Sзап, м². */
  areaWithWaste: number;
  /** Запас на подрез (доля). */
  wasteFactor: number;
  /** Плит, шт. */
  slabs: number;
  /** Опор, шт (если на опоры). */
  pedestals?: number;
  /** Расход опор/м² по таблице HILST (если на опоры). */
  pedestalsPerSqm?: number;
}
