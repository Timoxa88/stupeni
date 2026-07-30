import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { LeadForm } from "@/components/forms/LeadForm";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Calculator } from "@/components/calculator/Calculator";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { SOLUTIONS, getSolution } from "@/lib/content/solutions";
import { getProductsByApplication } from "@/lib/catalog/queries";
import { howToSchema, itemListSchema } from "@/lib/jsonld";
import { productTitle } from "@/lib/catalog/display";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: `/resheniya/${s.slug}` },
  };
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  const products = getProductsByApplication(s.slug);

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={s.heroImage}
          alt={s.heroAlt}
          eyebrow="Решение"
          h1={s.h1}
          intro={s.intro}
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: s.h1, url: `/resheniya/${s.slug}` },
          ]}
        >
          <Link
            href="#calc"
            className="sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
          >
            Рассчитать →
          </Link>
          <Link
            href="#catalog"
            className="rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10"
          >
            Что подойдёт
          </Link>
        </SubHero>

        {/* Что подойдёт — требования сценария */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-clinker">Что подойдёт</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Требования к материалу
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* h-full по цепочке: карточки одного ряда одной высоты, даже если
                текст разной длины («Монтаж» не короче «Элементов») */}
            {s.requirements.map((r, i) => (
              <Reveal key={r.label} delay={i * 70} className="h-full">
                <div className="h-full rounded-card border border-ink/10 bg-white p-6 shadow-card">
                  <div className="text-sm font-semibold uppercase tracking-wide text-stone/70">
                    {r.label}
                  </div>
                  <div className="mt-2 font-display text-xl font-bold text-ink">
                    {r.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Рекомендованные артикулы */}
        <section id="catalog" className="bg-sand-deep">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
            <Reveal>
              <p className="eyebrow text-clinker">Подборка</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                Рекомендованные коллекции
              </h2>
            </Reveal>
            <div className="mt-10">
              <ProductGrid products={products} />
            </div>
          </div>
        </section>

        {/* Мини-калькулятор сценария */}
        <section id="calc" className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-clinker">Калькулятор</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Рассчитайте комплект под этот сценарий
            </h2>
            <p className="mt-3 max-w-2xl text-stone">
              Режим калькулятора уже выбран под сценарий. Цены подставлены из
              каталога — их можно изменить, результат пересчитывается мгновенно.
            </p>
          </Reveal>
          <div className="mt-8 rounded-xl2 border border-ink/10 bg-white p-5 shadow-card sm:p-8">
            <Calculator initialMode={s.calcMode} />
          </div>
        </section>

        {/* Этапы монтажа — HowTo */}
        <section className="bg-graphite-deep text-sand">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
            <Reveal>
              <p className="eyebrow text-clinker-bright">Монтаж</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
                Этапы монтажа
              </h2>
            </Reveal>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2">
              {s.steps.map((step, i) => (
                <Reveal as="li" key={step.name} delay={i * 70}>
                  <div className="flex gap-4 rounded-card border border-sand/15 bg-sand/[0.05] p-6">
                    <span className="font-display text-3xl font-extrabold text-clinker-bright">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">{step.name}</h3>
                      <p className="mt-1.5 text-sm text-sand/80">{step.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ сценария */}
        <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-clinker">Вопросы</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Частые вопросы по сценарию
            </h2>
          </Reveal>
          <div className="mt-8">
            <Faq items={s.faq} />
          </div>
        </section>

        {/* Заявка по сценарию */}
        <section className="bg-sand-deep">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
                Заявка по сценарию «{s.h1}»
              </h2>
              <p className="mt-4 max-w-md text-stone">
                Опишите задачу — подберём материал, посчитаем комплект и доставку.
                Ответим в течение 15 минут.
              </p>
            </div>
            <div className="rounded-card border border-ink/10 bg-white p-6 shadow-card sm:p-8">
              <LeadForm
                tag={s.h1}
                submitLabel="Отправить заявку"
                comment={`Сценарий: ${s.h1}`}
                fields={["comment"]}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SchemaScript
        data={[
          howToSchema({ name: `Монтаж: ${s.h1}`, steps: s.steps }),
          itemListSchema(
            products.map((p) => ({ id: p.id, name: `${p.brand} ${productTitle(p)}` })),
          ),
        ]}
      />
    </>
  );
}
