import { getSeoOverride, listSeoOverrides } from "@/lib/store/seo";
import { allProducts } from "@/lib/store/products";
import { CATEGORIES } from "@/lib/content/categories";
import { SOLUTIONS } from "@/lib/content/solutions";
import { BRANDS } from "@/lib/catalog/brands";
import { clearSeoAction, saveSeoAction } from "../../seo-actions";

export const dynamic = "force-dynamic";

/** Список редактируемых страниц: ключ ⇄ человекочитаемое имя. */
async function targets() {
  const products = await allProducts();
  return [
    { group: "Главная и разделы", items: [
      { key: "home", label: "Главная", url: "/" },
      { key: "static:calculator", label: "Калькулятор", url: "/calculator" },
      { key: "static:catalog", label: "Каталог — листинг", url: "/catalog" },
      { key: "static:podbor", label: "Подбор за 5 шагов", url: "/podbor" },
      { key: "static:services", label: "Услуги", url: "/services" },
      { key: "static:contacts", label: "Контакты", url: "/contacts" },
      { key: "blog", label: "Блог — список", url: "/blog" },
    ] },
    { group: "Категории", items: CATEGORIES.map((c) => ({
      key: `catalog:${c.slug}`, label: c.h1, url: `/${c.slug}`,
    })) },
    { group: "Бренды", items: BRANDS.map((b) => ({
      key: `brand:${b.slug}`, label: b.name, url: `/producers/${b.slug}`,
    })) },
    { group: "Сценарии", items: SOLUTIONS.map((s) => ({
      key: `solution:${s.slug}`, label: s.h1, url: `/resheniya/${s.slug}`,
    })) },
    { group: "Артикулы", items: products.map((p) => ({
      key: `product:${p.id}`, label: `${p.brand} ${p.collection} (${p.sku})`, url: `/catalog/tovar/${p.id}`,
    })) },
  ];
}

export default async function AdminSeo({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const [groups, overrides] = await Promise.all([targets(), listSeoOverrides()]);
  const flat = groups.flatMap((g) => g.items);
  const selectedKey = key && flat.some((i) => i.key === key) ? key : "home";
  const selected = flat.find((i) => i.key === selectedKey)!;
  const current = await getSeoOverride(selectedKey);
  const overriddenKeys = new Set(overrides.map((o) => o.key));

  return (
    <div className="max-w-4xl">
      <h1 className="a-h1">SEO</h1>
      <p className="a-muted mt-1 mb-6 max-w-3xl">
        Title, Description, H1, og:image и запрет индексации для любой страницы. Пустое поле —
        значение из кода страницы.
      </p>

      <div className="grid gap-5 md:grid-cols-[18rem_1fr]">
        <form className="a-card a-card-pad h-fit">
          <label>
            <span className="a-label">Страница</span>
            <select name="key" defaultValue={selectedKey} className="a-select">
              {groups.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((i) => (
                    <option key={i.key} value={i.key}>
                      {overriddenKeys.has(i.key) ? "• " : ""}
                      {i.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <button className="a-btn a-btn-ghost a-btn-sm mt-3 w-full" type="submit">
            Открыть
          </button>
          <p className="a-muted mt-3 text-xs">
            «•» — у страницы есть переопределение. Всего: {overrides.length}
          </p>
        </form>

        <section className="a-card">
          <div className="border-b border-sand-divider px-5 py-4">
            <h2 className="a-h2">{selected.label}</h2>
            <p className="a-muted text-sm">
              {selected.url} · ключ <code>{selectedKey}</code>
            </p>
          </div>
          <form action={saveSeoAction} className="a-card-pad grid gap-4">
            <input type="hidden" name="key" value={selectedKey} />
            <label>
              <span className="a-label">Title</span>
              <input name="title" className="a-input" defaultValue={current?.title ?? ""} />
            </label>
            <label>
              <span className="a-label">Description</span>
              <textarea name="description" className="a-textarea" defaultValue={current?.description ?? ""} />
            </label>
            <label>
              <span className="a-label">H1 (если поддерживается страницей)</span>
              <input name="h1" className="a-input" defaultValue={current?.h1 ?? ""} />
            </label>
            <label>
              <span className="a-label">og:image (URL)</span>
              <input name="ogImage" className="a-input" defaultValue={current?.ogImage ?? ""} />
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="noindex" defaultChecked={current?.noindex ?? false} className="h-4 w-4" />
              <span className="text-sm font-semibold">Запретить индексацию (noindex, nofollow)</span>
            </label>
            <div className="flex gap-2">
              <button className="a-btn a-btn-primary" type="submit">
                Сохранить
              </button>
            </div>
          </form>
          {current ? (
            <form action={clearSeoAction} className="border-t border-sand-divider px-5 py-4">
              <input type="hidden" name="key" value={selectedKey} />
              <button className="a-btn a-btn-danger a-btn-sm" type="submit">
                Сбросить к значениям из кода
              </button>
            </form>
          ) : null}
        </section>
      </div>

      {overrides.length ? (
        <section className="a-card mt-6">
          <div className="border-b border-sand-divider px-5 py-4">
            <h2 className="a-h2">Переопределённые страницы</h2>
          </div>
          <div className="a-scroll-x">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Ключ</th>
                  <th>Title</th>
                  <th>Noindex</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {overrides.map((o) => (
                  <tr key={o.key}>
                    <td className="font-mono text-xs">{o.key}</td>
                    <td className="max-w-[24rem] truncate">{o.title ?? "—"}</td>
                    <td>{o.noindex ? <span className="a-badge a-badge-warn">noindex</span> : "—"}</td>
                    <td>
                      <form action={clearSeoAction}>
                        <input type="hidden" name="key" value={o.key} />
                        <button className="a-btn a-btn-danger a-btn-sm" type="submit">
                          Сбросить
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
