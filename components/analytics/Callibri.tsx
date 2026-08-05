"use client";

import Script from "next/script";

/**
 * Callibri — коллтрекинг и виджет обратного звонка (код выдан вместе с
 * кодами hc-sftk.ru, 05.08.2026).
 *
 * У скрипта нет параметра с номером площадки: Callibri узнаёт сайт по домену,
 * с которого запрошен файл. Значит, домен обязан быть заведён в кабинете
 * Callibri — иначе скрипт загрузится и молча ничего не покажет. Проверка —
 * в кабинете, из кода это не видно.
 *
 * В оригинальном сниппете адрес протокол-относительный (`//cdn.callibri.ru`);
 * здесь явный https — сайт работает только по https (HSTS в nginx), а
 * протокол-относительные адреса Next в next/script не любит.
 *
 * Выключается из админки: поле «Callibri» = `0`.
 */
export function Callibri({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  return (
    <Script
      id="callibri"
      src="https://cdn.callibri.ru/callibri.js"
      strategy="afterInteractive"
    />
  );
}
