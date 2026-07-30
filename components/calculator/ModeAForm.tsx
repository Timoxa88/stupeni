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
  baseTileOptions,
  stepAvailability,
  stepTypeOptions,
  toBasePerSqm,
  toStepGeometry,
  toStepPallets,
  toStepPrices,
  toStepWeights,
  type StepFrontType,
} from "@/lib/catalog/adapters";
import { getStepProducts } from "@/lib/catalog/seed";
import {
  Field,
  IconButton,
  NumberField,
  Segmented,
  TextField,
  Toggle,
  Select,
} from "@/components/ui/controls";
import { Disclosure } from "@/components/ui/Disclosure";
import { calcSummary } from "@/lib/calculator/summary";
import { formatRub } from "@/lib/format";
import { ResultPanel } from "./ResultPanel";
import { MaterialToggles } from "./MaterialToggles";
import { ArticlePicker } from "./ArticlePicker";
import { StairDiagram } from "./Diagrams";

/** Предзаполнение из чипа «Быстрый старт» (см. Calculator). */
export interface ModeAPreset {
  steps: number;
  width: number;
  nonce: number;
}

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
  initialProductId,
  preset,
}: {
  city: City;
  onSend: (summary: string) => void;
  initialProductId?: string;
  preset?: ModeAPreset | null;
}) {
  const [productId, setProductId] = useState(
    initialProductId && products.some((p) => p.id === initialProductId)
      ? initialProductId
      : (products[0]?.id ?? ""),
  );
  const product = products.find((p) => p.id === productId) ?? products[0];

  // Исполнение фронтальной ступени: у Paradyz коллекции обычно выпускают обе —
  // с капиносом (готовая кромка) и с насечками (простая плитка с рифлением);
  // это разные цена, длина кромки и вес. Переключатель виден, где есть выбор.
  const typeOptions = stepTypeOptions(product);
  const [stepType, setStepType] = useState<StepFrontType | undefined>(
    typeOptions[0]?.value,
  );
  const activeStepType = typeOptions.some((o) => o.value === stepType)
    ? stepType
    : typeOptions[0]?.value;

  const [marches, setMarches] = useState<MarchInput[]>([newMarch()]);
  const [cladRisers, setCladRisers] = useState(true);
  const [cladSides, setCladSides] = useState(true);
  const [platformOn, setPlatformOn] = useState(true);
  const [platform, setPlatform] = useState({ length: 1.5, width: 1.2 });
  const [baseTileSize, setBaseTileSize] = useState<BaseTileSize>("30x30");
  // Формат напольной плитки артикула («300x300x8.5» / «600x300x8.5»). У Paradyz
  // почти вся линейка выпускается в двух форматах, и это разные цена и норма.
  const baseOptions = baseTileOptions(product);
  const [baseSizeMm, setBaseSizeMm] = useState<string | undefined>(baseOptions[0]?.value);
  const activeBaseSize = baseOptions.some((o) => o.value === baseSizeMm)
    ? baseSizeMm
    : baseOptions[0]?.value;
  const [prices, setPrices] = useState<StepElementPrices>(toStepPrices(product));
  const [materials, setMaterials] = useState<Partial<Record<MaterialCode, boolean>>>(
    { glue: true, grout: true, primer: false, waterproofing: false },
  );

  // Чип «Быстрый старт» перезаполняет марши типовым объектом.
  useEffect(() => {
    if (!preset) return;
    setMarches([{ ...newMarch(), steps: preset.steps, width: preset.width }]);
  }, [preset]);

  const avail = stepAvailability(product);
  // Норма базовой плитки — из артикула; переключатель 30×30/30×60 остаётся только
  // для артикулов, у которых нормы нет (ТЗ §8.3).
  const articleBasePerSqm = toBasePerSqm(product, activeBaseSize);
  const articleBaseLabel = baseTileLabel(product, activeBaseSize);

  // Цены переинициализируются при смене артикула, формата плитки и типа
  // ступени (подставляются из CMS).
  useEffect(() => {
    setPrices(toStepPrices(product, activeBaseSize, activeStepType));
  }, [product, activeBaseSize, activeStepType]);

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
        geometry: toStepGeometry(product, activeStepType),
        prices: dPrices,
        weights: toStepWeights(product, activeBaseSize, activeStepType),
        pallets: toStepPallets(product, activeBaseSize, activeStepType),
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
      activeBaseSize,
      activeStepType,
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
        {/* Артикул: бренд → коллекция → цвет */}
        <section className="rounded-card bg-white p-5 shadow-card">
          <ArticlePicker products={products} value={productId} onChange={setProductId} />
          {typeOptions.length > 1 ? (
            <div className="mt-4">
              <Field
                label="Тип ступени"
                hint={
                  activeStepType === "front"
                    ? "готовая кромка с выступающим носиком"
                    : "простая плитка с противоскользящим рифлением"
                }
              >
                <Segmented
                  value={activeStepType ?? ""}
                  onChange={(v) => setStepType(v as StepFrontType)}
                  options={typeOptions}
                  size="sm"
                />
              </Field>
            </div>
          ) : null}
          <div className="mt-4">
            {baseOptions.length > 1 ? (
              // У артикула есть оба формата — выбирает пользователь, а норма и
              // цена подтягиваются из выбранного элемента, а не из общей таблицы.
              <Field
                label="Базовая плитка площадки"
                hint={
                  articleBasePerSqm
                    ? `${articleBasePerSqm.toFixed(2)} шт/м² — из артикула`
                    : "формат из артикула"
                }
              >
                <Segmented
                  value={activeBaseSize ?? ""}
                  onChange={setBaseSizeMm}
                  options={baseOptions}
                  size="sm"
                />
              </Field>
            ) : articleBasePerSqm ? (
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

          {/* Схема объясняет буквы полей — форма понятна без знания терминов */}
          <StairDiagram className="mb-4 rounded-xl border border-sand-divider bg-sand/30 p-3" />

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
                {/* На виду — два поля, которые знает каждый: сколько ступеней и
                    какой ширины. Проступь/подступёнок/углы — стандартные размеры
                    под раскрытием, дефолты корректны для типовой лестницы. */}
                <div className="grid grid-cols-2 gap-3">
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
                </div>
                <div className="mt-3">
                  <Disclosure
                    variant="inline"
                    title="Уточнить размеры"
                    hint={`проступь ${m.treadDepth} м · подступёнок ${m.riserHeight} м · углов ${m.externalCorners}`}
                  >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                  </Disclosure>
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

        {/* Редактируемые цены — инструмент сметчика, 95% посетителей их не
            трогают; свёрнуты в строку, функция на месте. */}
        <Disclosure
          title="Цены за элемент, ₽"
          hint={`из прайса: фронтальная ${formatRub(prices.front)} · можно изменить`}
        >
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
        </Disclosure>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultPanel
          result={result}
          onSend={() =>
            onSend(
              calcSummary(result, {
                article:
                  `${product.brand} ${product.collection}` +
                  (typeOptions.length > 1
                    ? `, ступень ${activeStepType === "front" ? "с капиносом" : "с насечками"}`
                    : ""),
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
