"use client";

import { useState } from "react";
import type { City } from "@/lib/calculator";
import { Segmented } from "@/components/ui/controls";
import { ModeAForm, type ModeAPreset } from "./ModeAForm";
import { ModeBForm, type ModeBPreset } from "./ModeBForm";
import { LeadModal } from "./LeadModal";

/**
 * Пресеты стартовых сценариев: один тап предзаполняет форму типовым объектом,
 * дальше человек только правит числа. Порог входа в «форму на 25 полей»
 * падает почти до нуля, при этом все поля остаются доступны.
 */
const PRESETS: {
  key: string;
  label: string;
  mode: "A" | "B";
  a?: Omit<ModeAPreset, "nonce">;
  b?: Omit<ModeBPreset, "nonce">;
}[] = [
  { key: "kryltso", label: "Типовое крыльцо · 3 ступени", mode: "A", a: { steps: 3, width: 1.2 } },
  { key: "lestnitsa", label: "Уличная лестница · 15 ступеней", mode: "A", a: { steps: 15, width: 1.2 } },
  { key: "terrasa", label: "Терраса · 20 м²", mode: "B", b: { length: 5, width: 4 } },
];

export function Calculator({
  initialMode = "A",
  initialProductId,
}: {
  initialMode?: "A" | "B";
  /** Диплинк из каталога (?product=): артикул уже выбран за пользователя. */
  initialProductId?: string;
}) {
  const [mode, setMode] = useState<"A" | "B">(initialMode);
  const [city, setCity] = useState<City>("msk");
  const [lead, setLead] = useState<string | null>(null);
  const [presetA, setPresetA] = useState<ModeAPreset | null>(null);
  const [presetB, setPresetB] = useState<ModeBPreset | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setMode(p.mode);
    setActivePreset(p.key);
    if (p.mode === "A" && p.a) setPresetA({ ...p.a, nonce: Date.now() });
    if (p.mode === "B" && p.b) setPresetB({ ...p.b, nonce: Date.now() });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          value={mode}
          onChange={(m) => {
            setMode(m);
            setActivePreset(null);
          }}
          options={[
            { value: "A", label: "Лестница / крыльцо" },
            { value: "B", label: "Терраса / площадка" },
          ]}
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone">Город:</span>
          <Segmented
            value={city}
            onChange={setCity}
            options={[
              { value: "msk", label: "Москва" },
              { value: "spb", label: "Санкт-Петербург" },
            ]}
            size="sm"
          />
        </div>
      </div>

      {/* Быстрый старт */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-stone/80">Быстрый старт:</span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activePreset === p.key
                ? "border-clinker bg-clinker/10 text-clinker"
                : "border-ink/12 bg-white text-ink hover:border-clinker hover:text-clinker"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {mode === "A" ? (
        <ModeAForm
          city={city}
          onSend={setLead}
          initialProductId={initialProductId}
          preset={presetA}
        />
      ) : (
        <ModeBForm
          city={city}
          onSend={setLead}
          initialProductId={initialProductId}
          preset={presetB}
        />
      )}

      {lead ? (
        <LeadModal summary={lead} city={city} onClose={() => setLead(null)} />
      ) : null}
    </div>
  );
}
