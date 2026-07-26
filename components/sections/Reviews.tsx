"use client";

import { useState } from "react";
import { Img as Image } from "@/components/ui/Img";
import { REVIEWS } from "@/lib/content/reviews";

/** Отзывы: фильтр-таб частники / профи (ТЗ §6 блок 17). */
export function Reviews() {
  const [tab, setTab] = useState<"all" | "private" | "pro">("all");
  const list = REVIEWS.filter((r) => (tab === "all" ? true : r.type === tab));

  const tabs: { key: typeof tab; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "private", label: "Частные клиенты" },
    { key: "pro", label: "Подрядчики и дизайнеры" },
  ];

  return (
    <section className="bg-sand-deep">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <p className="eyebrow text-clinker">Отзывы</p>
        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Нам доверяют
          </h2>
          <div className="inline-flex flex-wrap gap-1 rounded-full border border-ink/10 bg-white p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-pressed={tab === t.key}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === t.key ? "bg-ink text-sand" : "text-stone hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <figure
              key={r.name + r.text.slice(0, 12)}
              className="flex flex-col overflow-hidden rounded-card border border-ink/10 bg-white shadow-card"
            >
              {r.photo ? (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={r.photo} alt={`Объект — ${r.name}`} fill sizes="(max-width:768px) 100vw, 33vw" loading="lazy" className="img-rich object-cover" />
                </div>
              ) : null}
              <blockquote className="flex flex-1 flex-col p-6">
                <p className="flex-1 text-stone">«{r.text}»</p>
                <figcaption className="mt-4">
                  <div className="font-display font-bold text-ink">{r.name}</div>
                  <div className="text-sm text-stone/70">
                    {r.role ? `${r.role} · ` : ""}
                    {r.city}
                    {r.source ? ` · ${r.source}` : ""}
                  </div>
                </figcaption>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
