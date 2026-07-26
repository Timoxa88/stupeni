"use client";

import { useState } from "react";
import Link from "next/link";
import { Img as Image } from "@/components/ui/Img";
import type { ApplicationCode, ProductType } from "@/lib/catalog/types";
import { activeProducts } from "@/lib/catalog/queries";
import { LeadForm } from "@/components/forms/LeadForm";

interface Option {
  value: string;
  label: string;
}
interface Step {
  key: string;
  question: string;
  options: Option[];
}

const STEPS: Step[] = [
  {
    key: "app",
    question: "Что облицовываем?",
    options: [
      { value: "kryltso", label: "Крыльцо" },
      { value: "lestnitsa-ulitsa", label: "Уличная лестница" },
      { value: "terrasa", label: "Терраса" },
      { value: "dorozhki", label: "Дорожки" },
      { value: "bassein", label: "Зона бассейна" },
    ],
  },
  {
    key: "material",
    question: "Материал-предпочтение",
    options: [
      { value: "step_system", label: "Клинкерные ступени" },
      { value: "slab", label: "Крупноформат 20 мм" },
      { value: "any", label: "Не знаю — подберите" },
    ],
  },
  {
    key: "conditions",
    question: "Условия эксплуатации",
    options: [
      { value: "frost", label: "Открытая улица — мороз" },
      { value: "canopy", label: "Под навесом" },
      { value: "water", label: "У воды / бассейн" },
    ],
  },
  {
    key: "style",
    question: "Стиль и цвет",
    options: [
      { value: "light", label: "Светлый" },
      { value: "dark", label: "Тёмный" },
      { value: "terracotta", label: "Терракота-кирпич" },
      { value: "grey", label: "Серый-бетон" },
      { value: "any", label: "Посмотреть варианты" },
    ],
  },
];

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [size, setSize] = useState("");
  const total = STEPS.length + 1; // + шаг размера
  const done = step >= total;

  function choose(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  const recommendations = (() => {
    if (!done) return [];
    const app = answers.app as ApplicationCode | undefined;
    const mat = answers.material as ProductType | "any" | undefined;
    return activeProducts()
      .filter((p) => (app ? p.application.includes(app) : true))
      .filter((p) => (mat && mat !== "any" ? p.product_type === mat : true))
      .slice(0, 3);
  })();

  const summary = [
    answers.app && `Объект: ${STEPS[0].options.find((o) => o.value === answers.app)?.label}`,
    answers.material && `Материал: ${STEPS[1].options.find((o) => o.value === answers.material)?.label}`,
    answers.conditions && `Условия: ${STEPS[2].options.find((o) => o.value === answers.conditions)?.label}`,
    answers.style && `Стиль: ${STEPS[3].options.find((o) => o.value === answers.style)?.label}`,
    size && `Размер: ${size}`,
  ]
    .filter(Boolean)
    .join("; ");

  const progress = Math.min(step, total) / total;

  return (
    <div className="rounded-xl2 border border-ink/10 bg-white p-6 shadow-card sm:p-10">
      {/* Прогресс */}
      <div className="flex items-center justify-between text-sm text-stone">
        <span className="font-semibold">Подбор решения</span>
        <span className="tabular">
          {Math.min(step + (done ? 0 : 1), total)} / {total}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand-deep">
        <div
          className="h-full rounded-full bg-clinker transition-all duration-500"
          style={{ width: `${(done ? 1 : progress) * 100}%` }}
        />
      </div>

      {/* Шаги выбора */}
      {!done && step < STEPS.length ? (
        <div className="mt-8">
          <h3 className="font-display text-2xl font-bold text-ink">{STEPS[step].question}</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {STEPS[step].options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => choose(STEPS[step].key, o.value)}
                className="rounded-full border border-ink/15 px-5 py-3 font-semibold text-ink transition hover:border-clinker hover:bg-clinker hover:text-white"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Шаг размера (опционально) */}
      {!done && step === STEPS.length ? (
        <div className="mt-8">
          <h3 className="font-display text-2xl font-bold text-ink">
            Размер объекта (необязательно)
          </h3>
          <p className="mt-2 text-stone">Например: «терраса 24 м²» или «крыльцо, 5 ступеней».</p>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="field-input mt-4 max-w-md"
            placeholder="м² террасы или число ступеней"
          />
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="sheen rounded-full bg-clinker px-7 py-3.5 font-semibold text-white transition hover:bg-clinker-hover"
            >
              Показать подбор →
            </button>
          </div>
        </div>
      ) : null}

      {/* Результат */}
      {done ? (
        <div className="mt-8">
          <h3 className="font-display text-2xl font-bold text-ink">Рекомендуем под ваш сценарий</h3>
          {recommendations.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {recommendations.map((p) => (
                <Link
                  key={p.id}
                  href={`/catalog/${p.id}`}
                  className="group overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.photos[0] ?? "/images/cat-clinker.jpg"}
                      alt={p.seo.h1}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      loading="lazy"
                      className="img-rich object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-semibold uppercase text-stone/70">{p.brand}</div>
                    <div className="font-display font-bold text-ink">
                      {p.collection} {p.specs.color}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-stone">Подберём вручную — оставьте контакт ниже.</p>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="rounded-card bg-sand-deep p-5">
              <p className="text-sm font-semibold text-ink">Ваш выбор</p>
              <p className="mt-1.5 text-sm text-stone">{summary || "—"}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/calculator"
                  className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-clinker hover:text-clinker"
                >
                  Рассчитать комплект →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setAnswers({});
                    setSize("");
                  }}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-stone underline-offset-4 hover:underline"
                >
                  Пройти заново
                </button>
              </div>
            </div>
            <LeadForm
              tag="Квиз"
              submitLabel="Получить подбор и образец"
              comment={`Квиз — ${summary}`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
