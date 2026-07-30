"use client";

import { createContext, useContext } from "react";
import { SITE, CITY_CONTACTS } from "@/lib/content/site";

/**
 * Контакты, отредактированные в админке, раздаются клиентским компонентам
 * (Header, мобильная CTA-панель). Значение приходит из серверного layout;
 * дефолт — контакты из кода, поэтому компонент работает и без БД.
 */
export type Contacts = {
  phone: string;
  phoneLabel: string;
  email: string;
  cities: { city: string; phone: string; phoneLabel: string }[];
};

const DEFAULT: Contacts = {
  phone: SITE.phone,
  phoneLabel: SITE.phoneLabel,
  email: SITE.email,
  cities: CITY_CONTACTS.map((c) => ({ ...c })),
};

const Ctx = createContext<Contacts>(DEFAULT);

export function ContactsProvider({
  value,
  children,
}: {
  value: Contacts;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContacts(): Contacts {
  return useContext(Ctx);
}
