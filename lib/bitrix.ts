/**
 * Интеграция с Битрикс24 (ТЗ §12).
 * Создаёт лид/сделку в воронке «Лендинг ступени/террасы» через REST-вебхук.
 *
 * Вебхук берётся из переменной окружения BITRIX_WEBHOOK_URL.
 * Базовый вебхук из ТЗ: https://hit-ceramics.bitrix24.ru/rest/1/<token>/
 */

export interface LeadPayload {
  name: string;
  phone: string;
  tag: string; // Тип заявки / услуга (§12.2)
  comment?: string;
  city?: "msk" | "spb";
  page?: string; // страница захвата
  utm?: Record<string, string>;
}

export interface BitrixResult {
  ok: boolean;
  id?: number;
  error?: string;
}

/** Маппинг полей заявки → поля сделки Битрикс24 (§12.2, §12.3). */
function toDealFields(lead: LeadPayload) {
  const comment = [
    lead.comment,
    lead.city ? `Город: ${lead.city === "msk" ? "Москва" : "СПб"}` : "",
    lead.page ? `Страница: ${lead.page}` : "",
    Object.entries(lead.utm ?? {})
      .map(([k, v]) => `${k}=${v}`)
      .join(" "),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    TITLE: `Лендинг ступени Hit Ceramics — ${lead.tag}`,
    NAME: lead.name,
    SOURCE_ID: "WEB",
    SOURCE_DESCRIPTION: "Лендинг ступени Hit Ceramics",
    COMMENTS: comment,
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
    // UTM-поля Битрикс24 (§12.2)
    UTM_SOURCE: lead.utm?.utm_source,
    UTM_MEDIUM: lead.utm?.utm_medium,
    UTM_CAMPAIGN: lead.utm?.utm_campaign,
    UTM_CONTENT: lead.utm?.utm_content,
    UTM_TERM: lead.utm?.utm_term,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Создание лида в Битрикс24 с ретраями и экспоненциальным backoff (ТЗ B.5).
 *
 * Без вебхука заявка НЕ считается доставленной: раньше здесь возвращался `ok: true`,
 * из-за чего сайт показывал «Заявка отправлена», а лид оставался только в логе
 * (проверено на превью 26.07.2026 — вебхук не был задан, заявки терялись молча).
 * Теперь это ошибка: клиент увидит очередь/повтор, а не ложный успех.
 * Явно разрешить приём «в лог» можно переменной ALLOW_LEADS_WITHOUT_CRM=1 (только dev).
 */
export async function createLead(
  lead: LeadPayload,
  attempts = 3,
): Promise<BitrixResult> {
  const base = process.env.BITRIX_WEBHOOK_URL;
  if (!base) {
    if (process.env.ALLOW_LEADS_WITHOUT_CRM === "1") {
      console.info("[bitrix] lead (dev, no webhook):", lead);
      return { ok: true };
    }
    console.error("[bitrix] BITRIX_WEBHOOK_URL не задан — заявка не доставлена:", lead);
    return { ok: false, error: "crm_not_configured" };
  }

  const url = `${base.replace(/\/$/, "")}/crm.lead.add.json`;
  let lastError = "unknown";
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: toDealFields(lead) }),
      });
      const data = (await res.json()) as { result?: number; error?: string };
      if (data.error) {
        lastError = data.error;
      } else {
        return { ok: true, id: data.result };
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : "unknown";
    }
    if (i < attempts - 1) await sleep(300 * Math.pow(3, i)); // 300мс, 900мс
  }
  return { ok: false, error: lastError };
}
