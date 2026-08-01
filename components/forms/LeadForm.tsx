"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { City } from "@/lib/calculator";
import { withBase } from "@/lib/base";
import { enqueueLead, flushLeads, installLeadQueueAutoFlush } from "@/lib/leadQueue";
import { GOALS, reachGoal } from "@/lib/analytics/goals";

type FieldKey = "email" | "company" | "interest" | "region" | "comment" | "catalog";

export interface LeadFormProps {
  /** Тег заявки в CRM (ТЗ §12.2). */
  tag: string;
  /**
   * Слаг формы для меток Битрикса (calculator | sample | quiz | …): из него
   * строится название формы в заголовке лида и UF-поле (см. lib/bitrix.ts).
   */
  source?: string;
  /** Структурированные поля для CRM: product, area, total_cost, brand, … */
  data?: Record<string, unknown>;
  submitLabel?: string;
  /** Доп. поля сверх Имя+Телефон. */
  fields?: FieldKey[];
  /** Опции селекта «Что вас интересует?» (ТЗ §21). */
  interestOptions?: string[];
  /** Предзаполненный комментарий (сводка расчёта / бренд / сценарий). */
  comment?: string;
  city?: City;
  variant?: "light" | "dark";
  /** Лид-магнит: при успехе показываем ссылку на скачивание PDF (ТЗ §21/§23). */
  downloadUrl?: string;
  successText?: string;
  className?: string;
  /** Колбэк после успешной отправки (напр. разблокировать загрузки). */
  onSuccess?: () => void;
}

const digits = (s: string) => (s.match(/\d/g) ?? []).length;

export function LeadForm({
  tag,
  source = "cta",
  data,
  submitLabel = "Отправить",
  fields = [],
  interestOptions,
  comment,
  city,
  variant = "light",
  downloadUrl,
  successText = "Заявка отправлена. Ответим в течение 15 минут в рабочее время.",
  className = "",
  onSuccess,
}: LeadFormProps) {
  const dark = variant === "dark";
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState(""); // реальное поле «Компания»
  // Пустое значение по умолчанию: предзаполненный первый пункт уходил в CRM
  // как «Интерес: Ступени для крыльца» у всех, кто селект не трогал.
  const [interest, setInterest] = useState("");
  const [region, setRegion] = useState("");
  const [note, setNote] = useState("");
  // Бывший отдельный блок «лид-магнит» — теперь галочка в общей форме: одна форма
  // вместо двух, и мы не отдаём ссылку на PDF, пока настоящего каталога нет.
  const [wantCatalog, setWantCatalog] = useState(false);
  const [hp, setHp] = useState(""); // honeypot (ТЗ §15)
  const [consent, setConsent] = useState(false); // 152-ФЗ (ТЗ B.2)
  const [marketing, setMarketing] = useState(false); // отдельное согласие на рассылки
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  // До-отправка ранее не доставленных лидов (ТЗ B.5).
  useEffect(() => {
    installLeadQueueAutoFlush();
    void flushLeads();
  }, []);

  const valid = {
    name: name.trim().length >= 2,
    phone: digits(phone) >= 6,
    email: email === "" || /^\S+@\S+\.\S+$/.test(email),
  };
  const showErr = (k: keyof typeof valid) => touched[k] && !valid[k];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, consent: true });
    if (!valid.name || !valid.phone || !valid.email) {
      // нативная подсказка + фокус на первом невалидном (fallback для всех браузеров)
      formRef.current?.reportValidity();
      return;
    }
    if (!consent) return; // 152-ФЗ: без согласия не отправляем
    setState("sending");

    const utm: Record<string, string> = {};
    if (typeof window !== "undefined") {
      new URLSearchParams(window.location.search).forEach((v, k) => {
        if (k.startsWith("utm_")) utm[k] = v;
      });
    }
    const commentParts = [comment, fields.includes("comment") && note ? note : ""].filter(Boolean);
    // Поля формы уходят структурой (data): из неё Битрикс собирает заголовок,
    // UF-поля и сумму сделки, а не парсит текст комментария.
    const payloadData: Record<string, unknown> = {
      ...(data ?? {}),
      ...(city ? { city } : {}),
      ...(fields.includes("company") && companyName ? { company: companyName } : {}),
      ...(fields.includes("interest") && interest ? { interest } : {}),
      ...(fields.includes("region") && region ? { region } : {}),
      ...(fields.includes("catalog") && wantCatalog ? { wants_catalog: true } : {}),
      ...(marketing ? { marketing: true } : {}),
    };
    const url = withBase("/api/lead");
    const idempotencyKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${name}-${phone}`;
    const payloadBody = JSON.stringify({
      name,
      phone,
      email: fields.includes("email") && email ? email : undefined,
      hp_field: hp,
      tag,
      source,
      data: payloadData,
      comment: commentParts.join("\n"),
      city,
      consent,
      page: typeof window !== "undefined" ? window.location.href : "",
      utm,
      idempotencyKey,
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payloadBody,
      });
      if (res.ok) {
        setState("done");
        reachGoal(GOALS.lead, { form: tag, source });
        onSuccess?.();
      } else if (res.status >= 500) {
        // Сервер/Битрикс недоступен — кладём в очередь, до-отправим позже (ТЗ B.5)
        enqueueLead(url, payloadBody);
        setState("done");
        reachGoal(GOALS.lead, { form: tag, source });
        onSuccess?.();
      } else {
        setState("error");
      }
    } catch {
      // Обрыв сети — сохраняем и до-отправляем при возврате онлайн (ТЗ B.5)
      enqueueLead(url, payloadBody);
      setState("done");
      // Цель шлём и здесь: заявка принята и дойдёт до CRM из очереди, а сам
      // вызов Метрика буферизует до восстановления сети.
      reachGoal(GOALS.lead, { form: tag, source });
      onSuccess?.();
    }
  }

  const labelCls = `text-sm font-medium ${dark ? "text-sand/80" : "text-stone"}`;
  const inputCls = `field-input ${dark ? "field-input--dark" : ""}`;

  if (state === "done") {
    return (
      <div className={`rounded-card p-6 text-center ${dark ? "bg-sand/10 text-sand" : "bg-sand-deep"} ${className}`}>
        <h3 className={`font-display text-xl font-bold ${dark ? "text-sand" : "text-ink"}`}>Готово!</h3>
        <p className={`mt-2 ${dark ? "text-sand/80" : "text-stone"}`}>{successText}</p>
        {downloadUrl ? (
          <a
            href={withBase(downloadUrl)}
            className="mt-4 inline-flex rounded-full bg-clinker px-6 py-3 font-semibold text-white transition hover:bg-clinker-hover"
            download
          >
            Скачать PDF →
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className={`flex flex-col gap-3.5 ${className}`}>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Имя</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          aria-invalid={showErr("name") || undefined}
          aria-errormessage={showErr("name") ? `${uid}-name-err` : undefined}
          className={inputCls}
          placeholder="Ваше имя"
        />
        {showErr("name") ? (
          <span id={`${uid}-name-err`} className="field-err">
            Укажите имя (минимум 2 символа).
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Телефон</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          required
          inputMode="tel"
          pattern="[\d\s()+\-]{6,}"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          aria-invalid={showErr("phone") || undefined}
          aria-errormessage={showErr("phone") ? `${uid}-phone-err` : undefined}
          className={inputCls}
          placeholder="+7 900 000-00-00"
        />
        {showErr("phone") ? (
          <span id={`${uid}-phone-err`} className="field-err">
            Введите корректный номер телефона.
          </span>
        ) : null}
      </label>

      {fields.includes("email") ? (
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={showErr("email") || undefined}
            aria-errormessage={showErr("email") ? `${uid}-email-err` : undefined}
            className={inputCls}
            placeholder="you@example.com"
          />
          {showErr("email") ? (
            <span id={`${uid}-email-err`} className="field-err">
              Проверьте адрес электронной почты.
            </span>
          ) : null}
        </label>
      ) : null}

      {fields.includes("company") ? (
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Компания</span>
          <input
            type="text"
            name="organization"
            autoComplete="organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={inputCls}
            placeholder="Название бюро / компании"
          />
        </label>
      ) : null}

      {fields.includes("interest") && interestOptions ? (
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Что вас интересует?</span>
          <select
            name="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className={inputCls}
          >
            <option value="">— выберите —</option>
            {interestOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {fields.includes("region") ? (
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Регион доставки</span>
          <input
            type="text"
            name="region"
            autoComplete="address-level1"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={inputCls}
            placeholder="Город / регион"
          />
        </label>
      ) : null}

      {fields.includes("comment") ? (
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Комментарий</span>
          <textarea
            name="comment"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputCls}
            placeholder="Кратко опишите задачу"
          />
        </label>
      ) : null}

      {fields.includes("catalog") ? (
        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={wantCatalog}
            onChange={(e) => setWantCatalog(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-clinker)]"
          />
          <span className={`text-sm ${dark ? "text-sand/80" : "text-stone"}`}>
            Пришлите заодно каталог коллекций и прайс-лист.
          </span>
        </label>
      ) : null}

      {/* honeypot — скрыт от людей (ТЗ §15) */}
      <input
        type="text"
        name="hp_field"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
      />

      {/* 152-ФЗ: отдельное непредотмеченное согласие; без отметки отправки нет,
          но кнопка кликабельна — клик подсвечивает подсказку (disabled-submit
          молчал бы о причине). */}
      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-invalid={touched.consent && !consent ? true : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-clinker)]"
        />
        <span className={`text-xs ${dark ? "text-sand/70" : "text-stone"}`}>
          Я согласен на обработку персональных данных в соответствии с{" "}
          {/* withBase обязателен: на подпути сырой /privacy уходил на чужой сайт (агентства) */}
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
      {touched.consent && !consent ? (
        <span className="field-err">Отметьте согласие, чтобы отправить заявку.</span>
      ) : null}

      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-clinker)]"
        />
        <span className={`text-xs ${dark ? "text-sand/55" : "text-stone/70"}`}>
          Согласен получать новости и информацию об акциях (необязательно).
        </span>
      </label>

      {state === "error" ? (
        <p className="field-err" role="alert">
          Не удалось отправить. Позвоните нам или попробуйте позже.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="sheen mt-1 rounded-full bg-clinker px-6 py-3.5 font-semibold text-white transition hover:bg-clinker-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "sending" ? "Отправляем…" : submitLabel}
      </button>
    </form>
  );
}
