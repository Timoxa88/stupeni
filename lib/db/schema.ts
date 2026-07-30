/**
 * Схема БД админки (PostgreSQL + Drizzle).
 *
 * Принцип, как на the-one-temp: сид в коде — источник по умолчанию, в БД лежат
 * только ПЕРЕОПРЕДЕЛЕНИЯ (overrides) и «живые» данные (лиды, ошибки, просмотры,
 * отзывы, публикации). Чтение = дефолт ⊕ оверрайд, поэтому сайт работает даже
 * при недоступной БД (см. lib/store/*).
 */

import { pgTable, text, integer, boolean, timestamp, jsonb, serial } from "drizzle-orm/pg-core";

/**
 * Переопределения артикулов каталога. Ключ — `Product.id` из lib/catalog/seed.ts.
 * Все поля опциональны: null = «берём из сида».
 */
export const productOverrides = pgTable("product_overrides", {
  id: text("id").primaryKey(),
  /** Скрыть артикул из витрины (Product.active). */
  active: boolean("active").notNull().default(true),
  /** Название коллекции. */
  collection: text("collection"),
  /** Цены: { elements: {code: ₽}, formats: {code: {sqm?, pcs?}} }. */
  prices: jsonb("prices"),
  /** Характеристики (ProductSpecs) — частично. */
  specs: jsonb("specs"),
  /** Фото (string[]). */
  photos: jsonb("photos"),
  /** Промо-акция (ProductPromo) или null. */
  promo: jsonb("promo"),
  /** Наличие: in_stock | on_order. */
  stockStatus: text("stock_status"),
  /** Срок поставки под заказ, недель. */
  leadTimeWeeks: integer("lead_time_weeks"),
  /** SEO артикула: {title, description, h1}. */
  seo: jsonb("seo"),
  /** Порядок в витрине (0 = по умолчанию, меньше — выше). */
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Счётчик просмотров артикулов («топ товаров» на дашборде). Маячок /api/view. */
export const productViews = pgTable("product_views", {
  id: text("id").primaryKey(),
  views: integer("views").notNull().default(0),
  lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Заявки с сайта + статус доставки в Битрикс24. */
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  /** Тег заявки (человекочитаемый, ТЗ §12.2). */
  tag: text("tag").notNull(),
  /** Слаг формы для меток Битрикса (calculator | quiz | sample | …). */
  formSource: text("form_source").notNull().default(""),
  /** Сайт-источник (LEAD_SOURCE_SLUG). */
  source: text("source").notNull().default("stupeni"),
  name: text("name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email"),
  comment: text("comment"),
  data: jsonb("data"),
  utm: jsonb("utm"),
  page: text("page"),
  bitrixLeadId: text("bitrix_lead_id"),
  bitrixError: text("bitrix_error"),
});

/** Публикации блога (дополняют сид lib/content/blog.ts). */
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  /** article | howto */
  type: text("type").notNull().default("article"),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  /** Markdown-ish тело: абзацы и подзаголовки (## …). */
  body: text("body").notNull().default(""),
  cover: text("cover"),
  coverAlt: text("cover_alt"),
  author: text("author"),
  readingMin: integer("reading_min").notNull().default(4),
  /** id артикулов каталога (string[]). */
  relatedProductIds: jsonb("related_product_ids"),
  /** draft | published */
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * SEO-переопределения по ключу страницы:
 * 'home' | 'catalog:<slug>' | 'product:<id>' | 'brand:<slug>' |
 * 'solution:<slug>' | 'blog' | 'blog:<slug>' | 'static:<name>'
 */
export const seoOverrides = pgTable("seo_overrides", {
  key: text("key").primaryKey(),
  title: text("title"),
  description: text("description"),
  h1: text("h1"),
  ogImage: text("og_image"),
  noindex: boolean("noindex").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Мини-CMS: редактируемые блоки сайта. key → JSONB.
 * Ключи: 'hero' | 'advantages' | 'counters' | 'education' | 'contacts' |
 * 'settings' | 'bitrix' | 'faq:home' | 'faq:catalog:<slug>' | 'services'.
 */
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Журнал ошибок (клиент/сервер/api) — раздел «Ошибки» в админке. */
export const errors = pgTable("errors", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  /** client | server | api */
  source: text("source").notNull(),
  /** error | warning */
  level: text("level").notNull().default("error"),
  message: text("message").notNull(),
  stack: text("stack"),
  url: text("url"),
  userAgent: text("user_agent"),
  digest: text("digest"),
  context: jsonb("context"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export type ProductOverrideRow = typeof productOverrides.$inferSelect;
export type ProductViewRow = typeof productViews.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
export type BlogPostRow = typeof blogPosts.$inferSelect;
export type SeoOverrideRow = typeof seoOverrides.$inferSelect;
export type SiteContentRow = typeof siteContent.$inferSelect;
export type ErrorRow = typeof errors.$inferSelect;
