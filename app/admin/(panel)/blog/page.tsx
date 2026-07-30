import Link from "next/link";
import { hasDb } from "@/lib/db/client";
import { listPosts } from "@/lib/store/blog";
import { BLOG_POSTS } from "@/lib/content/blog";
import { importSeedPostAction } from "../../blog-actions";

export const dynamic = "force-dynamic";

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

export default async function AdminBlog() {
  const posts = await listPosts();
  const inDb = new Set(posts.map((p) => p.slug));
  const seedOnly = BLOG_POSTS.filter((p) => !inDb.has(p.slug));

  return (
    <div className="max-w-4xl">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="a-h1">Блог</h1>
        <Link href="/admin/blog/new" className="a-btn a-btn-primary a-btn-sm">
          Новая публикация
        </Link>
      </div>
      <p className="a-muted mt-1 mb-6 max-w-3xl">
        Публикации из базы дополняют статьи из кода; при совпадении слага версия из базы
        показывается вместо кодовой.
      </p>

      <div className="a-card a-scroll-x mb-8">
        <table className="a-table">
          <thead>
            <tr>
              <th>Заголовок</th>
              <th>Тип</th>
              <th>Статус</th>
              <th>Опубликована</th>
              <th>Обновлена</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/admin/blog/${p.id}`} className="font-semibold text-ink hover:text-clinker">
                    {p.title}
                  </Link>
                  <div className="a-muted text-xs">/blog/{p.slug}</div>
                </td>
                <td className="a-muted text-xs">{p.type === "howto" ? "HowTo" : "Статья"}</td>
                <td>
                  <span className={`a-badge ${p.status === "published" ? "a-badge-ok" : "a-badge-warn"}`}>
                    {p.status === "published" ? "опубликована" : "черновик"}
                  </span>
                </td>
                <td className="a-muted text-xs">{fmt(p.publishedAt)}</td>
                <td className="a-muted text-xs">{fmt(p.updatedAt)}</td>
                <td>
                  <Link href={`/admin/blog/${p.id}`} className="a-btn a-btn-ghost a-btn-sm">
                    Открыть
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="a-muted py-10 text-center">
                  В базе публикаций нет
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {seedOnly.length ? (
        <section className="a-card">
          <div className="border-b border-sand-divider px-5 py-4">
            <h2 className="a-h2">Статьи из кода</h2>
            <p className="a-muted text-sm">
              Показываются на сайте как есть. Скопируйте в базу, чтобы редактировать из админки.
            </p>
          </div>
          <div className="divide-y divide-sand-divider">
            {seedOnly.map((p) => (
              <div key={p.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-ink">{p.title}</div>
                  <div className="a-muted text-xs">
                    /blog/{p.slug} · {p.type === "howto" ? "HowTo" : "Статья"} · {p.date}
                  </div>
                </div>
                <form action={importSeedPostAction}>
                  <input type="hidden" name="slug" value={p.slug} />
                  <button className="a-btn a-btn-ghost a-btn-sm" type="submit" disabled={!hasDb()}>
                    Копировать в базу
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
