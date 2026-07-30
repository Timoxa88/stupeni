/**
 * Фильтры и сортировка листингов каталога.
 *
 * Состояние живёт в query-параметрах (?color=bezhevyy&sort=price-asc) —
 * фильтрует СЕРВЕР: работает без JS, дружит с пагинацией (?page=N поверх
 * фильтров) и не тащит весь каталог в браузер.
 *
 * Цвет — не сырые значения specs.color (41 вариант на двух языках), а восемь
 * витринных групп: имя цвета разбирается по словарю токенов, непонятное
 * классифицируется по color_hex (HSL). Страна берётся из BRANDS.
 *
 * «Популярные» — реальной аналитики у лендинга нет (Метрика не подключена),
 * ранжируем по продажам ЗЕ ВАН: ходовые коллекции получают вес, внутри одного
 * веса сохраняется разнесённый порядок листинга (см. diversify.ts) — поэтому
 * даже топ выдачи не слипается в одну коллекцию.
 */

import type { Product } from "./types";
import { basePrice } from "./queries";
import { collectionBase, slug } from "./taxonomy";
import { BRANDS } from "./brands";

export type SortKey = "recommended" | "popular" | "price-asc" | "price-desc";

export interface CatalogQuery {
  sort: SortKey;
  /** Поисковая строка (?q=): токены ищутся в бренде/коллекции/цвете с транслитом. */
  q?: string;
  color?: string;
  country?: string;
  brand?: string;
  surface?: string;
  slip?: string;
  type?: string;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Рекомендуемые" },
  { value: "popular", label: "Популярные" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
];

// ── Цветовые группы ───────────────────────────────────────────────────────────

const COLOR_GROUP_LABELS: Record<string, string> = {
  bezhevyy: "Бежевый",
  korichnevyy: "Коричневый",
  seryy: "Серый",
  grafit: "Графит / чёрный",
  belyy: "Белый",
  krasnyy: "Красный / терракота",
  zheltyy: "Жёлтый / охра",
  zelenyy: "Зелёный",
};

/** Репрезентативный цвет свотча каждой витринной группы (для визуального подбора). */
export const COLOR_GROUP_HEX: Record<string, string> = {
  bezhevyy: "#C9B79C",
  korichnevyy: "#6F4E37",
  seryy: "#9A9A94",
  grafit: "#3B3B3B",
  belyy: "#EFEBE2",
  krasnyy: "#A9502F",
  zheltyy: "#C99A4B",
  zelenyy: "#6B7A54",
};

/** Порядок проверки важен: «антрацит» должен уйти в графит раньше серого. */
const COLOR_TOKENS: [string, string[]][] = [
  ["grafit", ["grafit", "graphit", "anthra", "antrac", "nero", "black", "chern", "schwarz", "bazalt", "lava"]],
  ["belyy", ["white", "bel", "bianco", "weiss", "snow"]],
  ["krasnyy", ["rosso", "red", "krasn", "rot ", "terra", "cotto", "kotto", "rust", "rzhav", "rosa", "cegl"]],
  ["zheltyy", ["ochra", "ohra", "honey", "gold", "zolot", "medov", "yellow", "gelb", "curry", "amber"]],
  ["zelenyy", ["verde", "zelen", "green", "oliv"]],
  ["seryy", ["grys", "grey", "gray", "sery", "silver", "serebr", "beton", "krios", "grau", "stal", "steel"]],
  ["bezhevyy", ["beige", "bezh", "crema", "cream", "sand", "pesoch", "marfil", "ivory", "bone", "taupe", "svetl", "capuc", "vanil"]],
  ["korichnevyy", ["brown", "korichn", "marrone", "braun", "mocca", "mokka", "choco", "duro", "natural", "teak", "tabak", "tundra", "temn", "dark"]],
];

const CYR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
};
const norm = (s: string) =>
  s.toLowerCase().split("").map((ch) => CYR[ch] ?? ch).join("");

function hexGroup(hex?: string): string | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d > 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
  }
  if (l < 0.22) return "grafit";
  if (s < 0.12) return l > 0.8 ? "belyy" : l > 0.45 ? "seryy" : "grafit";
  if (h < 15 || h >= 340) return "krasnyy";
  if (h < 45) return l > 0.62 ? "bezhevyy" : "korichnevyy";
  if (h < 70) return "zheltyy";
  if (h < 170) return "zelenyy";
  if (h < 260) return "seryy";
  return "seryy";
}

/** Витринная группа цвета товара (slug из COLOR_GROUP_LABELS) либо null. */
export function colorGroupOf(p: Product): string | null {
  const name = norm(`${p.specs.color ?? ""} ${p.collection}`);
  for (const [group, tokens] of COLOR_TOKENS) {
    if (tokens.some((t) => name.includes(t))) return group;
  }
  return hexGroup(p.specs.color_hex);
}

// ── Страна ────────────────────────────────────────────────────────────────────

const COUNTRY_BY_BRAND = new Map(BRANDS.map((b) => [b.name, b.country]));

export function countryOf(p: Product): string | undefined {
  return COUNTRY_BY_BRAND.get(p.brand);
}

// ── Поверхность / противоскольжение / тип ─────────────────────────────────────

const SURFACE_LABELS: Record<string, string> = {
  structured: "Структурированная",
  matte: "Матовая",
  smooth: "Гладкая",
  wood: "Под дерево",
};

const TYPE_LABELS: Record<string, string> = {
  stupeni: "Ступени",
  plitka: "Плитка 20 мм",
};

const typeSlug = (p: Product) => (p.product_type === "step_system" ? "stupeni" : "plitka");

/** «R10/A» и «R11/B» с карточек Славдома сводим к базовому классу. */
const slipClass = (p: Product) => {
  const m = /^R\d+/.exec(p.specs.slip_resistance ?? "");
  return m ? m[0] : null;
};

// ── Популярность ──────────────────────────────────────────────────────────────

/**
 * Веса коллекций по фактическим продажам ЗЕ ВАН (Scandiano — многолетний
 * бестселлер; Cloud/Mattone/Semir/Aera — ходовые). Не аналитика сайта —
 * заменить на неё, когда появится Метрика с электронной коммерцией.
 */
const POPULAR_COLLECTIONS: Record<string, number> = {
  "Scandiano": 3, "Cloud": 3, "Mattone": 3, "Keraplatte Aera": 3, "Semir": 3,
  "Viano": 2, "Natural": 2, "Ilario": 2, "Taurus": 2, "Eremite": 2,
  "Keraplatte Roccia": 2, "ATRIUM": 2, "Sundown": 2,
};

function popularityScore(p: Product): number {
  const base = collectionBase(p);
  const key = Object.keys(POPULAR_COLLECTIONS).find(
    (k) => base === k || base.startsWith(k + " "),
  );
  const w = key ? POPULAR_COLLECTIONS[key] : 0;
  const photo = p.photos[0]?.startsWith("/images/products/") ? 1 : 0;
  // Paradyz — основной бренд (30.07.2026): в «Популярных» весь его ассортимент
  // стоит выше чужого; внутри бренда сохраняются веса коллекций по продажам.
  const brand = p.brand === "Paradyz" ? 100 : 0;
  return brand + w * 10 + photo;
}

// ── Разбор query, фильтрация, сортировка ──────────────────────────────────────

type RawParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseCatalogQuery(sp: RawParams): CatalogQuery {
  const sort = one(sp.sort);
  return {
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "recommended",
    q: one(sp.q)?.trim() || undefined,
    color: one(sp.color) || undefined,
    country: one(sp.country) || undefined,
    brand: one(sp.brand) || undefined,
    surface: one(sp.surface) || undefined,
    slip: one(sp.slip) || undefined,
    type: one(sp.type) || undefined,
  };
}

export function hasActiveFilters(q: CatalogQuery): boolean {
  return Boolean(q.q || q.color || q.country || q.brand || q.surface || q.slip || q.type);
}

/** Строка query без значений по умолчанию (пустая, если фильтров нет). */
export function catalogQueryString(q: CatalogQuery): string {
  const params = new URLSearchParams();
  if (q.sort !== "recommended") params.set("sort", q.sort);
  for (const k of ["q", "color", "country", "brand", "surface", "slip", "type"] as const) {
    if (q[k]) params.set(k, q[k]!);
  }
  return params.toString();
}

/**
 * Поиск: каждый токен запроса должен встретиться в «бренд + коллекция + цвет».
 * Обе стороны прогоняются через транслит — «сканд бежевый» находит
 * «Paradyz Scandiano Beige».
 */
export function matchesSearch(p: Product, query: string): boolean {
  const hay = norm(`${p.brand} ${p.collection} ${p.specs.color ?? ""}`);
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(norm(t)));
}

export function filterProducts(list: Product[], q: CatalogQuery): Product[] {
  return list.filter((p) => {
    if (q.q && !matchesSearch(p, q.q)) return false;
    if (q.color && colorGroupOf(p) !== q.color) return false;
    if (q.country && slug(countryOf(p) ?? "") !== q.country) return false;
    if (q.brand && slug(p.brand) !== q.brand) return false;
    if (q.surface && p.specs.surface !== q.surface) return false;
    if (q.slip && slipClass(p) !== q.slip) return false;
    if (q.type && typeSlug(p) !== q.type) return false;
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const out = [...list];
  switch (sort) {
    case "popular":
      // stable sort: внутри одного веса сохраняется разнесённый порядок
      return out.sort((a, b) => popularityScore(b) - popularityScore(a));
    case "price-asc":
      return out.sort((a, b) => basePrice(a) - basePrice(b));
    case "price-desc":
      return out.sort((a, b) => basePrice(b) - basePrice(a));
    default:
      return out; // recommended = разнесённый порядок из diversify
  }
}

// ── Фасеты с счётчиками ───────────────────────────────────────────────────────

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface Facets {
  colors: FacetOption[];
  countries: FacetOption[];
  brands: FacetOption[];
  surfaces: FacetOption[];
  slips: FacetOption[];
  types: FacetOption[];
}

function countBy(
  list: Product[],
  keyOf: (p: Product) => string | null | undefined,
  labelOf: (value: string, p: Product) => string,
): FacetOption[] {
  const acc = new Map<string, FacetOption>();
  for (const p of list) {
    const value = keyOf(p);
    if (!value) continue;
    const hit = acc.get(value);
    if (hit) hit.count++;
    else acc.set(value, { value, label: labelOf(value, p), count: 1 });
  }
  return [...acc.values()];
}

/**
 * Счётчик каждого фасета считается по списку, отфильтрованному ВСЕМИ остальными
 * фасетами: выбрал «Польша» — в цветах остаются только польские варианты,
 * но сама страна показывает и другие доступные значения.
 */
export function facetsOf(list: Product[], q: CatalogQuery): Facets {
  const without = (key: keyof CatalogQuery) => filterProducts(list, { ...q, [key]: undefined });

  const colorOrder = Object.keys(COLOR_GROUP_LABELS);
  return {
    colors: countBy(without("color"), colorGroupOf, (v) => COLOR_GROUP_LABELS[v] ?? v).sort(
      (a, b) => colorOrder.indexOf(a.value) - colorOrder.indexOf(b.value),
    ),
    countries: countBy(without("country"), (p) => slug(countryOf(p) ?? ""), (_, p) => countryOf(p)!).sort(
      (a, b) => b.count - a.count,
    ),
    brands: countBy(without("brand"), (p) => slug(p.brand), (_, p) => p.brand).sort(
      (a, b) => b.count - a.count,
    ),
    surfaces: countBy(without("surface"), (p) => p.specs.surface, (v) => SURFACE_LABELS[v] ?? v).sort(
      (a, b) => b.count - a.count,
    ),
    slips: countBy(without("slip"), slipClass, (v) => v).sort((a, b) =>
      a.value.localeCompare(b.value, undefined, { numeric: true }),
    ),
    types: countBy(without("type"), typeSlug, (v) => TYPE_LABELS[v] ?? v).sort(
      (a, b) => b.count - a.count,
    ),
  };
}
