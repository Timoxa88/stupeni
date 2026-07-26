"use client";

import type { MaterialCode } from "@/lib/calculator";
import { FLOOR_MATS } from "@/lib/calculator";

/** Тумблеры сопутствующих материалов (ТЗ §9.3). */
export function MaterialToggles({
  value,
  onChange,
}: {
  value: Partial<Record<MaterialCode, boolean>>;
  onChange: (v: Partial<Record<MaterialCode, boolean>>) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-stone">
        Сопутствующие материалы
      </div>
      <div className="flex flex-wrap gap-2">
        {FLOOR_MATS.map((m) => {
          const on = value[m.code] ?? false;
          return (
            <button
              key={m.code}
              type="button"
              onClick={() => onChange({ ...value, [m.code]: !on })}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                on
                  ? "border-olive bg-olive/10 text-olive"
                  : "border-sand-divider text-stone hover:border-stone"
              }`}
              aria-pressed={on}
            >
              {on ? "✓ " : ""}
              {m.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
