"use client";

import { useId } from "react";
import type { City } from "@/lib/calculator";
import { Modal } from "@/components/ui/Modal";
import { LeadForm } from "@/components/forms/LeadForm";

/** Сбор контакта и отправка расчёта менеджеру (ТЗ §9.4, §12). Доступный диалог. */
export function LeadModal({
  summary,
  city,
  onClose,
}: {
  summary: string;
  city: City;
  onClose: () => void;
}) {
  const titleId = useId();
  return (
    <Modal onClose={onClose} labelledBy={titleId}>
      <div className="flex items-start justify-between gap-3">
        <h3 id={titleId} className="font-display text-xl font-bold text-ink">
          Отправить расчёт менеджеру
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 text-stone transition hover:text-ink"
        >
          ✕
        </button>
      </div>
      <p className="mt-1 text-sm text-stone">{summary}</p>
      <div className="mt-4">
        <LeadForm
          tag="Расчёт"
          submitLabel="Отправить расчёт"
          comment={summary}
          city={city}
        />
      </div>
    </Modal>
  );
}
