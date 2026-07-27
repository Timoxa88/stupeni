import { Img as Image } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Сценарии применения — масонри-сетка с hover-зумом (ТЗ §6, блок 14).
 *
 * Заголовок «Примеры работ» убран сознательно. Сток заменён на фото и рендеры
 * заводов (27.07.2026, см. lib/images.ts) — часть кадров это реальные объекты
 * из разделов «проекты» производителей, но не НАШИ объекты. Подпись «наши
 * работы» под ними была бы таким же заявлением о несуществующем, как выдуманный
 * отзыв. Вернём прежний заголовок, когда будет своя съёмка.
 */
export function Gallery({ images }: { images: GalleryImage[] }) {
  if (!images.length) return null;
  return (
    <section className="bg-sand-deep">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow text-clinker">Сценарии</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Как это выглядит
          </h2>
          <p className="mt-4 max-w-2xl text-stone">
            Крыльцо, уличная лестница, терраса, дорожки и зона у воды — типовые сценарии,
            под которые подбирается материал. Фото и рендеры заводов-производителей
            коллекций.
          </p>
        </Reveal>
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={(i % 3) * 90}>
              <figure className="group relative overflow-hidden rounded-card border border-ink/10 shadow-card">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="img-rich h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-graphite-deep/80 to-transparent p-4 text-sm text-sand opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {img.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
