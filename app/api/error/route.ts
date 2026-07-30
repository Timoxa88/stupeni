import { NextResponse } from "next/server";
import { logError } from "@/lib/store/errors";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

type Payload = {
  message?: string;
  stack?: string;
  url?: string;
  digest?: string;
  context?: Record<string, unknown>;
};

const cap = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : undefined);

/** Приём ошибок из клиентских error-boundary (app/error.tsx, global-error.tsx). */
export async function POST(req: Request) {
  // Эндпоинт публичный — принимаем только same-origin, чтобы не засоряли таблицу.
  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ ok: false }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (!rateLimit(`err:${ip}`, { limit: 10, windowMs: 60_000 }).ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  if (!body.message) return NextResponse.json({ ok: false, error: "message required" }, { status: 400 });

  let context = body.context ?? null;
  try {
    if (context && JSON.stringify(context).length > 4000) context = { truncated: true };
  } catch {
    context = null;
  }

  await logError({
    source: "client",
    level: "error",
    message: cap(body.message, 2000)!,
    stack: cap(body.stack, 5000) ?? null,
    url: cap(body.url, 500) ?? null,
    userAgent: cap(req.headers.get("user-agent"), 500) ?? null,
    digest: cap(body.digest, 200) ?? null,
    context,
  });

  return NextResponse.json({ ok: true });
}
