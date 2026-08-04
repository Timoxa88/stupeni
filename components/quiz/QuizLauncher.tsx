"use client";

import { useCallback, useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { CatalogQuiz } from "@/components/quiz/CatalogQuiz";
import { withBase } from "@/lib/base";
import type { QuizData } from "@/lib/quiz/types";

/**
 * Данные квиза одни на всю вкладку: открыл в каталоге, закрыл, открыл на
 * карточке — запрос уходит один раз. Кэш в модуле, а не в состоянии, чтобы
 * переживать размонтирование кнопки при переходах.
 */
let cache: QuizData | null = null;
let inflight: Promise<QuizData> | null = null;

function loadQuiz(): Promise<QuizData> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch(withBase("/api/quiz"))
      .then((r) => {
        if (!r.ok) throw new Error(`quiz ${r.status}`);
        return r.json() as Promise<QuizData>;
      })
      .then((d) => {
        cache = d;
        return d;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/**
 * Кнопка «Подобрать» на страницах каталога: открывает квиз модалкой.
 *
 * Шаги и картинки приезжают по /api/quiz в момент первого открытия — страницы
 * каталога от квиза не тяжелеют (см. комментарий в app/api/quiz/route.ts).
 */
export function QuizLauncher({
  label = "Подобрать за минуту",
  app,
  context,
  variant = "solid",
  className = "",
}: {
  label?: string;
  /** Сценарий страницы (kryltso, terrasa…) — первый шаг будет отвечен заранее. */
  app?: string;
  /** Что за страница (коллекция, бренд) — уходит в CRM. */
  context?: string;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<QuizData | null>(cache);
  const [failed, setFailed] = useState(false);
  const titleId = useId();

  const openQuiz = useCallback(() => {
    setOpen(true);
    setFailed(false);
    if (!cache) {
      loadQuiz()
        .then(setData)
        .catch(() => setFailed(true));
    } else {
      setData(cache);
    }
  }, []);

  const styles: Record<string, string> = {
    solid:
      "sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover",
    outline:
      "rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10",
    ghost:
      "rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:border-clinker hover:text-clinker",
  };

  return (
    <>
      <button
        type="button"
        onClick={openQuiz}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${styles[variant]} ${className}`}
      >
        {label}
      </button>

      {open ? (
        <Modal
          onClose={() => setOpen(false)}
          labelledBy={titleId}
          className="max-h-[90vh] max-w-4xl overflow-y-auto"
        >
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="-mr-2 -mt-2 rounded-full p-2 text-2xl leading-none text-stone transition hover:bg-sand-deep hover:text-ink"
            >
              ×
            </button>
          </div>
          {data ? (
            <CatalogQuiz
              data={data}
              initialApp={app}
              context={context}
              titleId={titleId}
              onClose={() => setOpen(false)}
            />
          ) : failed ? (
            <p id={titleId} className="py-8 text-center text-stone">
              Не удалось загрузить подбор. Обновите страницу или позвоните нам — подберём
              вручную.
            </p>
          ) : (
            <p id={titleId} className="py-8 text-center text-stone">
              Загружаем подбор…
            </p>
          )}
        </Modal>
      ) : null}
    </>
  );
}
