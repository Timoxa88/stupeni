import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Quiz } from "@/components/sections/Quiz";
import { IMAGES } from "@/lib/images";
import { primeOverrides } from "@/lib/store/products";

/* Правки из админки (цены, тексты, скрытие) подхватываются за минуту. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Подбор материала для крыльца и террасы — 5 шагов",
  description:
    "Ответьте на пять вопросов — покажем подходящие клинкерные ступени или керамогранит 20 мм под ваш сценарий, условия и стиль.",
  alternates: { canonical: "/podbor" },
};

/**
 * Квиз-подбор. Раньше жил секцией на главной, где дублировал карточки сценариев
 * (шаг 1) и выбор категории (шаг 2) и конкурировал с калькулятором за внимание.
 * Отдельной страницей он остаётся доступен — ссылкой из hero и из шапки.
 */
export default async function PodborPage() {
  await primeOverrides();
  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={IMAGES.hero.src}
          alt={IMAGES.hero.alt}
          eyebrow="Подбор"
          h1="Подберите решение за 5 шагов"
          intro="Куда укладываем, в каких условиях и в каком стиле — по ответам покажем подходящие коллекции. Если нужен точный комплект в штуках, откройте калькулятор."
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
            <Quiz />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
