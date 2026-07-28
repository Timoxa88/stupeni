"use client";

import { useState } from "react";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { productHref } from "@/lib/catalog/taxonomy";
import type { Product } from "@/lib/catalog/types";
import { basePrice, priceUnitLabel } from "@/lib/catalog/queries";
import { priceView } from "@/lib/catalog/pricing";
import { formatRub } from "@/lib/format";
import { PromoTimer } from "@/components/ui/PromoTimer";

const TYPE_LABEL: Record<Product["product_type"], string> = {
  step_system: "Клинкерные ступени",
  slab: "Керамогранит 20 мм",
};

/**
 * Карточка витрины (ТЗ §6 блок 10, §8.1): фото, бейдж скидки, старая/новая
 * цена «за шт. с НДС», цветовые чипы вариантов (наведение меняет превью,
 * клик ведёт в карточку на выбранном цвете). Обёрнута в content-visibility.
 */
export function ProductCard({ product }: { product: Product }) {
  const [activeId, setActiveId] = useState(product.id);
  const variants = product.variants ?? [];

  // Фото ТОЛЬКО своё. Раньше фолбэком стояла картинка категории, и подряд шли
  // четыре одинаковые карточки, где чёрный артикул был показан серым двориком.
  // Чужое фото хуже честной плашки: оно врёт о цвете товара.
  const own = variants.find((v) => v.id === activeId)?.photo ?? product.photos[0];
  const preview = own?.startsWith("/images/products/") ? own : null;

  // Цена — из единого источника (lib/catalog/pricing): текущая цена всегда каталожная,
  // акция с истёкшим дедлайном не показывается.
  const view = priceView(product, basePrice(product));

  return (
    <article className="cv-card group flex flex-col overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link href={productHref(activeId)} className="relative block aspect-[4/3] overflow-hidden">
        {preview ? (
          <Image
            src={preview}
            alt={`${product.brand} ${product.collection} — ${product.specs.color}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="img-rich object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2"
            style={{ background: product.specs.color_hex || "#C9B79C" }}
          >
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-ink">
              {product.specs.color}
            </span>
            <span className="text-[11px] text-white/85">фото уточняется</span>
          </div>
        )}
        {view.label || view.discountPct ? (
          <span className="absolute left-3 top-3 rounded-full bg-clinker px-2.5 py-1 text-xs font-bold text-white shadow-glow">
            {view.discountPct ? `−${view.discountPct} %` : view.label}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-stone/70">
          {product.brand} · {TYPE_LABEL[product.product_type]}
        </div>
        <h3 className="mt-1.5">
          <Link
            href={productHref(activeId)}
            className="font-display text-lg font-bold text-ink transition hover:text-clinker"
          >
            {product.collection} {product.specs.color}
          </Link>
        </h3>

        {/* Цена */}
        <div className="mt-3 flex items-baseline gap-2">
          {view.oldPrice ? (
            <>
              <span className="tabular text-stone/60 line-through">
                {formatRub(view.oldPrice)}
              </span>
              <span className="tabular font-display text-xl font-extrabold text-clinker">
                {formatRub(view.price)}
              </span>
            </>
          ) : (
            <span className="tabular font-display text-xl font-extrabold text-ink">
              от {formatRub(view.price)}
            </span>
          )}
        </div>
        <div className="text-xs text-stone/70">{priceUnitLabel(product)}</div>
        {view.endsAt ? <PromoTimer endsAt={view.endsAt} className="mt-1.5" /> : null}

        {/* Цветовые чипы вариантов */}
        {variants.length > 1 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Цвета коллекции">
            {variants.map((v) => {
              const active = v.id === activeId;
              return (
                <Link
                  key={v.id}
                  href={productHref(v.id)}
                  aria-label={v.color}
                  title={v.color}
                  onMouseEnter={() => setActiveId(v.id)}
                  onFocus={() => setActiveId(v.id)}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    active ? "border-clinker scale-110" : "border-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                  }`}
                  style={{ background: v.color_hex }}
                />
              );
            })}
          </div>
        ) : null}

        {/* Мини-характеристики */}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
          {product.stock_status ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                product.stock_status === "in_stock"
                  ? "bg-olive/15 text-olive"
                  : "bg-ember/15 text-[#9a6418]"
              }`}
            >
              {product.stock_status === "in_stock" ? "В наличии" : "Под заказ"}
            </span>
          ) : null}
          {[product.specs.frost_resistance, product.specs.slip_resistance].filter(Boolean).map((tag) => (
            <span key={tag} className="rounded-full bg-sand-deep px-2.5 py-1 text-xs font-medium text-stone">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
