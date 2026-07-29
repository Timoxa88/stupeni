"use client";

import { useMemo } from "react";
import type { Product } from "@/lib/catalog/types";
import { collectionBase, colorLabel } from "@/lib/catalog/taxonomy";
import { Field, Select } from "@/components/ui/controls";

/**
 * Каскадный выбор артикула: бренд → коллекция → цвет-свотч.
 *
 * Заменяет один селект на 80+ строк «Brand Collection Color»: цвет выбирается
 * кружком фактического оттенка (color_hex из каталога), а список коллекций
 * у выбранного бренда — короткий. Функционально это тот же выбор productId.
 *
 * Формы калькулятора и так клиентские и держат сид каталога в бандле, поэтому
 * runtime-импорт taxonomy здесь ничего не добавляет.
 */
export function ArticlePicker({
  products,
  value,
  onChange,
}: {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
}) {
  const product = products.find((p) => p.id === value) ?? products[0];

  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [products]);

  const collections = useMemo(() => {
    const seen: string[] = [];
    for (const p of products) {
      if (p.brand !== product.brand) continue;
      const base = collectionBase(p);
      if (!seen.includes(base)) seen.push(base);
    }
    return seen;
  }, [products, product.brand]);

  const collection = collectionBase(product);
  const colors = products.filter(
    (p) => p.brand === product.brand && collectionBase(p) === collection,
  );

  const pickBrand = (brand: string) => {
    const first = products.find((p) => p.brand === brand);
    if (first) onChange(first.id);
  };
  const pickCollection = (base: string) => {
    const first = products.find(
      (p) => p.brand === product.brand && collectionBase(p) === base,
    );
    if (first) onChange(first.id);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Бренд">
          <Select
            value={product.brand}
            onChange={pickBrand}
            options={brands.map((b) => ({ value: b, label: b }))}
          />
        </Field>
        <Field label="Коллекция">
          <Select
            value={collection}
            onChange={pickCollection}
            options={collections.map((c) => ({ value: c, label: c }))}
          />
        </Field>
      </div>
      <Field label={`Цвет — ${colorLabel(product)}`}>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Цвет артикула">
          {colors.map((p) => {
            const active = p.id === product.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange(p.id)}
                aria-label={colorLabel(p)}
                aria-pressed={active}
                title={colorLabel(p)}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  active
                    ? "scale-110 border-clinker shadow-glow"
                    : "border-white shadow-[0_0_0_1px_rgba(0,0,0,0.18)] hover:scale-105"
                }`}
                style={{ background: p.specs.color_hex || "#C9B79C" }}
              />
            );
          })}
        </div>
      </Field>
    </div>
  );
}
