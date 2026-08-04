import { Reveal } from "@/components/ui/Reveal";
import { REVIEWS, REVIEWS_SUMMARY } from "@/lib/content/reviews";

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-clinker" aria-label={`Оценка ${rating} из 5`}>
      {"★".repeat(rating)}
      <span className="text-ink/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

/**
 * Отзывы с Яндекс.Карт. Показываем выборку, а рейтинг и число — по всему пулу,
 * теми же цифрами, что уходят в AggregateRating (lib/jsonld.ts): расхождение
 * между разметкой и видимым текстом Яндекс проверяет жёстко.
 */
export function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
      <Reveal>
        <p className="eyebrow text-clinker">Что говорят покупатели</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">Отзывы</h2>
        <p className="mt-4 max-w-2xl text-stone">
          <span className="font-semibold text-ink">
            {REVIEWS_SUMMARY.ratingValue.toLocaleString("ru-RU")} из {REVIEWS_SUMMARY.bestRating}
          </span>{" "}
          по {REVIEWS_SUMMARY.reviewCount} отзывам на Яндекс.Картах — о компании целиком, не только
          о ступенях. Ниже — те, что касаются подбора и доставки материала.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <Reveal key={`${r.author}-${r.date}`}>
            <figure className="flex h-full flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <Stars rating={r.rating} />
                <time dateTime={r.date} className="text-sm text-stone/70">
                  {DATE_FMT.format(new Date(r.date))}
                </time>
              </div>
              <blockquote className="mt-4 flex-1 text-stone">{r.text}</blockquote>
              <figcaption className="mt-4 font-semibold text-ink">{r.author}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-sm text-stone/80">
        Все отзывы —{" "}
        {REVIEWS_SUMMARY.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " и " : ""}
            <a
              href={s.url}
              target="_blank"
              rel="noopener nofollow"
              className="underline decoration-clinker/40 underline-offset-4 hover:text-ink"
            >
              на карточке в {s.city}
            </a>
          </span>
        ))}
        .
      </p>
    </section>
  );
}
