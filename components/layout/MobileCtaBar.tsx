"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useContacts } from "@/components/layout/ContactsProvider";

/**
 * Sticky-CTA-бар на мобильном (ТЗ A.3§4 / B.7): Позвонить + Рассчитать.
 * Скрыт на десктопе. Учитывает safe-area; фокус не перекрывается за счёт
 * scroll-padding-bottom в globals.css, футер — за счёт pb-компенсации в body.
 *
 * «Позвонить» раньше всегда набирала Москву. Городов у нас два (просьба
 * Кирилла 01.08.2026 — питерский номер тоже нужен), поэтому при двух и более
 * номерах кнопка сперва спрашивает город; при одном — сразу tel:.
 */
export function MobileCtaBar() {
  const contacts = useContacts();
  const [callOpen, setCallOpen] = useState(false);
  // На главной калькулятор встроен — якорь вместо перехода на /calculator.
  const pathname = usePathname();
  const calcHref = pathname === "/" ? "#calc" : "/calculator";

  // На самом калькуляторе кнопка «Рассчитать» бессмысленна, а низ экрана
  // занимает липкая плашка итога (ResultPanel) — этот бар уступает ей место.
  if (pathname.startsWith("/calculator")) return null;

  const cities = contacts.cities;
  const callClass =
    "flex flex-1 items-center justify-center rounded-full border border-ink/15 px-4 py-3 font-semibold text-ink";

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-white/95 p-2.5 backdrop-blur lg:hidden"
        style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
      >
        {cities.length > 1 ? (
          <button
            type="button"
            onClick={() => setCallOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={callOpen}
            className={callClass}
          >
            Позвонить
          </button>
        ) : (
          <a href={`tel:${cities[0]?.phone ?? contacts.phone}`} className={callClass}>
            Позвонить
          </a>
        )}
        <Link
          href={calcHref}
          className="flex flex-1 items-center justify-center rounded-full bg-clinker px-4 py-3 font-semibold text-white"
        >
          Рассчитать
        </Link>
      </div>

      {callOpen ? (
        <Modal
          onClose={() => setCallOpen(false)}
          label="Выбор города для звонка"
          className="max-w-sm"
        >
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-ink">Куда звоним?</span>
            <span className="mt-1 text-sm text-stone">Отвечаем пн–пт 9:00–19:00</span>
            <div className="mt-4 flex flex-col gap-2">
              {cities.map((c) => (
                <a
                  key={c.phone}
                  href={`tel:${c.phone}`}
                  onClick={() => setCallOpen(false)}
                  className="flex flex-col rounded-card border border-ink/10 px-4 py-3 transition hover:border-clinker/40"
                >
                  <span className="font-display text-xl font-bold leading-tight text-ink">
                    {c.phoneLabel}
                  </span>
                  <span className="text-sm text-stone">{c.city}</span>
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCallOpen(false)}
              className="mt-3 rounded-full border border-ink/10 px-5 py-3 font-semibold text-stone"
            >
              Отмена
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
