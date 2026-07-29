import type { Metadata } from "next";
import { CategoryView } from "@/components/sections/CategoryView";
import { getCategory } from "@/lib/content/categories";
import { getProductsByCategory } from "@/lib/catalog/queries";
import { PER_PAGE, pageHref, pageSuffix, parsePage } from "@/lib/pagination";
import { hasActiveFilters, parseCatalogQuery } from "@/lib/catalog/facets";

const CAT = getCategory("plastiny-pod-derevo")!;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const pages = Math.max(1, Math.ceil(getProductsByCategory(CAT.slug).length / PER_PAGE));
  const suffix = pageSuffix(page, pages);
  return {
    title: CAT.title + suffix,
    description: CAT.description,
    // Страницы пагинации индексируются с canonical на себя (ТЗ B.3).
    alternates: { canonical: pageHref(`/${CAT.slug}`, page) },
    // Фильтрованные выдачи (?color=…) не индексируем — canonical и так чистый.
    ...(hasActiveFilters(parseCatalogQuery(sp)) ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  return <CategoryView category={CAT} page={parsePage(sp.page)} query={parseCatalogQuery(sp)} />;
}
