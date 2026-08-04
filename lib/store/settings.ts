import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db, hasDb, schema } from "@/lib/db/client";

/**
 * Настройки, управляемые из админки (как на the-one-temp): дефолт — env,
 * поверх — оверрайд из site_content('settings'). Смысл: NEXT_PUBLIC_* «вшиты»
 * на сборке и не меняются без пересборки, а из БД читается на каждый запрос.
 *
 * Сюда же вынесены метки Битрикса — чтобы источник/ответственный/подпись сайта
 * менялись без деплоя.
 */
export type SiteSettings = {
  /** Номер счётчика Яндекс.Метрики. */
  ymCounterId: string;
  /** Код подтверждения Яндекс.Вебмастера. */
  yandexVerification: string;
  /** Код подтверждения Google Search Console. */
  googleVerification: string;
  /** Ключ Яндекс.Карт (клиентский). */
  yandexMapsKey: string;

  // ── Метки Битрикс24 (см. lib/bitrix.ts) ──
  /** Префикс заголовка лида — по нему заявки сайта видно в списке CRM. */
  bitrixTitlePrefix: string;
  /** SOURCE_ID лида в портале. */
  bitrixSourceId: string;
  /** ASSIGNED_BY_ID — ответственный менеджер. */
  bitrixAssignedById: string;
  /** Подпись сайта-источника в SOURCE_DESCRIPTION. */
  bitrixSiteLabel: string;
  /** CURRENCY_ID сделки. */
  bitrixCurrencyId: string;
  /** UF-поля портала. */
  bitrixUfFormName: string;
  bitrixUfProduct: string;
  bitrixUfArea: string;
};

const SETTINGS_KEY = "settings";

function envDefaults(): SiteSettings {
  const e = (k: string, fb = "") => process.env[k]?.trim() || fb;
  return {
    ymCounterId: e("NEXT_PUBLIC_YM_COUNTER_ID"),
    yandexVerification: e("YANDEX_VERIFICATION"),
    googleVerification: e("GOOGLE_SITE_VERIFICATION"),
    yandexMapsKey: e("NEXT_PUBLIC_YANDEX_MAPS_API_KEY"),

    bitrixTitlePrefix: e("LEAD_TITLE_PREFIX", "ступени ХИТ"),
    // Собственный источник портала «Сайт Ступени Hit Ceramics» (заведён 04.08.2026).
    // Прежний дефолт «WEB» в справочнике источников портала ОТСУТСТВУЕТ: лид с ним
    // получал нераспознанный источник и выпадал из отчётов по источникам.
    bitrixSourceId: e("LEAD_BITRIX_SOURCE_ID", "STUPENI_HC"),
    bitrixAssignedById: e("BITRIX_ASSIGNED_BY_ID", "6"),
    bitrixSiteLabel: e("LEAD_SITE_LABEL", "Лендинг ступени/террасы Hit Ceramics"),
    bitrixCurrencyId: e("BITRIX_CURRENCY_ID", "RUB"),
    bitrixUfFormName: e("BITRIX_UF_FORMNAME", "UF_CRM_FORMNAME"),
    bitrixUfProduct: e("BITRIX_UF_TILE", "UF_CRM_TILE"),
    bitrixUfArea: e("BITRIX_UF_AREA", "UF_CRM_AREA"),
  };
}

const clean = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

async function readOverride(): Promise<Partial<SiteSettings>> {
  if (!hasDb()) return {};
  try {
    const [row] = await db()
      .select()
      .from(schema.siteContent)
      .where(eq(schema.siteContent.key, SETTINGS_KEY))
      .limit(1);
    return (row?.value ?? {}) as Partial<SiteSettings>;
  } catch {
    return {};
  }
}

/** Настройки: env ⊕ БД. cache() — дедуп в рамках одного запроса. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const base = envDefaults();
  const o = await readOverride();
  const out = { ...base };
  for (const key of Object.keys(base) as (keyof SiteSettings)[]) {
    const v = clean(o[key]);
    if (v) out[key] = v;
  }
  return out;
});

/** Что реально лежит в БД — чтобы форма админки отличала оверрайд от env. */
export async function getSettingsOverride(): Promise<Partial<SiteSettings>> {
  return readOverride();
}

export { envDefaults as settingsEnvDefaults };

export async function setSettings(value: Partial<SiteSettings>): Promise<void> {
  const base = envDefaults();
  const v: Record<string, string> = {};
  for (const key of Object.keys(base) as (keyof SiteSettings)[]) {
    v[key] = clean(value[key]);
  }
  await db()
    .insert(schema.siteContent)
    .values({ key: SETTINGS_KEY, value: v })
    .onConflictDoUpdate({
      target: schema.siteContent.key,
      set: { value: v, updatedAt: new Date() },
    });
}
