"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/content/site";

/**
 * Sticky-CTA-бар на мобильном (ТЗ A.3§4 / B.7): Позвонить + Рассчитать.
 * Скрыт на десктопе. Учитывает safe-area; фокус не перекрывается за счёт
 * scroll-padding-bottom в globals.css, футер — за счёт pb-компенсации в body.
 */
export function MobileCtaBar() {
  // На главной калькулятор встроен — якорь вместо перехода на /calculator.
  const pathname = usePathname();
  const calcHref = pathname === "/" ? "#calc" : "/calculator";

  // На самом калькуляторе кнопка «Рассчитать» бессмысленна, а низ экрана
  // занимает липкая плашка итога (ResultPanel) — этот бар уступает ей место.
  if (pathname.startsWith("/calculator")) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-white/95 p-2.5 backdrop-blur lg:hidden"
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href={`tel:${SITE.phone}`}
        className="flex flex-1 items-center justify-center rounded-full border border-ink/15 px-4 py-3 font-semibold text-ink"
      >
        Позвонить
      </a>
      <Link
        href={calcHref}
        className="flex flex-1 items-center justify-center rounded-full bg-clinker px-4 py-3 font-semibold text-white"
      >
        Рассчитать
      </Link>
    </div>
  );
}
