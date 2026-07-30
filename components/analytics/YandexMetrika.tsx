"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Яндекс.Метрика (ТЗ §15). Номер счётчика приходит из админки («Настройки»),
 * поэтому включение не требует пересборки.
 *
 * Загружаем только после согласия на cookie (CookieBanner пишет
 * `cookie-consent-v1` в localStorage и рассылает событие `consentchange`) —
 * иначе аналитика ставится без согласия (152-ФЗ / ТЗ B.2).
 */
export function YandexMetrika({ counterId }: { counterId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // CookieBanner хранит объект { necessary, analytics, ads } под этим ключом.
    const read = () => {
      try {
        const raw = localStorage.getItem("cookie-consent-v1");
        setAllowed(!!raw && JSON.parse(raw)?.analytics === true);
      } catch {
        setAllowed(false);
      }
    };
    read();
    window.addEventListener("consentchange", read);
    return () => window.removeEventListener("consentchange", read);
  }, []);

  if (!counterId || !allowed) return null;

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
        ym(${JSON.stringify(counterId)}, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- требование Метрики */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
