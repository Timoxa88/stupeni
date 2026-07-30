"use client";

import { useId, useState } from "react";
import { LeadForm } from "@/components/forms/LeadForm";
import { Modal } from "@/components/ui/Modal";
import { SERVICES, type Service } from "@/lib/content/services";

/** `items` — услуги из мини-CMS (админка), дефолт — из кода. */
export function ServicesGrid({ items = SERVICES }: { items?: Service[] }) {
  const [active, setActive] = useState<Service | null>(null);
  const titleId = useId();

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <div
            key={s.tag}
            className="flex flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
          >
            <h3 className="font-display text-lg font-bold text-ink">{s.title}</h3>
            <p className="mt-2 flex-1 text-sm text-stone">{s.desc}</p>
            <button
              type="button"
              onClick={() => setActive(s)}
              className="mt-5 inline-flex w-fit items-center gap-1.5 font-semibold text-clinker transition hover:gap-2.5"
            >
              Оставить заявку →
            </button>
          </div>
        ))}
      </div>

      {active ? (
        <Modal onClose={() => setActive(null)} labelledBy={titleId}>
          <h3 id={titleId} className="font-display text-xl font-bold text-ink">
            {active.title}
          </h3>
          <p className="mt-1 text-sm text-stone">{active.desc}</p>
          <div className="mt-4">
            <LeadForm
              tag={active.tag}
              source="service"
              data={{ service: active.title }}
              submitLabel="Отправить заявку"
              fields={["comment"]}
              comment={`Услуга: ${active.title}`}
            />
          </div>
        </Modal>
      ) : null}
    </>
  );
}
