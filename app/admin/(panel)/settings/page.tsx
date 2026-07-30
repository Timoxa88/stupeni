import { getSettings, getSettingsOverride, settingsEnvDefaults } from "@/lib/store/settings";
import { FORM_TITLES, buildLeadFields, webhookBase } from "@/lib/bitrix";
import { checkEnv } from "@/lib/env";
import { saveSettingsAction } from "../../settings-actions";

export const dynamic = "force-dynamic";

export default async function AdminSettings({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [settings, override] = await Promise.all([getSettings(), getSettingsOverride()]);
  const env = settingsEnvDefaults();
  const envCheck = checkEnv();

  // Превью метки: как будет выглядеть лид «Калькулятор» в Битрикс24.
  const preview = (await buildLeadFields({
    tag: "Расчёт",
    formSource: "calculator",
    name: "Иван",
    phone: "+79000000000",
    comment: "Терраса, Stroeher Aera Beige 600x1200, на опоры HILST",
    data: { city: "msk", product: "Stroeher Aera Beige", area: 24.5, total_cost: 189000 },
    page: "/calculator",
  })) as Record<string, unknown>;

  return (
    <div className="max-w-4xl">
      <h1 className="a-h1">Интеграции и метки CRM</h1>
      <p className="a-muted mt-1 mb-6 max-w-3xl">
        Значение из этой формы перекрывает переменную окружения — счётчики и метки меняются
        без пересборки. Пустое поле = берётся из <code>.env</code> (показан в подсказке).
      </p>

      {saved ? (
        <div className="a-card a-card-pad mb-5 border-[#b9c6b3] bg-[#f2f6f0]">
          <p className="text-sm font-semibold text-[#3c5236]">✓ Настройки сохранены</p>
        </div>
      ) : null}

      <form action={saveSettingsAction} className="grid gap-5">
        <section className="a-card">
          <div className="border-b border-sand-divider px-5 py-4">
            <h2 className="a-h2">Аналитика и подтверждение прав</h2>
          </div>
          <div className="a-card-pad grid gap-4 sm:grid-cols-2">
            <Field
              name="ymCounterId"
              label="Яндекс.Метрика — номер счётчика"
              value={override.ymCounterId}
              env={env.ymCounterId}
            />
            <Field
              name="yandexMapsKey"
              label="Яндекс.Карты — API-ключ"
              value={override.yandexMapsKey}
              env={env.yandexMapsKey}
            />
            <Field
              name="yandexVerification"
              label="Яндекс.Вебмастер — код подтверждения"
              value={override.yandexVerification}
              env={env.yandexVerification}
            />
            <Field
              name="googleVerification"
              label="Google Search Console — код"
              value={override.googleVerification}
              env={env.googleVerification}
            />
          </div>
        </section>

        <section className="a-card">
          <div className="border-b border-sand-divider px-5 py-4">
            <h2 className="a-h2">Метки заявок в Битрикс24</h2>
            <p className="a-muted text-sm">
              Заявка создаётся как <code>crm.lead.add</code>; заголовок — «Форма: Имя | Город ·
              Товар · Площадь», название формы дублируется в UF-поле и в описании источника.
            </p>
          </div>
          <div className="a-card-pad grid gap-4 sm:grid-cols-2">
            <Field
              name="bitrixSourceId"
              label="SOURCE_ID (источник в портале)"
              value={override.bitrixSourceId}
              env={env.bitrixSourceId}
            />
            <Field
              name="bitrixAssignedById"
              label="ASSIGNED_BY_ID (ответственный)"
              value={override.bitrixAssignedById}
              env={env.bitrixAssignedById}
            />
            <Field
              name="bitrixSiteLabel"
              label="Подпись сайта-источника"
              value={override.bitrixSiteLabel}
              env={env.bitrixSiteLabel}
              wide
            />
            <Field
              name="bitrixCurrencyId"
              label="CURRENCY_ID"
              value={override.bitrixCurrencyId}
              env={env.bitrixCurrencyId}
            />
            <Field
              name="bitrixUfFormName"
              label="UF-поле: название формы"
              value={override.bitrixUfFormName}
              env={env.bitrixUfFormName}
            />
            <Field
              name="bitrixUfProduct"
              label="UF-поле: товар"
              value={override.bitrixUfProduct}
              env={env.bitrixUfProduct}
            />
            <Field
              name="bitrixUfArea"
              label="UF-поле: площадь/количество"
              value={override.bitrixUfArea}
              env={env.bitrixUfArea}
            />
          </div>
        </section>

        <div>
          <button className="a-btn a-btn-primary" type="submit">
            Сохранить настройки
          </button>
        </div>
      </form>

      <section className="a-card mt-6">
        <div className="border-b border-sand-divider px-5 py-4">
          <h2 className="a-h2">Проверка меток</h2>
          <p className="a-muted text-sm">
            Так выглядит лид из калькулятора при текущих настройках.{" "}
            {webhookBase() ? (
              <span className="a-badge a-badge-ok">вебхук настроен</span>
            ) : (
              <span className="a-badge a-badge-warn">вебхук не настроен — заявки только в БД</span>
            )}
          </p>
        </div>
        <div className="a-card-pad">
          <dl className="grid gap-2 text-sm sm:grid-cols-[12rem_1fr]">
            {["TITLE", "SOURCE_ID", "SOURCE_DESCRIPTION", "ASSIGNED_BY_ID", "OPPORTUNITY", "ADDRESS_CITY", settings.bitrixUfFormName, settings.bitrixUfProduct, settings.bitrixUfArea].map(
              (k) => (
                <div key={k} className="grid gap-1 sm:col-span-2 sm:grid-cols-[12rem_1fr]">
                  <dt className="a-muted font-mono text-xs">{k}</dt>
                  <dd className="break-words">{String(preview[k] ?? "—")}</dd>
                </div>
              ),
            )}
            <div className="sm:col-span-2">
              <dt className="a-muted font-mono text-xs">COMMENTS</dt>
              <dd>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap bg-sand/60 p-2 text-[11px]">
                  {String(preview.COMMENTS ?? "")}
                </pre>
              </dd>
            </div>
          </dl>

          <h3 className="a-h2 mt-6 text-base">Слаги форм → метки</h3>
          <div className="a-scroll-x mt-2">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Слаг</th>
                  <th>Название формы в CRM</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(FORM_TITLES).map(([slug, title]) => (
                  <tr key={slug}>
                    <td className="font-mono text-xs">{slug}</td>
                    <td>{title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {envCheck.warnings.length ? (
        <section className="a-card a-card-pad mt-6">
          <h2 className="a-h2 mb-2">Замечания по окружению</h2>
          <ul className="a-muted list-inside list-disc text-sm">
            {envCheck.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Field({
  name,
  label,
  value,
  env,
  wide,
}: {
  name: string;
  label: string;
  value?: string;
  env: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "sm:col-span-2" : undefined}>
      <span className="a-label">{label}</span>
      <input
        name={name}
        className="a-input"
        defaultValue={value ?? ""}
        placeholder={env || "не задано в .env"}
      />
    </label>
  );
}
