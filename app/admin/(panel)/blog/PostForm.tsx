import Link from "next/link";
import type { AdminPost } from "@/lib/store/blog";
import { createPostAction, deletePostAction, updatePostAction } from "../../blog-actions";

/**
 * Форма публикации. Тело — простой текст: «## Заголовок» — секция,
 * «### Заголовок» — шаг HowTo, перевод строки — новый абзац
 * (разбор в lib/store/blog.ts → bodyToSections).
 */
export function PostForm({ post }: { post?: AdminPost }) {
  const isNew = !post;
  return (
    <div className="max-w-3xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/blog" className="a-muted text-sm hover:text-clinker">
            ← Все публикации
          </Link>
          <h1 className="a-h1 mt-1">{isNew ? "Новая публикация" : post!.title}</h1>
          {post ? <p className="a-muted text-sm">/blog/{post.slug}</p> : null}
        </div>
        <div className="flex gap-2">
          {post?.status === "published" ? (
            <Link href={`/blog/${post.slug}`} target="_blank" className="a-btn a-btn-ghost a-btn-sm">
              Открыть на сайте
            </Link>
          ) : null}
          {post ? (
            <form action={deletePostAction}>
              <input type="hidden" name="id" value={post.id} />
              <button className="a-btn a-btn-danger a-btn-sm" type="submit">
                Удалить
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <form action={isNew ? createPostAction : updatePostAction} className="a-card a-card-pad grid gap-4">
        {post ? <input type="hidden" name="id" value={post.id} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="a-label">Заголовок *</span>
            <input name="title" className="a-input" required defaultValue={post?.title ?? ""} />
          </label>
          <label>
            <span className="a-label">Слаг (URL)</span>
            <input
              name="slug"
              className="a-input"
              placeholder="kak-oblitsevat-kryltso"
              defaultValue={post?.slug ?? ""}
            />
          </label>
          <label>
            <span className="a-label">Тип</span>
            <select name="type" className="a-select" defaultValue={post?.type ?? "article"}>
              <option value="article">Статья (Article)</option>
              <option value="howto">Пошаговая инструкция (HowTo)</option>
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="a-label">SEO description</span>
            <textarea name="description" className="a-textarea" defaultValue={post?.description ?? ""} />
          </label>
          <label className="sm:col-span-2">
            <span className="a-label">Анонс (в списке блога)</span>
            <textarea name="excerpt" className="a-textarea" defaultValue={post?.excerpt ?? ""} />
          </label>
          <label>
            <span className="a-label">Обложка (URL)</span>
            <input
              name="cover"
              className="a-input"
              placeholder="/images/cat-clinker.jpg"
              defaultValue={post?.cover ?? ""}
            />
          </label>
          <label>
            <span className="a-label">Alt обложки</span>
            <input name="coverAlt" className="a-input" defaultValue={post?.coverAlt ?? ""} />
          </label>
          <label>
            <span className="a-label">Автор / эксперт</span>
            <input
              name="author"
              className="a-input"
              placeholder="Технолог Hit Ceramics"
              defaultValue={post?.author ?? ""}
            />
          </label>
          <label>
            <span className="a-label">Время чтения, мин</span>
            <input
              name="readingMin"
              className="a-input tabular-nums"
              inputMode="numeric"
              defaultValue={post?.readingMin ?? 4}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="a-label">Связанные артикулы (id через запятую)</span>
            <input
              name="relatedProductIds"
              className="a-input"
              placeholder="paradyz-taurus-brown, stroeher-aera-beige"
              defaultValue={post?.relatedProductIds.join(", ") ?? ""}
            />
          </label>
        </div>

        <label>
          <span className="a-label">Текст публикации</span>
          <textarea
            name="body"
            className="a-textarea min-h-[24rem] font-mono text-[13px]"
            placeholder={"## Подзаголовок\nАбзац текста.\n\n### Шаг 1. Подготовка\nТекст шага (для HowTo)."}
            defaultValue={post?.body ?? ""}
          />
          <span className="a-muted mt-1 block text-xs">
            «## Заголовок» — раздел, «### Заголовок» — шаг инструкции, каждая строка — абзац.
          </span>
        </label>

        <div className="flex flex-wrap items-end gap-3">
          <label>
            <span className="a-label">Статус</span>
            <select name="status" className="a-select w-52" defaultValue={post?.status ?? "draft"}>
              <option value="draft">Черновик</option>
              <option value="published">Опубликовать</option>
            </select>
          </label>
          <button className="a-btn a-btn-primary" type="submit">
            {isNew ? "Создать публикацию" : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
