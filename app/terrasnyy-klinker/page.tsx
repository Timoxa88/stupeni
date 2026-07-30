import type { Metadata } from "next";
import { CategoryView } from "@/components/sections/CategoryView";
import { getCategory } from "@/lib/content/categories";
import { getProductsByCategory } from "@/lib/catalog/queries";
import { PER_PAGE, pageHref, pageSuffix, parsePage } from "@/lib/pagination";
import { hasActiveFilters, parseCatalogQuery } from "@/lib/catalog/facets";
import { primeOverrides } from "@/lib/store/products";
import { resolveSeo } from "@/lib/store/seo";

/* Правки из админки (цены, тексты, скрытие) подхватываются за минуту. */
export const revalidate = 60;

const CAT = getCategory("terrasnyy-klinker")!;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  await primeOverrides();
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const pages = Math.max(1, Math.ceil(getProductsByCategory(CAT.slug).length / PER_PAGE));
  const suffix = pageSuffix(page, pages);
  const seo = await resolveSeo("catalog:terrasnyy-klinker", { title: CAT.title, description: CAT.description });
  return {
    title: seo.title + suffix,
    description: seo.description,
    // Страницы пагинации индексируются с canonical на себя (ТЗ B.3).
    alternates: { canonical: pageHref(`/${CAT.slug}`, page) },
    // Фильтрованные выдачи (?color=…) не индексируем — canonical и так чистый.
    ...(hasActiveFilters(parseCatalogQuery(sp)) ? { robots: { index: false, follow: true } } : {}),
    ...(seo.ogImage ? { openGraph: { images: [seo.ogImage] } } : {}),
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Page({ searchParams }: Props) {
  await primeOverrides();
  const sp = await searchParams;
  return <CategoryView category={CAT} page={parsePage(sp.page)} query={parseCatalogQuery(sp)} />;
}
