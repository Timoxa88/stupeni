"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SITE } from "@/lib/content/site";

/**
 * Меню — четыре пункта вместо семи. Три категории свёрнуты в хаб «Каталог»
 * (раньше /catalog отдавал 404), «Решения» ведут на хаб, а не сразу на крыльцо.
 * Услуги и блог живут в футере — в шапке они отбирали внимание у главного действия.
 */
const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/resheniya", label: "Решения" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  // На главной калькулятор встроен (#calc) — уводить с лендинга на /calculator
  // ради того же инструмента значит терять прокрутку и контекст.
  const pathname = usePathname();
  const calcHref = pathname === "/" ? "#calc" : "/calculator";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // В самом верху хедер прозрачный и лежит на тёмном hero — текст светлый.
  const onDark = !scrolled;

  return (
    <header className="vt-header sticky top-0 z-50">
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "glass border-b hairline shadow-[0_10px_30px_-20px_rgba(17,17,16,0.5)]"
            : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-500 ${
            scrolled ? "py-2.5" : "py-4"
          }`}
        >
          <Link
            href="/"
            className={`font-display text-lg font-extrabold tracking-tight transition-colors ${
              onDark ? "text-sand" : "text-ink"
            }`}
          >
            Hit
            <span className={onDark ? "text-clinker-bright" : "text-clinker"}>
              Ceramics
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                  onDark
                    ? "text-sand/90 hover:bg-white/10 hover:text-white"
                    : "text-stone hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${SITE.phone}`}
              className={`hidden text-sm font-semibold transition-colors sm:block ${
                onDark ? "text-sand" : "text-ink"
              }`}
            >
              {SITE.phoneLabel}
            </a>
            <Link
              href={calcHref}
              className="sheen relative hidden rounded-full bg-clinker px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(184,72,31,0.7)] transition hover:bg-clinker-hover sm:inline-block"
            >
              Получить расчёт
            </Link>

            {/* Бургер (мобильный) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              className={`grid h-11 w-11 place-items-center rounded-full border lg:hidden ${
                onDark ? "border-sand/25 text-sand" : "border-ink/15 text-ink"
              }`}
            >
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span className="h-0.5 w-5 rounded bg-current" />
                <span className="h-0.5 w-5 rounded bg-current" />
                <span className="h-0.5 w-5 rounded bg-current" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню — доступный диалог (focus-trap, Esc, возврат фокуса) */}
      {menuOpen ? (
        <Modal onClose={() => setMenuOpen(false)} label="Меню" className="max-w-sm">
          <div id={menuId} className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-extrabold text-ink">
                Hit<span className="text-clinker">Ceramics</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Закрыть меню"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-stone"
              >
                ✕
              </button>
            </div>
            <nav className="mt-4 flex flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b hairline py-3.5 font-display text-lg font-bold text-ink transition hover:text-clinker"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <a
              href={`tel:${SITE.phone}`}
              className="mt-5 font-display text-xl font-bold text-ink"
            >
              {SITE.phoneLabel}
            </a>
            <Link
              href={calcHref}
              onClick={() => setMenuOpen(false)}
              className="mt-4 rounded-full bg-clinker px-5 py-3.5 text-center font-semibold text-white"
            >
              Получить расчёт
            </Link>
          </div>
        </Modal>
      ) : null}
    </header>
  );
}
