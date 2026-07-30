import Link from "next/link";
import { listLeads } from "@/lib/store/leads";
import { FORM_TITLES } from "@/lib/bitrix";

export const dynamic = "force-dynamic";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default async function AdminLeads({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; crm?: string }>;
}) {
  const { tag = "all", crm = "all" } = await searchParams;
  const all = await listLeads();
  const tags = [...new Set(all.map((l) => l.tag))].sort();

  const filtered = all
    .filter((l) => (tag === "all" ? true : l.tag === tag))
    .filter((l) =>
      crm === "all"
        ? true
        : crm === "ok"
          ? !!l.bitrixLeadId
          : !l.bitrixLeadId,
    );

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h1 className="a-h1">Заявки</h1>
        <div className="a-muted text-sm">
          {filtered.length} из {all.length}
        </div>
      </div>
      <p className="a-muted mb-6 max-w-3xl">
        Все заявки с сайта. Параллельно создаются лидами в Битрикс24 с метками формы
        (см. «Настройки» → метки CRM).{" "}
        <Link href="/api/export/leads" className="font-semibold text-clinker hover:underline">
          Скачать CSV
        </Link>
      </p>

      <form className="mb-5 flex flex-wrap items-end gap-2">
        <label>
          <span className="a-label">Тег</span>
          <select name="tag" defaultValue={tag} className="a-select w-56">
            <option value="all">Все теги</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="a-label">CRM</span>
          <select name="crm" defaultValue={crm} className="a-select w-48">
            <option value="all">Все</option>
            <option value="ok">Доставлено</option>
            <option value="fail">Не доставлено</option>
          </select>
        </label>
        <button className="a-btn a-btn-primary" type="submit">
          Фильтр
        </button>
      </form>

      <div className="a-card a-scroll-x">
        <table className="a-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Тег / форма</th>
              <th>Контакт</th>
              <th>Источник</th>
              <th>Данные</th>
              <th>CRM</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id}>
                <td className="a-muted whitespace-nowrap">{formatDate(l.createdAt)}</td>
                <td>
                  <span className="a-badge a-badge-accent">{l.tag}</span>
                  {l.formSource ? (
                    <div className="a-muted mt-1 text-xs">
                      {FORM_TITLES[l.formSource] ?? l.formSource}
                      <span className="opacity-60"> · {l.formSource}</span>
                    </div>
                  ) : null}
                </td>
                <td>
                  <div className="font-semibold">{l.name || "—"}</div>
                  <div className="a-muted text-xs">
                    {l.phone ? <a href={`tel:${l.phone}`}>{l.phone}</a> : ""}
                    {l.email ? <div>{l.email}</div> : null}
                  </div>
                </td>
                <td className="a-muted max-w-[18rem] text-xs">
                  <div className="truncate" title={l.page ?? ""}>
                    {l.page ?? "—"}
                  </div>
                  {l.utm && Object.keys(l.utm).length ? (
                    <div className="mt-1 text-clinker">
                      {Object.entries(l.utm)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(" · ")}
                    </div>
                  ) : null}
                </td>
                <td className="max-w-[22rem] text-xs">
                  {l.comment ? <div className="mb-1 whitespace-pre-wrap">{l.comment}</div> : null}
                  {l.data && Object.keys(l.data).length ? (
                    <details>
                      <summary className="a-muted cursor-pointer">показать поля</summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap bg-sand/60 p-2 text-[10px]">
                        {JSON.stringify(l.data, null, 2)}
                      </pre>
                    </details>
                  ) : null}
                </td>
                <td className="text-xs">
                  {l.bitrixLeadId ? (
                    <span className="a-badge a-badge-ok">✓ #{l.bitrixLeadId}</span>
                  ) : l.bitrixError ? (
                    <span className="a-badge a-badge-err" title={l.bitrixError}>
                      не отправлено
                    </span>
                  ) : (
                    <span className="a-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="a-muted py-12 text-center">
                  Заявок нет{tag !== "all" || crm !== "all" ? " по этому фильтру" : ""}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
