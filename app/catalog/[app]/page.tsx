import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { QuizLauncher } from "@/components/quiz/QuizLauncher";
import { getApplication, brandsOf, applications, productHref } from "@/lib/catalog/taxonomy";
import { getProductById } from "@/lib/catalog/queries";
import { getSolution } from "@/lib/content/solutions";
import { plural } from "@/lib/format";
import { primeOverrides } from "@/lib/store/products";

/* Правки из админки (цены, тексты, скрытие) подхватываются за минуту. */
export const revalidate = 60;

type Props = { params: Promise<{ app: string }> };

export function generateStaticParams() {
  return applications().map((a) => ({ app: a.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await primeOverrides();
  const a = getApplication((await params).app);
  if (!a) return {};
  return {
    title: `${a.title} — клинкер и керамогранит по брендам`,
    description: `Материалы для сценария «${a.title.toLowerCase()}»: ${a.count} ${plural(a.count, "позиция", "позиции", "позиций")} от заводов-производителей. Выберите бренд, коллекцию и цвет.`,
    alternates: { canonical: `/catalog/${a.code}` },
  };
}

/** Второй уровень каталога: бренды, у которых есть материал под это назначение. */
export default async function AppLevel({ params }: Props) {
  await primeOverrides();
  const { app } = await params;

  // Старые адреса карточек были /catalog/<id> и теперь попадают сюда.
  // Молча уводим на новый канонический адрес, а не показываем 404.
  if (!getApplication(app)) {
    if (getProductById(app)) redirect(productHref(app));
    notFound();
  }

  const node = getApplication(app)!;
  const solution = getSolution(app);
  const brands = brandsOf(node.code);

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={node.image}
          alt={node.imageAlt}
          eyebrow="Каталог"
          h1={`${node.title} — материалы`}
          intro={`${node.count} ${plural(node.count, "позиция", "позиции", "позиций")} под этот сценарий от ${brands.length} ${plural(brands.length, "производителя", "производителей", "производителей")}. Выберите бренд, дальше — коллекцию и цвет.`}
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: "Каталог", url: "/catalog" },
            { name: node.title, url: `/catalog/${node.code}` },
          ]}
        >
          <QuizLauncher
            label="Подобрать за минуту"
            app={node.code}
            context={`Каталог · ${node.title}`}
          />
          {solution ? (
            <Link
              href={`/resheniya/${solution.slug}`}
              className="rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10"
            >
              Как выбрать под этот сценарий →
            </Link>
          ) : null}
        </SubHero>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-clinker">Шаг 2 — бренд</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Производители
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((b, i) => (
              <Reveal key={b.slug} delay={(i % 3) * 80}>
                <Link
                  href={b.href}
                  className="group flex h-full flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <h3 className="font-display text-xl font-bold text-ink transition group-hover:text-clinker">
                    {b.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-stone">
                    {b.collections} {plural(b.collections, "коллекция", "коллекции", "коллекций")}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-clinker">
                    {b.count} {plural(b.count, "позиция", "позиции", "позиций")} →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
