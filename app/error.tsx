"use client";

import { useEffect } from "react";
import Link from "next/link";
import { withBase } from "@/lib/base";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
    // Журнал ошибок админки (/admin/errors) — свой сбор вместо Sentry (ТЗ B.5).
    void fetch(withBase("/api/error"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [error]);

  return (
    <main id="main" className="grid min-h-screen place-items-center bg-sand px-5">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">Что-то пошло не так</h1>
        <p className="mt-3 text-stone">
          Мы уже знаем о проблеме. Попробуйте обновить страницу или вернуться позже.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-clinker px-6 py-3 font-semibold text-white transition hover:bg-clinker-hover"
          >
            Повторить
          </button>
          <Link href="/" className="rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink">
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
