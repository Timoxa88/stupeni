import { Img as Image } from "@/components/ui/Img";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const gridMotif: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(243,241,236,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,241,236,0.05) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

/**
 * Hero подстраницы (категория / решение / бренд / блог). Тёмный графит с фото
 * сценария. Фото — LCP-кандидат: priority (= fetchpriority=high, без lazy), ТЗ §15.
 */
export function SubHero({
  image,
  alt,
  eyebrow,
  h1,
  intro,
  breadcrumbs,
  children,
}: {
  image: string;
  alt: string;
  eyebrow?: string;
  h1: string;
  intro?: string;
  breadcrumbs: { name: string; url: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative -mt-[72px] overflow-hidden bg-graphite-deep pt-[72px] text-sand">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="img-rich object-cover object-center opacity-45"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(12,14,13,0.78) 0%, rgba(12,14,13,0.6) 45%, rgba(12,14,13,0.92) 100%)",
        }}
      />
      <div className="absolute inset-0" style={gridMotif} aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="[&_*]:!text-sand/70 [&_[aria-current]]:!text-sand">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        {eyebrow ? <p className="eyebrow mt-6 text-clinker-bright">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.1rem,5vw,3.8rem)] font-extrabold leading-[1.02]">
          {h1}
        </h1>
        {intro ? <p className="mt-5 max-w-2xl text-lg text-sand/85">{intro}</p> : null}
        {children ? <div className="mt-8 flex flex-wrap gap-4">{children}</div> : null}
      </div>
    </section>
  );
}
