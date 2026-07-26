"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
