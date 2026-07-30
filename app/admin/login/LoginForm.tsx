"use client";

import { useState, useTransition } from "react";
import { login } from "../actions";

export function LoginForm({ next }: { next?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(null);
        start(async () => {
          const res = await login(fd);
          if (res?.error) setError(res.error);
        });
      }}
      className="flex flex-col gap-3"
    >
      <input type="hidden" name="next" value={next ?? "/admin"} />
      <label>
        <span className="a-label">Пароль</span>
        <input className="a-input" type="password" name="password" required autoFocus autoComplete="current-password" />
      </label>
      {error ? (
        <p className="text-sm font-semibold text-[#a3261a]" role="alert">
          {error}
        </p>
      ) : null}
      <button className="a-btn a-btn-primary mt-1" type="submit" disabled={pending}>
        {pending ? "Проверяем…" : "Войти"}
      </button>
    </form>
  );
}
