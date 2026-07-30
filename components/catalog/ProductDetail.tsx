"use client";

import { useId, useMemo, useState } from "react";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import type { ElementCode, Product } from "@/lib/catalog/types";
import { formatRub, formatNum } from "@/lib/format";
import { priceView } from "@/lib/catalog/pricing";
import { productTitle } from "@/lib/catalog/display";
import { PromoTimer } from "@/components/ui/PromoTimer";
import { LeadForm } from "@/components/forms/LeadForm";
import { Modal } from "@/components/ui/Modal";
import { withBase } from "@/lib/base";
import { elementKey, elementLabel, orderedElements } from "@/lib/catalog/elements";

const SURFACE: Record<string, string> = {
  structured: "Структурированная",
  matte: "Матовая",
  wood: "Под дерево",
  smooth: "Гладкая",
  relief: "Рельефная",
};

const APP_LABEL: Record<string, string> = {
  kryltso: "крыльцо",
  "lestnitsa-ulitsa": "уличная лестница",
  terrasa: "терраса",
  dorozhki: "дорожки",
  "landshaft-opory": "укладка на опоры",
  bassein: "бассейн",
};

type Variant = {
  key: string;
  label: string;
  size_mm: string;
  unit: string;
  price: number;
  weight?: number;
  perPallet?: number;
  thickness?: number;
  perSqm?: number;
  /** Артикул именно этого элемента (у ступеней каждый элемент — свой SKU). */
  sku?: string;
  /** Фото этого элемента: ступень с капиносом ≠ ступень с насечками ≠ плитка. */
  photo?: string;
  code?: ElementCode;
};

export function ProductDetail({ product }: { product: Product }) {
  const isStep = product.product_type === "step_system";

  const variants: Variant[] = useMemo(() => {
    if (isStep && product.elements?.length) {
      const els = orderedElements(product);
      return els.map((e) => ({
        // Ключ — код + размер: у одного кода бывает два формата (плитка 300×300
        // и 600×300), и по одному только коду селектор их бы склеил.
        key: elementKey(e),
        label: elementLabel(e, els),
        size_mm: e.size_mm,
        unit: e.unit === "sqm" ? "за м² с НДС" : "за шт. с НДС",
        price: e.price_rub,
        weight: e.weight_kg,
        perPallet: e.per_pallet,
        perSqm: e.per_sqm,
        sku: e.sku,
        photo: e.photo,
        code: e.code,
      }));
    }
    return (product.formats ?? []).map((f) => ({
      key: f.code,
      label: `Формат ${f.size_mm} мм`,
      size_mm: f.size_mm,
      unit: f.price_rub_pcs ? "за шт. с НДС" : "за м² с НДС",
      price: f.price_rub_pcs ?? f.price_rub_sqm,
      weight: f.weight_kg,
      perPallet: f.per_pallet,
      thickness: f.thickness_mm,
      perSqm: f.per_sqm,
    }));
  }, [isStep, product]);

  const [variantKey, setVariantKey] = useState(variants[0]?.key ?? "");
  const [photo, setPhoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const orderTitleId = useId();

  const v = variants.find((x) => x.key === variantKey) ?? variants[0];
  const photos = product.photos.length ? product.photos : ["/images/cat-clinker.jpg"];

  /**
   * Смена элемента ведёт галерею за собой: у каждого элемента системы своё фото,
   * и показывать капинос кадром базовой плитки — прямая дезинформация покупателя.
   * Если фото элемента в галерее нет, кадр не трогаем.
   */
  const selectVariant = (key: string) => {
    setVariantKey(key);
    const target = variants.find((x) => x.key === key)?.photo;
    const i = target ? photos.indexOf(target) : -1;
    if (i >= 0) setPhoto(i);
  };

  // Единый источник цены (lib/catalog/pricing): показываем ровно каталожную цену
  // выбранного элемента/формата — ту же, что считает калькулятор.
  const view = priceView(product, v.price);

  const specRows: [string, string][] = [
    // Внутри одной системы «тип товара» у элементов разный: базовая плитка —
    // это напольная плитка, а не ступень. Подписываем по выбранному элементу.
    [
      "Тип товара",
      isStep
        ? v?.code === "base"
          ? "Напольная клинкерная плитка"
          : "Клинкерные ступени"
        : "Крупноформатная пластина",
    ],
    ["Применение", product.application.map((a) => APP_LABEL[a]).join(", ")],
    [isStep ? "Элемент" : "Формат", v.label],
    ["Размер, мм", v.size_mm],
    ...(v.thickness ? ([["Толщина, мм", String(v.thickness)]] as [string, string][]) : []),
    ...(v.weight ? ([["Вес штуки, кг", formatNum(v.weight)]] as [string, string][]) : []),
    ["Поверхность", SURFACE[product.specs.surface] ?? product.specs.surface],
    // Незаполненные характеристики не выводим: «F100» или «0 %» по догадке — это
    // заявление о свойствах товара, которого нет в источнике данных.
    ...(product.specs.slip_resistance
      ? ([["Противоскольжение", product.specs.slip_resistance]] as [string, string][])
      : []),
    ["Цвет", product.specs.color],
    ...(product.specs.frost_resistance
      ? ([["Морозостойкость", product.specs.frost_resistance]] as [string, string][])
      : []),
    ...(product.specs.water_absorption_pct != null
      ? ([["Водопоглощение", `${formatNum(product.specs.water_absorption_pct)} %`]] as [string, string][])
      : []),
    ...(v.perSqm ? ([["Шт/м²", formatNum(v.perSqm)]] as [string, string][]) : []),
    ...(v.perPallet ? ([["Шт/поддон", String(v.perPallet)]] as [string, string][]) : []),
  ];

  // Артикул уезжает в калькулятор предвыбранным — человеку не приходится
  // искать его заново в списке из 80+ позиций (режим калькулятор выведет
  // из типа товара сам).
  const calcHref = `/calculator?product=${product.id}`;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Галерея. min-w-0 на колонках: <select> элементов с длинными названиями
          не должен распирать колонку (на 360px давал гориз. скролл страницы) */}
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="relative block aspect-[4/3] w-full overflow-hidden rounded-card border border-ink/10 bg-white"
          aria-label="Увеличить фото"
        >
          <Image
            src={photos[photo]}
            alt={product.seo.h1}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="img-rich object-contain"
          />
          {view.discountPct || view.label ? (
            <span className="absolute left-4 top-4 rounded-full bg-clinker px-3 py-1.5 text-sm font-bold text-white shadow-glow">
              {view.discountPct ? `−${view.discountPct} %` : view.label}
            </span>
          ) : null}
        </button>
        {photos.length > 1 ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {photos.map((p, i) => {
              // Миниатюра, за которой стоит элемент системы, переключает и его:
              // иначе на экране кадр капиноса, а цена и характеристики — плитки.
              const owner = variants.find((x) => x.photo === p);
              return (
                <button
                  key={p + i}
                  type="button"
                  onClick={() => (owner ? selectVariant(owner.key) : setPhoto(i))}
                  className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition ${
                    i === photo ? "border-clinker" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={owner ? owner.label : `Фото ${i + 1}`}
                  title={owner?.label}
                >
                  {/* contain, а не cover: у кадров элементов важна форма кромки —
                      обрезка миниатюры съедала как раз капинос и насечки */}
                  <Image src={p} alt="" fill sizes="96px" loading="lazy" className="object-contain" />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Инфо */}
      <div className="min-w-0">
        <div className="text-sm font-semibold uppercase tracking-wide text-stone/70">
          {product.brand} · арт. {v?.sku ?? product.sku}
        </div>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {product.seo.h1}
        </h1>

        {/* Селектор элемента/формата */}
        {variants.length > 1 ? (
          <label className="mt-6 flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone">
              {isStep ? "Элемент системы" : "Формат"}
            </span>
            <select
              className="field-input"
              value={variantKey}
              onChange={(e) => selectVariant(e.target.value)}
            >
              {variants.map((x) => (
                <option key={x.key} value={x.key}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {/* Цена */}
        <div className="mt-6 flex items-baseline gap-3">
          {view.oldPrice ? (
            <span className="tabular text-lg text-stone/60 line-through">
              {formatRub(view.oldPrice)}
            </span>
          ) : null}
          <span className="tabular font-display text-4xl font-extrabold text-clinker">
            {formatRub(view.price)}
          </span>
        </div>
        <div className="text-sm text-stone/70">{v.unit}</div>
        {view.endsAt ? <PromoTimer endsAt={view.endsAt} className="mt-2" /> : null}
        <p className="mt-1 text-xs text-stone/60">
          Цена справочная и не является публичной офертой. Актуальную стоимость
          уточняйте у менеджера.
        </p>
        {product.stock_status ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium">
            <span
              className={`h-2 w-2 rounded-full ${product.stock_status === "in_stock" ? "bg-olive" : "bg-ember"}`}
              aria-hidden
            />
            {product.stock_status === "in_stock"
              ? "В наличии на складе"
              : `Под заказ${product.lead_time_weeks ? ` ~${product.lead_time_weeks} нед.` : ""}`}
          </p>
        ) : null}

        {/* CTA */}
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="sheen rounded-full bg-clinker px-7 py-3.5 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
          >
            Заказать
          </button>
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="rounded-full border border-ink/15 px-7 py-3.5 font-semibold text-ink transition hover:border-clinker hover:text-clinker"
          >
            Заказать образец
          </button>
          <Link
            href={calcHref}
            className="rounded-full border border-ink/15 px-7 py-3.5 font-semibold text-ink transition hover:border-clinker hover:text-clinker"
          >
            Рассчитать с этой плиткой →
          </Link>
        </div>

        {/* Характеристики */}
        <div className="mt-8 overflow-hidden rounded-card border border-ink/10">
          <table className="w-full text-sm">
            <tbody>
              {specRows.map(([k, val], i) => (
                <tr key={k} className={i % 2 ? "bg-sand-deep/50" : "bg-white"}>
                  <td className="px-4 py-2.5 text-stone">{k}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-ink">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Документы */}
        {product.documents?.length ? (
          <div className="mt-6">
            <div className="eyebrow text-clinker">Документы</div>
            <ul className="mt-3 flex flex-col gap-2">
              {product.documents.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white px-4 py-2.5 text-sm">
                  <span className="text-ink">{d.name}</span>
                  {d.gated ? (
                    <Link href="/contacts" className="font-semibold text-clinker">
                      Запросить у менеджера →
                    </Link>
                  ) : (
                    <a href={withBase(d.url)} className="font-semibold text-clinker" download>
                      Скачать
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Лайтбокс */}
      {zoom ? (
        <Modal onClose={() => setZoom(false)} label="Просмотр фото" surface={false} className="max-w-5xl">
          <div className="relative h-[80vh] w-full">
            <Image src={photos[photo]} alt={product.seo.h1} fill className="object-contain" sizes="100vw" />
          </div>
        </Modal>
      ) : null}

      {/* Модал заказа */}
      {orderOpen ? (
        <Modal onClose={() => setOrderOpen(false)} labelledBy={orderTitleId}>
          <h3 id={orderTitleId} className="font-display text-xl font-bold text-ink">
            Заявка по артикулу
          </h3>
          <p className="mt-1 text-sm text-stone">
            {product.brand} {productTitle(product)} · {v.label}
          </p>
          <div className="mt-4">
            <LeadForm
              tag="Образец"
              source="product"
              data={{
                product: `${product.brand} ${product.collection}`,
                sku: v?.sku ?? product.sku,
                variant: v.label,
              }}
              submitLabel="Отправить"
              comment={`Артикул: ${v?.sku ?? product.sku} (${product.brand} ${product.collection}), ${v.label}`}
            />
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
