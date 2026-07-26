import type { Metadata } from "next";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { BLOG_POSTS } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Блог «Идеи для крыльца и террасы» — кейсы и инструкции",
  description:
    "Идеи, кейсы и пошаговые инструкции по облицовке крыльца, лестниц и террас клинкером и керамогранитом 20 мм. Монтаж, выбор материала, расчёт.",
  alternates: { canonical: "/blog" },
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

export default function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image="/images/gal-porch.jpg"
          alt="Крыльцо из клинкера"
          eyebrow="Блог"
          h1="Идеи для крыльца и террасы"
          intro="Кейсы реализованных объектов и пошаговые инструкции по монтажу — с конкретными артикулами и расчётами."
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: "Блог", url: "/blog" },
          ]}
        />
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
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
                    <span className="absolute left-3 top-3 rounded-full bg-graphite-deep/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sand">
                      {p.type === "howto" ? "Инструкция" : "Статья"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-xs text-stone/70">
                      {fmtDate(p.date)} · {p.readingMin} мин
                    </div>
                    <h2 className="mt-2 font-display text-xl font-bold text-ink transition group-hover:text-clinker">
                      {p.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm text-stone">{p.excerpt}</p>
                    <span className="mt-4 font-semibold text-clinker">Читать →</span>
                  </div>
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
