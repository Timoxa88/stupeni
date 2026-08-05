"use client";

import Script from "next/script";

/**
 * Google Tag Manager (контейнер выдан вместе с кодами hc-sftk.ru, 05.08.2026).
 *
 * Идентификатор контейнера приходит из настроек админки — чтобы поменять или
 * снять контейнер, пересборка не нужна. Пустое значение = тег не выводится
 * вообще.
 *
 * Грузится сразу, как и Метрика (решение заказчика от 01.08.2026 про cookie
 * распространяется на всю аналитику). Стратегия afterInteractive — тег уходит
 * после гидратации и не задерживает первый рендер; для GTM это штатный режим.
 *
 * Что через него можно ловить: события сайта дублируются в `dataLayer`
 * (см. lib/analytics/goals.ts) — `lead_submit`, `phone_click`, `email_click`,
 * `calc_result`, `messenger_click` с теми же именами, что и цели Метрики.
 * Триггеры на них настраиваются в интерфейсе GTM, код для этого не трогаем.
 */
export function GoogleTagManager({ containerId }: { containerId: string }) {
  const id = containerId.trim();
  if (!id) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer',${JSON.stringify(id)});`}
    </Script>
  );
}

/**
 * Вторая половина кода GTM — фолбэк для браузеров без JS. По требованию
 * Google стоит сразу за открывающим `<body>`, поэтому вынесен отдельным
 * компонентом: в app/layout.tsx он идёт первым элементом внутри body.
 */
export function GoogleTagManagerNoScript({ containerId }: { containerId: string }) {
  const id = containerId.trim();
  if (!id) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(id)}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
