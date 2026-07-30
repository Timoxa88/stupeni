import { NextResponse } from "next/server";
import { getProductById } from "@/lib/catalog/queries";
import { incrementView } from "@/lib/store/views";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

/** Маячок просмотра карточки товара — «Топ товаров» в админке. */
export async function POST(req: Request) {
  let id = "";
  try {
    const body = (await req.json()) as { id?: string };
    id = (body.id ?? "").toString().trim();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Неизвестный артикул не считаем (и не шумим ошибкой).
  if (!id || !getProductById(id)) return NextResponse.json({ ok: false }, { status: 404 });

  // Дедуп: 1 просмотр на (IP, артикул) в 30 минут — рефреши и StrictMode
  // не должны накручивать счётчик.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (rateLimit(`view:${ip}:${id}`, { limit: 1, windowMs: 30 * 60_000 }).ok) {
    await incrementView(id);
  }
  return NextResponse.json({ ok: true });
}
