import Link from "next/link";
import { SITE, CITY_CONTACTS } from "@/lib/content/site";

const COLS = [
  {
    title: "Продукция",
    links: [
      ["Террасный клинкер", "/terrasnyy-klinker"],
      ["Террасные пластины", "/terrasnye-plastiny"],
      ["Под дерево", "/plastiny-pod-derevo"],
      ["Калькулятор", "/calculator"],
    ],
  },
  {
    title: "Решения",
    links: [
      ["Крыльцо", "/resheniya/kryltso"],
      ["Уличная лестница", "/resheniya/lestnitsa-ulitsa"],
      ["Терраса", "/resheniya/terrasa"],
      ["Укладка на опоры", "/resheniya/landshaft-opory"],
    ],
  },
  {
    title: "Компания",
    links: [
      ["Производители", "/producers/stroeher"],
      ["Услуги", "/services"],
      ["Блог", "/blog"],
      ["Архитекторам", "/#architects"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-graphite-deep text-sand">
      <div
        className="absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(40rem 24rem at 90% 0%, rgba(193,87,46,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr]">
          <div>
            <div className="font-display text-2xl font-extrabold">
              Hit<span className="text-clinker-bright">Ceramics</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-sand/80">
              Клинкерные ступени и крупноформатный керамогранит для крыльца,
              лестниц и террас. Доставка по России и СНГ.
            </p>
            <div className="mt-6 flex flex-col gap-1.5">
              {CITY_CONTACTS.map((c) => (
                <a key={c.phone} href={`tel:${c.phone}`} className="font-display text-lg font-bold">
                  {c.phoneLabel}{" "}
                  <span className="text-sm font-normal text-sand/60">— {c.city}</span>
                </a>
              ))}
              <a href={`mailto:${SITE.email}`} className="mt-1 text-sm text-sand/85 transition hover:text-clinker-bright">
                {SITE.email}
              </a>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="eyebrow text-sand/60">{col.title}</div>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-sand/85">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="transition hover:text-clinker-bright">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="text-sm text-sand/75">
            <div className="eyebrow text-sand/60">Контакты</div>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>Шоу-рум СПб — м. Новочеркасская</li>
              <li>Шоу-рум Москва — м. Калужская</li>
              <li>пн–пт 9:00–19:00</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {["VK", "TG", "WA"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sand/25 text-xs font-semibold text-sand/80 transition hover:border-clinker hover:text-clinker-bright"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-sand/20 pt-6 text-xs text-sand/60 sm:flex-row sm:items-center">
          <p>
            ООО «ЗЕ ВАН» · ИНН 7806568970 · ОГРН 1207800001639 · ©{" "}
            {new Date().getFullYear()} Hit Ceramics
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/contacts" className="hover:text-sand/70">Контакты</Link>
            <Link href="/payment-delivery" className="hover:text-sand/70">Оплата и доставка</Link>
            <Link href="/privacy" className="hover:text-sand/70">Конфиденциальность</Link>
            <Link href="/offer" className="hover:text-sand/70">Оферта</Link>
            <Link href="/accessibility" className="hover:text-sand/70">Доступность</Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-sand/55">
          delivered by{" "}
          <a
            href="https://br2nd.tech"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-sand/80 underline-offset-4 transition hover:text-clinker-bright hover:underline"
          >
            br2nd.tech
          </a>
        </div>
      </div>
    </footer>
  );
}
