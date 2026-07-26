/** Бесконечная лента (полоса брендов, ТЗ §6 блок 2). Чистый CSS. */
export function Marquee({ items }: { items: string[] }) {
  // дублируем массив, чтобы цикл был бесшовным (transform: -50%)
  const doubled = [...items, ...items];
  return (
    <div className="group relative overflow-hidden">
      {/* мягкие края */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-graphite-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-graphite-deep to-transparent" />
      <div className="marquee-track group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-8 inline-flex items-center font-display text-xl font-semibold tracking-tight text-sand/65"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
