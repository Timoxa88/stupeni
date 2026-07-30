"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "../actions";

const GROUPS: { title: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    title: "Обзор",
    items: [
      { href: "/admin", label: "Панель", icon: "▦" },
      { href: "/admin/leads", label: "Заявки", icon: "✉" },
      { href: "/admin/errors", label: "Ошибки", icon: "⚠" },
    ],
  },
  {
    title: "Каталог",
    items: [
      { href: "/admin/products", label: "Артикулы и цены", icon: "▢" },
    ],
  },
  {
    title: "Контент",
    items: [
      { href: "/admin/content", label: "Контент сайта", icon: "✎" },
      { href: "/admin/blog", label: "Блог", icon: "❝" },
      { href: "/admin/faq", label: "FAQ", icon: "?" },
      { href: "/admin/seo", label: "SEO", icon: "⌕" },
    ],
  },
  {
    title: "Настройки",
    items: [{ href: "/admin/settings", label: "Интеграции и CRM", icon: "⚙" }],
  },
];

const ALL = GROUPS.flatMap((g) => g.items);

export function AdminNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  // usePathname возвращает путь БЕЗ basePath — сравниваем напрямую.
  const isActive = (href: string) => path === href || (href !== "/admin" && path.startsWith(href));
  const current = ALL.find((i) => isActive(i.href));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-sand/10 px-5 py-3 text-sm text-sand md:hidden"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <span className="text-sand/60">{current?.icon ?? "≡"}</span>
          {current?.label ?? "Меню"}
        </span>
        <span className={open ? "rotate-180 transition-transform" : "transition-transform"}>▾</span>
      </button>

      <nav className={`${open ? "block" : "hidden"} pb-3 md:block`}>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="a-nav-group">{g.title}</div>
            {g.items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                data-active={isActive(i.href)}
                className="a-nav-link"
              >
                <span className="w-4 text-center text-sand/55">{i.icon}</span>
                {i.label}
              </Link>
            ))}
          </div>
        ))}

        <form action={logout} className="mt-4 border-t border-sand/10 px-5 pt-4">
          <button type="submit" className="a-btn a-btn-sm w-full border-sand/25 bg-transparent text-sand/75">
            Выйти
          </button>
        </form>
      </nav>
    </>
  );
}
