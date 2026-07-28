import type { Product } from "@/lib/catalog/types";
import { getProductById, basePrice, priceUnitLabel } from "@/lib/catalog/queries";
import { priceView } from "@/lib/catalog/pricing";
import { productTitle } from "@/lib/catalog/display";
import { ProductCard, type VariantDisplay } from "./ProductCard";

/**
 * Наведение на цветовой чип меняло фото, но имя и цена оставались от базового
 * артикула. Клиенту сами товары-соседи не отдаём — здесь, на сервере, собираем
 * компактную карту «id варианта → имя + цена», карточка подставляет её на hover.
 */
function variantInfoFor(p: Product): Record<string, VariantDisplay> | undefined {
  const variants = p.variants ?? [];
  if (variants.length < 2) return undefined;
  const out: Record<string, VariantDisplay> = {};
  for (const v of variants) {
    const sib = v.id === p.id ? p : getProductById(v.id);
    if (!sib) continue;
    const view = priceView(sib, basePrice(sib));
    out[v.id] = {
      title: productTitle(sib),
      price: view.price,
      oldPrice: view.oldPrice,
      unit: priceUnitLabel(sib),
    };
  }
  return out;
}

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
        <ProductCard key={p.id} product={p} variantInfo={variantInfoFor(p)} />
      ))}
    </div>
  );
}
