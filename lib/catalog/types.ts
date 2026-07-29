/** Схема данных товара (ТЗ §17). Источник в проде — headless CMS. */

export type ProductType = "step_system" | "slab";

export type ApplicationCode =
  | "kryltso"
  | "lestnitsa-ulitsa"
  | "terrasa"
  | "dorozhki"
  | "landshaft-opory"
  | "bassein";

/**
 * Элементы системы ступеней.
 *
 * Ступень бывает двух исполнений, и это РАЗНЫЕ товары с разной ценой и геометрией:
 *  - «с капиносом» (`front`, `corner_l`) — с выступающим носиком, кладётся на
 *    проступь как готовая кромка;
 *  - «с насечками» (`front_notch`, `corner_notch`) — простая плитка с рифлением
 *    на лицевой стороне, кромку формирует подрезка.
 * До 29.07.2026 в каталоге жил один код `front`, и у 14 коллекций Paradyz
 * насечная ступень вытеснила капиносную (генератор оставлял «самую длинную»).
 */
export type ElementCode =
  | "front"
  | "front_notch"
  | "corner_l"
  | "corner_r"
  | "corner_notch"
  | "riser"
  | "base"
  | "plinth";

export interface ProductElement {
  code: ElementCode;
  name: string;
  /** «1200x320». */
  size_mm: string;
  /** Длина элемента, м (для линейных). */
  length_m?: number;
  unit: "pcs" | "sqm";
  /** Шт/м² (для base). */
  per_sqm?: number;
  /** Вес штуки, кг. Нет в источнике — строка в карточке не выводится. */
  weight_kg?: number;
  per_pallet?: number;
  price_rub: number;
  /**
   * Фото именно этого элемента. Один код может встречаться несколько раз
   * (плитка 300×300 и 300×600 — два элемента), поэтому ключ элемента —
   * пара code + size_mm; см. elementKey() в lib/catalog/elements.ts.
   */
  photo?: string;
  /** Артикул элемента у поставщика (в карточке — под выбранный элемент). */
  sku?: string;
}

export interface ProductFormat {
  /** «600x1200». */
  code: string;
  size_mm: string;
  thickness_mm: number;
  weight_kg: number;
  per_sqm: number;
  per_pallet?: number;
  price_rub_sqm: number;
  /** Цена за штуку (если есть; иначе считается по м²). */
  price_rub_pcs?: number;
}

/** Ключ продуктовой категории-хаба (ТЗ §3). Дублирует CategoryKey в queries.ts. */
export type ProductCategory =
  | "terrasnyy-klinker"
  | "terrasnye-plastiny"
  | "plastiny-pod-derevo";

/**
 * Характеристики. Морозостойкость, водопоглощение и R-класс опциональны:
 * если в источнике данных марки нет, поле остаётся пустым и строка не выводится —
 * писать «F100» или «0 %» по догадке нельзя (это заявление о свойствах товара).
 */
export interface ProductSpecs {
  surface: string;
  color: string;
  color_hex: string;
  frost_resistance?: string;
  water_absorption_pct?: number;
  slip_resistance?: string;
}

/**
 * Промо-механика (ТЗ §8.1). Менеджер включает/выключает из CMS.
 * По истечении `ends_at` акция считается завершённой (см. `activePromo`).
 */
export interface ProductPromo {
  /** Старая (зачёркнутая) цена, ₽. */
  old_price?: number;
  /** Процент скидки для бейджа, напр. 15 → «−15 %». */
  discount_percent?: number;
  /** Метка акции, напр. «Акция», «Хит». */
  label?: string;
  /** ISO-дата окончания акции (для таймера); по истечении гаснет. */
  ends_at?: string;
}

/**
 * Цветовой вариант коллекции (ТЗ §6 блок 10 / §8.1).
 * Чип в витрине меняет превью и ведёт в карточку на выбранном цвете.
 */
export interface ProductVariant {
  /** id артикула этого цвета (ссылка на Product.id). */
  id: string;
  color: string;
  color_hex: string;
  /** Превью-фото варианта (подмена в сетке витрины). */
  photo?: string;
}

export interface Product {
  id: string;
  brand: string;
  product_type: ProductType;
  application: ApplicationCode[];
  /**
   * Явная категория-хаб. Нужна там, где её не вывести из типа: тонкая клинкерная
   * напольная плитка (8–11 мм) — это «Террасный клинкер», а не «Пластины 20 мм».
   * Не задана — категория выводится из product_type/поверхности (см. productCategory).
   */
  category?: ProductCategory;
  collection: string;
  sku: string;
  active: boolean;
  elements?: ProductElement[];
  formats?: ProductFormat[];
  specs: ProductSpecs;
  /** Наличие (ТЗ B.8/B.9). Источник в проде — 1С/учётная система. */
  stock_status?: "in_stock" | "on_order";
  /** Срок поставки под заказ, недель (для импортных коллекций обычно 6–10). */
  lead_time_weeks?: number;
  /** Дата актуальности цены, ISO (ТЗ B.9 — версионность цены/курса). */
  price_updated_at?: string;
  /** Промо-акция (ТЗ §8.1). */
  promo?: ProductPromo;
  /** Цветовые варианты коллекции (ТЗ §6 блок 10). */
  variants?: ProductVariant[];
  photos: string[];
  documents?: ProductDocument[];
  seo: { title: string; description: string; h1: string };
}

/** Документ артикула (ТЗ §8.4 вкладка 5). */
export interface ProductDocument {
  name: string;
  url: string;
  /** Тип: pdf-лист/каталог свободно; bim/texture — после профи-регистрации. */
  kind?: "tech" | "catalog" | "cert" | "bim" | "texture";
  /** Требует профи-регистрации для скачивания (BIM/CAD, текстуры). */
  gated?: boolean;
}
