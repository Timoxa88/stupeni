import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { PLACES } from "@/lib/content/site";

/** Шоу-румы + склады и доставка (ТЗ §6 блоки 18–19). */
export function Showrooms() {
  const showrooms = PLACES.filter((p) => p.kind === "showroom");
  const warehouses = PLACES.filter((p) => p.kind === "warehouse");

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
      <Reveal>
        <p className="eyebrow text-clinker">Где посмотреть и забрать</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
          Шоу-румы и склады
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {/* Шоу-румы */}
        <div className="grid gap-4 sm:grid-cols-2">
          {showrooms.map((p) => (
            <Reveal key={`${p.city}-show`}>
              <div className="flex h-full flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card">
                <div className="eyebrow text-clinker">Шоу-рум</div>
                <h3 className="mt-2 font-display text-xl font-bold text-ink">{p.city}</h3>
                <p className="mt-2 text-stone">{p.address}</p>
                <p className="mt-1 text-sm text-stone/70">{p.hours}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Склады + доставка */}
        <Reveal delay={120}>
          <div className="flex h-full flex-col rounded-card bg-graphite-deep p-6 text-sand sm:p-8">
            <div className="eyebrow text-clinker-bright">Склады и доставка</div>
            <ul className="mt-4 space-y-3 text-sand/85">
              {warehouses.map((w) => (
                <li key={`${w.city}-wh`}>
                  <span className="font-semibold text-sand">Склад {w.city}:</span> {w.address}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sand/80">
              Доставка по России и СНГ — рассчитываем индивидуально под объём и регион.
            </p>
            <details className="group mt-5">
              <summary className="sheen w-fit cursor-pointer list-none rounded-full bg-clinker px-6 py-3 font-semibold text-white transition hover:bg-clinker-hover">
                Рассчитать доставку
              </summary>
              <div className="mt-4 rounded-card bg-white/[0.06] p-5">
                <LeadForm
                  tag="Доставка"
                  variant="dark"
                  submitLabel="Рассчитать доставку"
                  fields={["region"]}
                  comment="Запрос расчёта доставки"
                />
              </div>
            </details>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
