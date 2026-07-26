import type { Metadata } from "next";
import { CategoryView } from "@/components/sections/CategoryView";
import { getCategory } from "@/lib/content/categories";
import { getProductsByCategory } from "@/lib/catalog/queries";
import { PER_PAGE, pageHref, pageSuffix, parsePage } from "@/lib/pagination";

const CAT = getCategory("plastiny-pod-derevo")!;

type Props = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePage((await searchParams).page);
  const pages = Math.max(1, Math.ceil(getProductsByCategory(CAT.slug).length / PER_PAGE));
  const suffix = pageSuffix(page, pages);
  return {
    title: CAT.title + suffix,
    description: CAT.description,
    // Страницы пагинации индексируются с canonical на себя (ТЗ B.3).
    alternates: { canonical: pageHref(`/${CAT.slug}`, page) },
  };
}

export default async function Page({ searchParams }: Props) {
  return <CategoryView category={CAT} page={parsePage((await searchParams).page)} />;
}
