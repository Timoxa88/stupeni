"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CalcResult } from "@/lib/calculator";
import { formatNum, formatRub } from "@/lib/format";
import { GOALS, reachGoal } from "@/lib/analytics/goals";

/*
 * Флаг «цель уже ушла» живёт на уровне модуля, а не в ref компонента.
 * Переключение «Лестница / Терраса» размонтирует одну форму и монтирует
 * другую вместе с новой панелью результата — на ref'е цель уходила бы
 * повторно за тот же визит. Модульный флаг сбрасывается только полной
 * перезагрузкой страницы, то есть ровно «один раз за визит».
 */
let calcGoalSent = false;

export function ResultPanel({
  result,
  onSend,
}: {
  result: CalcResult;
  onSend: () => void;
}) {
  const detail = result.detail;

  /*
   * Цель «довёл калькулятор до результата» — один раз за визит страницы и
   * только ПОСЛЕ того, как человек сам поменял параметры расчёта.
   *
   * Прежде условием было «итог больше нуля», и это делало цель бесполезной:
   * калькулятор на главной стартует с заполненного сценария, ненулевой итог
   * есть уже на первой отрисовке — цель уходила на каждом открытии главной
   * без единого действия посетителя (найдено 05.08.2026, когда события стали
   * видны в dataLayer GTM).
   *
   * Признак действия — расхождение расчёта с тем, каким он был на монтировании.
   * Сравниваем именно РЕЗУЛЬТАТ, а не состояние полей: он один для обоих
   * режимов и меняется от любого осмысленного действия — правки числа, смены
   * артикула, города, галочки материала, чипа «Быстрый старт». Открыть
   * «Уточнить размеры» или пролистать смету при этом целью не считается,
   * потому что расчёт от этого не меняется. Голая смена режима тоже не
   * считается: она размонтирует форму, и отсчёт начинается заново от
   * стартового расчёта нового режима — цель уйдёт, когда человек в нём
   * что-то поправит.
   *
   * Асинхронно результат сам по себе не меняется: цены приходят пропсами с
   * сервера ещё до первой отрисовки, а useDeferredValue стартует с тех же
   * значений — ложного срабатывания «само посчиталось» тут быть не может.
   */
  const sig = useMemo(() => JSON.stringify(result), [result]);
  const initialSig = useRef<string | null>(null);
  if (initialSig.current === null) initialSig.current = sig;
  useEffect(() => {
    if (calcGoalSent || result.grandTotal <= 0) return;
    if (sig === initialSig.current) return; // человек ещё ничего не менял
    calcGoalSent = true;
    reachGoal(GOALS.calc, { mode: result.mode, city: result.city });
  }, [sig, result.grandTotal, result.mode, result.city]);

  // Смета читается с итога: сопутствующие материалы по умолчанию свёрнуты
  // в одну строку с подытогом, детализация — по клику.
  const [matsOpen, setMatsOpen] = useState(false);
  const collapseMats = result.materials.length > 1;
  const matsTotal = result.materials.reduce((s, m) => s + m.total, 0);

  // На мобильном панель результата лежит под всеми полями — пока заполняешь
  // форму, сумму не видно. Липкая нижняя плашка показывает итог всегда и
  // скроллит к панели; когда панель и так на экране, плашка прячется.
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  useEffect(() => {
    const el = panelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setPanelVisible(e.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        ref={panelRef}
        className="relative flex flex-col gap-5 overflow-hidden rounded-xl2 bg-graphite-deep p-6 text-sand shadow-lift sm:p-7"
      >
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
            {collapseMats ? (
              <tr className="border-b border-sand/20 text-sand/80">
                <td colSpan={3} className="py-2 pr-2">
                  <button
                    type="button"
                    onClick={() => setMatsOpen((v) => !v)}
                    aria-expanded={matsOpen}
                    className="flex items-center gap-1.5 text-left transition hover:text-sand"
                  >
                    <span
                      aria-hidden
                      className={`inline-block text-xs transition-transform ${matsOpen ? "rotate-90" : ""}`}
                    >
                      ▸
                    </span>
                    Сопутствующие материалы · {result.materials.length} поз.
                  </button>
                </td>
                <td className="py-2 text-right font-medium">{formatRub(matsTotal)}</td>
              </tr>
            ) : null}
            {(collapseMats ? (matsOpen ? result.materials : []) : result.materials).map(
              (m) => (
                <tr key={m.code} className="border-b border-sand/20 text-sand/80">
                  <td className={`py-2 pr-2 ${collapseMats ? "pl-5" : ""}`}>
                    {m.name}
                    <span className="block text-xs text-sand/65">{m.pack}</span>
                  </td>
                  <td className="py-2 text-right">{m.packs} уп.</td>
                  <td className="py-2 text-right text-sand/85">
                    {formatRub(m.unitPrice)}
                  </td>
                  <td className="py-2 text-right font-medium">{formatRub(m.total)}</td>
                </tr>
              ),
            )}
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

      {/* Мобильная липкая плашка итога (заменяет общий CTA-бар на /calculator) */}
      {!panelVisible ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-ink/10 bg-white/95 p-2.5 backdrop-blur lg:hidden"
          style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
        >
          <div className="min-w-0 flex-1 pl-2">
            <div className="text-[11px] uppercase tracking-wide text-stone/70">
              Итого материалы
            </div>
            <div className="tabular truncate font-display text-lg font-extrabold text-ink">
              {formatRub(result.grandTotal)}
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="rounded-full bg-clinker px-5 py-3 font-semibold text-white"
          >
            Смотреть расчёт
          </button>
        </div>
      ) : null}
    </>
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
