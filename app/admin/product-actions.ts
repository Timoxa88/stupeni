"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import {
  productById,
  resetOverride,
  setActive,
  setContent,
  setPrices,
  setPromo,
  setStock,
  type PriceOverride,
} from "@/lib/store/products";
import { revalidateCatalog } from "./revalidate";

const s = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const n = (fd: FormData, key: string): number | null => {
  const raw = s(fd, key).replace(/\s/g, "").replace(",", ".");
  if (!raw) return null;
  const v = Number(raw);
  return Number.isFinite(v) ? v : null;
};

function afterProduct(id: string) {
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidateCatalog();
}

/** Инлайн-переключатель видимости в списке артикулов. */
export async function toggleActiveAction(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  if (!id) return;
  await setActive(id, s(fd, "active") === "true");
  afterProduct(id);
}

/**
 * Цены: элементы (₽/шт) и форматы (₽/м², ₽/шт). Поле, равное цене из сида или
 * пустое, оверрайдом не становится — так «сброс» делается очисткой поля.
 */
export async function updatePricesAction(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const base = await productById(id);
  if (!base) return;

  const prices: PriceOverride = {};
  for (const e of base.elements ?? []) {
    const v = n(fd, `el_${e.code}`);
    if (v != null && v >= 0 && Math.round(v) !== e.price_rub) {
      (prices.elements ??= {})[e.code] = Math.round(v);
    }
  }
  for (const f of base.formats ?? []) {
    const sqm = n(fd, `fmt_${f.code}_sqm`);
    const pcs = n(fd, `fmt_${f.code}_pcs`);
    const patch: { sqm?: number; pcs?: number } = {};
    if (sqm != null && sqm >= 0 && Math.round(sqm) !== f.price_rub_sqm) patch.sqm = Math.round(sqm);
    if (pcs != null && pcs > 0 && Math.round(pcs) !== (f.price_rub_pcs ?? -1)) patch.pcs = Math.round(pcs);
    if (Object.keys(patch).length) (prices.formats ??= {})[f.code] = patch;
  }

  await setPrices(id, Object.keys(prices).length ? prices : null);
  afterProduct(id);
  redirect(`/admin/products/${id}?saved=prices`);
}

/** Контент: коллекция, характеристики, фото, SEO. Пусто/как в сиде → без оверрайда. */
export async function updateContentAction(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const base = await productById(id);
  if (!base) return;

  const collection = s(fd, "collection");
  const specsInput = {
    surface: s(fd, "surface"),
    color: s(fd, "color"),
    color_hex: s(fd, "color_hex"),
    frost_resistance: s(fd, "frost_resistance"),
    water_absorption_pct: n(fd, "water_absorption_pct") ?? base.specs.water_absorption_pct,
    slip_resistance: s(fd, "slip_resistance"),
  };
  // В оверрайд попадают только отличия от сида — минимальный дифф в БД.
  const specs: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(specsInput)) {
    const seedVal = (base.specs as unknown as Record<string, unknown>)[k];
    if (v !== "" && v != null && v !== seedVal) specs[k] = v;
  }

  let photos: string[] | null = null;
  try {
    const parsed = JSON.parse(s(fd, "photos") || "[]");
    if (Array.isArray(parsed)) {
      const list = parsed.filter((u): u is string => typeof u === "string" && !!u);
      photos = list.length && JSON.stringify(list) !== JSON.stringify(base.photos) ? list : null;
    }
  } catch {
    photos = null;
  }

  const seoInput = {
    title: s(fd, "seo_title"),
    description: s(fd, "seo_description"),
    h1: s(fd, "seo_h1"),
  };
  const seo: Record<string, string> = {};
  for (const [k, v] of Object.entries(seoInput)) {
    if (v && v !== (base.seo as unknown as Record<string, string>)[k]) seo[k] = v;
  }

  await setContent(id, {
    collection: collection && collection !== base.collection ? collection : null,
    specs: Object.keys(specs).length ? specs : null,
    photos,
    seo: Object.keys(seo).length ? seo : null,
  });
  afterProduct(id);
  redirect(`/admin/products/${id}?saved=content`);
}

/** Промо-акция (ТЗ §8.1): пустой label и цена → акция снята. */
export async function updatePromoAction(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  if (!id) return;

  const label = s(fd, "promo_label");
  const oldPrice = n(fd, "promo_old_price");
  const discount = n(fd, "promo_discount");
  const endsAt = s(fd, "promo_ends_at");
  const on = s(fd, "promo_on") === "true";

  if (!on || (!label && !oldPrice && !discount)) {
    await setPromo(id, null);
  } else {
    await setPromo(id, {
      ...(label ? { label } : {}),
      ...(oldPrice != null && oldPrice > 0 ? { old_price: Math.round(oldPrice) } : {}),
      ...(discount != null && discount > 0 ? { discount_percent: Math.round(discount) } : {}),
      // <input type="datetime-local"> отдаёт локальное время без зоны — приводим к ISO.
      ...(endsAt ? { ends_at: new Date(endsAt).toISOString() } : {}),
    });
  }
  afterProduct(id);
  redirect(`/admin/products/${id}?saved=promo`);
}

/** Наличие и срок поставки (ТЗ B.8/B.9). */
export async function updateStockAction(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  if (!id) return;
  const status = s(fd, "stock_status");
  const weeks = n(fd, "lead_time_weeks");
  await setStock(
    id,
    status === "in_stock" || status === "on_order" ? status : null,
    weeks != null && weeks > 0 ? Math.round(weeks) : null,
  );
  afterProduct(id);
  redirect(`/admin/products/${id}?saved=stock`);
}

export async function resetProductAction(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  if (!id) return;
  await resetOverride(id);
  afterProduct(id);
  redirect(`/admin/products/${id}?saved=reset`);
}
