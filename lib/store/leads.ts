import "server-only";
import { desc, gte, sql } from "drizzle-orm";
import { db, hasDb, schema } from "@/lib/db/client";

export type Lead = {
  id: string;
  createdAt: string;
  /** Человекочитаемый тег (ТЗ §12.2), напр. «Образец». */
  tag: string;
  /** Слаг формы для меток Битрикса (sample | calculator | quiz | …). */
  formSource: string;
  /** Сайт-источник. */
  source: string;
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  data?: Record<string, unknown>;
  utm?: Record<string, string>;
  page?: string;
  bitrixLeadId?: string | null;
  bitrixError?: string | null;
};

function rowToLead(r: schema_LeadRow): Lead {
  return {
    id: r.id,
    createdAt: (r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt)).toISOString(),
    tag: r.tag,
    formSource: r.formSource,
    source: r.source,
    name: r.name,
    phone: r.phone,
    email: r.email ?? undefined,
    comment: r.comment ?? undefined,
    data: (r.data ?? undefined) as Record<string, unknown> | undefined,
    utm: (r.utm ?? undefined) as Record<string, string> | undefined,
    page: r.page ?? undefined,
    bitrixLeadId: r.bitrixLeadId ?? null,
    bitrixError: r.bitrixError ?? null,
  };
}
type schema_LeadRow = typeof schema.leads.$inferSelect;

export async function listLeads(limit = 500): Promise<Lead[]> {
  if (!hasDb()) return [];
  try {
    const rows = await db()
      .select()
      .from(schema.leads)
      .orderBy(desc(schema.leads.createdAt))
      .limit(limit);
    return rows.map(rowToLead);
  } catch {
    return [];
  }
}

/** Последние заявки — виджет на дашборде. */
export async function recentLeads(limit = 8): Promise<Lead[]> {
  return listLeads(limit);
}

export type LeadStats = {
  today: number;
  week: number;
  month: number;
  total: number;
  crmDelivered: number;
  crmFailed: number;
  crmRate: number;
};

const EMPTY_STATS: LeadStats = {
  today: 0, week: 0, month: 0, total: 0, crmDelivered: 0, crmFailed: 0, crmRate: 0,
};

export async function leadStats(): Promise<LeadStats> {
  if (!hasDb()) return EMPTY_STATS;
  try {
    const DAY = 24 * 60 * 60_000;
    const now = Date.now();
    const countSince = async (ms: number) => {
      const [r] = await db()
        .select({ n: sql<number>`count(*)` })
        .from(schema.leads)
        .where(gte(schema.leads.createdAt, new Date(now - ms)));
      return Number(r?.n ?? 0);
    };

    const [today, week, month] = await Promise.all([
      countSince(DAY),
      countSince(7 * DAY),
      countSince(30 * DAY),
    ]);

    const [agg] = await db()
      .select({
        total: sql<number>`count(*)`,
        delivered: sql<number>`count(*) filter (where ${schema.leads.bitrixLeadId} is not null)`,
        failed: sql<number>`count(*) filter (where ${schema.leads.bitrixLeadId} is null and ${schema.leads.bitrixError} is not null)`,
      })
      .from(schema.leads);

    const total = Number(agg?.total ?? 0);
    const crmDelivered = Number(agg?.delivered ?? 0);
    const crmFailed = Number(agg?.failed ?? 0);
    return {
      today, week, month, total, crmDelivered, crmFailed,
      crmRate: total > 0 ? Math.round((crmDelivered / total) * 100) : 0,
    };
  } catch {
    return EMPTY_STATS;
  }
}

/**
 * Сохранение заявки. БД — журнал заявок админки; если её нет (или упала),
 * заявка всё равно уже отправлена в Битрикс — просто логируем и не падаем.
 */
export async function appendLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead | null> {
  const id = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  if (!hasDb()) {
    console.info("[leads] (без БД):", { id, ...lead });
    return null;
  }
  try {
    const [row] = await db()
      .insert(schema.leads)
      .values({
        id,
        tag: lead.tag,
        formSource: lead.formSource ?? "",
        source: lead.source,
        name: lead.name,
        phone: lead.phone,
        email: lead.email ?? null,
        comment: lead.comment ?? null,
        data: lead.data ?? null,
        utm: lead.utm ?? null,
        page: lead.page ?? null,
        bitrixLeadId: lead.bitrixLeadId ?? null,
        bitrixError: lead.bitrixError ?? null,
      })
      .returning();
    return rowToLead(row);
  } catch (e) {
    console.error("[leads] не удалось сохранить заявку:", e instanceof Error ? e.message : e);
    return null;
  }
}

/** Нормализация телефона к +7XXXXXXXXXX (как на the-one-temp). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  if (digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  return `+${digits}`;
}
