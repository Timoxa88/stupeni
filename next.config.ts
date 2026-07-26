import type { NextConfig } from "next";

// Подпуть для деплоя (напр. "/stupeni" на br2nd.tech/stupeni). Пусто на проде
// с собственным доменом. Задаётся при сборке: NEXT_PUBLIC_BASE_PATH=/stupeni.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

// Заголовки безопасности (ТЗ §15, B.5). CSP — в режиме Report-Only (B.5: «прогон
// report-only → enforce»), чтобы не ломать инлайновый JSON-LD и рантайм Next;
// allowlist готов под Метрику/Яндекс.Карты/коллтрекинг.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://api-maps.yandex.ru",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://mc.yandex.ru https://*.bitrix24.ru",
  "frame-src 'self' https://mc.yandex.ru",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Разрешаем dev-доступ к /_next/* через туннели ngrok.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.app", "*.ngrok.io"],
};

export default nextConfig;
