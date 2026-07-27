/**
 * Текстовая сводка расчёта для менеджера (ТЗ §12.3).
 *
 * Зачем: до 27.07.2026 в сделку уходила одна строка вида
 * «Ступени, 2 марш(а/ей), Paradyz Taurus, 30x30» — без количеств, суммы и веса,
 * то есть менеджер не видел, что именно посчитал клиент. §12.3 требует режим,
 * город, бренд/артикул, состав, способ укладки, материалы/опоры, итого и вес.
 */

import type { CalcResult } from "./types";

const rub = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(n)) + " ₽";
const num = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n);

export interface SummaryContext {
  /** «Paradyz Scandiano Brown» */
  article: string;
  /** Режим A: сколько маршей; режим B: способ укладки и раскладка. */
  extra?: string;
  /** Ссылка на страницу, где считали. */
  page?: string;
}

/** Многострочная сводка: уходит в комментарий сделки и показывается в модалке. */
export function calcSummary(result: CalcResult, ctx: SummaryContext): string {
  const lines: string[] = [];
  const city = result.city === "msk" ? "Москва" : "Санкт-Петербург";

  lines.push(
    result.mode === "A"
      ? "Расчёт: лестница/крыльцо (поэлементно)"
      : "Расчёт: терраса/площадка (по площади)",
  );
  lines.push(`Город: ${city}`);
  lines.push(`Артикул: ${ctx.article}`);
  if (ctx.extra) lines.push(ctx.extra);

  if (result.detail.kind === "B") {
    const d = result.detail;
    lines.push(
      `Площадь: ${num(d.netArea)} м² нетто, с запасом ${num(d.areaWithWaste)} м² ` +
        `(+${Math.round(d.wasteFactor * 100)}%)`,
    );
    if (d.pedestals != null) {
      lines.push(`Опоры HILST: ${d.pedestals} шт (${num(d.pedestalsPerSqm ?? 0)} опор/м²)`);
    }
  } else {
    const d = result.detail;
    lines.push(`Маршей: ${d.marches.length}; площадь облицовки ${num(d.cladArea)} м²`);
  }

  lines.push("Состав:");
  for (const l of result.product) {
    lines.push(`  · ${l.name} — ${num(l.quantity)} ${l.unit} × ${rub(l.unitPrice)} = ${rub(l.total)}`);
  }
  if (result.materials.length) {
    lines.push("Сопутствующие материалы:");
    for (const m of result.materials) {
      lines.push(`  · ${m.name} (${m.pack}) — ${m.packs} уп. × ${rub(m.unitPrice)} = ${rub(m.total)}`);
    }
  }

  lines.push(`Продукция: ${rub(result.productTotal)}`);
  if (result.extrasTotal > 0) {
    lines.push(
      `${result.mode === "B" && result.materials.length === 0 ? "Опоры" : "Материалы"}: ${rub(result.extrasTotal)}`,
    );
  }
  if (result.pallets != null) lines.push(`Поддонов: ${result.pallets}`);
  lines.push(`Вес поставки: ${num(result.weightTons)} т`);
  lines.push(`ИТОГО: ${rub(result.grandTotal)}`);
  lines.push("Цены справочные (не оферта), актуальные подтверждает менеджер.");
  if (ctx.page) lines.push(`Страница: ${ctx.page}`);

  return lines.join("\n");
}

/** Короткая строка для заголовка модалки. */
export function calcHeadline(result: CalcResult, ctx: SummaryContext): string {
  const what = result.mode === "A" ? "Ступени" : "Терраса";
  return `${what} · ${ctx.article} · ${rub(result.grandTotal)}`;
}
