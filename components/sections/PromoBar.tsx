"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Полоса акции с обратным отсчётом — по образцу PromoBanner fintherm.com.ru
 * (просьба Кирилла 30.07.2026): скользящее 12-часовое окно, счётчик
 * чч:мм:сс, CTA на форму заявки. Размер скидки и текст — маркетинговые
 * настройки, меняются здесь в константах.
 *
 * Рендерится только после маунта (до этого null): SSR-разметка со временем
 * сервера не совпала бы с клиентом и ломала гидрацию.
 */
const DISCOUNT_TEXT = "Скидка −15% на клинкерные ступени";
const DISCOUNT_NOTE = "При оформлении расчёта сегодня";
const WINDOW_MS = 12 * 60 * 60 * 1000;

export function PromoBar() {
  const [left, setLeft] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const remaining = WINDOW_MS - (Date.now() % WINDOW_MS);
      setLeft({
        h: Math.floor(remaining / 3_600_000),
        m: Math.floor((remaining % 3_600_000) / 60_000),
        s: Math.floor((remaining % 60_000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  if (!left) return null;

  return (
    <section className="relative overflow-hidden border-y border-clinker/25 bg-graphite-deep text-sand">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(30rem 16rem at 85% 50%, rgba(224,112,63,0.28), transparent 65%)",
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-5 sm:py-6 md:flex-row md:justify-between md:gap-8">
        <div className="flex items-center gap-4">
          <span
            className="hidden h-12 w-12 shrink-0 animate-pulse place-items-center rounded-full border border-clinker/40 bg-clinker/15 font-display text-lg font-extrabold text-clinker-bright sm:grid"
            aria-hidden
          >
            %
          </span>
          <div className="text-center md:text-left">
            <p className="font-display text-lg font-extrabold leading-tight sm:text-xl">
              {DISCOUNT_TEXT}
            </p>
            <p className="mt-0.5 text-sm text-sand/70">{DISCOUNT_NOTE}</p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center md:w-auto">
          <div className="flex items-end gap-2" aria-label="До конца акции">
            <span className="mb-4 hidden text-sm text-sand/60 lg:block">До конца акции:</span>
            {(
              [
                [left.h, "часов"],
                [left.m, "минут"],
                [left.s, "секунд"],
              ] as const
            ).map(([v, label], i) => (
              <span key={label} className="flex items-end gap-2">
                {i > 0 ? (
                  <span className="mb-6 font-display text-xl font-extrabold text-sand/40" aria-hidden>
                    :
                  </span>
                ) : null}
                <span className="flex flex-col items-center">
                  <span className="tabular w-14 rounded-xl border border-sand/20 bg-white/10 py-2 text-center font-display text-2xl font-extrabold">
                    {String(v).padStart(2, "0")}
                  </span>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-sand/50">
                    {label}
                  </span>
                </span>
              </span>
            ))}
          </div>
          <Link
            href="#lead"
            className="sheen w-full rounded-full bg-clinker px-6 py-3 text-center font-semibold text-white shadow-glow transition hover:bg-clinker-hover sm:w-auto"
          >
            Забрать скидку
          </Link>
        </div>
      </div>
    </section>
  );
}
