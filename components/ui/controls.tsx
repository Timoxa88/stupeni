"use client";

import type { ReactNode } from "react";

/** Подпись поля. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-stone">{label}</span>
      {children}
      {hint ? <span className="text-xs text-stone/70">{hint}</span> : null}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-sand-divider bg-white px-3 py-2 text-ink outline-none transition focus:border-clinker focus:ring-2 focus:ring-clinker/20";

export function NumberField({
  value,
  onChange,
  min = 0,
  step = "any",
  placeholder,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number | "any";
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        className={`${inputCls} tabular ${suffix ? "pr-12" : ""}`}
        value={Number.isFinite(value) ? value : ""}
        min={min}
        step={step}
        placeholder={placeholder}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          onChange(Number.isNaN(v) ? 0 : v);
        }}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone/70">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      className={inputCls}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-ink/10 bg-sand-deep/70 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full font-semibold transition duration-300 ${
              size === "sm" ? "px-4 py-1.5 text-sm" : "px-5 py-2.5"
            } ${
              active
                ? "bg-ink text-sand shadow-card"
                : "text-stone hover:text-ink"
            }`}
            aria-pressed={active}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-left"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-clinker" : "bg-sand-divider"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
      <span className="text-sm text-ink">{label}</span>
    </button>
  );
}

export function IconButton({
  onClick,
  label,
  children,
  variant = "ghost",
  disabled,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
  variant?: "ghost" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 ${
        variant === "danger"
          ? "border-clinker/30 text-clinker hover:bg-clinker/10"
          : "border-sand-divider text-stone hover:border-stone hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
