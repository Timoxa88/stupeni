import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hit Ceramics — клинкерные ступени и крупноформатный керамогранит";

/** Брендированная OG-обложка по умолчанию (ТЗ B.6). Применяется ко всем страницам без своей. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0e0d",
          color: "#f3f1ec",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "56px", height: "8px", background: "#ee7c46" }} />
          <div style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "0.04em" }}>
            HIT CERAMICS
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "68px", fontWeight: 800, lineHeight: 1.05, maxWidth: "1000px" }}>
            Клинкерные ступени и керамогранит 20 мм для улицы
          </div>
          <div style={{ fontSize: "30px", color: "#c9c3b8", maxWidth: "900px" }}>
            Крыльцо · лестницы · террасы · дорожки. Морозостойко, не скользит, расчёт онлайн.
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "24px", color: "#ee7c46", fontWeight: 600 }}>
          <span>F100–F150</span>
          <span style={{ color: "#534e47" }}>·</span>
          <span>R10–R12</span>
          <span style={{ color: "#534e47" }}>·</span>
          <span>Доставка по РФ и СНГ</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
