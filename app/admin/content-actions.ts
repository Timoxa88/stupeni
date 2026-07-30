"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import {
  CONTENT_DEFAULTS,
  resetContentSection,
  setContentSection,
  setFaq,
  type ContentKey,
  type FaqTarget,
} from "@/lib/store/content";
import { revalidateContent } from "./revalidate";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/** Пары «поле-i» из повторяющихся строк формы: title-0, text-0, title-1 … */
function rows(fd: FormData, keys: string[], limit = 24): Record<string, string>[] {
  const out: Record<string, string>[] = [];
  for (let i = 0; i < limit; i++) {
    const row: Record<string, string> = {};
    let any = false;
    for (const k of keys) {
      const v = s(fd, `${k}-${i}`);
      row[k] = v;
      if (v) any = true;
    }
    if (any) out.push(row);
  }
  return out;
}

function after(section: string) {
  revalidatePath("/admin/content");
  revalidateContent();
  redirect(`/admin/content?saved=${section}`);
}

export async function saveHeroAction(fd: FormData) {
  await requireAdmin();
  const d = CONTENT_DEFAULTS.hero;
  await setContentSection("hero", {
    eyebrow: s(fd, "eyebrow") || d.eyebrow,
    titleLine1: s(fd, "titleLine1") || d.titleLine1,
    titleLine2: s(fd, "titleLine2") || d.titleLine2,
    titleAccent: s(fd, "titleAccent") || d.titleAccent,
    subtitle: s(fd, "subtitle") || d.subtitle,
    primaryCta: {
      label: s(fd, "primaryLabel") || d.primaryCta.label,
      href: s(fd, "primaryHref") || d.primaryCta.href,
    },
    secondaryCta: {
      label: s(fd, "secondaryLabel") || d.secondaryCta.label,
      href: s(fd, "secondaryHref") || d.secondaryCta.href,
    },
  });
  after("hero");
}

export async function saveAdvantagesAction(fd: FormData) {
  await requireAdmin();
  const items = rows(fd, ["title", "text"]).map((r) => ({ title: r.title, text: r.text }));
  await setContentSection("advantages", { items: items.length ? items : CONTENT_DEFAULTS.advantages.items });
  after("advantages");
}

export async function saveServicesAction(fd: FormData) {
  await requireAdmin();
  const items = rows(fd, ["title", "desc", "tag"]).map((r) => ({
    title: r.title,
    desc: r.desc,
    // Тег уходит в CRM как метка заявки (ТЗ §12.2) — без него берём название.
    tag: r.tag || r.title,
  }));
  await setContentSection("services", { items: items.length ? items : CONTENT_DEFAULTS.services.items });
  after("services");
}

export async function saveContactsAction(fd: FormData) {
  await requireAdmin();
  const d = CONTENT_DEFAULTS.contacts;
  const cities = rows(fd, ["city", "phone", "phoneLabel"]).map((r) => ({
    city: r.city,
    phone: r.phone,
    phoneLabel: r.phoneLabel || r.phone,
  }));
  await setContentSection("contacts", {
    phone: s(fd, "phone") || d.phone,
    phoneLabel: s(fd, "phoneLabel") || d.phoneLabel,
    email: s(fd, "email") || d.email,
    legal: s(fd, "legal") || d.legal,
    inn: s(fd, "inn") || d.inn,
    ogrn: s(fd, "ogrn") || d.ogrn,
    cities: cities.length ? cities : d.cities,
    places: d.places,
  });
  after("contacts");
}

export async function resetSectionAction(fd: FormData) {
  await requireAdmin();
  const key = s(fd, "key") as ContentKey;
  if (key in CONTENT_DEFAULTS) await resetContentSection(key);
  revalidatePath("/admin/content");
  revalidateContent();
}

// ── FAQ ─────────────────────────────────────────────────────────────────────

export async function saveFaqAction(fd: FormData) {
  await requireAdmin();
  const target = (s(fd, "target") || "home") as FaqTarget;
  const items = rows(fd, ["q", "a"], 40).map((r) => ({ q: r.q, a: r.a }));
  await setFaq(target, items);
  revalidatePath("/admin/faq");
  revalidatePath("/");
  redirect("/admin/faq?saved=1");
}
