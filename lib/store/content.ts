import "server-only";
import { cache } from "react";
import { eq, inArray } from "drizzle-orm";
import { db, hasDb, schema } from "@/lib/db/client";
import { ADVANTAGES, CITY_CONTACTS, PLACES, SITE } from "@/lib/content/site";
import { HOME_FAQ, type QA } from "@/lib/content/faq";
import { SERVICES, type Service } from "@/lib/content/services";

/**
 * Мини-CMS: дефолты живут в коде (`lib/content/*`), в `site_content` — только
 * переопределения. Чтение = дефолт ⊕ оверрайд (merge, не замена), поэтому
 * пустая база = текущий сайт без изменений.
 *
 * Набор блоков повторяет то, что реально есть на сайте: счётчиков и блока
 * «Виды и характеристики» здесь нет — они сняты 27.07.2026 (см. lib/content/site.ts).
 */

export type HeroContent = {
  /** Надзаголовок над H1. */
  eyebrow: string;
  /** Две обычные строки H1 + третья акцентная (градиент). */
  titleLine1: string;
  titleLine2: string;
  titleAccent: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export type ContactsContent = {
  phone: string;
  phoneLabel: string;
  email: string;
  legal: string;
  inn: string;
  ogrn: string;
  cities: { city: string; phone: string; phoneLabel: string }[];
  places: typeof PLACES;
};

export type ContentMap = {
  hero: HeroContent;
  advantages: { items: { title: string; text: string }[] };
  services: { items: Service[] };
  contacts: ContactsContent;
};

export type ContentKey = keyof ContentMap;

/** Дефолты — ровно то, что сейчас отрисовано на сайте. */
export const CONTENT_DEFAULTS: ContentMap = {
  hero: {
    eyebrow: "Клинкер · керамогранит 20 мм · для улицы",
    titleLine1: "Клинкерные ступени",
    titleLine2: "и крупноформат для",
    titleAccent: "крыльца и террас",
    subtitle:
      "Морозостойко, не скользит, открытые цены. Считаем комплект в штуках, а не «в квадратах» — поэлементно для ступеней и по площади для террасы. Доставка по России и СНГ.",
    primaryCta: { label: "Рассчитать комплект", href: "#calc" },
    secondaryCta: { label: "Подобрать за минуту", href: "/podbor" },
  },
  advantages: { items: ADVANTAGES },
  services: { items: SERVICES },
  contacts: {
    phone: SITE.phone,
    phoneLabel: SITE.phoneLabel,
    email: SITE.email,
    legal: SITE.legal,
    inn: SITE.inn,
    ogrn: SITE.ogrn,
    cities: CITY_CONTACTS.map((c) => ({ ...c })),
    places: PLACES,
  },
};

export const CONTENT_SECTIONS: { key: ContentKey; label: string; hint: string }[] = [
  { key: "hero", label: "Первый экран (Hero)", hint: "Надзаголовок, три строки H1, подзаголовок, две кнопки" },
  { key: "advantages", label: "Преимущества", hint: "Карточки: заголовок + текст" },
  { key: "services", label: "Услуги", hint: "Название, описание, тег заявки в CRM" },
  { key: "contacts", label: "Контакты и реквизиты", hint: "Телефоны, email, юр. данные" },
];

async function readKeys(keys: string[]): Promise<Map<string, unknown>> {
  if (!hasDb() || keys.length === 0) return new Map();
  try {
    const rows = await db()
      .select()
      .from(schema.siteContent)
      .where(inArray(schema.siteContent.key, keys));
    return new Map(rows.map((r) => [r.key, r.value]));
  } catch {
    return new Map();
  }
}

/** Одна секция: дефолт ⊕ оверрайд. cache() — дедуп в рамках запроса. */
export const getContent = cache(async <K extends ContentKey>(key: K): Promise<ContentMap[K]> => {
  const map = await readKeys([key]);
  const override = (map.get(key) ?? {}) as Partial<ContentMap[K]>;
  return { ...CONTENT_DEFAULTS[key], ...override };
});

/** Все секции разом (админка и главная). */
export const getAllContent = cache(async (): Promise<ContentMap> => {
  const keys = Object.keys(CONTENT_DEFAULTS) as ContentKey[];
  const map = await readKeys(keys);
  const out = {} as ContentMap;
  for (const key of keys) {
    // @ts-expect-error — ключи и значения соответствуют друг другу по построению
    out[key] = { ...CONTENT_DEFAULTS[key], ...((map.get(key) ?? {}) as object) };
  }
  return out;
});

export async function setContentSection<K extends ContentKey>(
  key: K,
  value: ContentMap[K],
): Promise<void> {
  await db()
    .insert(schema.siteContent)
    .values({ key, value })
    .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
}

export async function resetContentSection(key: ContentKey): Promise<void> {
  await db().delete(schema.siteContent).where(eq(schema.siteContent.key, key));
}

/** Какие секции реально переопределены (бейдж в админке). */
export async function overriddenSections(): Promise<Set<string>> {
  const keys = Object.keys(CONTENT_DEFAULTS) as ContentKey[];
  return new Set((await readKeys(keys)).keys());
}

// ── FAQ: дефолт = HOME_FAQ, оверрайд по ключу faq:<target> ───────────────────

export type FaqTarget = "home" | `catalog:${string}`;

const faqKey = (t: FaqTarget) => `faq:${t}`;

function parseFaq(value: unknown): QA[] | null {
  if (!Array.isArray(value)) return null;
  const items = value
    .map((v) => ({ q: String((v as QA)?.q ?? "").trim(), a: String((v as QA)?.a ?? "").trim() }))
    .filter((v) => v.q && v.a);
  return items.length ? items : null;
}

/** FAQ для цели: оверрайд, иначе сид (для главной) / пусто. */
export const getFaq = cache(async (target: FaqTarget = "home"): Promise<QA[]> => {
  const map = await readKeys([faqKey(target)]);
  return parseFaq(map.get(faqKey(target))) ?? (target === "home" ? HOME_FAQ : []);
});

export async function setFaq(target: FaqTarget, items: QA[]): Promise<void> {
  const clean = items
    .map((v) => ({ q: String(v?.q ?? "").trim(), a: String(v?.a ?? "").trim() }))
    .filter((v) => v.q && v.a);
  if (!clean.length) {
    await db().delete(schema.siteContent).where(eq(schema.siteContent.key, faqKey(target)));
    return;
  }
  await db()
    .insert(schema.siteContent)
    .values({ key: faqKey(target), value: clean })
    .onConflictDoUpdate({
      target: schema.siteContent.key,
      set: { value: clean, updatedAt: new Date() },
    });
}
