import type { Product } from "@/lib/catalog/types";
import {
  getProductById,
  basePrice,
  comparableUnitPrice,
  priceUnitLabel,
} from "@/lib/catalog/queries";
import { priceView } from "@/lib/catalog/pricing";
import { productTitle } from "@/lib/catalog/display";
import { ProductCard, type VariantDisplay } from "./ProductCard";

function displayOf(p: Product): VariantDisplay {
  const view = priceView(p, basePrice(p));
  return {
    title: productTitle(p),
    price: view.price,
    oldPrice: view.oldPrice,
    unit: priceUnitLabel(p),
    perUnit: comparableUnitPrice(p),
    badge: view.discountPct ? `−${view.discountPct} %` : view.label,
    endsAt: view.endsAt,
  };
}

/**
 * Карта «id артикула → имя + цены» для карточки: базовый артикул и цветовые
 * варианты. Собирается на СЕРВЕРЕ — карточка клиентская, и runtime-импорт
 * queries/pricing из неё утащил бы весь сид каталога в бандл (см. ProductCard).
 */
function variantInfoFor(p: Product): Record<string, VariantDisplay> {
  const out: Record<string, VariantDisplay> = { [p.id]: displayOf(p) };
  for (const v of p.variants ?? []) {
    if (out[v.id]) continue;
    const sib = getProductById(v.id);
    if (sib) out[v.id] = displayOf(sib);
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
