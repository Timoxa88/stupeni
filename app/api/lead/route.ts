import { NextResponse } from "next/server";
import { createLead, type LeadPayload } from "@/lib/bitrix";

/** Простой in-memory rate limit по IP (ТЗ §15). В проде — Redis/KV. */
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

/**
 * Идемпотентность и дедупликация (ТЗ B.5/B.7). In-memory; в проде — Redis/БД.
 * Ключ идемпотентности гасит повторные до-отправки клиента; дедуп по phone+tag
 * отсекает дубли лида за окно.
 */
const seenKeys = new Map<string, number>();
const seenLeads = new Map<string, number>();
const IDEMP_TTL = 10 * 60_000;
const DEDUP_TTL = 5 * 60_000;

function recentlySeen(map: Map<string, number>, key: string, ttl: number): boolean {
  const now = Date.now();
  for (const [k, ts] of map) if (now - ts > ttl) map.delete(k); // сборка мусора
  if (map.has(key)) return true;
  map.set(key, now);
  return false;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: (LeadPayload & { hp_field?: string; idempotencyKey?: string }) | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // honeypot: скрытое поле hp_field должно быть пустым (ТЗ §15)
  if (body?.hp_field) {
    return NextResponse.json({ ok: true }); // тихо «принимаем», ничего не делаем
  }

  if (!body?.name || !body?.phone) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // Идемпотентность: повтор той же отправки (до-отправка из localStorage) — не дублируем.
  if (body.idempotencyKey && recentlySeen(seenKeys, body.idempotencyKey, IDEMP_TTL)) {
    return NextResponse.json({ ok: true, deduped: true });
  }
  // Дедуп по phone+tag за окно — отсекает случайные дубли.
  const dedupKey = `${body.phone}|${body.tag ?? ""}`;
  if (recentlySeen(seenLeads, dedupKey, DEDUP_TTL)) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  const result = await createLead({
    name: body.name,
    phone: body.phone,
    tag: body.tag ?? "Заявка",
    comment: body.comment,
    city: body.city,
    page: body.page,
    utm: body.utm,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, id: result.id });
}
