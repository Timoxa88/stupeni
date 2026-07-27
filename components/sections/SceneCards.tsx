import Link from "next/link";
import { Img as Image } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";
import { SOLUTIONS } from "@/lib/content/solutions";

const NOTE: Record<string, string> = {
  kryltso: "Клинкерные ступени с капиносом",
  "lestnitsa-ulitsa": "Морозостойко, не скользит",
  terrasa: "Клинкер и керамогранит 20 мм",
  dorozhki: "Площадки и проходные зоны",
  "landshaft-opory": "Регулируемые пьедесталы HILST",
  bassein: "Борт, ступени, R-классы",
};

const SHORT: Record<string, string> = {
  kryltso: "Крыльцо",
  "lestnitsa-ulitsa": "Уличная лестница",
  terrasa: "Терраса",
  dorozhki: "Садовые дорожки",
  "landshaft-opory": "Укладка на опоры",
  bassein: "Зона бассейна",
};

/**
 * Выбор по применению — сценовые карточки (ТЗ §6 блок 6). После пересборки главной
 * это единственная развилка выбора: категории материала и квиз её дублировали.
 * Заголовок переопределяется, чтобы на хабе /resheniya не повторять H1 из SubHero.
 */
export function SceneCards({
  eyebrow = "Выбор по применению",
  title = "С чего начнём — куда укладываем?",
  intro = "Чаще выбирают не бренд и не формат, а сценарий. Откройте свой — там подборка материалов, требования и расчёт.",
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <Reveal>
        <p className="eyebrow text-clinker">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
          {title}
        </h2>
        {intro ? <p className="mt-4 max-w-2xl text-stone">{intro}</p> : null}
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SOLUTIONS.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 100}>
            <Link
              href={`/resheniya/${s.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-card border border-ink/10 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
            >
              <Image
                src={s.heroImage}
                alt={s.heroAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                className="img-rich object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"
              />
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, rgba(12,14,13,0.05) 30%, rgba(12,14,13,0.82) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-sand">
                <h3 className="font-display text-2xl font-bold">{SHORT[s.slug]}</h3>
                <p className="mt-1 text-sm text-sand/85">{NOTE[s.slug]}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
