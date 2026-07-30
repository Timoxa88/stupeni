import "server-only";
import { desc, sql } from "drizzle-orm";
import { db, hasDb, schema } from "@/lib/db/client";

/**
 * Счётчик просмотров карточек товара — «Топ товаров» на дашборде.
 * Страницы товара кэшируются (ISR), поэтому считаем клиентским маячком
 * (components/analytics/ViewTracker → POST /api/view) с дедупом по IP.
 */

export async function incrementView(id: string): Promise<void> {
  if (!hasDb()) return;
  try {
    await db()
      .insert(schema.productViews)
      .values({ id, views: 1 })
      .onConflictDoUpdate({
        target: schema.productViews.id,
        set: { views: sql`${schema.productViews.views} + 1`, lastViewedAt: new Date() },
      });
  } catch {
    /* счётчик не критичен */
  }
}

export async function topViewed(limit = 10): Promise<{ id: string; views: number }[]> {
  if (!hasDb()) return [];
  try {
    const rows = await db()
      .select({ id: schema.productViews.id, views: schema.productViews.views })
      .from(schema.productViews)
      .orderBy(desc(schema.productViews.views))
      .limit(limit);
    return rows;
  } catch {
    return [];
  }
}

export async function totalViews(): Promise<number> {
  if (!hasDb()) return 0;
  try {
    const [row] = await db()
      .select({ n: sql<number>`coalesce(sum(${schema.productViews.views}), 0)::int` })
      .from(schema.productViews);
    return Number(row?.n ?? 0);
  } catch {
    return 0;
  }
}
