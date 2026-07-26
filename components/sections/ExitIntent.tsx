"use client";

import { useEffect, useId, useState } from "react";
import { LeadForm } from "@/components/forms/LeadForm";
import { Modal } from "@/components/ui/Modal";

/**
 * Exit-intent поп-ап (ТЗ §6 блок 23): десктоп — движение к закрытию вкладки;
 * мобильный — через 40 сек. Один раз за сессию. Оффер — лид-магнит «каталог/прайс».
 */
export function ExitIntent({ catalogUrl = "/docs/demo-catalog.pdf" }: { catalogUrl?: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("exit-intent-shown")) return;

    const trigger = () => {
      if (sessionStorage.getItem("exit-intent-shown")) return;
      sessionStorage.setItem("exit-intent-shown", "1");
      setOpen(true);
    };

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isTouch) {
      timer = setTimeout(trigger, 40_000);
    } else {
      document.addEventListener("mouseout", onLeave);
    }

    return () => {
      document.removeEventListener("mouseout", onLeave);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!open) return null;

  return (
    <Modal onClose={() => setOpen(false)} labelledBy={titleId} className="max-w-lg">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Закрыть"
          className="absolute -right-1 -top-1 grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-stone transition hover:text-ink"
        >
          ✕
        </button>
        <p className="eyebrow text-clinker">Не уходите без каталога</p>
        <h3 id={titleId} className="mt-3 font-display text-2xl font-extrabold text-ink">
          Пришлём PDF-каталог и прайс + подбор за 5 минут
        </h3>
        <p className="mt-2 text-stone">
          Оставьте контакт — отправим актуальный каталог коллекций с ценами и поможем
          с подбором под ваш объект.
        </p>
        <div className="mt-5">
          <LeadForm
            tag="Каталог/прайс"
            submitLabel="Получить каталог"
            downloadUrl={catalogUrl}
            successText="Спасибо! Каталог и прайс — по кнопке ниже, подбор пришлём отдельно."
          />
        </div>
      </div>
    </Modal>
  );
}
