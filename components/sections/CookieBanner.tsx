"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Уведомление об использовании cookie.
 *
 * До 01.08.2026 это был баннер согласия с тумблерами, и Метрика ждала нажатия
 * «Принять». По решению заказчика счётчик теперь ставится сразу — значит
 * тумблер «Аналитика» и кнопка «Только необходимые» стали бы обещанием, которое
 * сайт не выполняет. Поэтому баннер переведён в информирующий режим: он
 * сообщает, что аналитика уже работает, и ведёт в политику.
 *
 * Обратная связка: вебвизор с 04.08.2026 включён, но фиксация ВВОДА В ФОРМЫ
 * выключена в настройках счётчика (`wv_forms: 0`) — см.
 * components/analytics/YandexMetrika.tsx. Включать запись полей можно только
 * вместе с настоящим согласием, и тогда текст ниже придётся переписать.
 *
 * 05.08.2026 к Метрике добавлены Google Tag Manager и виджет Callibri
 * (коллтрекинг) — они перечислены в тексте уведомления и в разделе 4
 * app/privacy/page.tsx.
 */
const KEY = "cookie-notice-v2";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

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

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-ink/10 bg-white/95 p-4 shadow-[0_-10px_40px_-20px_rgba(17,17,16,0.5)] backdrop-blur"
      role="region"
      aria-label="Уведомление об использовании cookie"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-stone">
          Мы используем cookie, Яндекс.Метрику, Google Tag Manager и виджет Callibri, чтобы
          понимать, как посетители пользуются сайтом. Ввод в формы не записывается.
          Продолжая пользоваться сайтом, вы соглашаетесь с обработкой данных.{" "}
          <Link
            href="/privacy"
            className="font-semibold text-clinker underline-offset-2 hover:underline"
          >
            Политика обработки данных
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full bg-clinker px-5 py-2 text-sm font-semibold text-white transition hover:bg-clinker-hover"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
