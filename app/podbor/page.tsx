import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { CatalogQuiz } from "@/components/quiz/CatalogQuiz";
import { buildQuiz } from "@/lib/quiz/build";
import { IMAGES } from "@/lib/images";
import { primeOverrides } from "@/lib/store/products";

/* Правки из админки (цены, тексты, скрытие) подхватываются за минуту. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Подбор материала для крыльца и террасы за минуту",
  description:
    "Ответьте на шесть вопросов — покажем подходящие клинкерные ступени или керамогранит 20 мм под ваш сценарий, элементы системы, цвет и условия эксплуатации.",
  alternates: { canonical: "/podbor" },
};

/**
 * Квиз-подбор. Раньше жил секцией на главной, где дублировал карточки сценариев
 * (шаг 1) и выбор категории (шаг 2) и конкурировал с калькулятором за внимание.
 * Отдельной страницей он остаётся доступен — ссылкой из hero и из шапки.
 *
 * 04.08.2026 прежний текстовый квиз из четырёх вопросов заменён общим с каталогом
 * (`CatalogQuiz`): один набор вопросов — одна структура ответов в CRM. Здесь он
 * идёт врезкой в страницу, в каталоге — модалкой, разница только в обрамлении.
 * Данные строятся прямо на сервере: ради главного содержимого страницы ходить
 * за ними в /api/quiz незачем.
 */
export default async function PodborPage() {
  await primeOverrides();
  const quiz = buildQuiz();
  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={IMAGES.hero.src}
          alt={IMAGES.hero.alt}
          eyebrow="Подбор"
          h1="Подберите решение за минуту"
          intro="Куда укладываем, какие нужны элементы, в каком цвете и в каких условиях — по ответам покажем подходящие коллекции и пришлём цены. Если нужен точный комплект в штуках, откройте калькулятор."
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: "Подбор решения", url: "/podbor" },
          ]}
        >
          <Link
            href="/calculator"
            className="rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10"
          >
            Сразу к калькулятору →
          </Link>
        </SubHero>

        <section className="bg-sand-deep">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
            <div className="rounded-xl2 border border-ink/10 bg-white p-6 shadow-card sm:p-10">
              <CatalogQuiz
                data={quiz}
                context="Страница подбора"
                tag="Квиз — подбор"
                source="quiz"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
