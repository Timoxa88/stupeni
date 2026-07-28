"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  calcModeA,
  type BaseTileSize,
  type City,
  type MarchInput,
  type MaterialCode,
  type StepElementPrices,
} from "@/lib/calculator";
import {
  baseTileLabel,
  stepAvailability,
  toBasePerSqm,
  toStepGeometry,
  toStepPallets,
  toStepPrices,
  toStepWeights,
} from "@/lib/catalog/adapters";
import { getStepProducts } from "@/lib/catalog/seed";
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

const products = getStepProducts();
let uid = 0;
const newMarch = (): MarchInput => ({
  id: `m${++uid}`,
  name: "",
  steps: 3,
  width: 1.2,
  treadDepth: 0.3,
  riserHeight: 0.15,
  externalCorners: 2,
});

export function ModeAForm({
  city,
  onSend,
}: {
  city: City;
  onSend: (summary: string) => void;
}) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const product = products.find((p) => p.id === productId) ?? products[0];

  const [marches, setMarches] = useState<MarchInput[]>([newMarch()]);
  const [cladRisers, setCladRisers] = useState(true);
  const [cladSides, setCladSides] = useState(true);
  const [platformOn, setPlatformOn] = useState(true);
  const [platform, setPlatform] = useState({ length: 1.5, width: 1.2 });
  const [baseTileSize, setBaseTileSize] = useState<BaseTileSize>("30x30");
  const [prices, setPrices] = useState<StepElementPrices>(toStepPrices(product));
  const [materials, setMaterials] = useState<Partial<Record<MaterialCode, boolean>>>(
    { glue: true, grout: true, primer: false, waterproofing: false },
  );

  const avail = stepAvailability(product);
  // Норма базовой плитки — из артикула; переключатель 30×30/30×60 остаётся только
  // для артикулов, у которых нормы нет (ТЗ §8.3).
  const articleBasePerSqm = toBasePerSqm(product);
  const articleBaseLabel = baseTileLabel(product);

  // Цены переинициализируются при смене артикула (подставляются из CMS).
  useEffect(() => {
    setPrices(toStepPrices(product));
  }, [product]);

  // INP (ТЗ B.5): марши/площадка/цены вводятся мгновенно, тяжёлый поэлементный
  // пересчёт (самый тяжёлый — Режим A с несколькими маршами) идёт от отложенных
  // значений и не блокирует отклик ввода.
  const dMarches = useDeferredValue(marches);
  const dPlatform = useDeferredValue(platform);
  const dPrices = useDeferredValue(prices);

  const result = useMemo(
    () =>
      calcModeA({
        city,
        marches: dMarches,
        cladRisers: cladRisers && avail.hasRisers,
        cladSides: cladSides && avail.hasPlinth,
        platform: platformOn && avail.hasBase ? dPlatform : undefined,
        baseTileSize,
        basePerSqm: articleBasePerSqm,
        geometry: toStepGeometry(product),
        prices: dPrices,
        weights: toStepWeights(product),
        pallets: toStepPallets(product),
        materials,
      }),
    [
      city,
      dMarches,
      cladRisers,
      cladSides,
      platformOn,
      dPlatform,
      baseTileSize,
      articleBasePerSqm,
      product,
      dPrices,
      materials,
      avail.hasRisers,
      avail.hasPlinth,
      avail.hasBase,
    ],
  );

  const patchMarch = (id: string, patch: Partial<MarchInput>) =>
    setMarches((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col gap-6">
        {/* Артикул */}
        <section className="rounded-card bg-white p-5 shadow-card">
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
          <div className="mt-4">
            {articleBasePerSqm ? (
              <Field label="Базовая плитка площадки" hint="формат и норма — из артикула">
                <div className="rounded-lg border border-sand-divider bg-sand/40 px-3 py-2 text-sm text-ink">
                  {articleBaseLabel} ·{" "}
                  <span className="tabular">{articleBasePerSqm.toFixed(2)}</span> шт/м²
                </div>
              </Field>
            ) : (
              <Field label="Размер базовой плитки площадки">
                <Segmented
                  value={baseTileSize}
                  onChange={setBaseTileSize}
                  options={[
                    { value: "30x30", label: "30×30 (11.11 шт/м²)" },
                    { value: "30x60", label: "30×60 (5.56 шт/м²)" },
                  ]}
                  size="sm"
                />
              </Field>
            )}
          </div>
        </section>

        {/* Марши */}
        <section className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Лестничные марши</h3>
            <button
              type="button"
              onClick={() => setMarches((ms) => [...ms, newMarch()])}
              className="rounded-lg bg-clinker px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-clinker-hover"
            >
              + Добавить марш
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {marches.map((m, i) => (
              <div
                key={m.id}
                className="rounded-xl border border-sand-divider p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-graphite text-xs font-bold text-sand">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <TextField
                      value={m.name ?? ""}
                      onChange={(v) => patchMarch(m.id, { name: v })}
                      placeholder="Название (напр. «Крыльцо»)"
                    />
                  </div>
                  <IconButton
                    label="Удалить марш"
                    variant="danger"
                    disabled={marches.length <= 1}
                    onClick={() =>
                      setMarches((ms) => ms.filter((x) => x.id !== m.id))
                    }
                  >
                    −
                  </IconButton>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Field label="Ступеней, N">
                    <NumberField
                      value={m.steps}
                      onChange={(v) => patchMarch(m.id, { steps: v })}
                      step={1}
                    />
                  </Field>
                  <Field label="Ширина W, м">
                    <NumberField
                      value={m.width}
                      onChange={(v) => patchMarch(m.id, { width: v })}
                    />
                  </Field>
                  <Field label="Глубина d, м">
                    <NumberField
                      value={m.treadDepth}
                      onChange={(v) => patchMarch(m.id, { treadDepth: v })}
                    />
                  </Field>
                  <Field label="Высота h, м">
                    <NumberField
                      value={m.riserHeight}
                      onChange={(v) => patchMarch(m.id, { riserHeight: v })}
                    />
                  </Field>
                  <Field label="Внешних углов">
                    <Select
                      value={String(m.externalCorners) as "0" | "1" | "2"}
                      onChange={(v) =>
                        patchMarch(m.id, {
                          externalCorners: Number(v) as 0 | 1 | 2,
                        })
                      }
                      options={[
                        { value: "0", label: "0" },
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                      ]}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Параметры облицовки */}
        <section className="flex flex-col gap-4 rounded-card bg-white p-5 shadow-card">
          <h3 className="font-display text-lg font-bold">Что облицовываем</h3>
          {avail.hasRisers ? (
            <Toggle
              checked={cladRisers}
              onChange={setCladRisers}
              label="Облицовывать подступёнки"
            />
          ) : null}
          {avail.hasPlinth ? (
            <Toggle
              checked={cladSides}
              onChange={setCladSides}
              label="Боковины марша (плинтус)"
            />
          ) : null}
          {avail.hasBase ? (
            <Toggle
              checked={platformOn}
              onChange={setPlatformOn}
              label="Верхняя площадка (базовая плитка)"
            />
          ) : null}
          {platformOn && avail.hasBase ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Площадка: длина, м">
                <NumberField
                  value={platform.length}
                  onChange={(v) => setPlatform((p) => ({ ...p, length: v }))}
                />
              </Field>
              <Field label="Площадка: ширина, м">
                <NumberField
                  value={platform.width}
                  onChange={(v) => setPlatform((p) => ({ ...p, width: v }))}
                />
              </Field>
            </div>
          ) : null}
          <MaterialToggles value={materials} onChange={setMaterials} />
        </section>

        {/* Редактируемые цены */}
        <section className="rounded-card bg-white p-5 shadow-card">
          <h3 className="mb-3 font-display text-lg font-bold">
            Цены за элемент, ₽
            <span className="ml-2 text-sm font-normal text-stone">
              из CMS, можно изменить
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Фронтальная">
              <NumberField
                value={prices.front}
                onChange={(v) => setPrices((p) => ({ ...p, front: v }))}
              />
            </Field>
            {avail.hasCorners ? (
              <Field label="Угловая L/R">
                <NumberField
                  value={prices.corner}
                  onChange={(v) => setPrices((p) => ({ ...p, corner: v }))}
                />
              </Field>
            ) : null}
            {avail.hasRisers ? (
              <Field label="Подступёнок">
                <NumberField
                  value={prices.riser}
                  onChange={(v) => setPrices((p) => ({ ...p, riser: v }))}
                />
              </Field>
            ) : null}
            {avail.hasBase ? (
              <Field label="Базовая плитка">
                <NumberField
                  value={prices.base}
                  onChange={(v) => setPrices((p) => ({ ...p, base: v }))}
                />
              </Field>
            ) : null}
            {avail.hasPlinth ? (
              <Field label="Плинтус">
                <NumberField
                  value={prices.plinth}
                  onChange={(v) => setPrices((p) => ({ ...p, plinth: v }))}
                />
              </Field>
            ) : null}
          </div>
        </section>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultPanel
          result={result}
          onSend={() =>
            onSend(
              calcSummary(result, {
                article: `${product.brand} ${product.collection}`,
                extra:
                  `Маршей: ${marches.length}` +
                  marches
                    .map(
                      (m, i) =>
                        `\n  марш ${i + 1}${m.name ? ` «${m.name}»` : ""}: ${m.steps} ступ., ` +
                        `ширина ${m.width} м, проступь ${m.treadDepth} м, подступёнок ${m.riserHeight} м, ` +
                        `внешних углов ${m.externalCorners}`,
                    )
                    .join("") +
                  (platformOn && avail.hasBase
                    ? `\n  площадка: ${platform.length}×${platform.width} м`
                    : ""),
                page: typeof window !== "undefined" ? window.location.href : undefined,
              }),
            )
          }
        />
      </div>
    </div>
  );
}
