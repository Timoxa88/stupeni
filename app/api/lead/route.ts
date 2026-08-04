import { NextResponse } from "next/server";
import { NO_WEBHOOK, sendToBitrix } from "@/lib/bitrix";
import { appendLead, normalizePhone } from "@/lib/store/leads";
import { logError } from "@/lib/store/errors";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

type Payload = {
  tag?: string;
  /** Слаг формы для меток Битрикса (calculator | sample | quiz | …). */
  source?: string;
  name?: string;
  phone?: string;
  email?: string;
  comment?: string;
  /** Структурированные поля формы (city, product, area, total_cost, …). */
  data?: Record<string, unknown>;
  city?: string;
  utm?: Record<string, string>;
  page?: string;
  /** 152-ФЗ (ТЗ B.2). */
  consent?: boolean;
  /** honeypot (ТЗ §15) — должен быть пустым. */
  hp_field?: string;
  /** До-отправка из localStorage не должна дублировать заявку (ТЗ B.5). */
  idempotencyKey?: string;
};

/** Формы, где имя не спрашиваем (одно поле = выше отклик). */
const PHONE_ONLY_SOURCES = new Set(["exit-popup"]);

/** Идемпотентность и дедуп (ТЗ B.5/B.7). In-memory: один процесс pm2. */
const IDEMP_TTL = 10 * 60_000;
const DEDUP_TTL = 5 * 60_000;

function badRequest(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60_000 }).ok) {
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок. Попробуйте через минуту." },
      { status: 429 },
    );
  }

  try {
    let body: Payload;
    try {
      body = (await req.json()) as Payload;
    } catch {
      return badRequest("Невалидный JSON");
    }

    // Honeypot: ответ неотличим от успешного, заявка никуда не идёт.
    if (body.hp_field && body.hp_field.trim() !== "") {
      return NextResponse.json({ ok: true, id: crypto.randomUUID() });
    }

    // Ловец уходящих спрашивает только телефон: имя там — лишнее поле на пути
    // к отправке, а в CRM заголовок лида и так собирается из телефона
    // (см. `who` в buildLeadFields). Для всех остальных форм имя обязательно.
    if (!body.name?.trim() && !PHONE_ONLY_SOURCES.has(body.source ?? "")) {
      return badRequest("Укажите имя");
    }
    if (!body.phone?.trim()) return badRequest("Укажите телефон");
    if (body.consent !== true) {
      return badRequest("Требуется согласие на обработку персональных данных");
    }

    const name = (body.name ?? "").trim().slice(0, 120);
    const phone = normalizePhone(body.phone);
    if (!/^\+\d{10,15}$/.test(phone)) return badRequest("Некорректный телефон");

    // Повторная отправка того же ключа (до-отправка из очереди) — не дублируем.
    if (body.idempotencyKey) {
      if (!rateLimit(`lead-idemp:${body.idempotencyKey}`, { limit: 1, windowMs: IDEMP_TTL }).ok) {
        return NextResponse.json({ ok: true, deduped: true });
      }
    }
    // Дедуп по (телефон | тег) за окно — отсекает случайные дубли.
    if (!rateLimit(`lead-dedup:${phone}|${body.tag ?? ""}`, { limit: 1, windowMs: DEDUP_TTL }).ok) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    const data: Record<string, unknown> = { ...(body.data ?? {}) };
    if (body.source) data.source = body.source;
    if (body.city && !data.city) data.city = body.city;
    // Фиксируем факт согласия в CRM и БД (152-ФЗ).
    data.consent = true;
    data.consentAt = new Date().toISOString();

    const lead = {
      tag: body.tag?.toString().slice(0, 120) || "Заявка",
      formSource: body.source?.toString().slice(0, 60) ?? "",
      source: process.env.LEAD_SOURCE_SLUG || "stupeni",
      name,
      phone,
      email: body.email?.toString().trim().slice(0, 200) || undefined,
      comment: body.comment?.toString().slice(0, 2000) || undefined,
      data,
      utm: body.utm && Object.keys(body.utm).length ? body.utm : undefined,
      page: body.page?.toString().slice(0, 500) || undefined,
    };

    const bitrix = await sendToBitrix(lead);
    if (!bitrix.ok && bitrix.error !== NO_WEBHOOK) {
      await logError({
        source: "api",
        level: "warning",
        message: `Bitrix24: заявка не доставлена — ${bitrix.error}`,
        url: "/api/lead",
        context: { tag: lead.tag, formSource: lead.formSource },
      });
    }

    const stored = await appendLead({
      ...lead,
      bitrixLeadId: bitrix.ok ? bitrix.id : null,
      bitrixError: bitrix.ok ? null : bitrix.error,
    });

    /*
     * Успех — только если заявка где-то реально лежит: в CRM или в журнале БД
     * (её видно в /admin/leads, менеджер не потеряет). Раньше при незаданном
     * вебхуке сайт показывал «Заявка отправлена», а лид пропадал в логе
     * (проверено на превью 26.07.2026) — такого больше не будет: если не
     * доставлено никуда, отвечаем 502, клиент положит заявку в очередь и
     * повторит отправку.
     */
    if (!bitrix.ok && !stored) {
      return NextResponse.json(
        { ok: false, error: bitrix.error === NO_WEBHOOK ? "crm_not_configured" : bitrix.error },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: stored?.id ?? `crm-${bitrix.ok ? bitrix.id : ""}` });
  } catch (e) {
    await logError({
      source: "api",
      level: "error",
      message: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : null,
      url: "/api/lead",
      userAgent: req.headers.get("user-agent"),
    });
    return NextResponse.json({ ok: false, error: "Внутренняя ошибка. Мы уже знаем." }, { status: 500 });
  }
}
