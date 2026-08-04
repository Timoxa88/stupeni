"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Img as Image } from "@/components/ui/Img";
import { LeadForm } from "@/components/forms/LeadForm";
import { productHref } from "@/lib/catalog/hrefs";
import { formatRub } from "@/lib/format";
import type { QuizData, QuizOption, QuizPoolItem } from "@/lib/quiz/types";

/** Короткая подпись ответа в сводке для CRM. */
const SUMMARY_LABELS: Record<string, string> = {
  app: "Объект",
  element: "Элементы",
  color: "Цвет",
  volume: "Объём",
  conditions: "Условия",
  role: "Статус",
};

/** Пауза перед автопереходом: выбор должен успеть подсветиться. */
const AUTO_ADVANCE_MS = 220;

function recommend(pool: QuizPoolItem[], answers: Record<string, string>): QuizPoolItem[] {
  const stepElements = ["front", "front_notch", "corner", "riser"];
  const wantSteps = stepElements.includes(answers.element ?? "");

  // Фильтры снимаются по одному, от менее важного к более важному: пустая
  // подборка после квиза выглядит хуже, чем подборка «почти по запросу».
  const stages: ((p: QuizPoolItem) => boolean)[][] = [
    [
      (p) => (answers.app ? p.apps.includes(answers.app) : true),
      (p) => (answers.color ? p.color === answers.color : true),
      (p) => (wantSteps ? p.type === "step_system" : true),
    ],
    [
      (p) => (answers.app ? p.apps.includes(answers.app) : true),
      (p) => (wantSteps ? p.type === "step_system" : true),
    ],
    [(p) => (answers.app ? p.apps.includes(answers.app) : true)],
    [],
  ];
  for (const stage of stages) {
    const hit = pool.filter((p) => stage.every((f) => f(p)) && p.photo);
    if (hit.length >= 3) return hit.slice(0, 3);
    if (hit.length > 0 && stage.length <= 1) return hit.slice(0, 3);
  }
  return pool.slice(0, 3);
}

/**
 * Квиз-подбор в стиле карточного опроса: вопрос — плитки с реальными фото —
 * автопереход к следующему шагу. Последний шаг — контакты (LeadForm со всей
 * валидацией и согласием 152-ФЗ), после отправки показываем подборку.
 *
 * Работает и в модалке (каталог), и врезкой в страницу — разница только
 * в обрамлении, поэтому обёртку задаёт вызывающий код.
 */
export function CatalogQuiz({
  data,
  initialApp,
  eyebrow = "Подбор ступеней и керамогранита",
  context,
  titleId,
  onClose,
  tag = "Квиз в каталоге",
  source = "quiz-catalog",
}: {
  data: QuizData;
  /** Сценарий со страницы каталога — шаг 1 отвечен заранее. */
  initialApp?: string;
  eyebrow?: string;
  /** Откуда открыли (коллекция, бренд) — уходит в CRM отдельной строкой. */
  context?: string;
  titleId?: string;
  onClose?: () => void;
  /** Метка заявки и слаг формы: модалка каталога и страница /podbor различаются. */
  tag?: string;
  source?: string;
}) {
  const { steps, pool } = data;
  const total = steps.length + 1; // + шаг контактов

  const preset = useMemo<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    // Предзаполняем шаг 1, только если такой сценарий в квизе действительно есть.
    if (initialApp && steps[0]?.options.some((o) => o.value === initialApp)) {
      out.app = initialApp;
    }
    return out;
  }, [initialApp, steps]);

  const [idx, setIdx] = useState(preset.app ? 1 : 0);
  const [answers, setAnswers] = useState<Record<string, string>>(preset);
  const [volumeNote, setVolumeNote] = useState("");
  const [sent, setSent] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const step = steps[idx];
  const onContacts = idx >= steps.length;

  function go(next: number) {
    if (timer.current) clearTimeout(timer.current);
    setIdx(Math.max(0, Math.min(total - 1, next)));
  }

  function choose(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: a[key] === value ? "" : value }));
    // Повторный клик по выбранному варианту снимает выбор — вперёд не гоним.
    if (answers[key] === value) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => go(idx + 1), AUTO_ADVANCE_MS);
  }

  const labelOf = (key: string, value: string): string =>
    steps.find((s) => s.key === key)?.options.find((o) => o.value === value)?.label ?? value;

  const volumeLabel = answers.volume
    ? [labelOf("volume", answers.volume), volumeNote].filter(Boolean).join(", ")
    : volumeNote;

  // В CRM уходят подписи вариантов, а не их коды: «Цвет: Бежевый», не «bezhevyy».
  const summaryLines = steps
    .map((s) => {
      const value =
        s.key === "volume"
          ? volumeLabel
          : answers[s.key]
            ? labelOf(s.key, answers[s.key])
            : "";
      return value ? `${SUMMARY_LABELS[s.key] ?? s.question}: ${value}` : "";
    })
    .filter(Boolean);

  const picks = useMemo(() => recommend(pool, answers), [pool, answers]);

  const canForward =
    !onContacts &&
    (Boolean(answers[step.key]) ||
      Boolean(step.skippable) ||
      (step.kind === "volume" && volumeNote !== ""));

  // ── Результат ──────────────────────────────────────────────────────────────
  if (sent) {
    const colorQuery = answers.color ? `?color=${answers.color}` : "";
    return (
      <div>
        <h2 id={titleId} className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Заявка принята
        </h2>
        <p className="mt-2 text-stone">
          Подберём комплект под ваш объект и пришлём цены. Ответим в течение 15 минут
          в рабочее время. А пока — что подходит под ваши ответы:
        </p>

        {picks.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {picks.map((p) => (
              <Link
                key={p.id}
                href={productHref(p.id)}
                className="group overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sand-deep">
                  {p.photo ? (
                    <Image
                      src={p.photo}
                      alt={`${p.brand} ${p.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 240px"
                      loading="lazy"
                      className="img-rich object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="text-xs font-semibold uppercase text-stone/70">{p.brand}</div>
                  <div className="font-display font-bold text-ink">{p.title}</div>
                  {p.price > 0 ? (
                    <div className="tabular mt-1 text-sm text-stone">
                      от {formatRub(p.price)} <span className="text-stone/70">{p.unit}</span>
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/calculator"
            className="sheen rounded-full bg-clinker px-6 py-3 font-semibold text-white transition hover:bg-clinker-hover"
          >
            Рассчитать комплект в штуках →
          </Link>
          <Link
            href={`/catalog${colorQuery}`}
            className="rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:border-clinker hover:text-clinker"
          >
            Смотреть весь каталог
          </Link>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-3 font-semibold text-stone underline-offset-4 hover:underline"
            >
              Закрыть
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  // ── Шаги ───────────────────────────────────────────────────────────────────
  return (
    <div>
      <p className="text-sm text-stone/80">{eyebrow}</p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand-deep">
        <div
          className="h-full rounded-full bg-clinker transition-all duration-500"
          style={{ width: `${((idx + 1) / total) * 100}%` }}
        />
      </div>

      {onContacts ? (
        <div className="mt-6">
          <h2 id={titleId} className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Куда прислать подбор?
          </h2>
          {summaryLines.length > 0 ? (
            <p className="mt-2 text-sm text-stone">{summaryLines.join(" · ")}</p>
          ) : null}
          <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:items-start">
            <LeadForm
              tag={tag}
              source={source}
              fields={["email"]}
              data={{
                // area → «Площадь/кол-во» в заголовке лида и UF-поле портала.
                ...(volumeLabel ? { area: volumeLabel } : {}),
                ...(context ? { product: context } : {}),
              }}
              comment={[...summaryLines, context ? `Открыт из: ${context}` : ""]
                .filter(Boolean)
                .join("\n")}
              submitLabel="Получить подбор и цены"
              onSuccess={() => setSent(true)}
            />
            <div className="rounded-card bg-sand-deep p-5">
              <p className="text-sm font-semibold text-ink">Что будет дальше</p>
              <ul className="mt-2 space-y-1.5 text-sm text-stone">
                <li>— подберём коллекции под сценарий и цвет;</li>
                <li>— посчитаем комплект поэлементно, в штуках;</li>
                <li>— пришлём цены и сроки поставки.</li>
              </ul>
              <p className="mt-3 text-xs text-stone/70">
                Нужен точный расчёт прямо сейчас — откройте{" "}
                <Link href="/calculator" className="font-semibold underline underline-offset-2">
                  калькулятор
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 id={titleId} className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            {step.question}
          </h2>
          {step.hint ? <p className="mt-2 text-sm text-stone">{step.hint}</p> : null}

          {step.kind === "image" ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {step.options.map((o) => (
                <OptionTile
                  key={o.value}
                  option={o}
                  selected={answers[step.key] === o.value}
                  onSelect={() => choose(step.key, o.value)}
                />
              ))}
            </div>
          ) : null}

          {step.kind === "choice" ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {step.options.map((o) => {
                const active = answers[step.key] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(step.key, o.value)}
                    className={`rounded-card border p-4 text-left transition ${
                      active
                        ? "border-clinker bg-clinker/10"
                        : "border-ink/12 bg-white hover:border-clinker"
                    }`}
                  >
                    <span className="font-semibold text-ink">{o.label}</span>
                    {o.hint ? (
                      <span className="mt-0.5 block text-sm text-stone">{o.hint}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          {step.kind === "volume" ? (
            <div className="mt-5">
              <div className="flex flex-wrap gap-2.5">
                {step.options.map((o) => {
                  const active = answers[step.key] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setAnswers((a) => ({
                          ...a,
                          [step.key]: a[step.key] === o.value ? "" : o.value,
                        }))
                      }
                      className={`rounded-full border px-5 py-3 font-semibold transition ${
                        active
                          ? "border-clinker bg-clinker text-white"
                          : "border-ink/15 text-ink hover:border-clinker hover:text-clinker"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
              <label className="mt-4 block max-w-md">
                <span className="text-sm font-medium text-stone">
                  Знаете точнее? Напишите (необязательно)
                </span>
                <input
                  type="text"
                  value={volumeNote}
                  onChange={(e) => setVolumeNote(e.target.value)}
                  className="field-input mt-1.5"
                  placeholder="крыльцо 5 ступеней, марш 1,4 м"
                />
              </label>
            </div>
          ) : null}
        </div>
      )}

      {/* Навигация */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5">
        <span className="tabular text-sm text-stone/80">
          Шаг: {idx + 1}/{total}
        </span>
        <div className="flex items-center gap-2">
          {step?.skippable && !answers[step.key] ? (
            <button
              type="button"
              onClick={() => go(idx + 1)}
              className="rounded-full px-4 py-2.5 text-sm font-semibold text-stone underline-offset-4 hover:underline"
            >
              Не знаю — подберите
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            aria-label="Назад"
            className="rounded-full border border-ink/15 px-4 py-2.5 font-semibold text-ink transition hover:border-clinker disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          {!onContacts ? (
            <button
              type="button"
              onClick={() => go(idx + 1)}
              disabled={!canForward}
              className="sheen rounded-full bg-clinker px-6 py-2.5 font-semibold text-white transition hover:bg-clinker-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Далее →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Плитка варианта с фото: фото — из каталога, поэтому у части опций его может не быть. */
function OptionTile({
  option,
  selected,
  onSelect,
}: {
  option: QuizOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`group overflow-hidden rounded-card border text-left transition ${
        selected
          ? "border-clinker ring-2 ring-clinker/40"
          : "border-ink/12 hover:border-clinker hover:shadow-card"
      }`}
    >
      <span
        className="relative block aspect-square w-full overflow-hidden bg-sand-deep"
        style={option.image ? undefined : { background: option.swatch ?? "#DBD2BF" }}
      >
        {option.image ? (
          <Image
            src={option.image}
            alt={option.imageAlt ?? option.label}
            fill
            sizes="(max-width: 640px) 45vw, 180px"
            loading="lazy"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        {option.swatch && option.image ? (
          <span
            aria-hidden
            className="absolute bottom-2 left-2 h-5 w-5 rounded-full border-2 border-white/80 shadow"
            style={{ background: option.swatch }}
          />
        ) : null}
      </span>
      <span className="block bg-white px-3 py-2.5">
        <span className="block text-sm font-semibold leading-tight text-ink">{option.label}</span>
        {option.hint ? (
          <span className="mt-0.5 block text-xs leading-tight text-stone/80">{option.hint}</span>
        ) : null}
      </span>
    </button>
  );
}
