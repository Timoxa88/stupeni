import Link from "next/link";
import { sql } from "drizzle-orm";
import { db, hasDb } from "@/lib/db/client";
import { checkEnv } from "@/lib/env";
import { webhookBase } from "@/lib/bitrix";
import { leadStats, recentLeads } from "@/lib/store/leads";
import { errorStats } from "@/lib/store/errors";
import { allProducts, getOverrides } from "@/lib/store/products";
import { listPosts } from "@/lib/store/blog";
import { listSeoOverrides } from "@/lib/store/seo";
import { getSettings } from "@/lib/store/settings";
import { overriddenSections } from "@/lib/store/content";
import { topViewed, totalViews } from "@/lib/store/views";
import { BRANDS } from "@/lib/catalog/brands";

export const dynamic = "force-dynamic";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

async function pingDb(): Promise<boolean> {
  if (!hasDb()) return false;
  try {
    await db().execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

export default async function AdminDashboard() {
  const [products, overrides, posts, seo, errors, stats, recent, top, views, settings, sections, dbOk] =
    await Promise.all([
      allProducts(),
      getOverrides(),
      listPosts(),
      listSeoOverrides(),
      errorStats(),
      leadStats(),
      recentLeads(8),
      topViewed(8),
      totalViews(),
      getSettings(),
      overriddenSections(),
      pingDb(),
    ]);

  const env = checkEnv();
  const hidden = products.filter((p) => !p.active).length;
  const pricedOverrides = [...overrides.values()].filter((o) => o.prices).length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const byId = new Map(products.map((p) => [p.id, p]));

  const integrations = [
    {
      label: "База данных (PostgreSQL)",
      ok: dbOk,
      note: dbOk ? "подключение активно" : "нет подключения — админка только читает сид",
    },
    {
      label: "Битрикс24 — заявки",
      ok: !!webhookBase(),
      note: webhookBase()
        ? `источник ${settings.bitrixSourceId} · ответственный #${settings.bitrixAssignedById}`
        : "вебхук не настроен — заявки пишутся только в БД",
    },
    {
      label: "Яндекс.Метрика",
      ok: !!settings.ymCounterId || !!settings.ymCounterIdExtra,
      note:
        [settings.ymCounterId, settings.ymCounterIdExtra].filter(Boolean).join(" + ") ||
        "выключена — включить в «Настройках»",
    },
    {
      label: "Google Tag Manager",
      ok: !!settings.gtmId,
      note: settings.gtmId ? `контейнер ${settings.gtmId}` : "контейнер не задан",
    },
    {
      label: "Callibri",
      ok: settings.callibri.trim() !== "0",
      note:
        settings.callibri.trim() !== "0"
          ? "виджет подключён (площадка должна быть заведена в кабинете Callibri)"
          : "выключен в «Настройках»",
    },
    {
      label: "Яндекс.Вебмастер / Google",
      ok: !!settings.yandexVerification || !!settings.googleVerification,
      note:
        settings.yandexVerification || settings.googleVerification
          ? "права подтверждены"
          : "коды подтверждения не заданы",
    },
    {
      label: "Яндекс.Карты",
      ok: !!settings.yandexMapsKey,
      note: settings.yandexMapsKey ? "API-ключ задан" : "без ключа — карта объектов в fallback-режиме",
    },
  ];

  const summary = [
    { label: "Артикулов", value: products.length, href: "/admin/products" },
    { label: "Скрыто из витрины", value: hidden, href: "/admin/products" },
    { label: "Цен переопределено", value: pricedOverrides, href: "/admin/products" },
    { label: "Брендов", value: BRANDS.length, href: "/admin/products" },
    { label: "Публикаций блога", value: `${publishedPosts}/${posts.length}`, href: "/admin/blog" },
    { label: "SEO-оверрайдов", value: seo.length, href: "/admin/seo" },
    { label: "Блоков контента", value: `${sections.size}/4`, href: "/admin/content" },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="a-h1">Панель управления</h1>
      <p className="a-muted mt-1 mb-8">Сводка по заявкам, каталогу и состоянию интеграций.</p>

      {!dbOk ? (
        <div className="a-card a-card-pad mb-8 border-[#e3c3bd] bg-[#fdf2f0]">
          <p className="text-sm font-semibold text-[#a3261a]">
            База данных недоступна — правки не сохранятся.
          </p>
          <p className="a-muted mt-1 text-sm">
            Проверьте <code>DATABASE_URL</code> в <code>.env</code> и что схема применена:{" "}
            <code>bun scripts/db-push.mjs</code>. Сайт при этом работает на сиде.
          </p>
        </div>
      ) : null}

      {/* Заявки */}
      <section className="mb-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="a-h2">Заявки</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-clinker hover:underline">
            Все заявки →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="За 24 часа" value={stats.today} href="/admin/leads" />
          <Stat label="За 7 дней" value={stats.week} href="/admin/leads" />
          <Stat label="За 30 дней" value={stats.month} href="/admin/leads" />
          <Stat
            label="Доставка в CRM"
            value={`${stats.crmRate}%`}
            sub={`${stats.crmDelivered} из ${stats.total}${stats.crmFailed ? ` · ${stats.crmFailed} с ошибкой` : ""}`}
            href="/admin/leads"
            accent={stats.crmFailed > 0}
          />
        </div>
      </section>

      {/* Последние заявки + топ товаров */}
      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        <div className="a-card">
          <div className="flex items-baseline justify-between border-b border-sand-divider px-5 py-4">
            <h2 className="a-h2">Последние заявки</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-clinker hover:underline">
              Все →
            </Link>
          </div>
          <div className="divide-y divide-sand-divider">
            {recent.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-ink">{l.name || "Без имени"}</div>
                  <div className="a-muted truncate text-xs">
                    {l.phone || l.email || "—"} · <span className="text-clinker">{l.tag}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="a-muted whitespace-nowrap text-xs">{formatDate(l.createdAt)}</div>
                  <div className="whitespace-nowrap text-xs">
                    {l.bitrixLeadId ? (
                      <span className="a-badge a-badge-ok">✓ CRM #{l.bitrixLeadId}</span>
                    ) : l.bitrixError ? (
                      <span className="a-badge a-badge-err" title={l.bitrixError}>
                        ошибка CRM
                      </span>
                    ) : (
                      <span className="a-muted">—</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {recent.length === 0 ? (
              <div className="a-muted px-5 py-10 text-center text-sm">Пока нет заявок</div>
            ) : null}
          </div>
        </div>

        <div className="a-card">
          <div className="flex items-baseline justify-between border-b border-sand-divider px-5 py-4">
            <h2 className="a-h2">Топ артикулов</h2>
            <span className="a-muted text-xs">{views.toLocaleString("ru-RU")} просмотров всего</span>
          </div>
          <div className="divide-y divide-sand-divider">
            {top.map((v, i) => {
              const p = byId.get(v.id);
              return (
                <Link
                  key={v.id}
                  href={`/admin/products/${v.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-sand/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="a-muted w-5 text-right text-sm tabular-nums">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-ink">
                        {p ? `${p.brand} ${p.collection}` : v.id}
                      </div>
                      <div className="a-muted truncate text-xs">{p?.sku ?? ""}</div>
                    </div>
                  </div>
                  <div className="shrink-0 font-display text-lg tabular-nums">
                    {v.views.toLocaleString("ru-RU")}
                  </div>
                </Link>
              );
            })}
            {top.length === 0 ? (
              <div className="a-muted px-5 py-10 text-center text-sm">
                Просмотров пока нет — счётчик заполняется, когда открывают карточки товаров.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Интеграции */}
      <section className="mb-10">
        <h2 className="a-h2 mb-3">Статус интеграций</h2>
        <div className="a-card divide-y divide-sand-divider">
          {integrations.map((it) => (
            <div key={it.label} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className={`a-dot ${it.ok ? "a-dot-ok" : "a-dot-warn"}`} aria-hidden />
                <span className="font-semibold text-ink">{it.label}</span>
              </div>
              <span className={`text-sm ${it.ok ? "a-muted" : "text-[#8a5410]"}`}>{it.note}</span>
            </div>
          ))}
          {errors.open > 0 ? (
            <Link href="/admin/errors" className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-sand/40">
              <div className="flex items-center gap-3">
                <span className="a-dot a-dot-err" aria-hidden />
                <span className="font-semibold text-ink">Открытых ошибок</span>
              </div>
              <span className="text-sm font-semibold text-[#a3261a]">{errors.open} — посмотреть →</span>
            </Link>
          ) : null}
          {env.errors.length > 0 ? (
            <div className="px-5 py-3">
              <div className="mb-1 flex items-center gap-3">
                <span className="a-dot a-dot-err" aria-hidden />
                <span className="font-semibold text-ink">Переменные окружения</span>
              </div>
              <ul className="a-muted list-inside list-disc text-sm">
                {env.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* Каталог и контент */}
      <section className="mb-10">
        <h2 className="a-h2 mb-3">Каталог и контент</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {summary.map((c) => (
            <Link key={c.label} href={c.href} className="a-card a-card-pad hover:border-ink/40">
              <div className="a-eyebrow mb-1">{c.label}</div>
              <div className="font-display text-2xl font-extrabold tabular-nums text-ink">{c.value}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="a-h2 mb-3">Быстрые действия</h2>
        <div className="a-card divide-y divide-sand-divider">
          <Row href="/admin/products" title="Обновить цены" text="Инлайн-правка цен по элементам и форматам, скрытие артикулов." />
          <Row href="/admin/content" title="Отредактировать тексты" text="Первый экран, преимущества, счётчики, услуги, контакты." />
          <Row href="/admin/blog/new" title="Написать в блог" text="Статья или пошаговый HowTo со связкой с артикулами." />
          <Row href="/admin/settings" title="Настроить метки CRM" text="Источник, ответственный, UF-поля и подпись сайта в Битрикс24." />
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  href,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link href={href} className="a-card a-card-pad hover:border-ink/40">
      <div className="a-eyebrow mb-1">{label}</div>
      <div
        className={`font-display text-3xl font-extrabold tabular-nums ${accent ? "text-clinker" : "text-ink"}`}
      >
        {value}
      </div>
      {sub ? <div className="a-muted mt-1 text-xs">{sub}</div> : null}
    </Link>
  );
}

function Row({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-6 px-5 py-4 hover:bg-sand/40">
      <div>
        <div className="font-display text-base font-bold text-ink">{title}</div>
        <div className="a-muted text-sm">{text}</div>
      </div>
      <span className="text-clinker">→</span>
    </Link>
  );
}
