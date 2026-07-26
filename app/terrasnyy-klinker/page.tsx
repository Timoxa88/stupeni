import type { Metadata } from "next";
import { CategoryView } from "@/components/sections/CategoryView";
import { getCategory } from "@/lib/content/categories";

const CAT = getCategory("terrasnyy-klinker")!;

export const metadata: Metadata = {
  title: CAT.title,
  description: CAT.description,
  alternates: { canonical: "/terrasnyy-klinker" },
};

export default function Page() {
  return <CategoryView category={CAT} />;
}
