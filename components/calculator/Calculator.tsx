"use client";

import { useState } from "react";
import type { City } from "@/lib/calculator";
import { Segmented } from "@/components/ui/controls";
import { ModeAForm } from "./ModeAForm";
import { ModeBForm } from "./ModeBForm";
import { LeadModal } from "./LeadModal";

export function Calculator({ initialMode = "A" }: { initialMode?: "A" | "B" }) {
  const [mode, setMode] = useState<"A" | "B">(initialMode);
  const [city, setCity] = useState<City>("msk");
  const [lead, setLead] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          value={mode}
          onChange={setMode}
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

      {mode === "A" ? (
        <ModeAForm city={city} onSend={setLead} />
      ) : (
        <ModeBForm city={city} onSend={setLead} />
      )}

      {lead ? (
        <LeadModal summary={lead} city={city} onClose={() => setLead(null)} />
      ) : null}
    </div>
  );
}
