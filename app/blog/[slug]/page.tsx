import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { BLOG_POSTS, getPost } from "@/lib/content/blog";
import { getProductById } from "@/lib/catalog/queries";
import { articleSchema, howToSchema } from "@/lib/jsonld";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.description, images: [p.cover], type: "article" },
  };
}

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = post.relatedProductIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

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
          .map((s) => ({ name: s.heading as string, text: s.paragraphs.join(" ") })),
      }),
    );
  }

  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <article className="mx-auto max-w-3xl px-5 py-10">
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

          <div className="mt-10 space-y-8">
            {post.sections.map((sec, i) => (
              <section key={i}>
                {sec.heading ? (
                  <h2 className="font-display text-2xl font-bold text-ink">{sec.heading}</h2>
                ) : null}
                <div className="mt-3 space-y-3 text-lg leading-relaxed text-stone">
                  {sec.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

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
              <div className="mt-8">
                <Link href="/blog" className="font-semibold text-clinker">
                  ← Все статьи блога
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <SchemaScript data={schema} />
    </>
  );
}
