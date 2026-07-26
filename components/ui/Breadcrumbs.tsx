import Link from "next/link";
import { breadcrumbSchema } from "@/lib/jsonld";
import { SchemaScript } from "@/components/seo/SchemaScript";

/** Хлебные крошки + BreadcrumbList Schema (ТЗ §4, §7, §8.1). */
export function Breadcrumbs({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <nav aria-label="Хлебные крошки" className="text-sm text-stone">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.url} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {it.name}
                </span>
              ) : (
                <>
                  <Link href={it.url} className="transition hover:text-clinker">
                    {it.name}
                  </Link>
                  <span aria-hidden className="text-stone/40">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <SchemaScript data={breadcrumbSchema(items)} />
    </nav>
  );
}
