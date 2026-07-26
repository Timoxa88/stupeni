"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Cookie-баннер (ТЗ B.2). Cookie = ПД с 30.05.2025 → требуется явное согласие.
 * Аналитика/коллтрекинг/чат должны грузиться ТОЛЬКО после согласия (Consent Mode):
 * выбор сохраняется в localStorage и публикуется в window.__consent + событие
 * `consentchange`, которые читает загрузчик Метрики (когда будет подключена).
 */
type Consent = { necessary: true; analytics: boolean; ads: boolean };

const KEY = "cookie-consent-v1";

function persist(c: Consent) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {}
  (window as unknown as { __consent?: Consent }).__consent = c;
  window.dispatchEvent(new CustomEvent("consentchange", { detail: c }));
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  useEffect(() => {
    let show = false;
    try {
      show = !localStorage.getItem(KEY);
    } catch {
      show = true;
    }
    if (!show) return;
    // Откладываем setState из тела эффекта (избегаем каскадного ре-рендера).
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!open) return null;

  const decide = (c: Consent) => {
    persist(c);
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-ink/10 bg-white/95 p-4 shadow-[0_-10px_40px_-20px_rgba(17,17,16,0.5)] backdrop-blur"
      role="region"
      aria-label="Согласие на использование cookie"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-stone">
          Мы используем cookie для работы сайта и аналитики. Аналитические и рекламные
          cookie подключаются только с вашего согласия.{" "}
          <Link href="/privacy" className="font-semibold text-clinker underline-offset-2 hover:underline">
            Политика обработки данных
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {config ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label className="flex items-center gap-1.5 text-stone/60">
                <input type="checkbox" checked readOnly /> Необходимые
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> Аналитика
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" checked={ads} onChange={(e) => setAds(e.target.checked)} /> Реклама
              </label>
              <button
                type="button"
                onClick={() => decide({ necessary: true, analytics, ads })}
                className="rounded-full bg-clinker px-5 py-2 font-semibold text-white transition hover:bg-clinker-hover"
              >
                Сохранить
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => decide({ necessary: true, analytics: false, ads: false })}
                className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-stone transition hover:text-ink"
              >
                Только необходимые
              </button>
              <button
                type="button"
                onClick={() => setConfig(true)}
                className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-stone transition hover:text-ink"
              >
                Настроить
              </button>
              <button
                type="button"
                onClick={() => decide({ necessary: true, analytics: true, ads: true })}
                className="rounded-full bg-clinker px-5 py-2 text-sm font-semibold text-white transition hover:bg-clinker-hover"
              >
                Принять все
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
