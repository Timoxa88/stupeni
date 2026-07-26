import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="grid min-h-[60vh] place-items-center px-5 pt-[72px]">
        <div className="text-center">
          <p className="font-display text-7xl font-extrabold text-clinker">404</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
            Страница не найдена
          </h1>
          <p className="mt-3 text-stone">
            Возможно, ссылка устарела. Вернитесь на главную или перейдите в каталог.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-full bg-clinker px-6 py-3 font-semibold text-white transition hover:bg-clinker-hover">
              На главную
            </Link>
            <Link href="/terrasnyy-klinker" className="rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:border-clinker hover:text-clinker">
              Каталог
            </Link>
            <Link href="/calculator" className="rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:border-clinker hover:text-clinker">
              Калькулятор
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
