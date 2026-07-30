import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_PRODUCTS } from "@/lib/catalog/seed";
import { getOverrides, productById } from "@/lib/store/products";
import { brandSlugByName } from "@/lib/catalog/brands";
import { formatRub } from "@/lib/format";
import { PhotoManager } from "../PhotoManager";
import {
  resetProductAction,
  updateContentAction,
  updatePricesAction,
  updatePromoAction,
  updateStockAction,
} from "../../../product-actions";

export const dynamic = "force-dynamic";

const SAVED_LABELS: Record<string, string> = {
  prices: "Цены сохранены",
  content: "Контент сохранён",
  promo: "Промо обновлено",
  stock: "Наличие обновлено",
  reset: "Все переопределения сброшены",
};

/** Значение для input: показываем оверрайд, дефолт — в placeholder. */
const localDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default async function AdminProductCard({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;

  const seed = SEED_PRODUCTS.find((p) => p.id === id);
  const product = await productById(id);
  if (!seed || !product) notFound();

  const override = (await getOverrides()).get(id);
  const slug = brandSlugByName(product.brand);

  return (
    <div className="max-w-4xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/products" className="a-muted text-sm hover:text-clinker">
            ← Все артикулы
          </Link>
          <h1 className="a-h1 mt-1">
            {product.brand} {product.collection}
          </h1>
          <p className="a-muted text-sm">
            {product.sku} · {product.id} ·{" "}
            {product.product_type === "step_system" ? "система ступеней" : "террасные пластины"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/catalog/tovar/${product.id}`} className="a-btn a-btn-ghost a-btn-sm" target="_blank">
            Открыть на сайте
          </Link>
          {slug ? (
            <Link href={`/producers/${slug}`} className="a-btn a-btn-ghost a-btn-sm" target="_blank">
              Страница бренда
            </Link>
          ) : null}
          {override ? (
            <form action={resetProductAction}>
              <input type="hidden" name="id" value={product.id} />
              <button className="a-btn a-btn-danger a-btn-sm" type="submit">
                Сбросить все правки
              </button>
            </form>
          ) : null}
        </div>
      </div>

      {saved && SAVED_LABELS[saved] ? (
        <div className="a-card a-card-pad mb-5 border-[#b9c6b3] bg-[#f2f6f0]">
          <p className="text-sm font-semibold text-[#3c5236]">✓ {SAVED_LABELS[saved]}</p>
        </div>
      ) : null}

      {/* ── Цены ── */}
      <section className="a-card mb-5">
        <div className="border-b border-sand-divider px-5 py-4">
          <h2 className="a-h2">Цены</h2>
          <p className="a-muted text-sm">
            Пустое поле — цена из каталога (показана в подсказке). Значение, равное каталожному,
            оверрайдом не становится.
          </p>
        </div>
        <form action={updatePricesAction} className="a-card-pad">
          <input type="hidden" name="id" value={product.id} />

          {seed.elements?.length ? (
            <div className="a-scroll-x">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>Элемент</th>
                    <th>Размер</th>
                    <th>Каталог, ₽</th>
                    <th>Цена, ₽/шт</th>
                  </tr>
                </thead>
                <tbody>
                  {seed.elements.map((e) => (
                    <tr key={e.code}>
                      <td>
                        {e.name}
                        <div className="a-muted text-xs">{e.code}</div>
                      </td>
                      <td className="a-muted text-xs">{e.size_mm}</td>
                      <td className="a-muted tabular-nums">{formatRub(e.price_rub)}</td>
                      <td>
                        <input
                          name={`el_${e.code}`}
                          className="a-input w-32 tabular-nums"
                          inputMode="numeric"
                          placeholder={String(e.price_rub)}
                          defaultValue={
                            override?.prices?.elements?.[e.code] != null
                              ? String(override.prices.elements[e.code])
                              : ""
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {seed.formats?.length ? (
            <div className="a-scroll-x mt-4">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>Формат</th>
                    <th>Каталог ₽/м²</th>
                    <th>Цена, ₽/м²</th>
                    <th>Каталог ₽/шт</th>
                    <th>Цена, ₽/шт</th>
                  </tr>
                </thead>
                <tbody>
                  {seed.formats.map((f) => (
                    <tr key={f.code}>
                      <td>
                        {f.size_mm}
                        <div className="a-muted text-xs">
                          {f.code} · {f.thickness_mm} мм
                        </div>
                      </td>
                      <td className="a-muted tabular-nums">{formatRub(f.price_rub_sqm)}</td>
                      <td>
                        <input
                          name={`fmt_${f.code}_sqm`}
                          className="a-input w-32 tabular-nums"
                          inputMode="numeric"
                          placeholder={String(f.price_rub_sqm)}
                          defaultValue={
                            override?.prices?.formats?.[f.code]?.sqm != null
                              ? String(override.prices.formats[f.code].sqm)
                              : ""
                          }
                        />
                      </td>
                      <td className="a-muted tabular-nums">
                        {f.price_rub_pcs ? formatRub(f.price_rub_pcs) : "—"}
                      </td>
                      <td>
                        <input
                          name={`fmt_${f.code}_pcs`}
                          className="a-input w-32 tabular-nums"
                          inputMode="numeric"
                          placeholder={f.price_rub_pcs ? String(f.price_rub_pcs) : "—"}
                          defaultValue={
                            override?.prices?.formats?.[f.code]?.pcs != null
                              ? String(override.prices.formats[f.code].pcs)
                              : ""
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <button className="a-btn a-btn-primary mt-4" type="submit">
            Сохранить цены
          </button>
        </form>
      </section>

      {/* ── Контент ── */}
      <section className="a-card mb-5">
        <div className="border-b border-sand-divider px-5 py-4">
          <h2 className="a-h2">Контент и характеристики</h2>
          <p className="a-muted text-sm">Название коллекции, характеристики, фото, SEO карточки.</p>
        </div>
        <form action={updateContentAction} className="a-card-pad">
          <input type="hidden" name="id" value={product.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="a-label">Коллекция</span>
              <input
                name="collection"
                className="a-input"
                placeholder={seed.collection}
                defaultValue={override?.collection ?? ""}
              />
            </label>
            <label>
              <span className="a-label">Поверхность</span>
              <input
                name="surface"
                className="a-input"
                placeholder={seed.specs.surface}
                defaultValue={override?.specs?.surface ?? ""}
              />
            </label>
            <label>
              <span className="a-label">Цвет</span>
              <input
                name="color"
                className="a-input"
                placeholder={seed.specs.color}
                defaultValue={override?.specs?.color ?? ""}
              />
            </label>
            <label>
              <span className="a-label">HEX цвета</span>
              <input
                name="color_hex"
                className="a-input"
                placeholder={seed.specs.color_hex}
                defaultValue={override?.specs?.color_hex ?? ""}
              />
            </label>
            <label>
              <span className="a-label">Морозостойкость</span>
              <input
                name="frost_resistance"
                className="a-input"
                placeholder={seed.specs.frost_resistance ?? "не задано"}
                defaultValue={override?.specs?.frost_resistance ?? ""}
              />
            </label>
            <label>
              <span className="a-label">Водопоглощение, %</span>
              <input
                name="water_absorption_pct"
                className="a-input tabular-nums"
                inputMode="decimal"
                placeholder={seed.specs.water_absorption_pct != null ? String(seed.specs.water_absorption_pct) : "не задано"}
                defaultValue={
                  override?.specs?.water_absorption_pct != null
                    ? String(override.specs.water_absorption_pct)
                    : ""
                }
              />
            </label>
            <label>
              <span className="a-label">Противоскольжение</span>
              <input
                name="slip_resistance"
                className="a-input"
                placeholder={seed.specs.slip_resistance ?? "не задано"}
                defaultValue={override?.specs?.slip_resistance ?? ""}
              />
            </label>
          </div>

          <div className="mt-5">
            <span className="a-label">Фото карточки</span>
            <PhotoManager initial={override?.photos ?? []} />
            <p className="a-muted mt-2 text-xs">
              Пусто — используются фото каталога: {seed.photos.join(", ")}
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            <label>
              <span className="a-label">SEO title</span>
              <input
                name="seo_title"
                className="a-input"
                placeholder={seed.seo.title}
                defaultValue={override?.seo?.title ?? ""}
              />
            </label>
            <label>
              <span className="a-label">SEO description</span>
              <textarea
                name="seo_description"
                className="a-textarea"
                placeholder={seed.seo.description}
                defaultValue={override?.seo?.description ?? ""}
              />
            </label>
            <label>
              <span className="a-label">H1</span>
              <input
                name="seo_h1"
                className="a-input"
                placeholder={seed.seo.h1}
                defaultValue={override?.seo?.h1 ?? ""}
              />
            </label>
          </div>

          <button className="a-btn a-btn-primary mt-4" type="submit">
            Сохранить контент
          </button>
        </form>
      </section>

      {/* ── Промо ── */}
      <section className="a-card mb-5">
        <div className="border-b border-sand-divider px-5 py-4">
          <h2 className="a-h2">Промо-акция</h2>
          <p className="a-muted text-sm">
            Бейдж и таймер в витрине. По дате окончания акция гаснет автоматически.
          </p>
        </div>
        <form action={updatePromoAction} className="a-card-pad">
          <input type="hidden" name="id" value={product.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" name="promo_on" value="true" defaultChecked={!!product.promo} className="h-4 w-4" />
              <span className="text-sm font-semibold">Акция включена</span>
            </label>
            <label>
              <span className="a-label">Метка</span>
              <input
                name="promo_label"
                className="a-input"
                placeholder="Акция / Хит"
                defaultValue={product.promo?.label ?? ""}
              />
            </label>
            <label>
              <span className="a-label">Старая цена, ₽</span>
              <input
                name="promo_old_price"
                className="a-input tabular-nums"
                inputMode="numeric"
                defaultValue={product.promo?.old_price ?? ""}
              />
            </label>
            <label>
              <span className="a-label">Скидка, %</span>
              <input
                name="promo_discount"
                className="a-input tabular-nums"
                inputMode="numeric"
                defaultValue={product.promo?.discount_percent ?? ""}
              />
            </label>
            <label>
              <span className="a-label">Действует до</span>
              <input
                type="datetime-local"
                name="promo_ends_at"
                className="a-input"
                defaultValue={localDate(product.promo?.ends_at)}
              />
            </label>
          </div>
          <button className="a-btn a-btn-primary mt-4" type="submit">
            Сохранить промо
          </button>
        </form>
      </section>

      {/* ── Наличие ── */}
      <section className="a-card">
        <div className="border-b border-sand-divider px-5 py-4">
          <h2 className="a-h2">Наличие и срок поставки</h2>
          <p className="a-muted text-sm">
            Влияет на бейдж в витрине и availability в разметке Schema.org.
          </p>
        </div>
        <form action={updateStockAction} className="a-card-pad">
          <input type="hidden" name="id" value={product.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="a-label">Статус</span>
              <select name="stock_status" defaultValue={product.stock_status ?? ""} className="a-select">
                <option value="">Как в каталоге ({seed.stock_status ?? "in_stock"})</option>
                <option value="in_stock">В наличии</option>
                <option value="on_order">Под заказ</option>
              </select>
            </label>
            <label>
              <span className="a-label">Срок поставки, недель</span>
              <input
                name="lead_time_weeks"
                className="a-input tabular-nums"
                inputMode="numeric"
                placeholder={seed.lead_time_weeks ? String(seed.lead_time_weeks) : "—"}
                defaultValue={override?.leadTimeWeeks ?? ""}
              />
            </label>
          </div>
          <button className="a-btn a-btn-primary mt-4" type="submit">
            Сохранить наличие
          </button>
        </form>
      </section>
    </div>
  );
}
