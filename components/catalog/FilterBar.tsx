"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CatalogQuery, FacetOption, Facets, SortKey } from "@/lib/catalog/facets";

/**
 * Панель сортировки и фильтров листинга. Состояние — в query-параметрах,
 * фильтрует сервер; компонент только строит URL и делает router.push.
 *
 * Импортирует из каталога ТОЛЬКО типы: любой runtime-импорт queries/facets
 * утащил бы весь сид каталога в клиентский бандл.
 *
 * Фасет с единственным значением не показывается (на странице бренда селект
 * «Бренд» бессмыслен) — поэтому компонент один для всех листингов.
 */
export function FilterBar({
  basePath,
  query,
  facets,
  sortOptions,
}: {
  basePath: string;
  query: CatalogQuery;
  facets: Facets;
  sortOptions: { value: SortKey; label: string }[];
}) {
  const router = useRouter();

  const apply = (patch: Partial<CatalogQuery>) => {
    const q = { ...query, ...patch };
    const params = new URLSearchParams();
    if (q.sort && q.sort !== "recommended") params.set("sort", q.sort);
    for (const k of ["color", "country", "brand", "surface", "slip", "type"] as const) {
      if (q[k]) params.set(k, q[k]!);
    }
    const qs = params.toString();
    // Смена фильтра сбрасывает страницу пагинации (page в params не пишем).
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  };

  const hasFilters = Boolean(
    query.color || query.country || query.brand || query.surface || query.slip || query.type,
  );

  const selects: {
    key: "color" | "country" | "brand" | "surface" | "slip" | "type";
    placeholder: string;
    options: FacetOption[];
  }[] = [
    { key: "color", placeholder: "Цвет", options: facets.colors },
    { key: "country", placeholder: "Страна", options: facets.countries },
    { key: "brand", placeholder: "Бренд", options: facets.brands },
    { key: "type", placeholder: "Тип", options: facets.types },
    { key: "surface", placeholder: "Поверхность", options: facets.surfaces },
    { key: "slip", placeholder: "Противоскольжение", options: facets.slips },
  ];

  const selectCls = (active: boolean) =>
    `h-11 cursor-pointer appearance-none rounded-full border bg-white py-0 pl-4 pr-9 text-sm font-semibold transition focus:outline-none focus-visible:border-clinker ${
      active ? "border-clinker text-clinker" : "border-ink/15 text-stone hover:border-ink/30"
    }`;

  const chevron: React.CSSProperties = {
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' fill='none' stroke='%23807A70' stroke-width='1.6' stroke-linecap='round'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.9rem center",
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Сортировка и фильтры каталога">
      <label className="sr-only" htmlFor="catalog-sort">
        Сортировка
      </label>
      <select
        id="catalog-sort"
        value={query.sort}
        onChange={(e) => apply({ sort: e.target.value as SortKey })}
        className={selectCls(query.sort !== "recommended")}
        style={chevron}
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {selects.map(({ key, placeholder, options }) =>
        // Фасет из одного значения ничего не фильтрует — прячем.
        options.length > 1 || query[key] ? (
          <select
            key={key}
            value={query[key] ?? ""}
            onChange={(e) => apply({ [key]: e.target.value || undefined })}
            aria-label={placeholder}
            className={selectCls(Boolean(query[key]))}
            style={chevron}
          >
            <option value="">{placeholder}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} ({o.count})
              </option>
            ))}
          </select>
        ) : null,
      )}

      {hasFilters ? (
        <Link
          href={basePath}
          className="text-sm font-semibold text-clinker underline-offset-2 hover:underline"
        >
          Сбросить
        </Link>
      ) : null}
    </div>
  );
}
