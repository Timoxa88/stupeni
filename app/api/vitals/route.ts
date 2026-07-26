import { NextResponse } from "next/server";

/**
 * Приёмник RUM Core Web Vitals (ТЗ §15). Сейчас — лог; в проде перенаправляется
 * в ClickHouse/аналитику. Принимает бикон от components/analytics/WebVitals.
 */
export async function POST(req: Request) {
  try {
    const m = await req.json();
    // INP > 200 мс — кандидат на разбор (ТЗ §15).
    const slow = m?.name === "INP" && typeof m.value === "number" && m.value > 200;
    console.info(`[web-vitals]${slow ? " ⚠ SLOW" : ""}`, m?.name, m?.value, m?.path, m?.target ?? "");
  } catch {
    // тихо игнорируем некорректные биконы
  }
  return new NextResponse(null, { status: 204 });
}
