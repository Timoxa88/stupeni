/**
 * Справочные данные калькулятора (ТЗ §8.3, §9.2.3, §9.2.4, §9.3).
 *
 * Эти значения по ТЗ редактируются и подтягиваются из CMS без деплоя (§9.6).
 * Здесь — дефолты, перенесённые из документа дословно; реальные цифры
 * приходят из карточки артикула / справочников CMS и переопределяют эти.
 */

import type {
  BaseTileSize,
  HilstPedestal,
  LayoutPattern,
  MaterialSpec,
} from "./types";

/** Запас на подрез по типу раскладки (ТЗ §9.2.3). */
export const WASTE_FACTOR: Record<LayoutPattern, number> = {
  straight: 0.05, // Прямая
  offset: 0.08, // Со смещением
  diagonal: 0.1, // Диагональ
  complex: 0.12, // Сложная геометрия
};

/** Запас на подрез по умолчанию для Режима A (ТЗ §9.1.3, k = 5%). */
export const STEP_WASTE_FACTOR = 0.05;

/** Шт/м² базовой плитки по размеру (ТЗ §8.3). */
export const TILE_PER_SQM: Record<BaseTileSize, number> = {
  "30x30": 11.11,
  "30x60": 5.56,
};

/**
 * Сопутствующие материалы для клеевой укладки (ТЗ §9.3).
 * Цены — на дату ТЗ; обновляются из CMS.
 */
export const FLOOR_MATS: MaterialSpec[] = [
  {
    code: "glue",
    name: "Клей Flex FKC",
    pack: "мешок 25 кг",
    packKg: 25,
    perSqm: 5,
    price: { msk: 2261.83, spb: 2386.83 },
  },
  {
    code: "primer",
    name: "Грунтовка UG",
    pack: "канистра 10 кг",
    packKg: 10,
    perSqm: 0.4,
    price: { msk: 1322.84, spb: 1372.84 },
  },
  {
    code: "waterproofing",
    name: "Гидроизоляция MDS",
    pack: "мешок 25 кг",
    packKg: 25,
    perSqm: 4,
    price: { msk: 1741.04, spb: 1866.04 },
  },
  {
    code: "grout",
    name: "Затирка FUG FBR (серый)",
    pack: "мешок 25 кг",
    packKg: 25,
    perSqm: 0.45,
    price: { msk: 1393.25, spb: 1518.25 },
  },
];

/**
 * Пороги площади (м²) для выбора колонки расхода опор HILST LIFT.
 * Выбирается ближайшая снизу (ТЗ §9.2.4); для площади < 20 берётся колонка 20.
 */
export const HILST_AREA_THRESHOLDS = [20, 50, 100, 1000] as const;
export type HilstAreaThreshold = (typeof HILST_AREA_THRESHOLDS)[number];

/**
 * Расход опор HILST LIFT (опор на 1 м²) по размеру плитки и площади террасы.
 * Источник: ATP HILST LIFT, лист 37 (ТЗ §9.2.4). Ключ — "ШxВ" в мм.
 * Колонки соответствуют HILST_AREA_THRESHOLDS: [20, 50, 100, 1000] м².
 */
export const HILST_LIFT: Record<string, [number, number, number, number]> = {
  "400x400": [7.7, 7.28, 6.77, 6.4],
  "500x500": [4.95, 4.64, 4.41, 4.14],
  "600x600": [6.8, 6.32, 6.13, 5.6],
  "750x750": [4.55, 4.22, 3.94, 3.68],
  "800x800": [7.7, 7.28, 6.71, 6.37],
  "900x900": [6.0, 5.52, 5.38, 5.0],
  "1000x1000": [4.95, 4.64, 4.41, 4.14],
  // ТЗ A.2 E2: ключ был "1200x200" (опечатка) → "1200x1200" (формат §8.3).
  "1200x1200": [10.4, 10.0, 9.0, 8.5],
  "300x600": [7.2, 6.8, 6.12, 5.7],
  "300x1200": [7.2, 6.8, 6.13, 5.7],
  "400x800": [7.7, 7.28, 6.77, 6.43],
  "400x1200": [7.7, 7.28, 6.77, 6.43],
  "450x900": [6.0, 5.52, 5.38, 5.0],
  "600x900": [5.0, 4.32, 4.15, 3.8],
  // ТЗ A.2 E3 / B.11: третье значение было 6.71 (ломало монотонность 6.8→6.32→6.71→5.6),
  // исправлено на 6.13 (соответствует строке 300x1200 и монотонному убыванию).
  "600x1200": [6.8, 6.32, 6.13, 5.6],
};
// B.11: значение 6.71 в строке "800x800" монотонно и правдоподобно; остальные
// ячейки совпадают с §9.2.4. Полная поячеечная сверка с листом 37 ATP HILST LIFT —
// при получении исходного документа (TBD заказчик).

/** Минимальный рекомендованный размер плитки для опор (ТЗ §9.2.2/§9.2.4). */
export const PEDESTAL_MIN_SIDE_MM = 400;

/**
 * Регулируемые опоры HILST LIFT Self-Leveling — модели, высоты и цены.
 * Источник: https://hilst.ru/product/reguliruemye-opory/hilst-lift-self-leveling/
 * Цены редактируемы и обновляются из CMS (ТЗ §9.6).
 */
export const HILST_PEDESTALS: HilstPedestal[] = [
  { code: "HL0", heightMin: 23, heightMax: 37, price: 215 },
  { code: "HL1", heightMin: 35, heightMax: 50, price: 266 },
  { code: "HL2", heightMin: 50, heightMax: 75, price: 285 },
  { code: "HL3", heightMin: 70, heightMax: 120, price: 315 },
  { code: "HL4", heightMin: 115, heightMax: 155, price: 387 },
  { code: "HL5", heightMin: 155, heightMax: 250, price: 460 },
  { code: "HL6", heightMin: 195, heightMax: 285, price: 532 },
  { code: "HL7", heightMin: 235, heightMax: 385, price: 605 },
  { code: "HL8", heightMin: 285, heightMax: 430, price: 678 },
  { code: "HL9", heightMin: 335, heightMax: 485, price: 750 },
  { code: "HL10", heightMin: 385, heightMax: 530, price: 823 },
];

/** Модель опоры по умолчанию (частый диапазон высоты для террас). */
export const DEFAULT_PEDESTAL_CODE = "HL2";

/**
 * Расход опор/м² для заданного формата и площади.
 * Возвращает null, если формат отсутствует в таблице (нестандартный — индивидуальный расчёт).
 */
export function pedestalsPerSqm(
  formatCode: string,
  areaSqm: number,
): number | null {
  const row = HILST_LIFT[formatCode];
  if (!row) return null;

  // ближайший снизу порог; для площади < 20 — первая колонка (20)
  let columnIndex = 0;
  for (let i = 0; i < HILST_AREA_THRESHOLDS.length; i++) {
    if (areaSqm >= HILST_AREA_THRESHOLDS[i]) columnIndex = i;
  }
  return row[columnIndex];
}

/** Нормализует размеры в ключ таблицы ("600x600"), порядок сторон сохраняется. */
export function formatKey(widthMm: number, heightMm: number): string {
  return `${widthMm}x${heightMm}`;
}
