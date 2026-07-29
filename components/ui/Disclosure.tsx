"use client";

import type { ReactNode } from "react";

/**
 * Свёртываемая секция на нативном <details> (доступно с клавиатуры, работает
 * без JS-состояния). Два вида:
 *  - "card" — карточка формы калькулятора (заголовок + подсказка справа);
 *  - "inline" — строчка внутри карточки («Уточнить размеры»).
 *
 * Зачем: форма калькулятора показывала все ~25 контролов сразу; редкие
 * (редактирование цен, тонкие размеры) сворачиваются, не теряя функции.
 */
export function Disclosure({
  title,
  hint,
  children,
  variant = "card",
  defaultOpen = false,
}: {
  title: ReactNode;
  /** Короткая сводка текущих значений — видна в свёрнутом состоянии. */
  hint?: ReactNode;
  children: ReactNode;
  variant?: "card" | "inline";
  defaultOpen?: boolean;
}) {
  if (variant === "inline") {
    return (
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-clinker transition hover:text-clinker-hover [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden
            className="inline-block text-xs transition-transform group-open:rotate-90"
          >
            ▸
          </span>
          <span>{title}</span>
          {hint ? (
            <span className="font-normal text-stone/70 group-open:hidden">{hint}</span>
          ) : null}
        </summary>
        <div className="mt-3">{children}</div>
      </details>
    );
  }

  return (
    <details open={defaultOpen} className="group rounded-card bg-white shadow-card">
      <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-x-3 gap-y-1 p-5 [&::-webkit-details-marker]:hidden">
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        {hint ? <span className="text-sm text-stone">{hint}</span> : null}
        <span
          aria-hidden
          className="ml-auto self-center text-stone/60 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}
