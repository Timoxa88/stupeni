/**
 * Таксономия каталога: назначение → бренд → коллекция → цвет.
 *
 * Зачем: каталог был плоским — три категории по типу материала и листинг на
 * 208 позиций с пагинацией. Найти «ступени Paradyz Scandiano бежевые» в нём
 * можно было только глазами. Теперь путь читается сам:
 * /catalog/kryltso/paradyz/scandiano → цвета → карточка.
 *
 * Данные в generated/products.ts неровные, и это приходится разбирать здесь:
 *  - у одних товаров цвет вшит в `collection` («Ardenas Antracita»),
 *    у других коллекция одна на всех, а цвет лежит в `specs.color`
 *    («Keraplatte Aera» + «705 beton»);
 *  - поэтому базовая коллекция вычисляется как самый длинный префикс из слов,
 *    который встречается у ДВУХ и более товаров бренда, а ярлык цвета — это
 *    остаток строки коллекции либо, если остатка нет, `specs.color`.
 * Проверено на всех 208 товарах: товаров без названия цвета — ноль.
 *
 * Товар остаётся по одному каноническому адресу /catalog/tovar/<id>: одна и та
 * же позиция попадает в несколько назначений, и плодить ей URL на каждое —
 * это дубли для поиска.
 */

import type { ApplicationCode, Product } from "@/lib/catalog/types";
import { activeProducts, getProductsByApplication } from "@/lib/catalog/queries";
import { SOLUTIONS } from "@/lib/content/solutions";

const CYR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
  ä: "a", ö: "o", ü: "u", ß: "ss",
};

export function slug(s: string): string {
  return s
    .toLowerCase()
    .split("")
    .map((ch) => CYR[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Канонический адрес карточки товара. */
export const productHref = (id: string) => `/catalog/tovar/${id}`;

// ── База коллекции ────────────────────────────────────────────────────────────

/** Самый длинный префикс из слов, который встречается у ≥2 товаров бренда. */
function computeBase(name: string, siblings: string[]): string {
  const toks = name.split(/\s+/).filter(Boolean);
  for (let k = toks.length; k > 0; k--) {
    const pref = toks.slice(0, k).join(" ");
    const hits = siblings.filter((s) => s === pref || s.startsWith(pref + " ")).length;
    if (hits >= 2) return pref;
  }
  return name;
}

const baseCache = new Map<string, string>();

function collectionsOfBrand(brand: string): string[] {
  return activeProducts().filter((p) => p.brand === brand).map((p) => p.collection);
}

/**
 * Технические серии, стоящие в конце имени коллекции. «Duro» у Paradyz — не
 * цвет, а исполнение (плотнее и толще), и продаётся оно в тех же цветах.
 * Без этого правила префиксная логика давала базу «Cloud Brown», а ярлыком
 * цвета становилось слово «Duro» — в фильтре цветов коллекции стояли
 * «Коричневый» и «Duro» рядом, как будто это два оттенка.
 */
const SERIES_SUFFIX = ["Duro"];

function splitSeries(collection: string): { head: string; series?: string } {
  for (const s of SERIES_SUFFIX) {
    if (collection.endsWith(" " + s)) {
      return { head: collection.slice(0, -(s.length + 1)), series: s };
    }
  }
  return { head: collection };
}

/**
 * Базовое имя коллекции товара («Ardenas Antracita» → «Ardenas»,
 * «Cloud Brown Duro» → «Cloud Duro»). Серия сравнивается только со «своими»:
 * Duro-коллекции образуют отдельную ветку каталога, а не подмешиваются к
 * обычным — у них другой артикул и другая цена.
 */
export function collectionBase(p: Product): string {
  const key = `${p.brand}|${p.collection}`;
  const hit = baseCache.get(key);
  if (hit) return hit;
  const { head, series } = splitSeries(p.collection);
  const siblings = collectionsOfBrand(p.brand)
    .map(splitSeries)
    .filter((x) => x.series === series)
    .map((x) => x.head);
  const head_base = computeBase(head, siblings);
  const base = series ? `${head_base} ${series}` : head_base;
  baseCache.set(key, base);
  return base;
}

/** Ярлык цвета/варианта («Antracita», «705 beton», «Дюна»). */
export function colorLabel(p: Product): string {
  const { head, series } = splitSeries(p.collection);
  const base = collectionBase(p);
  // у Duro-коллекций серия стоит в хвосте базы — цвет ищем в середине имени
  const headBase = series ? base.slice(0, base.length - series.length - 1) : base;
  const rest = head.slice(headBase.length).trim().replace(/^[,\s]+/, "");
  return rest || p.specs.color || "—";
}

// ── Уровни навигации ──────────────────────────────────────────────────────────

export interface AppNode {
  code: ApplicationCode;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
  count: number;
}

export interface BrandNode {
  name: string;
  slug: string;
  href: string;
  count: number;
  collections: number;
}

export interface CollectionNode {
  base: string;
  slug: string;
  href: string;
  products: Product[];
  /** Первое фото товара коллекции, у которого оно есть (иначе undefined). */
  cover?: string;
  coverAlt?: string;
}

const SHORT: Record<string, string> = {
  kryltso: "Крыльцо",
  "lestnitsa-ulitsa": "Уличная лестница",
  terrasa: "Терраса",
  dorozhki: "Садовые дорожки",
  "landshaft-opory": "Укладка на опоры",
  bassein: "Зона бассейна",
};

/** Первый уровень — назначения, у которых есть хоть один товар. */
export function applications(): AppNode[] {
  return SOLUTIONS.map((s) => ({
    code: s.slug,
    title: SHORT[s.slug] ?? s.h1,
    href: `/catalog/${s.slug}`,
    image: s.heroImage,
    imageAlt: s.heroAlt,
    count: getProductsByApplication(s.slug).length,
  })).filter((a) => a.count > 0);
}

export function getApplication(code: string): AppNode | undefined {
  return applications().find((a) => a.code === code);
}

/** Второй уровень — бренды внутри назначения. */
export function brandsOf(app: ApplicationCode): BrandNode[] {
  const items = getProductsByApplication(app);
  const byBrand = new Map<string, Product[]>();
  for (const p of items) {
    const list = byBrand.get(p.brand) ?? [];
    list.push(p);
    byBrand.set(p.brand, list);
  }
  return [...byBrand.entries()]
    .map(([name, list]) => ({
      name,
      slug: slug(name),
      href: `/catalog/${app}/${slug(name)}`,
      count: list.length,
      collections: new Set(list.map(collectionBase)).size,
    }))
    .sort((a, b) => b.count - a.count);
}

export function brandBySlug(app: ApplicationCode, brandSlug: string): string | undefined {
  return brandsOf(app).find((b) => b.slug === brandSlug)?.name;
}

/**
 * Назначение, под которым у бренда больше всего позиций нужного типа.
 *
 * Нужно, чтобы дать ссылку на коллекции бренда: адрес коллекции содержит сегмент
 * назначения (`/catalog/kryltso/paradyz/scandiano`), а одна и та же коллекция
 * попадает в несколько назначений. Берём то, где ассортимент полнее.
 *
 * Тип обязателен по делу: у Paradyz больше всего позиций в «террасе» (50 плит),
 * но витрина каталога показывает ступени — и ссылки на коллекции без фильтра
 * вели бы на плиты, которых в витрине нет.
 */
export function primaryApplicationOf(
  brand: string,
  type?: Product["product_type"],
): ApplicationCode | undefined {
  let best: { app: ApplicationCode; count: number } | undefined;
  for (const a of applications()) {
    const count = getProductsByApplication(a.code).filter(
      (p) => p.brand === brand && (!type || p.product_type === type),
    ).length;
    if (count && (!best || count > best.count)) best = { app: a.code, count };
  }
  return best?.app;
}

/** Коллекции бренда для перелинковки: назначение выбирается автоматически. */
export function collectionsOfBrandForLinks(
  brand: string,
  type?: Product["product_type"],
): CollectionNode[] {
  const app = primaryApplicationOf(brand, type);
  if (!app) return [];
  return collectionsOf(app, brand).filter(
    (c) => !type || c.products.some((p) => p.product_type === type),
  );
}

/** Третий уровень — коллекции бренда внутри назначения. */
export function collectionsOf(app: ApplicationCode, brand: string): CollectionNode[] {
  const items = getProductsByApplication(app).filter((p) => p.brand === brand);
  const byBase = new Map<string, Product[]>();
  for (const p of items) {
    const base = collectionBase(p);
    const list = byBase.get(base) ?? [];
    list.push(p);
    byBase.set(base, list);
  }
  return [...byBase.entries()]
    .map(([base, products]) => {
      const withPhoto = products.find((p) => p.photos[0]?.startsWith("/images/products/"));
      return {
        base,
        slug: slug(base),
        href: `/catalog/${app}/${slug(brand)}/${slug(base)}`,
        products,
        cover: withPhoto?.photos[0],
        coverAlt: withPhoto ? `${withPhoto.brand} ${withPhoto.collection}` : undefined,
      };
    })
    .sort((a, b) => b.products.length - a.products.length);
}

export function collectionBySlug(
  app: ApplicationCode,
  brand: string,
  collSlug: string,
): CollectionNode | undefined {
  return collectionsOf(app, brand).find((c) => c.slug === collSlug);
}

/** Все связки, у которых есть товары, — для generateStaticParams и sitemap. */
export function allPaths() {
  const out: { app: string; brand?: string; collection?: string }[] = [];
  for (const a of applications()) {
    out.push({ app: a.code });
    for (const b of brandsOf(a.code)) {
      out.push({ app: a.code, brand: b.slug });
      for (const c of collectionsOf(a.code, b.name)) {
        out.push({ app: a.code, brand: b.slug, collection: c.slug });
      }
    }
  }
  return out;
}

/**
 * Витрина «популярные»: по одной позиции на коллекцию и сначала те, у кого есть
 * своё фото. Без этого `activeProducts().slice(0, 8)` выдавал четыре цвета одной
 * коллекции подряд с одинаковым кадром — из-за чего витрина и выглядела стоковой.
 */
export function showcaseProducts(limit = 8): Product[] {
  return pickOnePerCollection(activeProducts(), limit);
}

/**
 * Витрина одного бренда — по позиции на коллекцию, сначала со своим фото.
 *
 * Понадобилось для Paradyz: он занимает больше половины каталога, но на первом
 * экране /catalog товара не было вообще — только плитки назначений, типов
 * покрытия и заводов, а до карточек надо было провалиться на два уровня.
 */
export function brandShowcase(
  brand: string,
  limit = 8,
  type?: Product["product_type"],
): Product[] {
  return pickOnePerCollection(
    activeProducts().filter(
      (p) => p.brand === brand && (!type || p.product_type === type),
    ),
    limit,
  );
}

function pickOnePerCollection(list: Product[], limit: number): Product[] {
  const seen = new Set<string>();
  const pick: Product[] = [];
  const ranked = [...list].sort((a, b) => {
    const ap = a.photos[0]?.startsWith("/images/products/") ? 0 : 1;
    const bp = b.photos[0]?.startsWith("/images/products/") ? 0 : 1;
    return ap - bp;
  });
  for (const p of ranked) {
    const key = `${p.brand}|${collectionBase(p)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pick.push(p);
    if (pick.length >= limit) break;
  }
  return pick;
}
