import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { listLeads } from "@/lib/store/leads";
import { FORM_TITLES } from "@/lib/bitrix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cell = (v: unknown): string => {
  const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  return `"${s.replace(/"/g, '""')}"`;
};

/** Экспорт заявок в CSV (Excel-совместимый: ; и BOM). */
export async function GET() {
  const jar = await cookies();
  if (!(await isValidSession(jar.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  const leads = await listLeads(5000);
  const header = [
    "Дата", "Тег", "Форма", "Слаг формы", "Имя", "Телефон", "Email",
    "Комментарий", "Город", "Товар", "Площадь", "Сумма", "Страница",
    "UTM", "ID лида в Битрикс", "Ошибка CRM",
  ];

  const rows = leads.map((l) => {
    const d = l.data ?? {};
    return [
      new Date(l.createdAt).toLocaleString("ru-RU"),
      l.tag,
      FORM_TITLES[l.formSource] ?? l.formSource,
      l.formSource,
      l.name,
      l.phone,
      l.email ?? "",
      l.comment ?? "",
      d.city ?? "",
      d.product ?? "",
      d.area ?? "",
      d.total_cost ?? "",
      l.page ?? "",
      l.utm
        ? Object.entries(l.utm)
            .map(([k, v]) => `${k}=${v}`)
            .join(" ")
        : "",
      l.bitrixLeadId ?? "",
      l.bitrixError ?? "",
    ].map(cell).join(";");
  });

  const csv = "﻿" + [header.map(cell).join(";"), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
