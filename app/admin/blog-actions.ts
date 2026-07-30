"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createPost, deletePost, importSeedPost, updatePost, type PostInput } from "@/lib/store/blog";
import { revalidateBlog } from "./revalidate";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function fromForm(fd: FormData): PostInput {
  return {
    slug: s(fd, "slug"),
    type: s(fd, "type") === "howto" ? "howto" : "article",
    title: s(fd, "title"),
    description: s(fd, "description"),
    excerpt: s(fd, "excerpt"),
    body: String(fd.get("body") ?? ""),
    cover: s(fd, "cover") || null,
    coverAlt: s(fd, "coverAlt") || null,
    author: s(fd, "author") || null,
    readingMin: Number(s(fd, "readingMin")) || 4,
    relatedProductIds: s(fd, "relatedProductIds")
      .split(/[,\s]+/)
      .map((x) => x.trim())
      .filter(Boolean),
    status: s(fd, "status") === "published" ? "published" : "draft",
  };
}

export async function createPostAction(fd: FormData) {
  await requireAdmin();
  const id = await createPost(fromForm(fd));
  revalidatePath("/admin/blog");
  revalidateBlog();
  redirect(id ? `/admin/blog/${id}?saved=1` : "/admin/blog?error=1");
}

export async function updatePostAction(fd: FormData) {
  await requireAdmin();
  const id = Number(s(fd, "id"));
  if (!Number.isFinite(id)) return;
  await updatePost(id, fromForm(fd));
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidateBlog();
  redirect(`/admin/blog/${id}?saved=1`);
}

export async function deletePostAction(fd: FormData) {
  await requireAdmin();
  const id = Number(s(fd, "id"));
  if (Number.isFinite(id)) await deletePost(id);
  revalidatePath("/admin/blog");
  revalidateBlog();
  redirect("/admin/blog");
}

/** Скопировать статью из кода в БД, чтобы править её из админки. */
export async function importSeedPostAction(fd: FormData) {
  await requireAdmin();
  const slug = s(fd, "slug");
  const id = await importSeedPost(slug);
  revalidatePath("/admin/blog");
  revalidateBlog();
  if (id) redirect(`/admin/blog/${id}?saved=1`);
}
