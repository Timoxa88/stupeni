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
 * ВАЖНО: в паре с этим ОТКЛЮЧЁН вебвизор — он записывает сессию целиком,
 * включая ввод в формы, и без явного согласия это уже обработка персональных
 * данных. Связка «посещения считаем сразу / сессии не пишем» осознанная:
 * вернуть webvisor:true можно только вместе с баннером согласия.
 * Вебвизор выключен и в настройках самого счётчика — чтобы его нельзя было
 * включить из интерфейса Метрики в обход этого решения.
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
        ym(${JSON.stringify(counterId)}, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
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
