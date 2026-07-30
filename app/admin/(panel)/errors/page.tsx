import { listErrors, errorStats } from "@/lib/store/errors";
import { resolveErrorAction, reopenErrorAction, deleteErrorAction, clearResolvedAction } from "../../error-actions";

export const dynamic = "force-dynamic";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default async function AdminErrors({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; level?: string; resolved?: string }>;
}) {
  const sp = await searchParams;
  const source = (sp.source ?? "all") as "all" | "client" | "server" | "api";
  const level = (sp.level ?? "all") as "all" | "error" | "warning";
  const resolved = (sp.resolved ?? "open") as "open" | "resolved" | "all";

  const [rows, stats] = await Promise.all([
    listErrors({ source, level, resolved }),
    errorStats(),
  ]);

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h1 className="a-h1">Ошибки</h1>
        <div className="a-muted text-sm">
          открытых {stats.open} из {stats.total}
        </div>
      </div>
      <p className="a-muted mb-6 max-w-3xl">
        Журнал ошибок клиента, сервера и API (включая недоставленные в Битрикс24 заявки).
      </p>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <form className="flex flex-wrap items-end gap-2">
          <label>
            <span className="a-label">Источник</span>
            <select name="source" defaultValue={source} className="a-select w-40">
              <option value="all">Все</option>
              <option value="client">Клиент</option>
              <option value="server">Сервер</option>
              <option value="api">API</option>
            </select>
          </label>
          <label>
            <span className="a-label">Уровень</span>
            <select name="level" defaultValue={level} className="a-select w-40">
              <option value="all">Все</option>
              <option value="error">Ошибки</option>
              <option value="warning">Предупреждения</option>
            </select>
          </label>
          <label>
            <span className="a-label">Статус</span>
            <select name="resolved" defaultValue={resolved} className="a-select w-40">
              <option value="open">Открытые</option>
              <option value="resolved">Закрытые</option>
              <option value="all">Все</option>
            </select>
          </label>
          <button className="a-btn a-btn-primary" type="submit">
            Фильтр
          </button>
        </form>
        <form action={clearResolvedAction}>
          <button className="a-btn a-btn-danger" type="submit">
            Удалить закрытые
          </button>
        </form>
      </div>

      <div className="a-card a-scroll-x">
        <table className="a-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Источник</th>
              <th>Сообщение</th>
              <th>Страница</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td className="a-muted whitespace-nowrap">{formatDate(e.createdAt)}</td>
                <td>
                  <span className={`a-badge ${e.level === "warning" ? "a-badge-warn" : "a-badge-err"}`}>
                    {e.source}
                  </span>
                  {e.resolvedAt ? <div className="a-muted mt-1 text-xs">закрыта</div> : null}
                </td>
                <td className="max-w-[32rem]">
                  <div className="font-medium">{e.message}</div>
                  {e.stack ? (
                    <details className="mt-1">
                      <summary className="a-muted cursor-pointer text-xs">стек</summary>
                      <pre className="mt-1 max-h-56 overflow-auto whitespace-pre-wrap bg-sand/60 p-2 text-[10px]">
                        {e.stack}
                      </pre>
                    </details>
                  ) : null}
                  {e.context ? (
                    <details className="mt-1">
                      <summary className="a-muted cursor-pointer text-xs">контекст</summary>
                      <pre className="mt-1 overflow-auto whitespace-pre-wrap bg-sand/60 p-2 text-[10px]">
                        {JSON.stringify(e.context, null, 2)}
                      </pre>
                    </details>
                  ) : null}
                </td>
                <td className="a-muted max-w-[14rem] break-all text-xs">{e.url ?? "—"}</td>
                <td>
                  <div className="flex gap-1.5">
                    {e.resolvedAt ? (
                      <form action={reopenErrorAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <button className="a-btn a-btn-ghost a-btn-sm" type="submit">
                          Открыть
                        </button>
                      </form>
                    ) : (
                      <form action={resolveErrorAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <button className="a-btn a-btn-ghost a-btn-sm" type="submit">
                          Закрыть
                        </button>
                      </form>
                    )}
                    <form action={deleteErrorAction}>
                      <input type="hidden" name="id" value={e.id} />
                      <button className="a-btn a-btn-danger a-btn-sm" type="submit">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="a-muted py-12 text-center">
                  Ошибок нет — хороший знак.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
