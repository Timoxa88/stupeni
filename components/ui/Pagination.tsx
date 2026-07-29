import Link from "next/link";
import { pageHref } from "@/lib/pagination";

/**
 * Пагинация листинга (ТЗ B.3). Обычные <Link> — страницы обходятся краулером,
 * без JS-подгрузки. Текущая помечена aria-current, цели ≥ 44 px (WCAG 2.5.8).
 */
export function Pagination({
  base,
  page,
  pages,
  query,
  className = "",
}: {
  /** Базовый путь листинга, напр. "/terrasnyy-klinker". */
  base: string;
  page: number;
  pages: number;
  /** Активные фильтры каталога (строка query) — сохраняются при листании. */
  query?: string;
  className?: string;
}) {
  if (pages <= 1) return null;

  // Окно: первая, последняя, текущая ±1, остальное — многоточием.
  const nums: (number | "…")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }

  const cell =
    "grid h-11 min-w-11 place-items-center rounded-lg border px-3 text-sm font-semibold transition";

  return (
    <nav className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Страницы каталога">
      {page > 1 ? (
        <Link href={pageHref(base, page - 1, query)} rel="prev" className={`${cell} border-ink/15 text-ink hover:border-clinker hover:text-clinker`}>
          ← Назад
        </Link>
      ) : null}

      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-stone/60" aria-hidden>
            …
          </span>
        ) : n === page ? (
          <span key={n} aria-current="page" className={`${cell} border-clinker bg-clinker text-white`}>
            {n}
          </span>
        ) : (
          <Link key={n} href={pageHref(base, n, query)} className={`${cell} border-ink/15 text-ink hover:border-clinker hover:text-clinker`}>
            {n}
          </Link>
        ),
      )}

      {page < pages ? (
        <Link href={pageHref(base, page + 1, query)} rel="next" className={`${cell} border-ink/15 text-ink hover:border-clinker hover:text-clinker`}>
          Вперёд →
        </Link>
      ) : null}
    </nav>
  );
}
