"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { deleteError, deleteResolvedErrors, reopenError, resolveError } from "@/lib/store/errors";

const id = (fd: FormData) => Number(fd.get("id"));

export async function resolveErrorAction(fd: FormData) {
  await requireAdmin();
  const n = id(fd);
  if (Number.isFinite(n)) await resolveError(n);
  revalidatePath("/admin/errors");
}

export async function reopenErrorAction(fd: FormData) {
  await requireAdmin();
  const n = id(fd);
  if (Number.isFinite(n)) await reopenError(n);
  revalidatePath("/admin/errors");
}

export async function deleteErrorAction(fd: FormData) {
  await requireAdmin();
  const n = id(fd);
  if (Number.isFinite(n)) await deleteError(n);
  revalidatePath("/admin/errors");
}

export async function clearResolvedAction() {
  await requireAdmin();
  await deleteResolvedErrors();
  revalidatePath("/admin/errors");
}
