"use client";

import Script from "next/script";

/**
 * Яндекс.Метрика (ТЗ §15). Номер счётчика приходит из админки («Настройки»),
 * поэтому включение не требует пересборки.
 *
 * Счётчик грузится сразу, не дожидаясь согласия на cookie (решение заказчика
 * 01.08.2026). Прежняя схема ставила его только после нажатия «Принять»:
 * статистика собиралась по меньшинству посетителей, Директ не мог строить
 * сегменты, а Вебмастер счётчик не видел вовсе.
 *
 * Вебвизор ВКЛЮЧЁН (решение заказчика 04.08.2026) — записи сессий нужны, чтобы
 * видеть, где посетитель бросает путь к заявке. Прежде он был выключен целиком
 * из-за того, что писал бы и ввод в формы без явного согласия.
 *
 * Компромисс, который снял это возражение: запись сессий включена, а фиксация
 * ВВОДА В ФОРМЫ выключена в настройках самого счётчика (`wv_forms: 0`, там же
 * `arch_type: load`). То есть видно поведение — клики, скролл, до какого поля
 * дошёл человек, — но не то, что он печатал. Так же настроен хиткерамикс.рф.
 * Если когда-нибудь понадобится содержимое полей — сначала баннер согласия,
 * потом wv_forms, и обязательно правка раздела 4 в app/privacy/page.tsx.
 */
export function YandexMetrika({ counterId }: { counterId: string }) {
  if (!counterId) return null;

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
