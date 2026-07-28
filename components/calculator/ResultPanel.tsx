"use client";

import type { CalcResult } from "@/lib/calculator";
import { formatNum, formatRub } from "@/lib/format";

export function ResultPanel({
  result,
  onSend,
}: {
  result: CalcResult;
  onSend: () => void;
}) {
  const detail = result.detail;
  return (
    <div className="relative flex flex-col gap-5 overflow-hidden rounded-xl2 bg-graphite-deep p-6 text-sand shadow-lift sm:p-7">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          background:
            "radial-gradient(28rem 18rem at 100% 0%, rgba(224,112,63,0.16), transparent 60%)",
        }}
      />
      <div className="relative">
        <p className="eyebrow text-clinker-bright">Результат</p>
        <h3 className="mt-1 font-display text-2xl font-extrabold">Ваш расчёт</h3>
        <p className="mt-1 text-sm text-sand/80">
          {result.mode === "A"
            ? "Лестница / крыльцо — поэлементно"
            : "Терраса / площадка — по площади"}{" "}
          · {result.city === "msk" ? "Москва" : "Санкт-Петербург"}
        </p>
      </div>

      {detail.kind === "B" ? (
        <div className="relative grid grid-cols-2 gap-2 text-sm">
          <Metric label="Площадь нетто" value={`${formatNum(detail.netArea)} м²`} />
          <Metric
            label={`С запасом (+${Math.round(detail.wasteFactor * 100)}%)`}
            value={`${formatNum(detail.areaWithWaste)} м²`}
          />
          <Metric label="Плит" value={`${detail.slabs} шт`} />
          {detail.pedestals != null ? (
            <Metric label="Опор HILST" value={`${detail.pedestals} шт`} />
          ) : null}
        </div>
      ) : null}

      <table className="relative w-full text-sm">
        <thead>
          <tr className="border-b border-sand/30 text-left text-sand/75">
            <th className="pb-2 font-medium">Позиция</th>
            <th className="pb-2 text-right font-medium">Кол-во</th>
            <th className="pb-2 text-right font-medium">Цена</th>
            <th className="pb-2 text-right font-medium">Сумма</th>
          </tr>
        </thead>
        <tbody className="tabular">
          {result.product.map((l) => (
            <tr key={l.code} className="border-b border-sand/20">
              <td className="py-2 pr-2">{l.name}</td>
              <td className="py-2 text-right">
                {formatNum(l.quantity)} {l.unit}
              </td>
              <td className="py-2 text-right text-sand/85">
                {formatRub(l.unitPrice)}
              </td>
              <td className="py-2 text-right font-medium">
                {formatRub(l.total)}
              </td>
            </tr>
          ))}
          {result.materials.map((m) => (
            <tr key={m.code} className="border-b border-sand/20 text-sand/80">
              <td className="py-2 pr-2">
                {m.name}
                <span className="block text-xs text-sand/65">{m.pack}</span>
              </td>
              <td className="py-2 text-right">{m.packs} уп.</td>
              <td className="py-2 text-right text-sand/85">
                {formatRub(m.unitPrice)}
              </td>
              <td className="py-2 text-right font-medium">{formatRub(m.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="relative flex flex-col gap-1 border-t border-sand/30 pt-4 text-sm">
        <Row label="Продукция" value={formatRub(result.productTotal)} />
        {result.extrasTotal > 0 ? (
          <Row
            label={result.mode === "B" && result.materials.length === 0 ? "Опоры" : "Сопутствующие материалы"}
            value={formatRub(result.extrasTotal)}
          />
        ) : null}
        {result.pallets != null ? (
          <Row label="Поддонов" value={`${result.pallets}`} muted />
        ) : null}
        <Row
          label="Вес поставки"
          value={`${formatNum(result.weightTons)} т`}
          muted
        />
      </div>

      <div className="relative flex items-baseline justify-between rounded-2xl border border-clinker/30 bg-clinker/15 px-5 py-4">
        <span className="font-display font-bold">Итого материалы</span>
        <span className="tabular font-display text-2xl font-extrabold text-clinker-bright">
          {formatRub(result.grandTotal)}
        </span>
      </div>

      <button
        type="button"
        onClick={onSend}
        className="sheen relative w-full rounded-full bg-clinker px-4 py-3.5 font-semibold text-white transition hover:bg-clinker-hover"
      >
        Отправить расчёт менеджеру →
      </button>
      <p className="relative text-center text-xs text-sand/65">
        Цены — справочные, из CMS, можно изменить выше. Ответим в течение 15 минут в рабочее время.
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-sand/10 px-3 py-2">
      <div className="text-xs text-sand/65">{label}</div>
      <div className="tabular font-display text-lg font-bold">{value}</div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-sand/65" : "text-sand/85"}>{label}</span>
      <span className={`tabular ${muted ? "text-sand/75" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}
