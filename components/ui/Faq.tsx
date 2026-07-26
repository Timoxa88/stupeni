import { faqSchema } from "@/lib/jsonld";
import { SchemaScript } from "@/components/seo/SchemaScript";

/**
 * FAQ-аккордеон на нативных <details> (работает без JS, доступен с клавиатуры).
 * Видимый текст = текст в FAQPage-разметке (ТЗ §4, §6 блок 20).
 */
export function Faq({
  items,
  schema = true,
  variant = "light",
}: {
  items: { q: string; a: string }[];
  schema?: boolean;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <div className="divide-y" style={{ borderColor: dark ? "rgba(243,241,236,0.14)" : undefined }}>
      <ul className={`divide-y ${dark ? "divide-sand/15" : "divide-ink/10"}`}>
        {items.map((it) => (
          <li key={it.q}>
            <details className="group py-2">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-bold ${
                  dark ? "text-sand" : "text-ink"
                }`}
              >
                {it.q}
                <span
                  aria-hidden
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition group-open:rotate-45 ${
                    dark ? "border-sand/30 text-sand" : "border-ink/15 text-stone"
                  }`}
                >
                  +
                </span>
              </summary>
              <p className={`pb-5 pr-12 ${dark ? "text-sand/80" : "text-stone"}`}>
                {it.a}
              </p>
            </details>
          </li>
        ))}
      </ul>
      {schema ? <SchemaScript data={faqSchema(items)} /> : null}
    </div>
  );
}
