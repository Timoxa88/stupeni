import type { Metadata } from "next";
import { CategoryView } from "@/components/sections/CategoryView";
import { getCategory } from "@/lib/content/categories";

const CAT = getCategory("plastiny-pod-derevo")!;

export const metadata: Metadata = {
  title: CAT.title,
  description: CAT.description,
  alternates: { canonical: "/plastiny-pod-derevo" },
};

export default function Page() {
  return <CategoryView category={CAT} />;
}
