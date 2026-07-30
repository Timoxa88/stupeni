import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { BLOG_POSTS } from "@/lib/content/blog";
import { publishedPost, publishedPosts } from "@/lib/store/blog";
import { getProductById } from "@/lib/catalog/queries";
import { primeOverrides } from "@/lib/store/products";
import { resolveSeo } from "@/lib/store/seo";
import { articleSchema, faqSchema, howToSchema } from "@/lib/jsonld";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 60;

/** Статьи из админки добавляются в рантайме — на сборке знаем только сидовые. */
export async function generateStaticParams() {
  const fromDb = await publishedPosts();
  const slugs = new Set([...BLOG_POSTS.map((p) => p.slug), ...fromDb.map((p) => p.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await publishedPost(slug);
  if (!p) return {};
  const seo = await resolveSeo(`blog:${p.slug}`, { title: p.title, description: p.description });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage ?? p.cover],
      type: "article",
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

/* ── Мини-разметка в текстах статей: **жирный** и [текст](/ссылка) ──────────
   Осознанно не markdown-библиотека: два токена хватает, и в бандл ничего
   не добавляется. Для Schema.org тексты вычищаются stripInline(). */

const INLINE_TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      return (
        <Link
          key={i}
          href={href}
          className="font-medium text-clinker underline decoration-clinker/40 underline-offset-2 transition hover:decoration-clinker"
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}

function stripInline(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
}

/** Якорь секции для оглавления (индексный: кириллица в id ломает переход по #). */
const anchor = (_heading: string, i: number) => `sec-${i}`;

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  await primeOverrides();
  const post = await publishedPost(slug);
  if (!post) notFound();

  const related = post.relatedProductIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // «Читайте также»: следующие статьи по кругу — у каждой статьи свой набор,
  // и вся пятёрка перелинкована между собой.
  const myIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const alsoRead = [1, 2, 3].map((d) => BLOG_POSTS[(myIndex + d) % BLOG_POSTS.length]);

  // Оглавление — из заголовков секций (+ FAQ, если есть).
  const toc = post.sections
    .map((s, i) => (s.heading ? { id: anchor(s.heading, i), title: s.heading } : null))
    .filter((t): t is { id: string; title: string } => Boolean(t));
  if (post.faq?.length) toc.push({ id: "faq", title: "Частые вопросы" });

  const schema: object[] = [
    articleSchema({
      title: post.title,
      description: post.description,
      image: post.cover,
      date: post.date,
      dateModified: post.dateModified ?? post.date,
      author: post.author ?? "Технолог Hit Ceramics",
      url: `/blog/${post.slug}`,
    }),
  ];
  if (post.type === "howto") {
    schema.push(
      howToSchema({
        name: post.title,
        steps: post.sections
          .filter((s) => s.step && s.heading)
          .map((s) => ({
            name: s.heading as string,
            text: stripInline([...s.paragraphs, ...(s.list ?? [])].join(" ")),
          })),
      }),
    );
  }
  // FAQ с микроразметкой (AEO): формулировки близки к запросам, каждый ответ
  // самодостаточен — см. website-full-cycle, этап 9.
  if (post.faq?.length) {
    schema.push(faqSchema(post.faq));
  }

  // CTA-врезка ведёт в калькулятор с предвыбранным артикулом из статьи.
  const calcHref = related[0] ? `/calculator?product=${related[0].id}` : "/calculator";

  return (
    <>
      <Header tone="light" />
      <main id="main" className="pt-[72px]">
        <div className="mx-auto flex max-w-6xl gap-10 px-5 py-10">
          <article className="mx-auto w-full min-w-0 max-w-3xl">
            <Breadcrumbs
              items={[
                { name: "Главная", url: "/" },
                { name: "Блог", url: "/blog" },
                { name: post.title, url: `/blog/${post.slug}` },
              ]}
            />
            <div className="mt-6 text-sm text-stone/70">
              {post.type === "howto" ? "Инструкция" : "Статья"} · {fmtDate(post.date)} ·{" "}
              {post.readingMin} мин · {post.author ?? "Технолог Hit Ceramics"}
            </div>
            {post.dateModified && post.dateModified !== post.date ? (
              <div className="mt-1 text-xs text-stone/60">Обновлено: {fmtDate(post.dateModified)}</div>
            ) : null}
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
              {post.title}
            </h1>
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-card">
              <Image
                src={post.cover}
                alt={post.coverAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="img-rich object-cover"
              />
            </div>

            {/* Оглавление на мобильном — свёрнутое, до контента */}
            {toc.length > 1 ? (
              <details className="group mt-8 rounded-card border border-ink/10 bg-white p-4 lg:hidden">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  Содержание <span className="text-stone/60 transition group-open:hidden">▸</span>
                </summary>
                <ol className="mt-3 space-y-1.5 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-stone transition hover:text-clinker">
                        {t.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}

            <div className="mt-10 space-y-8">
              {post.sections.map((sec, i) => (
                <section key={i} id={sec.heading ? anchor(sec.heading, i) : undefined} className="scroll-mt-24">
                  {sec.heading ? (
                    <h2 className="font-display text-2xl font-bold text-ink">{sec.heading}</h2>
                  ) : null}
                  <div className="mt-3 space-y-3 text-lg leading-relaxed text-stone">
                    {sec.paragraphs.map((p, j) => (
                      <p key={j}>{renderInline(p)}</p>
                    ))}
                    {sec.list?.length ? (
                      <ul className="list-disc space-y-1.5 pl-6 marker:text-clinker">
                        {sec.list.map((item, j) => (
                          <li key={j}>{renderInline(item)}</li>
                        ))}
                      </ul>
                    ) : null}
                    {sec.table ? (
                      <div className="overflow-x-auto rounded-card border border-ink/10">
                        <table className="w-full min-w-[560px] text-base">
                          <thead>
                            <tr className="bg-sand-deep text-left">
                              {sec.table.headers.map((h, j) => (
                                <th key={j} className="px-4 py-3 font-semibold text-ink">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sec.table.rows.map((row, j) => (
                              <tr key={j} className={j % 2 ? "bg-sand/40" : "bg-white"}>
                                {row.map((cell, k) => (
                                  <td
                                    key={k}
                                    className={`px-4 py-2.5 align-top ${k === 0 ? "font-medium text-ink" : "text-stone"}`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>

            {/* CTA-врезка: из статьи прямо в расчёт, с артикулом из материала */}
            <div className="relative mt-12 overflow-hidden rounded-xl2 bg-graphite-deep p-7 text-sand sm:p-8">
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(24rem 14rem at 100% 0%, rgba(224,112,63,0.2), transparent 60%)",
                }}
              />
              <div className="relative">
                <h2 className="font-display text-2xl font-extrabold">
                  Рассчитайте комплект под свой размер
                </h2>
                <p className="mt-2 max-w-lg text-sand/80">
                  Калькулятор посчитает штуки по элементам, сопутствующие материалы и вес
                  поставки — за пару минут, без звонков.
                </p>
                <Link
                  href={calcHref}
                  className="sheen mt-5 inline-block rounded-full bg-clinker px-6 py-3 font-semibold text-white transition hover:bg-clinker-hover"
                >
                  Открыть калькулятор →
                </Link>
              </div>
            </div>

            {/* Частые вопросы (AEO): ответы самодостаточны, дублируются
                FAQPage-разметкой выше по schema */}
            {post.faq?.length ? (
              <section id="faq" className="mt-12 scroll-mt-24">
                <h2 className="font-display text-2xl font-bold text-ink">Частые вопросы</h2>
                <div className="mt-5 space-y-5">
                  {post.faq.map((f) => (
                    <div key={f.q} className="rounded-card border border-ink/10 bg-white p-5 shadow-card">
                      <h3 className="font-display text-lg font-bold text-ink">{f.q}</h3>
                      <p className="mt-2 leading-relaxed text-stone">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          {/* Оглавление на десктопе — липкий сайдбар (как у эталона) */}
          {toc.length > 1 ? (
            <aside className="hidden w-56 shrink-0 lg:block" aria-label="Содержание статьи">
              <nav className="sticky top-24 rounded-card border border-ink/10 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-stone/70">
                  Содержание
                </div>
                <ol className="mt-3 space-y-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-stone transition hover:text-clinker">
                        {t.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
        </div>

        {/* Связанные артикулы */}
        {related.length > 0 ? (
          <section className="bg-sand-deep">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
              <Reveal>
                <p className="eyebrow text-clinker">Из статьи</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                  Артикулы из материала
                </h2>
              </Reveal>
              <div className="mt-10">
                <ProductGrid products={related} />
              </div>
            </div>
          </section>
        ) : null}

        {/* Читайте также — перелинковка статей между собой */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Читайте также
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {alsoRead.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={r.cover}
                    alt={r.coverAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    loading="lazy"
                    className="img-rich object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-graphite-deep/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sand">
                    {r.type === "howto" ? "Инструкция" : "Статья"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-ink transition group-hover:text-clinker">
                    {r.title}
                  </h3>
                  <span className="mt-2 inline-block text-sm font-semibold text-clinker">
                    Читать →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/blog" className="font-semibold text-clinker">
              ← Все статьи блога
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <SchemaScript data={schema} />
    </>
  );
}
