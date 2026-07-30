import "server-only";
import { and, desc, eq, isNull, sql, type SQL } from "drizzle-orm";
import { db, hasDb, schema } from "@/lib/db/client";

export type ErrorSource = "client" | "server" | "api";
export type ErrorLevel = "error" | "warning";

export type ErrorReport = {
  source: ErrorSource;
  level?: ErrorLevel;
  message: string;
  stack?: string | null;
  url?: string | null;
  userAgent?: string | null;
  digest?: string | null;
  context?: Record<string, unknown> | null;
};

export type LoggedError = {
  id: number;
  createdAt: string;
  source: ErrorSource;
  level: ErrorLevel;
  message: string;
  stack: string | null;
  url: string | null;
  userAgent: string | null;
  digest: string | null;
  context: Record<string, unknown> | null;
  resolvedAt: string | null;
};

function rowToError(r: typeof schema.errors.$inferSelect): LoggedError {
  const iso = (d: Date | null) => (d ? (d instanceof Date ? d : new Date(d)).toISOString() : null);
  return {
    id: r.id,
    createdAt: iso(r.createdAt)!,
    source: r.source as ErrorSource,
    level: r.level as ErrorLevel,
    message: r.message,
    stack: r.stack,
    url: r.url,
    userAgent: r.userAgent,
    digest: r.digest,
    context: (r.context ?? null) as Record<string, unknown> | null,
    resolvedAt: iso(r.resolvedAt),
  };
}

/** Пишет ошибку в журнал. Никогда не бросает — логирование не должно ломать запрос. */
export async function logError(input: ErrorReport): Promise<void> {
  if (!hasDb()) {
    console.error(`[${input.source}] ${input.message}`);
    return;
  }
  try {
    await db().insert(schema.errors).values({
      source: input.source,
      level: input.level ?? "error",
      message: (input.message ?? "Unknown error").slice(0, 2000),
      stack: input.stack?.slice(0, 8000) ?? null,
      url: input.url?.slice(0, 500) ?? null,
      userAgent: input.userAgent?.slice(0, 500) ?? null,
      digest: input.digest?.slice(0, 200) ?? null,
      context: input.context ?? null,
    });
  } catch (e) {
    console.error("[errors] не удалось записать ошибку:", e);
  }
}

type ListFilter = {
  source?: ErrorSource | "all";
  level?: ErrorLevel | "all";
  resolved?: "open" | "resolved" | "all";
  limit?: number;
};

export async function listErrors(filter: ListFilter = {}): Promise<LoggedError[]> {
  if (!hasDb()) return [];
  try {
    const conds: SQL[] = [];
    if (filter.source && filter.source !== "all") conds.push(eq(schema.errors.source, filter.source));
    if (filter.level && filter.level !== "all") conds.push(eq(schema.errors.level, filter.level));
    if (filter.resolved === "open") conds.push(isNull(schema.errors.resolvedAt));
    if (filter.resolved === "resolved") conds.push(sql`${schema.errors.resolvedAt} IS NOT NULL`);

    const rows = await db()
      .select()
      .from(schema.errors)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(schema.errors.createdAt))
      .limit(filter.limit ?? 200);
    return rows.map(rowToError);
  } catch {
    return [];
  }
}

export async function errorStats(): Promise<{ open: number; total: number }> {
  if (!hasDb()) return { open: 0, total: 0 };
  try {
    const [row] = await db()
      .select({
        total: sql<number>`count(*)::int`,
        open: sql<number>`count(*) filter (where ${schema.errors.resolvedAt} is null)::int`,
      })
      .from(schema.errors);
    return { open: Number(row?.open ?? 0), total: Number(row?.total ?? 0) };
  } catch {
    return { open: 0, total: 0 };
  }
}

export async function resolveError(id: number): Promise<void> {
  await db().update(schema.errors).set({ resolvedAt: new Date() }).where(eq(schema.errors.id, id));
}

export async function reopenError(id: number): Promise<void> {
  await db().update(schema.errors).set({ resolvedAt: null }).where(eq(schema.errors.id, id));
}

export async function deleteError(id: number): Promise<void> {
  await db().delete(schema.errors).where(eq(schema.errors.id, id));
}

export async function deleteResolvedErrors(): Promise<void> {
  await db().delete(schema.errors).where(sql`${schema.errors.resolvedAt} IS NOT NULL`);
}
