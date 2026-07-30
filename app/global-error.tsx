"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // basePath инлайнится на сборке: global-error рендерится вне layout,
    // поэтому withBase отсюда недоступен.
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    void fetch(`${base}/api/error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        context: { boundary: "global-error" },
      }),
      keepalive: true,
    }).catch(() => {});
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          margin: 0,
          background: "#f3f1ec",
          color: "#111110",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Произошла ошибка</h1>
          <p>Попробуйте обновить страницу.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              border: "none",
              background: "#b8481f",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Повторить
          </button>
          {error?.digest ? <p style={{ opacity: 0.5, fontSize: 12 }}>{error.digest}</p> : null}
        </div>
      </body>
    </html>
  );
}
