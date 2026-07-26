"use client";

import { useMemo, useState } from "react";
import { Img as Image } from "@/components/ui/Img";
import { MAP_OBJECTS, type MapObject } from "@/lib/content/map";

/**
 * Карта объектов (ТЗ §6 блок 13, §11.3). Маркеры позиционируются по координатам;
 * клик открывает попап (фото/город/бренд/год). Фильтр по типу.
 * В проде слой карты заменяется Яндекс.Картами API на тех же данных MAP_OBJECTS.
 */
export function ObjectsMap() {
  const [filter, setFilter] = useState<"all" | "steps" | "terrace">("all");
  const [active, setActive] = useState<MapObject | null>(null);

  const bounds = useMemo(() => {
    const lats = MAP_OBJECTS.map((o) => o.coords[0]);
    const lons = MAP_OBJECTS.map((o) => o.coords[1]);
    return {
      latMin: Math.min(...lats),
      latMax: Math.max(...lats),
      lonMin: Math.min(...lons),
      lonMax: Math.max(...lons),
    };
  }, []);

  const pos = (o: MapObject) => {
    const x = 8 + ((o.coords[1] - bounds.lonMin) / (bounds.lonMax - bounds.lonMin || 1)) * 84;
    const y = 8 + ((bounds.latMax - o.coords[0]) / (bounds.latMax - bounds.latMin || 1)) * 84;
    return { left: `${x}%`, top: `${y}%` };
  };

  const visible = MAP_OBJECTS.filter((o) => (filter === "all" ? true : o.type === filter));

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-clinker">География</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Карта объектов
          </h2>
        </div>
        <div className="inline-flex flex-wrap gap-1 rounded-full border border-ink/10 bg-white p-1">
          {(
            [
              ["all", "Все"],
              ["steps", "Ступени"],
              ["terrace", "Террасы"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              aria-pressed={filter === k}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === k ? "bg-ink text-sand" : "text-stone hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Слой карты с маркерами */}
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-card border border-ink/10 bg-graphite-deep"
          role="group"
          aria-label="Карта объектов"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(243,241,236,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,241,236,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          {visible.map((o) => {
            const isActive = active?.id === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setActive(o)}
                aria-label={`${o.city} — ${o.brand} ${o.article}, ${o.year}`}
                style={pos(o)}
                className="absolute -translate-x-1/2 -translate-y-full"
              >
                <span
                  className={`block h-4 w-4 rounded-full border-2 border-white transition ${
                    isActive ? "scale-150 bg-clinker-bright" : "bg-clinker hover:scale-125"
                  }`}
                  style={{ boxShadow: "0 6px 14px -4px rgba(0,0,0,0.6)" }}
                />
              </button>
            );
          })}
          <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-sand/40">
            Маркеры реализованных объектов
          </span>
        </div>

        {/* Попап / список */}
        <div className="rounded-card border border-ink/10 bg-white p-5 shadow-card">
          {active ? (
            <div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                <Image src={active.photo} alt={`${active.brand} ${active.article}`} fill sizes="(max-width:1024px) 100vw, 33vw" className="img-rich object-cover" />
              </div>
              <div className="mt-3 font-display text-lg font-bold text-ink">{active.city}</div>
              <div className="text-stone">
                {active.brand} · {active.article}
              </div>
              <div className="text-sm text-stone/70">
                {active.type === "steps" ? "Ступени" : "Терраса"} · {active.year}
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="mt-4 text-sm font-semibold text-clinker"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <div>
              <p className="text-stone">Нажмите на маркер, чтобы посмотреть объект.</p>
              <ul className="mt-4 space-y-2">
                {visible.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => setActive(o)}
                      className="text-left text-sm font-semibold text-ink transition hover:text-clinker"
                    >
                      {o.city} — {o.brand} {o.article} ({o.year})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
