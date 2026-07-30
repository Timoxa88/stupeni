import Link from "next/link";
import { allProducts, getOverrides } from "@/lib/store/products";
import { basePrice, priceUnitLabel, productCategory } from "@/lib/catalog/queries";
import { formatRub } from "@/lib/format";
import { toggleActiveAction } from "../../../admin/product-actions";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  "terrasnyy-klinker": "Террасный клинкер",
  "terrasnye-plastiny": "Террасные пластины",
  "plastiny-pod-derevo": "Под дерево",
};

const PER_PAGE = 50;

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; brand?: string; cat?: string; page?: string }>;
}) {
  const { q = "", brand = "all", cat = "all", page: pageRaw } = await searchParams;
  const [products, overrides] = await Promise.all([allProducts(), getOverrides()]);

  const brands = [...new Set(products.map((p) => p.brand))].sort();
  const needle = q.trim().toLowerCase();
  const filtered = products
    .filter((p) => (brand === "all" ? true : p.brand === brand))
    .filter((p) => (cat === "all" ? true : productCategory(p) === cat))
    .filter((p) =>
      needle
        ? [p.sku, p.collection, p.brand, p.id].some((v) => v.toLowerCase().includes(needle))
        : true,
    );

  // Каталог сгенерирован из прайсов (сотни позиций) — без пагинации страница
  // весит десятки мегабайт разметки.
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, Number(pageRaw) || 1), pages);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const qs = (n: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (brand !== "all") sp.set("brand", brand);
    if (cat !== "all") sp.set("cat", cat);
    if (n > 1) sp.set("page", String(n));
    const s = sp.toString();
    return s ? `/admin/products?${s}` : "/admin/products";
  };

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h1 className="a-h1">Артикулы и цены</h1>
        <div className="a-muted text-sm">
          {filtered.length} из {products.length}
          {pages > 1 ? ` · стр. ${page} из ${pages}` : ""}
        </div>
      </div>
      <p className="a-muted mb-6 max-w-3xl">
        Структура артикулов (элементы, форматы, документы) — из каталога проекта; в админке
        переопределяются цены, тексты, фото, промо, наличие, SEO и видимость. Пустое поле = «как в каталоге».
      </p>

      <form className="mb-5 flex flex-wrap items-end gap-2">
        <label className="grow sm:grow-0">
          <span className="a-label">Поиск</span>
          <input name="q" defaultValue={q} placeholder="Артикул, коллекция, бренд" className="a-input sm:w-72" />
        </label>
        <label>
          <span className="a-label">Бренд</span>
          <select name="brand" defaultValue={brand} className="a-select w-52">
            <option value="all">Все бренды</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="a-label">Категория</span>
          <select name="cat" defaultValue={cat} className="a-select w-56">
            <option value="all">Все категории</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <button className="a-btn a-btn-primary" type="submit">
          Показать
        </button>
      </form>

      <div className="a-card a-scroll-x">
        <table className="a-table">
          <thead>
            <tr>
              <th>Артикул</th>
              <th>Категория</th>
              <th>Цена «от»</th>
              <th>Наличие</th>
              <th>Промо</th>
              <th>Правки</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => {
              const o = overrides.get(p.id);
              const edits = [
                o?.prices && "цены",
                o?.collection && "название",
                o?.specs && "характеристики",
                o?.photos && "фото",
                o?.promo && "промо",
                o?.stockStatus && "наличие",
                o?.seo && "SEO",
                o?.sortOrder ? "порядок" : null,
              ].filter(Boolean) as string[];

              return (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="font-semibold text-ink hover:text-clinker">
                      {p.brand} {p.collection}
                    </Link>
                    <div className="a-muted text-xs">
                      {p.sku} · {p.specs.color}
                    </div>
                  </td>
                  <td className="a-muted text-xs">{CATEGORY_LABELS[productCategory(p)]}</td>
                  <td className="whitespace-nowrap">
                    <span className="font-semibold tabular-nums">{formatRub(basePrice(p))}</span>
                    <div className="a-muted text-xs">{priceUnitLabel(p)}</div>
                  </td>
                  <td className="text-xs">
                    {p.stock_status === "on_order" ? (
                      <span className="a-badge a-badge-warn">
                        под заказ{p.lead_time_weeks ? ` · ${p.lead_time_weeks} нед.` : ""}
                      </span>
                    ) : (
                      <span className="a-badge a-badge-ok">в наличии</span>
                    )}
                  </td>
                  <td className="text-xs">
                    {p.promo ? (
                      <span className="a-badge a-badge-accent">
                        {p.promo.label ?? "акция"}
                        {p.promo.discount_percent ? ` −${p.promo.discount_percent}%` : ""}
                      </span>
                    ) : (
                      <span className="a-muted">—</span>
                    )}
                  </td>
                  <td className="a-muted text-xs">{edits.length ? edits.join(", ") : "—"}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <form action={toggleActiveAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="active" value={String(!p.active)} />
                        <button
                          className={`a-btn a-btn-sm ${p.active ? "a-btn-ghost" : "a-btn-primary"}`}
                          type="submit"
                          title={p.active ? "Скрыть из витрины" : "Вернуть в витрину"}
                        >
                          {p.active ? "Скрыть" : "Показать"}
                        </button>
                      </form>
                      <Link href={`/admin/products/${p.id}`} className="a-btn a-btn-ghost a-btn-sm">
                        Открыть
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 ? (
              <tr>
                <td colSpan={7} className="a-muted py-12 text-center">
                  Ничего не найдено
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <nav className="mt-4 flex flex-wrap items-center gap-2" aria-label="Страницы">
          {page > 1 ? (
            <Link href={qs(page - 1)} className="a-btn a-btn-ghost a-btn-sm">
              ← Назад
            </Link>
          ) : null}
          <span className="a-muted text-sm">
            {page} / {pages}
          </span>
          {page < pages ? (
            <Link href={qs(page + 1)} className="a-btn a-btn-ghost a-btn-sm">
              Вперёд →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
