import { Img as Image } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";

export interface GalleryImage {
  src: string;
  alt: string;
  /** Реальные пропорции кадра; без них вертикальные фото режутся под 4:3. */
  w?: number;
  h?: number;
}

/**
 * Наши работы — масонри-сетка с hover-зумом (ТЗ §6, блок 14).
 *
 * 07.08.2026 подборка заменена на собственную съёмку объектов (см. lib/images.ts →
 * OBJECTS и scripts/import_works_photos.py). До этого блок держал сначала сток,
 * потом рендеры заводов, потом кадры из архива Битрикс24.Диска.
 *
 * Заголовок «Наши работы» поставлен после прямого подтверждения заказчика, что
 * объекты наши. Подписи — только сценарий и, где известна, коллекция: **без
 * городов, районов и прочей географии**, объекты частные.
 */
export function Gallery({ images }: { images: GalleryImage[] }) {
  if (!images.length) return null;
  return (
    <section className="bg-sand-deep">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow text-clinker">Объекты</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Наши работы
          </h2>
          <p className="mt-4 max-w-2xl text-stone">
            Крыльца, уличные лестницы, площадки и террасы на наших объектах —
            фотографии с самих объектов, а не каталожные рендеры. Где известна
            коллекция, она указана в подписи к кадру.
          </p>
        </Reveal>
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={(i % 3) * 90}>
              <figure className="group relative overflow-hidden rounded-card border border-ink/10 shadow-card">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.w ?? 800}
                  height={img.h ?? 600}
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
