"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { withBase } from "@/lib/base";
import { enqueueLead } from "@/lib/leadQueue";
import { GOALS, reachGoal } from "@/lib/analytics/goals";

/** Показываем один раз за вкладку: ключ живёт в sessionStorage. */
const SHOWN_KEY = "exit_intent_shown";
/** Мобильный фолбэк: мыши нет, ловим по времени после первого касания. */
const MOBILE_DELAY_MS = 60_000;

/** Цифры номера — по ним и валидируем (маска в счёт не идёт). */
const digitsOf = (s: string) => s.replace(/\D/g, "");

/** «+7 (912) 345-67-89» из любого ввода; 8 и 7 в начале приводим к +7. */
function maskPhone(raw: string): string {
  let d = digitsOf(raw);
  if (!d) return "";
  if (d[0] === "8" || d[0] === "7") d = d.slice(1);
  d = d.slice(0, 10);
  let out = "+7";
  if (d.length) out += ` (${d.slice(0, 3)}`;
  if (d.length > 3) out += `) ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

/**
 * Ловец уходящих (по образцу fintherm.com.ru).
 *
 * Триггеры — те же три, что на ФинТерме, и это важно: одного «увода курсора
 * за верхний край» хватает только на десктопе.
 *  1. `mouseout` без relatedTarget и с clientY ≤ 0 — курсор ушёл к адресной
 *     строке или вкладкам;
 *  2. `visibilitychange` → hidden — переключение вкладки, сворачивание;
 *  3. таймер на минуту, который заводится ПОСЛЕ первого скролла или касания, —
 *     мобильный фолбэк: без него телефоны попап не увидят никогда, а без
 *     условия «после первого действия» он бил бы по случайно открытой вкладке.
 *
 * Показ один за сессию вкладки (sessionStorage) — и до, и после отправки:
 * закрыл, ушёл, вернулся — второй раз не мешаем.
 */
export function ExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const fired = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // В админке ловец не нужен: это рабочий кабинет, а не витрина.
  const disabled = pathname.startsWith("/admin");

  useEffect(() => {
    if (disabled) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const show = () => {
      if (fired.current) return;
      try {
        if (sessionStorage.getItem(SHOWN_KEY)) return;
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch {
        /* приватный режим — просто покажем один раз за монтирование */
      }
      fired.current = true;
      setOpen(true);
    };

    try {
      if (sessionStorage.getItem(SHOWN_KEY)) {
        fired.current = true;
        return;
      }
    } catch {
      /* sessionStorage недоступен — работаем без памяти между вкладками */
    }

    const onMouseOut = (e: MouseEvent) => {
      // relatedTarget пуст только когда курсор покинул окно, а не ушёл
      // на другой элемент; clientY ≤ 0 — именно вверх, к вкладкам.
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") show();
    };
    const arm = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(show, MOBILE_DELAY_MS);
      window.removeEventListener("scroll", arm);
      window.removeEventListener("touchstart", arm);
    };

    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", arm, { passive: true, once: true });
    window.addEventListener("touchstart", arm, { passive: true, once: true });

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", arm);
      window.removeEventListener("touchstart", arm);
      if (timer) clearTimeout(timer);
    };
  }, [disabled]);

  // Фокус в поле — только там, где есть мышь: на телефоне это выбросило бы
  // клавиатуру поверх попапа. setTimeout обязателен: Modal ставит фокус на
  // первый интерактивный элемент в своём эффекте, а он выполняется позже.
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
    return () => clearTimeout(t);
  }, [open]);

  if (disabled || !open) return null;

  const valid = digitsOf(phone).length >= 11;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid || !consent) return;
    setState("sending");

    const utm: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((v, k) => {
      if (k.startsWith("utm_")) utm[k] = v;
    });

    const url = withBase("/api/lead");
    const body = JSON.stringify({
      phone,
      tag: "Exit-попап",
      source: "exit-popup",
      consent,
      page: window.location.href,
      utm,
      comment: "Оставил телефон в попапе при уходе со страницы — просил подборку и цены.",
      idempotencyKey:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${phone}`,
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (res.ok) {
        setState("done");
        reachGoal(GOALS.lead, { form: "Exit-попап", source: "exit-popup" });
      } else if (res.status >= 500) {
        // Сервер недоступен — до-отправим из очереди (ТЗ B.5).
        enqueueLead(url, body);
        setState("done");
        reachGoal(GOALS.lead, { form: "Exit-попап", source: "exit-popup" });
      } else {
        setState("error");
      }
    } catch {
      enqueueLead(url, body);
      setState("done");
      reachGoal(GOALS.lead, { form: "Exit-попап", source: "exit-popup" });
    }
  }

  return (
    <Modal onClose={() => setOpen(false)} labelledBy="exit-intent-title" className="max-w-md">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Закрыть"
          className="-mr-2 -mt-2 rounded-full p-2 text-2xl leading-none text-stone transition hover:bg-sand-deep hover:text-ink"
        >
          ×
        </button>
      </div>

      {state === "done" ? (
        <div className="pb-2 text-center">
          <h2 id="exit-intent-title" className="font-display text-xl font-bold text-ink">
            Спасибо!
          </h2>
          <p className="mt-2 text-stone">
            Пришлём подборку с ценами и ответим в рабочее время — обычно в течение 15 минут.
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-5 rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:border-clinker hover:text-clinker"
          >
            Вернуться на сайт
          </button>
        </div>
      ) : (
        <>
          <h2
            id="exit-intent-title"
            className="font-display text-2xl font-extrabold leading-tight text-ink"
          >
            Уходите?
          </h2>
          <p className="mt-2 text-stone">
            Пришлём подборку коллекций с ценами и посчитаем комплект под ваш объект —
            без обзвонов.
          </p>

          <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
            <label>
              <span className="sr-only">Телефон</span>
              <input
                ref={inputRef}
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onFocus={() => {
                  if (!phone) setPhone("+7");
                }}
                onChange={(e) => {
                  // При удалении символа маски убираем и цифру перед ним —
                  // иначе backspace по «)» визуально ничего не делает.
                  const next = e.target.value;
                  const deleting = next.length < phone.length;
                  let d = digitsOf(next);
                  if (deleting && /\D$/.test(next)) d = d.slice(0, -1);
                  setPhone(maskPhone(d));
                }}
                onBlur={() => setTouched(true)}
                aria-invalid={touched && !valid ? true : undefined}
                className="field-input"
              />
            </label>
            {touched && !valid ? (
              <span className="field-err">Введите номер полностью.</span>
            ) : null}

            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={touched && !consent ? true : undefined}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-clinker)]"
              />
              <span className="text-xs text-stone">
                Согласен на обработку персональных данных в соответствии с{" "}
                <a
                  href={withBase("/privacy")}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline underline-offset-2"
                >
                  Политикой
                </a>
                .
              </span>
            </label>
            {touched && !consent ? (
              <span className="field-err">Отметьте согласие, чтобы отправить заявку.</span>
            ) : null}

            {state === "error" ? (
              <p className="field-err" role="alert">
                Не удалось отправить. Позвоните нам или попробуйте позже.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={state === "sending"}
              className="sheen rounded-full bg-clinker px-6 py-3.5 font-semibold text-white transition hover:bg-clinker-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "sending" ? "Отправляем…" : "Получить подборку с ценами"}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
