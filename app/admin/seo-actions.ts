"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { clearSeoOverride, setSeoOverride } from "@/lib/store/seo";
import { revalidateCatalog, revalidateContent } from "./revalidate";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function saveSeoAction(fd: FormData) {
  await requireAdmin();
  const key = s(fd, "key");
  if (!key) return;
  await setSeoOverride(key, {
    title: s(fd, "title") || null,
    description: s(fd, "description") || null,
    h1: s(fd, "h1") || null,
    ogImage: s(fd, "ogImage") || null,
    noindex: fd.get("noindex") === "on",
  });
  revalidatePath("/admin/seo");
  revalidateCatalog();
  revalidateContent();
}

export async function clearSeoAction(fd: FormData) {
  await requireAdmin();
  const key = s(fd, "key");
  if (!key) return;
  await clearSeoOverride(key);
  revalidatePath("/admin/seo");
  revalidateCatalog();
  revalidateContent();
}
