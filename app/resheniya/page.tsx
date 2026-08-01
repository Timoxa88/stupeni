import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { SceneCards } from "@/components/sections/SceneCards";
import { IMAGES } from "@/lib/images";
import { SOLUTIONS } from "@/lib/content/solutions";

export const metadata: Metadata = {
  title: "Решения: крыльцо, лестница, терраса, дорожки",
  description:
    "Подбор уличной керамики по сценарию: крыльцо, уличная лестница, терраса, садовые дорожки, укладка на опоры, зона бассейна. Требования, монтаж, расчёт комплекта.",
  alternates: { canonical: "/resheniya" },
};

/**
 * Хаб решений. Раньше пункт меню «Решения» вёл сразу на /resheniya/kryltso —
 * то есть на конкретное крыльцо, а не на список сценариев.
 */
export default function ResheniyaPage() {
  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={IMAGES.catClinker.src}
          alt={IMAGES.catClinker.alt}
          eyebrow="Решения"
          h1="Решения по применению"
          intro={`Чаще выбирают не бренд и не формат, а сценарий: куда укладываем и в каких условиях. ${SOLUTIONS.length} сценариев — в каждом требования к материалу, этапы монтажа, подборка коллекций и расчёт комплекта.`}
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: "Решения", url: "/resheniya" },
          ]}
        >
          <Link
            href="/calculator"
            className="sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
          >
            Рассчитать комплект →
          </Link>
          <Link
            href="/podbor"
            className="rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10"
          >
            Подобрать за 5 шагов
          </Link>
        </SubHero>

        <SceneCards eyebrow="Сценарии" title="Шесть сценариев применения" intro="" />
      </main>
      <Footer />
    </>
  );
}
