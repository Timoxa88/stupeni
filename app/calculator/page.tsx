import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calculator } from "@/components/calculator/Calculator";
import { getProductById } from "@/lib/catalog/queries";

type Props = {
  searchParams: Promise<{ mode?: string; product?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { product } = await searchParams;
  return {
    title: "Калькулятор ступеней и керамогранита для террасы — расчёт онлайн",
    description:
      "Рассчитайте комплект клинкерных ступеней поэлементно или керамогранит для террасы по площади: опоры HILST, сопутствующие материалы по городу, мгновенный результат.",
    alternates: { canonical: "/calculator" },
    // Диплинки из каталога (?product=…) не индексируем — canonical и так чистый.
    ...(product ? { robots: { index: false, follow: true } } : {}),
  };
}

const gridMotif: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(243,241,236,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,241,236,0.05) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

export default async function CalculatorPage({ searchParams }: Props) {
  const { mode, product: productId } = await searchParams;

  // Диплинк из каталога: ?product=<id> предвыбирает артикул, а режим выводится
  // из типа товара (ступени → A, плиты → B) — переключатель руками не нужен.
  const product = productId ? getProductById(productId) : undefined;
  const initialMode = product
    ? product.product_type === "step_system"
      ? "A"
      : "B"
    : mode === "B"
      ? "B"
      : "A";

  return (
    <>
      <Header />
      <main id="main">
        {/* Заголовок */}
        <section className="relative -mt-[72px] overflow-hidden bg-graphite-deep pt-[72px] text-sand">
          <div className="absolute inset-0" style={gridMotif} aria-hidden />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(44rem 28rem at 80% 0%, rgba(224,112,63,0.18), transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20">
            <p className="eyebrow text-clinker-bright">Инструмент</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] sm:text-6xl">
              Калькулятор комплекта
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-sand/85">
              Считаем не «квадраты вообще», а штуки ступеней и плитки по реальному
              размеру, опоры по таблице HILST и сопутствующие материалы с ценой по
              вашему городу. Цены подставлены из каталога — их можно изменить.
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-5 py-12">
          <Calculator initialMode={initialMode} initialProductId={product?.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
