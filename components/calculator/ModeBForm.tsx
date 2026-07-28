"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  calcModeB,
  DEFAULT_PEDESTAL_CODE,
  HILST_PEDESTALS,
  PEDESTAL_MIN_SIDE_MM,
  type AreaInput,
  type City,
  type DeductionInput,
  type LayingMethod,
  type LayoutPattern,
  type MaterialCode,
} from "@/lib/calculator";
import { toSlabFormat } from "@/lib/catalog/adapters";
import { getSlabProducts } from "@/lib/catalog/seed";
import {
  Field,
  IconButton,
  NumberField,
  Segmented,
  Select,
  TextField,
  Toggle,
} from "@/components/ui/controls";
import { calcSummary } from "@/lib/calculator/summary";
import { ResultPanel } from "./ResultPanel";
import { MaterialToggles } from "./MaterialToggles";
import { productTitle } from "@/lib/catalog/display";

const products = getSlabProducts();
let uid = 0;
const newArea = (): AreaInput => ({
  id: `s${++uid}`,
  name: "",
  length: 5,
  width: 4,
});
const newDeduction = (): DeductionInput => ({
  id: `d${++uid}`,
  shape: "rect",
  length: 1,
  width: 1,
});

export function ModeBForm({
  city,
  onSend,
}: {
  city: City;
  onSend: (summary: string) => void;
}) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const product = products.find((p) => p.id === productId) ?? products[0];
  const [formatCode, setFormatCode] = useState(product.formats?.[0]?.code ?? "");
  const format =
    product.formats?.find((f) => f.code === formatCode) ?? product.formats?.[0];

  const [areas, setAreas] = useState<AreaInput[]>([newArea()]);
  const [deductions, setDeductions] = useState<DeductionInput[]>([]);
  const [method, setMethod] = useState<LayingMethod>("glue");
  const [layout, setLayout] = useState<LayoutPattern>("straight");
  const [pricePerPiece, setPricePerPiece] = useState(
    format?.price_rub_pcs ?? 0,
  );
  const defaultPedestal =
    HILST_PEDESTALS.find((p) => p.code === DEFAULT_PEDESTAL_CODE) ??
    HILST_PEDESTALS[0];
  const [pedestalCode, setPedestalCode] = useState(defaultPedestal.code);
  const [pedestalPrice, setPedestalPrice] = useState(defaultPedestal.price);
  const [withMaterials, setWithMaterials] = useState(true);
  const [materials, setMaterials] = useState<Partial<Record<MaterialCode, boolean>>>(
    { glue: true, grout: true, primer: false, waterproofing: true },
  );

  // Формат и цена переинициализируются при смене артикула.
  useEffect(() => {
    const f = product.formats?.[0];
    setFormatCode(f?.code ?? "");
    setPricePerPiece(f?.price_rub_pcs ?? 0);
  }, [product]);

  useEffect(() => {
    if (format) setPricePerPiece(format.price_rub_pcs ?? 0);
  }, [format]);

  // INP (ТЗ B.5): поля обновляются мгновенно, тяжёлый пересчёт идёт от
  // отложенных значений — отклик ввода не блокируется.
  const dAreas = useDeferredValue(areas);
  const dDeductions = useDeferredValue(deductions);
  const dPrice = useDeferredValue(pricePerPiece);
  const dPedestalPrice = useDeferredValue(pedestalPrice);

  const result = useMemo(() => {
    if (!format) return null;
    return calcModeB({
      city,
      areas: dAreas,
      deductions: dDeductions,
      format: toSlabFormat(format),
      method,
      layout,
      pricePerPiece: dPrice,
      pedestalPrice: dPedestalPrice,
      withMaterials,
      materials,
    });
  }, [
    city,
    dAreas,
    dDeductions,
    format,
    method,
    layout,
    dPrice,
    dPedestalPrice,
    withMaterials,
    materials,
  ]);

  const patchArea = (id: string, patch: Partial<AreaInput>) =>
    setAreas((as) => as.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const patchDed = (id: string, patch: Partial<DeductionInput>) =>
    setDeductions((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  const [w, h] = (format?.size_mm ?? "0x0").split("x").map(Number);
  const tooSmallForPedestals =
    method === "pedestals" &&
    (w < PEDESTAL_MIN_SIDE_MM || h < PEDESTAL_MIN_SIDE_MM);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col gap-6">
        {/* Артикул и формат */}
        <section className="rounded-card bg-white p-5 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Бренд / коллекция / цвет">
              <Select
                value={productId}
                onChange={setProductId}
                options={products.map((p) => ({
                  value: p.id,
                  label: `${p.brand} ${productTitle(p)}`,
                }))}
              />
            </Field>
            <Field label="Формат плиты">
              <Select
                value={formatCode}
                onChange={setFormatCode}
                options={(product.formats ?? []).map((f) => ({
                  value: f.code,
                  label: `${f.size_mm} мм · ${f.thickness_mm} мм`,
                }))}
              />
            </Field>
          </div>
        </section>

        {/* Участки */}
        <section className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Участки</h3>
            <button
              type="button"
              onClick={() => setAreas((as) => [...as, newArea()])}
              className="rounded-lg bg-clinker px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-clinker-hover"
            >
              + Участок
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {areas.map((a, i) => (
              <div
                key={a.id}
                className="grid grid-cols-[auto_1fr_1fr_1fr_auto] items-end gap-2"
              >
                <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-graphite text-xs font-bold text-sand">
                  {i + 1}
                </span>
                <Field label="Название">
                  <TextField
                    value={a.name ?? ""}
                    onChange={(v) => patchArea(a.id, { name: v })}
                    placeholder="Терраса"
                  />
                </Field>
                <Field label="Длина, м">
                  <NumberField
                    value={a.length}
                    onChange={(v) => patchArea(a.id, { length: v })}
                  />
                </Field>
                <Field label="Ширина, м">
                  <NumberField
                    value={a.width}
                    onChange={(v) => patchArea(a.id, { width: v })}
                  />
                </Field>
                <div className="mb-1">
                  <IconButton
                    label="Удалить участок"
                    variant="danger"
                    disabled={areas.length <= 1}
                    onClick={() =>
                      setAreas((as) => as.filter((x) => x.id !== a.id))
                    }
                  >
                    🗑
                  </IconButton>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-sand-divider pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-stone">
                Вычеты (бассейн, клумба, колонна)
              </span>
              <button
                type="button"
                onClick={() => setDeductions((ds) => [...ds, newDeduction()])}
                className="rounded-lg border border-sand-divider px-3 py-1.5 text-sm font-medium text-stone transition hover:border-stone hover:text-ink"
              >
                + Вычет
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {deductions.map((d) => (
                <div
                  key={d.id}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2"
                >
                  <Field label="Форма">
                    <Select
                      value={d.shape}
                      onChange={(v) =>
                        patchDed(d.id, { shape: v as DeductionInput["shape"] })
                      }
                      options={[
                        { value: "rect", label: "Прямоуг." },
                        { value: "circle", label: "Круг" },
                      ]}
                    />
                  </Field>
                  {d.shape === "rect" ? (
                    <>
                      <Field label="Длина, м">
                        <NumberField
                          value={d.length ?? 0}
                          onChange={(v) => patchDed(d.id, { length: v })}
                        />
                      </Field>
                      <Field label="Ширина, м">
                        <NumberField
                          value={d.width ?? 0}
                          onChange={(v) => patchDed(d.id, { width: v })}
                        />
                      </Field>
                    </>
                  ) : (
                    <>
                      <Field label="Диаметр, м">
                        <NumberField
                          value={d.diameter ?? 0}
                          onChange={(v) => patchDed(d.id, { diameter: v })}
                        />
                      </Field>
                      <div />
                    </>
                  )}
                  <div className="mb-1">
                    <IconButton
                      label="Удалить вычет"
                      variant="danger"
                      onClick={() =>
                        setDeductions((ds) => ds.filter((x) => x.id !== d.id))
                      }
                    >
                      🗑
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Параметры укладки */}
        <section className="flex flex-col gap-4 rounded-card bg-white p-5 shadow-card">
          <h3 className="font-display text-lg font-bold">Укладка</h3>
          <Field label="Способ укладки">
            <Segmented
              value={method}
              onChange={setMethod}
              options={[
                { value: "glue", label: "На клей" },
                { value: "pedestals", label: "На опоры HILST" },
                { value: "gravel", label: "На гравий" },
              ]}
              size="sm"
            />
          </Field>
          {tooSmallForPedestals ? (
            <p className="rounded-lg bg-clinker/10 px-3 py-2 text-sm text-clinker">
              Для опор рекомендована плитка не менее {PEDESTAL_MIN_SIDE_MM}×
              {PEDESTAL_MIN_SIDE_MM} мм.
            </p>
          ) : null}
          <Field label="Раскладка (запас на подрез)">
            <Segmented
              value={layout}
              onChange={setLayout}
              options={[
                { value: "straight", label: "Прямая 5%" },
                { value: "offset", label: "Смещение 8%" },
                { value: "diagonal", label: "Диагональ 10%" },
                { value: "complex", label: "Сложная 12%" },
              ]}
              size="sm"
            />
          </Field>

          {method === "pedestals" ? (
            <Field label="Модель опоры HILST LIFT" hint="высота, мм · цена за шт">
              <Select
                value={pedestalCode}
                onChange={(code) => {
                  setPedestalCode(code);
                  const p = HILST_PEDESTALS.find((x) => x.code === code);
                  if (p) setPedestalPrice(p.price);
                }}
                options={HILST_PEDESTALS.map((p) => ({
                  value: p.code,
                  label: `${p.code} · ${p.heightMin}–${p.heightMax} мм · ${p.price} ₽`,
                }))}
              />
            </Field>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Цена за плиту, ₽" hint="из CMS, можно изменить">
              <NumberField
                value={pricePerPiece}
                onChange={setPricePerPiece}
              />
            </Field>
            {method === "pedestals" ? (
              <Field label="Цена опоры HILST, ₽" hint="из выбранной модели">
                <NumberField value={pedestalPrice} onChange={setPedestalPrice} />
              </Field>
            ) : null}
          </div>

          {method === "glue" ? (
            <>
              <Toggle
                checked={withMaterials}
                onChange={setWithMaterials}
                label="Считать сопутствующие материалы"
              />
              {withMaterials ? (
                <MaterialToggles value={materials} onChange={setMaterials} />
              ) : null}
            </>
          ) : null}
        </section>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        {result ? (
          <ResultPanel
            result={result}
            onSend={() =>
              onSend(
                calcSummary(result, {
                  article: `${product.brand} ${product.collection} ${format?.size_mm ?? ""}`.trim(),
                  extra:
                    `Укладка: ${
                      method === "glue"
                        ? "на клей"
                        : method === "pedestals"
                          ? `на опоры HILST (${pedestalCode})`
                          : "на гравий"
                    }, раскладка: ${
                      { straight: "прямая", offset: "со смещением", diagonal: "диагональ", complex: "сложная" }[layout]
                    }` +
                    areas
                      .map((a, i) => `\n  участок ${i + 1}${a.name ? ` «${a.name}»` : ""}: ${a.length}×${a.width} м`)
                      .join("") +
                    deductions
                      .map((d) =>
                        d.shape === "circle"
                          ? `\n  вычет: круг Ø${d.diameter} м`
                          : `\n  вычет: ${d.length}×${d.width} м`,
                      )
                      .join(""),
                  page: typeof window !== "undefined" ? window.location.href : undefined,
                }),
              )
            }
          />
        ) : null}
      </div>
    </div>
  );
}
