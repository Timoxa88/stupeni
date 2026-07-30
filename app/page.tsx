import type { Metadata } from "next";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { Faq } from "@/components/ui/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { PromoBar } from "@/components/sections/PromoBar";
import { SceneCards } from "@/components/sections/SceneCards";
import { Showrooms } from "@/components/sections/Showrooms";
import { Calculator } from "@/components/calculator/Calculator";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { LeadForm } from "@/components/forms/LeadForm";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { BRANDS } from "@/lib/catalog/brands";
import { CATEGORIES } from "@/lib/content/categories";
import { showcaseProducts } from "@/lib/catalog/taxonomy";
import { IMAGES, OBJECTS } from "@/lib/images";
import { ADVANTAGES, CITY_CONTACTS } from "@/lib/content/site";
import { HOME_FAQ } from "@/lib/content/faq";
import { organizationSchema, localBusinessSchema } from "@/lib/jsonld";

/** Title/description наследуются из layout; здесь нужен canonical (ТЗ §4). */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const INTEREST_OPTIONS = [
  "Ступени для крыльца",
  "Ступени для лестницы",
  "Терраса",
  "Дорожки",
  "Расчёт",
  "Образцы",
  "Другое",
];

const gridMotif: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(243,241,236,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,241,236,0.05) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

/**
 * Главная — девять блоков (пересборка 27.07.2026).
 *
 * Было семнадцать: три параллельные развилки выбора (категории / сценарии / квиз),
 * четыре механики захвата контакта (квиз, калькулятор, форма, лид-магнит + ExitIntent)
 * и восемь блоков «нам можно верить», три из которых стояли на выдуманных данных.
 *
 * Стало: одна развилка (сценарии), одна форма, ноль непроверяемых утверждений.
 * Квиз переехал на /podbor. Отзывы, карта объектов, счётчики и хаб загрузок сняты
 * до появления реальных данных — см. docs/audit_i_plan_zapuska_2026-07-26.md §4, §8.
 */
export default function Home() {
  const popular = showcaseProducts(8);

  return (
    <>
      <Header />
      <main id="main">
        {/* ── 1. HERO ── */}
        <section className="relative -mt-[72px] overflow-hidden bg-graphite-deep pt-[72px] text-sand">
          <Image
            src={IMAGES.hero.src}
            alt={IMAGES.hero.alt}
            fill
            priority
            sizes="100vw"
            className="img-rich object-cover object-center opacity-60"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, rgba(18,20,19,0.72) 0%, rgba(18,20,19,0.62) 45%, rgba(18,20,19,0.86) 100%)",
            }}
          />
          <div className="absolute inset-0" style={gridMotif} aria-hidden />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(50rem 36rem at 78% 8%, rgba(224,112,63,0.28), transparent 60%), radial-gradient(44rem 36rem at 8% 92%, rgba(91,107,79,0.18), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute -right-24 top-24 hidden h-80 w-80 rotate-12 rounded-[2rem] border border-clinker/30 md:block"
            style={{ animation: "float-slow 9s ease-in-out infinite" }}
            aria-hidden
          />

          <div className="relative mx-auto max-w-7xl px-5 py-24 sm:py-32">
            <p className="eyebrow rise text-clinker-bright" style={{ ["--rise-delay" as string]: "0ms" }}>
              Клинкер · керамогранит 20 мм · для улицы
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[0.98]">
              <span className="rise block" style={{ ["--rise-delay" as string]: "80ms" }}>
                Клинкерные ступени
              </span>
              <span className="rise block" style={{ ["--rise-delay" as string]: "180ms" }}>
                и крупноформат для
              </span>
              <span
                className="rise block bg-gradient-to-r from-clinker-bright to-ember bg-clip-text text-transparent"
                style={{ ["--rise-delay" as string]: "280ms" }}
              >
                крыльца и террас
              </span>
            </h1>
            <p className="rise mt-7 max-w-xl text-lg text-sand/85" style={{ ["--rise-delay" as string]: "420ms" }}>
              Морозостойко, не скользит, открытые цены. Считаем комплект в штуках, а не
              «в квадратах» — поэлементно для ступеней и по площади для террасы. Доставка
              по России и СНГ.
            </p>
            {/* Один главный CTA — калькулятор (он же дифференциатор), второй вторичным стилем. */}
            <div className="rise mt-9 flex flex-wrap gap-4" style={{ ["--rise-delay" as string]: "540ms" }}>
              <Link
                href="#calc"
                className="sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
              >
                Рассчитать комплект
              </Link>
              <Link
                href="/podbor"
                className="rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10"
              >
                Подобрать за 5 шагов
              </Link>
            </div>
          </div>

          <div className="relative border-t border-sand/10 py-7">
            <Marquee items={BRANDS.map((b) => b.name)} />
          </div>
        </section>

        {/* ── 1б. АКЦИЯ с обратным отсчётом (по образцу fintherm) ── */}
        <PromoBar />

        {/* ── 2. СЦЕНАРИИ — единственная развилка выбора ── */}
        <SceneCards />

        {/* ── 2б. ТИПЫ ПОКРЫТИЯ — второй вход, для тех, кто уже знает материал.
               Переехал сюда с /catalog: там он стоял третьим уровнем навигации
               перед товаром, здесь же честно дополняет выбор по сценарию. ── */}
        {/* фон светлый: следом идёт калькулятор на sand-deep, два тонированных
            блока подряд слились бы в одну полосу */}
        <section className="border-t border-ink/5">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
            <Reveal>
              <p className="eyebrow text-clinker">Если знаете материал</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                Три типа покрытия
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {CATEGORIES.map((c, i) => (
                <Reveal key={c.slug} delay={i * 80}>
                  <Link
                    href={`/${c.slug}`}
                    className="group flex h-full flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <h3 className="font-display text-lg font-bold text-ink transition group-hover:text-clinker">
                      {c.h1}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-stone">{c.description}</p>
                    <span className="mt-4 text-sm font-semibold text-clinker">Смотреть →</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. КАЛЬКУЛЯТОР ── */}
        <section id="calc" className="bg-sand-deep scroll-mt-20">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="eyebrow text-clinker">Калькулятор</p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
                Рассчитайте комплект за минуту
              </h2>
              <p className="mt-4 max-w-2xl text-stone">
                Поэлементный расчёт ступеней по маршам или керамогранита для террасы с опорами
                HILST и материалами по городу. Результат пересчитывается мгновенно.
              </p>
            </Reveal>
            <div className="mt-8 rounded-xl2 border border-ink/10 bg-white p-5 shadow-card sm:p-8">
              <Calculator />
            </div>
          </div>
        </section>

        {/* ── 4. ПОЧЕМУ МЫ (bento) ── */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <Reveal>
            <p className="eyebrow text-clinker">Почему мы</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Специализация на уличном клинкере
            </h2>
          </Reveal>
          <div className="mt-12 grid auto-rows-[minmax(150px,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal className="lg:col-span-2 lg:row-span-2">
              <div className="flex h-full flex-col justify-between rounded-card border border-ink/10 bg-graphite p-8 text-sand shadow-card">
                <p className="eyebrow text-clinker-bright">Дифференциатор</p>
                <div>
                  <h3 className="font-display text-3xl font-bold sm:text-4xl">
                    Поэлементный расчёт комплекта
                  </h3>
                  <p className="mt-4 max-w-md text-sand/80">
                    Сколько проступей, углов, подступёнков и плитки — в штуках по реальному
                    размеру. Плюс опоры по таблице HILST и сопутствующие материалы с ценой
                    по вашему городу.
                  </p>
                </div>
                <Link
                  href="#calc"
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-clinker px-5 py-3 font-semibold text-white transition hover:bg-clinker-hover"
                >
                  Открыть калькулятор →
                </Link>
              </div>
            </Reveal>
            {ADVANTAGES.map((a, i) => (
              <Reveal key={a.title} delay={i * 70}>
                <div className="flex h-full flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <h3 className="font-display text-lg font-bold text-ink">{a.title}</h3>
                  <p className="mt-2 text-sm text-stone">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 5. ВИТРИНА ── */}
        <section className="bg-sand-deep">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow text-clinker">Каталог</p>
                  <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                    Популярные коллекции
                  </h2>
                </div>
                <Link href="/catalog" className="hidden font-semibold text-clinker sm:inline">
                  Весь каталог →
                </Link>
              </div>
            </Reveal>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                ["Весь каталог", "/catalog"],
                ["Террасный клинкер", "/terrasnyy-klinker"],
                ["Террасные пластины", "/terrasnye-plastiny"],
                ["Под дерево", "/plastiny-pod-derevo"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="rounded-full border border-ink/12 bg-white px-4 py-2 text-sm font-semibold text-stone transition hover:border-clinker hover:text-clinker"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <ProductGrid products={popular} />
            </div>
          </div>
        </section>

        {/* ── 6. ОБЪЕКТЫ ── */}
        <Gallery images={OBJECTS} />

        {/* ── 7. FAQ (вобрал тезисы образовательного блока) ── */}
        <section className="bg-sand-deep">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="eyebrow text-clinker">Вопросы</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                Частые вопросы
              </h2>
            </Reveal>
            <div className="mt-8">
              <Faq items={HOME_FAQ} />
            </div>
          </div>
        </section>

        {/* ── 8. ШОУ-РУМЫ И СКЛАДЫ ── */}
        <Showrooms />

        {/* ── 9. ФОРМА (одна на страницу; #lead — якорь для CTA из других блоков) ── */}
        <section id="lead" className="relative overflow-hidden bg-graphite-deep text-sand">
          <div className="absolute inset-0" style={gridMotif} aria-hidden />
          <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-clinker-bright">Заявка</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
                Получить расчёт
              </h2>
              <p className="mt-4 max-w-md text-sand/80">
                Ответим в течение 15 минут в рабочее время. Расскажите задачу — пришлём
                комплектацию с ценами, а по запросу и каталог с прайсом.
              </p>
              <div className="mt-8 flex flex-col gap-2 text-sand/85">
                {/* Оба города: номер и «— город» — неразрывные блоки, чтобы
                    «Санкт-Петербург» не ломался посреди слова на узких экранах */}
                {CITY_CONTACTS.map((c) => (
                  <a key={c.phone} href={`tel:${c.phone}`} className="font-display text-2xl font-bold">
                    <span className="whitespace-nowrap">{c.phoneLabel}</span>{" "}
                    <span className="whitespace-nowrap text-base font-normal text-sand/60">
                      — {c.city}
                    </span>
                  </a>
                ))}
                <a href="mailto:sales@hit-ceramics.ru" className="text-sand/70 transition hover:text-clinker-bright">
                  sales@hit-ceramics.ru
                </a>
              </div>
            </div>
            <div className="rounded-xl2 bg-white/[0.06] p-7 sm:p-9">
              <LeadForm
                tag="Заявка"
                variant="dark"
                submitLabel="Отправить заявку"
                fields={["interest", "region", "catalog"]}
                interestOptions={INTEREST_OPTIONS}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <SchemaScript data={[organizationSchema(), ...localBusinessSchema()]} />
    </>
  );
}
