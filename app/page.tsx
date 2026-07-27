import type { Metadata } from "next";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { Faq } from "@/components/ui/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { SceneCards } from "@/components/sections/SceneCards";
import { Quiz } from "@/components/sections/Quiz";
import { Showrooms } from "@/components/sections/Showrooms";
import { Reviews } from "@/components/sections/Reviews";
import { ArchitectsHub } from "@/components/sections/ArchitectsHub";
import { ObjectsMap } from "@/components/sections/ObjectsMap";
import { ExitIntent } from "@/components/sections/ExitIntent";
import { Calculator } from "@/components/calculator/Calculator";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { LeadForm } from "@/components/forms/LeadForm";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { BRANDS } from "@/lib/catalog/brands";
import { activeProducts } from "@/lib/catalog/queries";
import { IMAGES, GALLERY } from "@/lib/images";
import { COUNTERS, ADVANTAGES, EDUCATION } from "@/lib/content/site";
import { HOME_FAQ } from "@/lib/content/faq";
import { BLOG_POSTS } from "@/lib/content/blog";
import { organizationSchema, localBusinessSchema } from "@/lib/jsonld";

/** Title/description наследуются из layout; здесь нужен canonical (ТЗ §4). */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const CATEGORIES = [
  {
    href: "/terrasnyy-klinker",
    index: "01",
    title: "Террасный клинкер",
    desc: "Плитка и ступени для крыльца, уличных лестниц и террас. Проступь, подступёнок, угол, плинтус — поэлементно.",
    accent: "var(--color-clinker)",
    img: IMAGES.catClinker,
  },
  {
    href: "/terrasnye-plastiny",
    index: "02",
    title: "Террасные пластины",
    desc: "Крупноформатный керамогранит 20 мм для террас, площадок и дорожек. Укладка на клей или регулируемые опоры.",
    accent: "var(--color-stone)",
    img: IMAGES.catSlab,
  },
  {
    href: "/plastiny-pod-derevo",
    index: "03",
    title: "Под дерево",
    desc: "Керамогранит с текстурой дерева — декинг-эффект для террас и зон отдыха. Не выгорает, не гниёт.",
    accent: "var(--color-olive)",
    img: IMAGES.catWood,
  },
];

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

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(iso));

export default function Home() {
  const popular = activeProducts().slice(0, 8);
  const latestPosts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <>
      <Header />
      <main id="main">
        {/* ── HERO ── */}
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
            <div className="rise mt-9 flex flex-wrap gap-4" style={{ ["--rise-delay" as string]: "540ms" }}>
              <Link
                href="#quiz"
                className="sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
              >
                Подобрать решение
              </Link>
              <Link
                href="#calc"
                className="rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10"
              >
                Рассчитать комплект
              </Link>
            </div>
          </div>

          <div className="relative border-t border-sand/10 py-7">
            <Marquee items={BRANDS.map((b) => b.name)} />
          </div>
        </section>

        {/* ── КАТЕГОРИИ ── */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <Reveal>
            <p className="eyebrow text-clinker">01 — Категории</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Три направления — под любой сценарий улицы
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.href} delay={i * 120}>
                <Link
                  href={c.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={c.img.src}
                      alt={c.img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      className="img-rich object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      aria-hidden
                      style={{ background: "linear-gradient(180deg, transparent 55%, rgba(18,20,19,0.35) 100%)" }}
                    />
                    <span className="absolute right-4 top-2 font-display text-6xl font-extrabold leading-none text-white/85 mix-blend-overlay" aria-hidden>
                      {c.index}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: c.accent }} />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-2xl font-bold text-ink">{c.title}</h3>
                    <p className="mt-3 flex-1 text-stone">{c.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-clinker">
                      Смотреть каталог
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── СЧЁТЧИКИ ── */}
        <section className="relative overflow-hidden bg-graphite text-sand">
          <div className="absolute inset-0" style={gridMotif} aria-hidden />
          <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-5 py-20 md:grid-cols-4">
            {COUNTERS.map((c, i) => (
              <Reveal key={c.label} delay={i * 90} className="text-center">
                <div className="font-display text-5xl font-extrabold text-clinker-bright sm:text-6xl">
                  <CountUp value={c.value} />
                </div>
                <div className="mt-2 text-sm text-sand/75">{c.label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── ПРЕИМУЩЕСТВА (bento) ── */}
        <section className="bg-sand-deep">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="eyebrow text-clinker">02 — Почему мы</p>
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
          </div>
        </section>

        {/* ── ВЫБОР ПО ПРИМЕНЕНИЮ (сценовые карточки) ── */}
        <SceneCards />

        {/* ── КВИЗ ── */}
        <section id="quiz" className="bg-sand-deep scroll-mt-20">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="eyebrow text-clinker">Подбор</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                Подберите решение за 5 шагов
              </h2>
            </Reveal>
            <div className="mt-10">
              <Quiz />
            </div>
          </div>
        </section>

        {/* ── КАЛЬКУЛЯТОР ── */}
        <section id="calc" className="mx-auto max-w-7xl px-5 py-20 sm:py-28 scroll-mt-20">
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
        </section>

        {/* ── КАТАЛОГ-ВИТРИНА ── */}
        <section className="bg-sand-deep">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="eyebrow text-clinker">Каталог</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                Популярные коллекции
              </h2>
            </Reveal>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                ["Весь каталог", "/terrasnyy-klinker"],
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

        {/* ── ВИДЫ И ХАРАКТЕРИСТИКИ ── */}
        <section className="relative overflow-hidden bg-graphite-deep text-sand">
          <div className="absolute inset-0" style={gridMotif} aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="eyebrow text-clinker-bright">Технологии</p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
                Сделано для улицы и зимы
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {EDUCATION.map((e, i) => (
                <Reveal key={e.title} delay={i * 90}>
                  <div className="h-full rounded-card border border-sand/20 bg-sand/[0.06] p-7 transition duration-500 hover:border-clinker/50">
                    <h3 className="font-display text-lg font-bold text-clinker-bright">{e.title}</h3>
                    <p className="mt-2 text-sm text-sand/80">{e.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── КАРТА ОБЪЕКТОВ ── */}
        <ObjectsMap />

        {/* ── ПРИМЕРЫ РАБОТ ── */}
        <Gallery images={GALLERY} />

        {/* ── АРХИТЕКТОРАМ (хаб BIM/CAD) ── */}
        <ArchitectsHub />

        {/* ── БЛОГ ── */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-clinker">Блог</p>
                <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                  Идеи для крыльца и террасы
                </h2>
              </div>
              <Link href="/blog" className="hidden font-semibold text-clinker sm:inline">
                Все статьи →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {latestPosts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.cover}
                      alt={p.coverAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      className="img-rich object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-xs text-stone/70">
                      {p.type === "howto" ? "Инструкция" : "Статья"} · {fmtDate(p.date)}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-ink transition group-hover:text-clinker">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-stone">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── ОТЗЫВЫ ── */}
        <Reviews />

        {/* ── ШОУ-РУМЫ И СКЛАДЫ ── */}
        <Showrooms />

        {/* ── FAQ ── */}
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

        {/* ── ФОРМА + ЛИД-МАГНИТ ── */}
        <section className="relative overflow-hidden bg-graphite-deep text-sand">
          <div className="absolute inset-0" style={gridMotif} aria-hidden />
          <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:py-28 lg:grid-cols-2">
            <div className="rounded-xl2 bg-white/[0.06] p-7 sm:p-9">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Получить расчёт</h2>
              <p className="mt-3 text-sand/80">Ответим в течение 15 минут.</p>
              <div className="mt-6">
                <LeadForm
                  tag="Заявка"
                  variant="dark"
                  submitLabel="Отправить заявку"
                  fields={["interest"]}
                  interestOptions={INTEREST_OPTIONS}
                />
              </div>
            </div>
            <div className="rounded-xl2 border border-clinker/40 bg-clinker/10 p-7 sm:p-9">
              <p className="eyebrow text-clinker-bright">Лид-магнит</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
                Каталог и прайс — PDF
              </h2>
              <p className="mt-3 text-sand/80">
                Пришлём актуальный каталог коллекций с ценами. Оставьте контакт — ссылка
                на скачивание придёт сразу.
              </p>
              <div className="mt-6">
                <LeadForm
                  tag="Каталог/прайс"
                  variant="dark"
                  submitLabel="Скачать каталог и прайс"
                  downloadUrl="/docs/demo-catalog.pdf"
                  successText="Готово! Каталог и прайс — по кнопке ниже."
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <ExitIntent />
      <SchemaScript data={[organizationSchema(), ...localBusinessSchema()]} />
    </>
  );
}
