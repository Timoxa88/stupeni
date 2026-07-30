/** Проверка переменных окружения — статус интеграций на дашборде админки. */

export type EnvCheck = {
  ok: boolean;
  required: Array<{ name: string; present: boolean }>;
  optional: Array<{ name: string; present: boolean; note: string }>;
  warnings: string[];
  errors: string[];
};

const REQUIRED_VARS = ["DATABASE_URL", "ADMIN_PASS", "NEXT_PUBLIC_SITE_URL"] as const;

const OPTIONAL_VARS: Array<{ name: string; note: string; alt?: string[] }> = [
  { name: "BITRIX_WEBHOOK_URL", note: "заявки не пойдут в CRM (пишутся в БД и лог)", alt: ["BITRIX24_WEBHOOK_URL"] },
  { name: "NEXT_PUBLIC_YM_COUNTER_ID", note: "Я.Метрика выключена (можно задать в «Настройках»)" },
  { name: "NEXT_PUBLIC_YANDEX_MAPS_API_KEY", note: "Я.Карты без ключа — карта объектов в fallback-режиме" },
];

const WEAK_PASSWORDS = new Set(["password", "admin", "12345", "stupeni", "qwerty", "hitceramics"]);

export function checkEnv(): EnvCheck {
  const required = REQUIRED_VARS.map((name) => ({ name, present: !!process.env[name]?.trim() }));
  const optional = OPTIONAL_VARS.map((o) => ({
    name: o.name,
    present: !!process.env[o.name]?.trim() || (o.alt ?? []).some((a) => !!process.env[a]?.trim()),
    note: o.note,
  }));

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const r of required) if (!r.present) errors.push(`Отсутствует ${r.name}`);

  const adminPass = process.env.ADMIN_PASS ?? "";
  if (adminPass) {
    if (adminPass.length < 16) warnings.push("ADMIN_PASS короче 16 символов — небезопасно в проде");
    if (WEAK_PASSWORDS.has(adminPass.toLowerCase())) {
      if (process.env.NODE_ENV === "production") errors.push("ADMIN_PASS — слабый/дефолтный пароль");
      else warnings.push("ADMIN_PASS — слабый/дефолтный (ок для дева)");
    }
  }

  for (const o of optional) if (!o.present) warnings.push(`${o.name} не задан — ${o.note}`);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (siteUrl && !/^https?:\/\//.test(siteUrl)) {
    errors.push("NEXT_PUBLIC_SITE_URL должен начинаться с http:// или https://");
  }

  return { ok: errors.length === 0, required, optional, warnings, errors };
}
