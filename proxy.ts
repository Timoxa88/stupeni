/**
 * Next 16: файл-конвенция `middleware` переименована в `proxy`
 * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
 * Рантайм по умолчанию — Node.js, поэтому Web Crypto из lib/auth доступен.
 *
 * Задача: закрыть /admin и админские API. Мутации дополнительно проверяют
 * сессию сами (lib/admin-guard) — proxy не единственная линия защиты.
 */

import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Страница логина открыта.
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await isValidSession(token)) return NextResponse.next();

  // API → 401 JSON, страницы админки → редирект на логин.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  url.searchParams.set("next", pathname);

  // За nginx nextUrl.host — это интерфейс биндинга (127.0.0.1:3002), а реальный
  // домен приходит в Host / X-Forwarded-Host. Иначе редирект уводит на localhost.
  const fwdHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const fwdProto = req.headers.get("x-forwarded-proto");
  if (fwdHost) url.host = fwdHost;
  if (fwdProto) url.protocol = `${fwdProto}:`;
  if (fwdProto === "https") url.port = "";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*", "/api/export/:path*"],
};
