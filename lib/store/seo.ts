import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db, hasDb, schema } from "@/lib/db/client";

/**
 * SEO-переопределения по ключу страницы. Ключи:
 *   home | catalog:<slug> | product:<id> | brand:<slug> | solution:<slug> |
 *   blog | blog:<slug> | static:<name>
 * Читатели (generateMetadata страниц) вызывают resolveSeo() — при пустой БД
 * получают свои дефолты без изменений.
 */

export type SeoFields = {
  title: string;
  description: string;
  h1?: string;
  ogImage?: string;
  noindex?: boolean;
};

export type SeoOverride = {
  key: string;
  title: string | null;
  description: string | null;
  h1: string | null;
  ogImage: string | null;
  noindex: boolean;
  updatedAt: string;
};

function rowToOverride(r: typeof schema.seoOverrides.$inferSelect): SeoOverride {
  return {
    key: r.key,
    title: r.title,
    description: r.description,
    h1: r.h1,
    ogImage: r.ogImage,
    noindex: r.noindex,
    updatedAt: (r.updatedAt instanceof Date ? r.updatedAt : new Date(r.updatedAt)).toISOString(),
  };
}

const allOverrides = cache(async (): Promise<Map<string, SeoOverride>> => {
  if (!hasDb()) return new Map();
  try {
    const rows = await db().select().from(schema.seoOverrides);
    return new Map(rows.map((r) => [r.key, rowToOverride(r)]));
  } catch {
    return new Map();
  }
});

/** Дефолты страницы ⊕ оверрайд из админки. */
export async function resolveSeo(key: string, defaults: SeoFields): Promise<SeoFields> {
  const row = (await allOverrides()).get(key);
  if (!row) return defaults;
  return {
    title: row.title?.trim() || defaults.title,
    description: row.description?.trim() || defaults.description,
    h1: row.h1?.trim() || defaults.h1,
    ogImage: row.ogImage?.trim() || defaults.ogImage,
    noindex: row.noindex || defaults.noindex,
  };
}

export async function listSeoOverrides(): Promise<SeoOverride[]> {
  return [...(await allOverrides()).values()].sort((a, b) => a.key.localeCompare(b.key));
}

export async function getSeoOverride(key: string): Promise<SeoOverride | undefined> {
  return (await allOverrides()).get(key);
}

export async function setSeoOverride(
  key: string,
  patch: { title?: string | null; description?: string | null; h1?: string | null; ogImage?: string | null; noindex?: boolean },
): Promise<void> {
  const values = {
    key,
    title: patch.title?.trim() || null,
    description: patch.description?.trim() || null,
    h1: patch.h1?.trim() || null,
    ogImage: patch.ogImage?.trim() || null,
    noindex: !!patch.noindex,
  };
  await db()
    .insert(schema.seoOverrides)
    .values(values)
    .onConflictDoUpdate({
      target: schema.seoOverrides.key,
      set: { ...values, updatedAt: new Date() },
    });
}

export async function clearSeoOverride(key: string): Promise<void> {
  await db().delete(schema.seoOverrides).where(eq(schema.seoOverrides.key, key));
}
