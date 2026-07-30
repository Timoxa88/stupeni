/**
 * Идемпотентная схема БД: CREATE TABLE IF NOT EXISTS + ALTER … ADD COLUMN IF NOT EXISTS.
 * Прод без авто-миграций (как на the-one-temp): запускать вручную после деплоя.
 *
 *   bun scripts/db-push.mjs            # берёт DATABASE_URL из окружения/.env
 */

import { Pool } from "pg";
import { readFileSync } from "node:fs";

const DDL = `
CREATE TABLE IF NOT EXISTS product_overrides (
  id TEXT PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  collection TEXT,
  prices JSONB,
  specs JSONB,
  photos JSONB,
  promo JSONB,
  stock_status TEXT,
  lead_time_weeks INTEGER,
  seo JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS collection TEXT;
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS prices JSONB;
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS specs JSONB;
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS photos JSONB;
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS promo JSONB;
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS stock_status TEXT;
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS lead_time_weeks INTEGER;
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS seo JSONB;
ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS product_views (
  id TEXT PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS product_views_views_idx ON product_views(views DESC);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tag TEXT NOT NULL,
  form_source TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'stupeni',
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT,
  comment TEXT,
  data JSONB,
  utm JSONB,
  page TEXT,
  bitrix_lead_id TEXT,
  bitrix_error TEXT
);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'article',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  cover TEXT,
  cover_alt TEXT,
  author TEXT,
  reading_min INTEGER NOT NULL DEFAULT 4,
  related_product_ids JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_overrides (
  key TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  h1 TEXT,
  og_image TEXT,
  noindex BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE seo_overrides ADD COLUMN IF NOT EXISTS h1 TEXT;
ALTER TABLE seo_overrides ADD COLUMN IF NOT EXISTS noindex BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS errors (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'error',
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  user_agent TEXT,
  digest TEXT,
  context JSONB,
  resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS errors_created_at_idx ON errors(created_at DESC);
`;

function envFromDotfile() {
  // Прод (pm2) читает .env сам, но скрипт запускается отдельно — подхватим файл.
  if (process.env.DATABASE_URL) return;
  try {
    const text = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* нет .env — ок */
  }
}

envFromDotfile();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL не задан");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  await pool.query(DDL);
  const { rows } = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`,
  );
  console.log("схема применена. таблицы:", rows.map((r) => r.table_name).join(", "));
} catch (e) {
  console.error("ошибка применения схемы:", e.message);
  process.exit(1);
} finally {
  await pool.end();
}
