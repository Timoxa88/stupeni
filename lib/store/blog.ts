import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, hasDb, schema } from "@/lib/db/client";
import { BLOG_POSTS, type BlogPost } from "@/lib/content/blog";

/**
 * Блог: сид (lib/content/blog.ts) + публикации из БД. Слаг из БД перекрывает
 * сидовый — так можно отредактировать существующую статью, не трогая код.
 * Тело хранится текстом: строки «## Заголовок» становятся секциями,
 * пустая строка разделяет абзацы, «### шаг» помечает шаг HowTo.
 */

export type AdminPost = {
  id: number;
  slug: string;
  type: "article" | "howto";
  title: string;
  description: string;
  excerpt: string;
  body: string;
  cover: string | null;
  coverAlt: string | null;
  author: string | null;
  readingMin: number;
  relatedProductIds: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string;
};

function rowToPost(r: typeof schema.blogPosts.$inferSelect): AdminPost {
  const iso = (d: Date | null) => (d ? (d instanceof Date ? d : new Date(d)).toISOString() : null);
  return {
    id: r.id,
    slug: r.slug,
    type: (r.type as AdminPost["type"]) ?? "article",
    title: r.title,
    description: r.description,
    excerpt: r.excerpt,
    body: r.body,
    cover: r.cover,
    coverAlt: r.coverAlt,
    author: r.author,
    readingMin: r.readingMin,
    relatedProductIds: (r.relatedProductIds ?? []) as string[],
    status: (r.status as AdminPost["status"]) ?? "draft",
    publishedAt: iso(r.publishedAt),
    updatedAt: iso(r.updatedAt)!,
  };
}

/** Текст → секции BlogPost (## заголовок, ### заголовок шага HowTo). */
export function bodyToSections(body: string): BlogPost["sections"] {
  const sections: BlogPost["sections"] = [];
  let current: BlogPost["sections"][number] | null = null;

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const step = line.startsWith("### ");
    const heading = step || line.startsWith("## ");
    if (heading) {
      current = { heading: line.replace(/^#{2,3}\s+/, ""), ...(step ? { step: true } : {}), paragraphs: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { paragraphs: [] };
      sections.push(current);
    }
    current.paragraphs.push(line);
  }
  return sections.filter((s) => s.paragraphs.length > 0 || s.heading);
}

/** Секции → текст (для редактора). */
export function sectionsToBody(sections: BlogPost["sections"]): string {
  return sections
    .map((s) => {
      const head = s.heading ? `${s.step ? "###" : "##"} ${s.heading}\n` : "";
      return head + s.paragraphs.join("\n");
    })
    .join("\n\n");
}

function toBlogPost(p: AdminPost): BlogPost {
  return {
    slug: p.slug,
    type: p.type,
    title: p.title,
    description: p.description,
    excerpt: p.excerpt,
    cover: p.cover || "/images/cat-clinker.jpg",
    coverAlt: p.coverAlt || p.title,
    date: (p.publishedAt ?? p.updatedAt).slice(0, 10),
    dateModified: p.updatedAt.slice(0, 10),
    author: p.author ?? undefined,
    readingMin: p.readingMin,
    relatedProductIds: p.relatedProductIds,
    sections: bodyToSections(p.body),
  };
}

/** Все публикации из БД (админка). */
export async function listPosts(): Promise<AdminPost[]> {
  if (!hasDb()) return [];
  try {
    const rows = await db().select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.updatedAt));
    return rows.map(rowToPost);
  } catch {
    return [];
  }
}

export async function getPostById(id: number): Promise<AdminPost | undefined> {
  if (!hasDb()) return undefined;
  try {
    const [row] = await db().select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id)).limit(1);
    return row ? rowToPost(row) : undefined;
  } catch {
    return undefined;
  }
}

/** Витрина блога: сид ⊕ опубликованное из БД (БД перекрывает по слагу). */
export async function publishedPosts(): Promise<BlogPost[]> {
  const fromDb = (await listPosts()).filter((p) => p.status === "published").map(toBlogPost);
  const bySlug = new Map(BLOG_POSTS.map((p) => [p.slug, p]));
  for (const p of fromDb) bySlug.set(p.slug, p);
  return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function publishedPost(slug: string): Promise<BlogPost | undefined> {
  return (await publishedPosts()).find((p) => p.slug === slug);
}

export type PostInput = Omit<AdminPost, "id" | "updatedAt" | "publishedAt">;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9а-я\-\s]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

export async function createPost(input: PostInput): Promise<number | null> {
  const slug = slugify(input.slug || input.title);
  if (!slug || !input.title.trim()) return null;
  const [row] = await db()
    .insert(schema.blogPosts)
    .values({
      slug,
      type: input.type,
      title: input.title.trim(),
      description: input.description.trim(),
      excerpt: input.excerpt.trim(),
      body: input.body,
      cover: input.cover || null,
      coverAlt: input.coverAlt || null,
      author: input.author || null,
      readingMin: Math.max(1, Math.round(input.readingMin || 4)),
      relatedProductIds: input.relatedProductIds ?? [],
      status: input.status,
      publishedAt: input.status === "published" ? new Date() : null,
    })
    .returning({ id: schema.blogPosts.id });
  return row?.id ?? null;
}

export async function updatePost(id: number, input: PostInput): Promise<void> {
  const existing = await getPostById(id);
  await db()
    .update(schema.blogPosts)
    .set({
      slug: slugify(input.slug || input.title),
      type: input.type,
      title: input.title.trim(),
      description: input.description.trim(),
      excerpt: input.excerpt.trim(),
      body: input.body,
      cover: input.cover || null,
      coverAlt: input.coverAlt || null,
      author: input.author || null,
      readingMin: Math.max(1, Math.round(input.readingMin || 4)),
      relatedProductIds: input.relatedProductIds ?? [],
      status: input.status,
      // Дата публикации ставится один раз — при первом переводе в «опубликовано».
      publishedAt:
        input.status === "published"
          ? existing?.publishedAt
            ? new Date(existing.publishedAt)
            : new Date()
          : null,
      updatedAt: new Date(),
    })
    .where(eq(schema.blogPosts.id, id));
}

export async function deletePost(id: number): Promise<void> {
  await db().delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
}

/** Перенести сидовую статью в БД для редактирования. */
export async function importSeedPost(slug: string): Promise<number | null> {
  const seed = BLOG_POSTS.find((p) => p.slug === slug);
  if (!seed) return null;
  return createPost({
    slug: seed.slug,
    type: seed.type,
    title: seed.title,
    description: seed.description,
    excerpt: seed.excerpt,
    body: sectionsToBody(seed.sections),
    cover: seed.cover,
    coverAlt: seed.coverAlt,
    author: seed.author ?? null,
    readingMin: seed.readingMin,
    relatedProductIds: seed.relatedProductIds,
    status: "published",
  });
}
