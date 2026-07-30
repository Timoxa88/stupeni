import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exec } from "node:child_process";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";
import { rateLimit } from "@/lib/ratelimit";
import { logError } from "@/lib/store/errors";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * `next start` фиксирует список файлов public/ на момент запуска, поэтому новые
 * загрузки не видны оптимизатору картинок (/_next/image → 404). Планируем один
 * отложенный рестарт pm2 и схлопываем пакетную загрузку в одну перезагрузку.
 */
let pendingRestart: NodeJS.Timeout | null = null;
function scheduleRestart() {
  const app = process.env.PM2_APP_NAME;
  if (!app || pendingRestart) return;
  pendingRestart = setTimeout(() => {
    pendingRestart = null;
    exec(`pm2 restart ${app}`, (err) => {
      if (err) console.error("pm2 restart после загрузки не удался:", err.message);
    });
  }, 4000);
}

export async function POST(req: Request) {
  // Двойная проверка: даже если matcher proxy.ts изменят, эндпоинт закрыт сам.
  const jar = await cookies();
  if (!(await isValidSession(jar.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "admin";
  if (!rateLimit(`upload:${ip}`, { limit: 30, windowMs: 60_000 }).ok) {
    return NextResponse.json({ ok: false, error: "Слишком много загрузок" }, { status: 429 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Файл не загружен" }, { status: 400 });
    }
    const result = await saveUploadedImage(file, file.name);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    scheduleRestart();
    return NextResponse.json(result);
  } catch (e) {
    await logError({
      source: "api",
      level: "error",
      message: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : null,
      url: "/api/upload",
    });
    return NextResponse.json({ ok: false, error: "Ошибка загрузки" }, { status: 500 });
  }
}
