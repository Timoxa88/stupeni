import { getAllContent, overriddenSections, CONTENT_DEFAULTS } from "@/lib/store/content";
import {
  resetSectionAction,
  saveAdvantagesAction,
  saveContactsAction,
  saveHeroAction,
  saveServicesAction,
} from "../../content-actions";

export const dynamic = "force-dynamic";

/** Пустые строки в конце — чтобы можно было добавить пункт без JS. */
const withBlanks = <T,>(items: T[], blank: T, count = 2): T[] => [
  ...items,
  ...Array.from({ length: count }, () => blank),
];

export default async function AdminContent({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [content, overridden] = await Promise.all([getAllContent(), overriddenSections()]);

  return (
    <div className="max-w-4xl">
      <h1 className="a-h1">Контент сайта</h1>
      <p className="a-muted mt-1 mb-6 max-w-3xl">
        Тексты берутся из кода, а сохранённые здесь значения их перекрывают. «Сбросить» —
        вернуть блок к исходному тексту проекта.
      </p>

      {saved ? (
        <div className="a-card a-card-pad mb-5 border-[#b9c6b3] bg-[#f2f6f0]">
          <p className="text-sm font-semibold text-[#3c5236]">✓ Блок сохранён — сайт обновлён</p>
        </div>
      ) : null}

      {/* ── Hero ── */}
      <Section title="Первый экран (Hero)" note="Надзаголовок, три строки H1, подзаголовок, кнопки" k="hero" overridden={overridden.has("hero")}>
        <form action={saveHeroAction} className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="a-label">Надзаголовок</span>
            <input name="eyebrow" className="a-input" defaultValue={content.hero.eyebrow} />
          </label>
          <label>
            <span className="a-label">H1 — строка 1</span>
            <input name="titleLine1" className="a-input" defaultValue={content.hero.titleLine1} />
          </label>
          <label>
            <span className="a-label">H1 — строка 2</span>
            <input name="titleLine2" className="a-input" defaultValue={content.hero.titleLine2} />
          </label>
          <label className="sm:col-span-2">
            <span className="a-label">H1 — акцентная строка (градиент)</span>
            <input name="titleAccent" className="a-input" defaultValue={content.hero.titleAccent} />
          </label>
          <label className="sm:col-span-2">
            <span className="a-label">Подзаголовок</span>
            <textarea name="subtitle" className="a-textarea" defaultValue={content.hero.subtitle} />
          </label>
          <label>
            <span className="a-label">Кнопка 1 — текст</span>
            <input name="primaryLabel" className="a-input" defaultValue={content.hero.primaryCta.label} />
          </label>
          <label>
            <span className="a-label">Кнопка 1 — ссылка</span>
            <input name="primaryHref" className="a-input" defaultValue={content.hero.primaryCta.href} />
          </label>
          <label>
            <span className="a-label">Кнопка 2 — текст</span>
            <input name="secondaryLabel" className="a-input" defaultValue={content.hero.secondaryCta.label} />
          </label>
          <label>
            <span className="a-label">Кнопка 2 — ссылка</span>
            <input name="secondaryHref" className="a-input" defaultValue={content.hero.secondaryCta.href} />
          </label>
          <div className="sm:col-span-2">
            <button className="a-btn a-btn-primary" type="submit">
              Сохранить первый экран
            </button>
          </div>
        </form>
      </Section>

      {/* ── Преимущества ── */}
      <Section title="Преимущества" note="Пустая строка = пункт удалён" k="advantages" overridden={overridden.has("advantages")}>
        <form action={saveAdvantagesAction}>
          <div className="grid gap-3">
            {withBlanks(content.advantages.items, { title: "", text: "" }).map((it, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr]">
                <input name={`title-${i}`} className="a-input" placeholder="Заголовок" defaultValue={it.title} />
                <input name={`text-${i}`} className="a-input" placeholder="Описание" defaultValue={it.text} />
              </div>
            ))}
          </div>
          <button className="a-btn a-btn-primary mt-4" type="submit">
            Сохранить преимущества
          </button>
        </form>
      </Section>

      {/* ── Услуги ── */}
      <Section
        title="Услуги"
        note="Тег — метка заявки в Битрикс24 (форма услуги)"
        k="services"
        overridden={overridden.has("services")}
      >
        <form action={saveServicesAction}>
          <div className="grid gap-3">
            {withBlanks(content.services.items, { title: "", desc: "", tag: "" }).map((it, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_0.8fr]">
                <input name={`title-${i}`} className="a-input" placeholder="Название" defaultValue={it.title} />
                <input name={`desc-${i}`} className="a-input" placeholder="Описание" defaultValue={it.desc} />
                <input name={`tag-${i}`} className="a-input" placeholder="Тег CRM" defaultValue={it.tag} />
              </div>
            ))}
          </div>
          <button className="a-btn a-btn-primary mt-4" type="submit">
            Сохранить услуги
          </button>
        </form>
      </Section>

      {/* ── Контакты ── */}
      <Section title="Контакты и реквизиты" note="Шапка, футер, страница контактов" k="contacts" overridden={overridden.has("contacts")}>
        <form action={saveContactsAction} className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="a-label">Телефон (tel:)</span>
            <input name="phone" className="a-input" defaultValue={content.contacts.phone} />
          </label>
          <label>
            <span className="a-label">Телефон (как показывать)</span>
            <input name="phoneLabel" className="a-input" defaultValue={content.contacts.phoneLabel} />
          </label>
          <label>
            <span className="a-label">Email</span>
            <input name="email" className="a-input" defaultValue={content.contacts.email} />
          </label>
          <label>
            <span className="a-label">Юр. лицо</span>
            <input name="legal" className="a-input" defaultValue={content.contacts.legal} />
          </label>
          <label>
            <span className="a-label">ИНН</span>
            <input name="inn" className="a-input" defaultValue={content.contacts.inn} />
          </label>
          <label>
            <span className="a-label">ОГРН</span>
            <input name="ogrn" className="a-input" defaultValue={content.contacts.ogrn} />
          </label>

          <div className="sm:col-span-2">
            <span className="a-label">Телефоны по городам</span>
            <div className="grid gap-2">
              {withBlanks(content.contacts.cities, { city: "", phone: "", phoneLabel: "" }, 1).map((c, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-3">
                  <input name={`city-${i}`} className="a-input" placeholder="Москва" defaultValue={c.city} />
                  <input name={`phone-${i}`} className="a-input" placeholder="+74993977727" defaultValue={c.phone} />
                  <input
                    name={`phoneLabel-${i}`}
                    className="a-input"
                    placeholder="+7 499 397-77-27"
                    defaultValue={c.phoneLabel}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <button className="a-btn a-btn-primary" type="submit">
              Сохранить контакты
            </button>
          </div>
        </form>
      </Section>

      <p className="a-muted text-sm">
        Блоки, которых нет в списке (шоурумы, склады, сценарии, категории), пока задаются в коде:{" "}
        <code>lib/content/</code>. Дефолты видны в{" "}
        <code>CONTENT_DEFAULTS</code> ({Object.keys(CONTENT_DEFAULTS).length} блока).
      </p>
    </div>
  );
}

function Section({
  title,
  note,
  k,
  overridden,
  children,
}: {
  title: string;
  note: string;
  k: string;
  overridden: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="a-card mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-divider px-5 py-4">
        <div>
          <h2 className="a-h2">
            {title}{" "}
            {overridden ? <span className="a-badge a-badge-accent ml-1">изменён</span> : null}
          </h2>
          <p className="a-muted text-sm">{note}</p>
        </div>
        {overridden ? (
          <form action={resetSectionAction}>
            <input type="hidden" name="key" value={k} />
            <button className="a-btn a-btn-danger a-btn-sm" type="submit">
              Сбросить
            </button>
          </form>
        ) : null}
      </div>
      <div className="a-card-pad">{children}</div>
    </section>
  );
}
