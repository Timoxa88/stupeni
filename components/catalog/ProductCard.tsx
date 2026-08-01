"use client";

import { useState } from "react";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { productHref } from "@/lib/catalog/hrefs";
import type { Product } from "@/lib/catalog/types";
import { formatRub } from "@/lib/format";
import { PromoTimer } from "@/components/ui/PromoTimer";

const TYPE_LABEL: Record<Product["product_type"], string> = {
  step_system: "Клинкерные ступени",
  slab: "Керамогранит 20 мм",
};

/**
 * Отображение варианта (и базового артикула) — собирает СЕРВЕР (ProductGrid).
 * Карточка — клиентский компонент, и любой её runtime-импорт queries/pricing
 * утащил бы весь сид каталога в бандл; поэтому цены, бейдж и сравнимая
 * «≈ ₽/м²»-строка приходят готовыми пропсами.
 */
export interface VariantDisplay {
  title: string;
  price: number;
  oldPrice?: number;
  unit: string;
  /** Сравнимая между брендами цена: «≈ 1 250 ₽/пог. м кромки», «≈ 3 400 ₽/м²». */
  perUnit?: string;
  /** Бейдж акции («−15 %» / «Хит») — только у базового артикула. */
  badge?: string;
  /** Дедлайн акции для таймера — только у базового артикула. */
  endsAt?: string;
}

/**
 * Карточка витрины (ТЗ §6 блок 10, §8.1): фото, бейдж скидки, старая/новая
 * цена «за шт. с НДС», цветовые чипы вариантов (наведение меняет превью,
 * клик ведёт в карточку на выбранном цвете). Обёрнута в content-visibility.
 */
export function ProductCard({
  product,
  variantInfo,
}: {
  product: Product;
  variantInfo: Record<string, VariantDisplay>;
}) {
  const [activeId, setActiveId] = useState(product.id);
  const variants = product.variants ?? [];

  // Фото ТОЛЬКО своё. Раньше фолбэком стояла картинка категории, и подряд шли
  // четыре одинаковые карточки, где чёрный артикул был показан серым двориком.
  // Чужое фото хуже честной плашки: оно врёт о цвете товара.
  const activeVariant = variants.find((v) => v.id === activeId);
  const own = activeVariant?.photo ?? product.photos[0];
  const preview = own?.startsWith("/images/products/") ? own : null;
  // Плашка-фолбэк должна показывать цвет ВЫБРАННОГО варианта, а не базового:
  // иначе переключение на артикул без фото не меняло ни цвет, ни подпись.
  const fallbackColor = activeVariant?.color ?? product.specs.color;
  const fallbackHex = activeVariant?.color_hex || product.specs.color_hex;

  const base = variantInfo[product.id];
  const isBase = activeId === product.id;
  const shown = (!isBase && variantInfo[activeId]) || base;

  return (
    <article className="cv-card group flex flex-col overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link href={productHref(activeId)} className="relative block aspect-[4/3] overflow-hidden">
        {preview ? (
          <Image
            src={preview}
            alt={`${product.brand} ${shown.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="img-rich object-contain transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2"
            style={{ background: fallbackHex || "#C9B79C" }}
          >
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-ink">
              {fallbackColor}
            </span>
            <span className="text-[11px] text-white/85">фото уточняется</span>
          </div>
        )}
        {isBase && base.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-clinker px-2.5 py-1 text-xs font-bold text-white shadow-glow">
            {base.badge}
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
            {shown.title}
          </Link>
        </h3>

        {/* Цена */}
        <div className="mt-3 flex items-baseline gap-2">
          {shown.oldPrice ? (
            <>
              <span className="tabular text-stone/60 line-through">
                {formatRub(shown.oldPrice)}
              </span>
              <span className="tabular font-display text-xl font-extrabold text-clinker">
                {formatRub(shown.price)}
              </span>
            </>
          ) : (
            <span className="tabular font-display text-xl font-extrabold text-ink">
              от {formatRub(shown.price)}
            </span>
          )}
        </div>
        <div className="text-xs text-stone/70">
          {shown.unit}
          {/* Сравнимая цена: «за шт.» у разных брендов — штуки разной длины и
              формата, сравнить нельзя; ₽/пог. м и ₽/м² — можно. */}
          {shown.perUnit ? (
            <span className="tabular"> · {shown.perUnit}</span>
          ) : null}
        </div>
        {isBase && base.endsAt ? <PromoTimer endsAt={base.endsAt} className="mt-1.5" /> : null}

        {/* Цветовые чипы вариантов */}
        {variants.length > 1 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Цвета коллекции">
            {variants.map((v) => {
              const active = v.id === activeId;
              return (
                /* Чип ПЕРЕКЛЮЧАЕТ цвет прямо в карточке (фото, название, цена),
                   а не уводит на страницу товара: на мобильном тап по ссылке
                   не давал посмотреть цвета — сразу открывалась карточка.
                   Открыть выбранный цвет — по фото, заголовку или «Рассчитать». */
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveId(v.id)}
                  onMouseEnter={() => setActiveId(v.id)}
                  onFocus={() => setActiveId(v.id)}
                  aria-label={v.color}
                  aria-pressed={active}
                  title={v.color}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    active ? "border-clinker scale-110" : "border-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                  }`}
                  style={{ background: v.color_hex }}
                />
              );
            })}
          </div>
        ) : null}

        {/* Мини-характеристики + мост в калькулятор */}
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
        <Link
          href={`/calculator?product=${activeId}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-clinker transition hover:text-clinker-hover"
        >
          Рассчитать комплект →
        </Link>
      </div>
    </article>
  );
}
