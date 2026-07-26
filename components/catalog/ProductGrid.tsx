import type { Product } from "@/lib/catalog/types";
import { ProductCard } from "./ProductCard";

/** Сетка карточек витрины (ТЗ §6 блок 10, §7). Карточки — с content-visibility. */
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-card border border-ink/10 bg-white p-8 text-center text-stone">
        В этой подборке пока нет позиций. Напишите нам — подберём под задачу.
      </p>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
