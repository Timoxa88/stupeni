"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { setSettings, type SiteSettings } from "@/lib/store/settings";
import { revalidateCatalog, revalidateContent } from "./revalidate";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function saveSettingsAction(fd: FormData) {
  await requireAdmin();
  const value: Partial<SiteSettings> = {
    ymCounterId: s(fd, "ymCounterId"),
    ymCounterIdExtra: s(fd, "ymCounterIdExtra"),
    gtmId: s(fd, "gtmId"),
    callibri: s(fd, "callibri"),
    yandexVerification: s(fd, "yandexVerification"),
    googleVerification: s(fd, "googleVerification"),
    yandexMapsKey: s(fd, "yandexMapsKey"),
    bitrixTitlePrefix: s(fd, "bitrixTitlePrefix"),
    bitrixSourceId: s(fd, "bitrixSourceId"),
    bitrixAssignedById: s(fd, "bitrixAssignedById"),
    bitrixSiteLabel: s(fd, "bitrixSiteLabel"),
    bitrixCurrencyId: s(fd, "bitrixCurrencyId"),
    bitrixUfFormName: s(fd, "bitrixUfFormName"),
    bitrixUfProduct: s(fd, "bitrixUfProduct"),
    bitrixUfArea: s(fd, "bitrixUfArea"),
  };
  await setSettings(value);
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidateContent();
  revalidateCatalog();
  redirect("/admin/settings?saved=1");
}
