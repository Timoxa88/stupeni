import "server-only";
import { getSettings } from "@/lib/store/settings";

/**
 * Интеграция с Битрикс24 (ТЗ §12) — метки заявок сделаны по той же схеме, что
 * на the-one-temp (хиткерамикс.рф), портал hit-ceramics.bitrix24.ru:
 *
 *  • создаётся ЛИД (crm.lead.add) — в портале классический режим CRM,
 *    заявки с форм падают в раздел «Лиды»;
 *  • заголовок: «<Форма>: <Имя> | <Город> · <Товар> · <Площадь>»;
 *  • SOURCE_ID + SOURCE_DESCRIPTION = «<подпись сайта> · <Форма> · <страница>»;
 *  • UF-поля портала: UF_CRM_FORMNAME / UF_CRM_TILE / UF_CRM_AREA;
 *  • ASSIGNED_BY_ID фиксируется и переприсваивается доп. update-ом, чтобы
 *    правила распределения лидов по источнику не переназначили заявку;
 *  • UTM-метки → штатные поля UTM_* лида.
 *
 * Источник/ответственный/подпись меняются из админки («Настройки») —
 * см. lib/store/settings.ts; env остаётся дефолтом.
 */

/** Слаг формы → человекочитаемое название (метка формы в CRM). */
export const FORM_TITLES: Record<string, string> = {
  cta: "Обратная связь",
  calculator: "Калькулятор",
  catalog: "Расчёт из каталога",
  category: "Подбор по категории",
  solution: "Заявка по сценарию",
  brand: "Заявка по бренду",
  product: "Заявка по артикулу",
  sample: "Образец",
  price: "Запрос каталога и прайса",
  quiz: "Квиз — подбор",
  architect: "Архитектор / бюро",
  service: "Услуга",
  measure: "Замер на объекте",
  delivery: "Расчёт доставки",
  contacts: "Обратная связь (контакты)",
  "showroom-booking": "Запись в шоурум",
  docs: "Запрос документов",
  "exit-popup": "Exit-попап (каталог + подборка)",
};

/** Список слагов для админки/подсказок. */
export const FORM_SOURCES = Object.keys(FORM_TITLES);

export const CITY_LABELS: Record<string, string> = {
  msk: "Москва",
  spb: "Санкт-Петербург",
};

export interface BitrixLead {
  /** Тег заявки (ТЗ §12.2) — фолбэк названия формы. */
  tag: string;
  /** Слаг формы (ключ FORM_TITLES). */
  formSource?: string;
  name?: string;
  phone?: string;
  email?: string;
  comment?: string;
  /** Поля формы: city, product, area, total_cost и любые прочие. */
  data?: Record<string, unknown>;
  utm?: Record<string, string>;
  page?: string;
}

export type BitrixResult = { ok: true; id: string } | { ok: false; error: string };

/**
 * У портала hit-ceramics.bitrix24.ru база в 3-байтовом utf8: символ вне BMP
 * (эмодзи) обрезает ЗНАЧЕНИЕ ПОЛЯ по себя — проверено, «📝 …» в начале
 * COMMENTS сохранялся как пустая строка. Поэтому вычищаем surrogate-пары
 * из всех текстов, уходящих в CRM (в комментарии клиента эмодзи тоже бывают).
 */
const noAstral = (s: string) => s.replace(/[\u{10000}-\u{10FFFF}]/gu, "");

const str = (v: unknown) => noAstral((v == null ? "" : String(v))).trim();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Название формы для меток: сначала карта слагов, потом тег заявки. */
export function formTitle(lead: Pick<BitrixLead, "tag" | "formSource">): string {
  const slug = str(lead.formSource);
  return FORM_TITLES[slug] || lead.tag || "Заявка";
}

export function webhookBase(): string | null {
  const webhook = process.env.BITRIX_WEBHOOK_URL || process.env.BITRIX24_WEBHOOK_URL;
  if (!webhook?.trim()) return null;
  return webhook.trim().replace(/\/+$/, "");
}

/** Поля лида Битрикс24 — вынесено отдельно, чтобы админка могла показать превью. */
export async function buildLeadFields(lead: BitrixLead): Promise<Record<string, unknown>> {
  const s = await getSettings();
  const data = lead.data ?? {};
  const title = formTitle(lead);

  // ── Детали для заголовка: Город · Товар · Площадь ──
  const cityRaw = str(data.city);
  const city = CITY_LABELS[cityRaw] ?? cityRaw;
  const product = str(data.product ?? data.article ?? data.collection ?? data.sku);
  const area = str(data.area ?? data.area_m2 ?? data.qty);
  const who = str(lead.name) || str(lead.phone) || "без имени";
  const details = [city, product, area].filter(Boolean).join(" · ");

  // ── Комментарий: метка формы + текст пользователя + прочие поля + страница ──
  // Без эмодзи в начале — иначе портал сохранит пустой комментарий (см. noAstral).
  const parts: string[] = [`Форма: ${title}`];
  if (lead.comment) parts.push(str(lead.comment));
  const SKIP = new Set([
    "source", "city", "product", "article", "collection", "sku",
    "area", "area_m2", "qty", "total_cost", "totalPrice",
    "consent", "consentAt", "consentVersion",
  ]);
  const extra = Object.entries(data).filter(([k, v]) => !SKIP.has(k) && v != null && v !== "");
  if (extra.length > 0) {
    parts.push("\n--- Данные формы ---");
    for (const [k, v] of extra) {
      parts.push(`${k}: ${str(typeof v === "object" ? JSON.stringify(v) : v)}`);
    }
  }
  if (city) parts.push(`\nГород: ${city}`);
  if (product) parts.push(`Товар: ${product}`);
  if (area) parts.push(`Площадь/кол-во: ${area}`);
  if (data.consent) parts.push(`\nСогласие на обработку ПДн: да (${str(data.consentAt) || "—"})`);
  if (lead.page) parts.push(`\nСтраница: ${str(lead.page)}`);

  const fields: Record<string, unknown> = {
    TITLE: str(`${title}: ${who}${details ? ` | ${details}` : ""}`),
    SOURCE_ID: s.bitrixSourceId,
    SOURCE_DESCRIPTION: `${s.bitrixSiteLabel} · ${title}${lead.page ? ` · ${lead.page}` : ""}`,
    STATUS_ID: "NEW",
    OPENED: "Y",
    CURRENCY_ID: s.bitrixCurrencyId,
    NAME: str(lead.name) || undefined,
    PHONE: lead.phone ? [{ VALUE: str(lead.phone), VALUE_TYPE: "WORK" }] : undefined,
    EMAIL: lead.email ? [{ VALUE: str(lead.email), VALUE_TYPE: "WORK" }] : undefined,
    COMMENTS: parts.join("\n"),
    UTM_SOURCE: lead.utm?.utm_source,
    UTM_MEDIUM: lead.utm?.utm_medium,
    UTM_CAMPAIGN: lead.utm?.utm_campaign,
    UTM_CONTENT: lead.utm?.utm_content,
    UTM_TERM: lead.utm?.utm_term,
  };

  // Город → штатное поле адреса лида.
  if (city) fields.ADDRESS_CITY = city;

  // Сумма (из калькулятора) → OPPORTUNITY.
  const total = Number(data.total_cost ?? data.totalPrice);
  if (Number.isFinite(total) && total > 0) fields.OPPORTUNITY = total;

  // Кастомные поля портала (те же ключи, что у the-one-temp / ФинТерм).
  fields[s.bitrixUfFormName] = title;
  if (product) fields[s.bitrixUfProduct] = product;
  if (area) fields[s.bitrixUfArea] = area;

  const assignedBy = Number(s.bitrixAssignedById);
  if (Number.isFinite(assignedBy) && assignedBy > 0) fields.ASSIGNED_BY_ID = assignedBy;

  return fields;
}

/**
 * Отправка заявки в Битрикс24 с ретраями и экспоненциальным backoff (ТЗ B.5).
 * Без настроенного вебхука возвращает ошибку-маркер — вызывающий код всё равно
 * сохраняет заявку в БД (журнал в админке).
 */
export async function sendToBitrix(lead: BitrixLead, attempts = 3): Promise<BitrixResult> {
  const base = webhookBase();
  if (!base) {
    console.info("[bitrix] вебхук не настроен, заявка только в БД:", lead.tag);
    return { ok: false, error: NO_WEBHOOK };
  }

  const s = await getSettings();
  const fields = await buildLeadFields(lead);
  const assignedBy = Number(s.bitrixAssignedById);

  let lastError = "unknown";
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${base}/crm.lead.add.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          params: { REGISTER_SONET_EVENT: "Y" },
        }),
        signal: AbortSignal.timeout(10_000),
      });
      const data = (await res.json()) as {
        result?: number;
        error?: string;
        error_description?: string;
      };
      if (!res.ok || data.error) {
        lastError = data.error_description ?? data.error ?? `HTTP ${res.status}`;
      } else if (typeof data.result !== "number") {
        lastError = "портал не вернул id лида";
      } else {
        // Правила распределения по источнику могут переназначить ответственного
        // сразу после crm.lead.add — доп. update закрепляет нужного менеджера.
        if (Number.isFinite(assignedBy) && assignedBy > 0) {
          try {
            await fetch(`${base}/crm.lead.update.json`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: data.result,
                fields: { ASSIGNED_BY_ID: assignedBy },
                params: { REGISTER_SONET_EVENT: "N" },
              }),
              signal: AbortSignal.timeout(10_000),
            });
          } catch {
            // не критично — лид уже создан
          }
        }
        return { ok: true, id: String(data.result) };
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
    if (i < attempts - 1) await sleep(300 * Math.pow(3, i)); // 300 мс, 900 мс
  }
  return { ok: false, error: lastError };
}

/** Маркер «вебхук не настроен» — такую «ошибку» не пишем в журнал ошибок. */
export const NO_WEBHOOK = "BITRIX_WEBHOOK_URL не настроен";
