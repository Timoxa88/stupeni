"use client";

import { useEffect, useRef, type ReactNode } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Доступный модальный диалог (ТЗ A.2 E7 / A.3§7): role=dialog, aria-modal,
 * фокус-трап, закрытие по Esc и клику по фону, возврат фокуса на триггер,
 * блокировка скролла фона. Рендерится только когда открыт (монтаж = открыт).
 */
export function Modal({
  onClose,
  labelledBy,
  label,
  children,
  className = "max-w-md",
  surface = true,
}: {
  onClose: () => void;
  /** id заголовка внутри диалога (aria-labelledby). */
  labelledBy?: string;
  /** Фолбэк-метка, если нет заголовка. */
  label?: string;
  children: ReactNode;
  className?: string;
  /** true — карточка (bg/тень/паддинг); false — без хрома (лайтбокс). */
  surface?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement;
    const el = ref.current;
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    focusables()[0]?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const f = focusables();
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [onClose]);

  // z-[100] — выше cookie-баннера (z-[90]): при z-[80] баннер накрывал низ любого
  // диалога, у квиза за ним оставались «Далее» и счётчик шагов, на мобильном —
  // пол-экрана. Диалог модальный, баннер информирующий: приоритет у диалога.
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite-deep/70 p-4"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        className={`w-full ${surface ? "rounded-card bg-white p-6 shadow-lift" : ""} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
