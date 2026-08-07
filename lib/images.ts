/**
 * Манифест изображений сайта. Файлы лежат в /public/images, next/image отдаёт их
 * в WebP/AVIF с lazy-load (ТЗ §14/§15).
 *
 * Источник (замена стока 27.07.2026, ТЗ §5 сток запрещает): официальные фото и
 * рендеры производителей из папки парсинга — Exagres, Stroeher, Westerwälder
 * Klinker, Маркастрой. Часть кадров — реальные объекты из разделов «проекты»
 * этих заводов. Карта соответствия «файл ← источник» и пометка о логотипе
 * производителя на кадре — в scripts/replace_site_images.py, там же перегенерация.
 *
 * Своя съёмка объектов появилась 07.08.2026 и по приоритету источников идёт
 * первой — она собрана ниже, в OBJECTS.
 */

export interface SiteImage {
  src: string;
  alt: string;
  /** Реальные пропорции кадра — чтобы масонри-галерея не резала вертикальные фото. */
  w?: number;
  h?: number;
}

export const IMAGES = {
  hero: {
    src: "/images/hero.jpg",
    alt: "Зимняя терраса со ступенями, облицованная терракотовым клинкером, снег вокруг",
  },
  catClinker: {
    src: "/images/cat-clinker.jpg",
    alt: "Клинкерные ступени крупным планом — проступь с капиносом, подступёнок, кромка",
  },
  catSlab: {
    src: "/images/cat-slab.jpg",
    alt: "Крупноформатный керамогранит 20 мм на террасе у бассейна",
  },
  catWood: {
    src: "/images/cat-wood.jpg",
    alt: "Терраса из керамогранита под дерево вдоль узкого бассейна",
  },
} satisfies Record<string, SiteImage>;

/**
 * Галерея объектов (ТЗ §6, блок 14) — реальные крыльца, уличные лестницы,
 * площадки и террасы, которые мы сделали.
 *
 * 07.08.2026 подборка ЗАМЕНЕНА ЦЕЛИКОМ: вместо кадров из архива Битрикс24.Диска
 * («Информация для дилера / Фото объекты Paradyz», scripts/fetch_b24_objects.py)
 * здесь собственная съёмка объектов — папка Кирилла `Downloads/ступени`.
 * Обработка и таблица «исходник → файл → подпись» — scripts/import_works_photos.py,
 * оттуда же перегенерация. Прежние /images/objects/*.jpg удалены; кадры
 * /images/objects/catalog/*.jpg НЕ трогать — они живут в карточках товаров.
 *
 * Три кадра из папки в подборку не вошли: два с вывесками сторонних заведений
 * (правило «никаких упоминаний других компаний») и один слишком тёмный —
 * причины перечислены в SKIPPED импортёра.
 *
 * ПРАВИЛО (Кирилл, 28.07.2026): **никакой гео-привязки к фото объектов** — ни
 * города, ни района, ни посёлка ни в подписи, ни в alt, ни в имени файла. Объекты
 * частные, и локация клиента не наша, чтобы её публиковать. EXIF при пересохранении
 * не копируется (PIL пишет файл заново), но при смене пайплайна проверять, что
 * GPS-тегов в JPEG нет.
 *
 * Коллекция в подписи стоит только там, где она известна из имени исходника;
 * у безымянных кадров подпись описывает сцену — угадывать коллекцию по фото нельзя.
 *
 * Порядок перемешан вручную: соседние кадры — разные объекты, тёмные и светлые
 * чередуются. `w`/`h` — реальные пропорции, иначе масонри режет вертикальные кадры.
 */
export const OBJECTS: SiteImage[] = [
  { src: "/images/objects/works/viano-grys-lestnica.jpg", w: 1200, h: 1600, alt: "Полукруглая парадная лестница с коваными перилами, клинкер Paradyz Viano Grys" },
  { src: "/images/objects/works/semir-rosa-lestnica.jpg", w: 1080, h: 1080, alt: "Уличная лестница в четыре ступени вдоль фасада, клинкер Paradyz Semir Rosa" },
  { src: "/images/objects/works/viano-grys-antracite-veranda.jpg", w: 1600, h: 1066, alt: "Веранда с полом в шахматную укладку, клинкер Paradyz Viano Grys и Viano Antracite" },
  { src: "/images/objects/works/ilario-beige-kryltso.jpg", w: 1080, h: 1080, alt: "Крыльцо с широкой площадкой и ступенями с насечкой, клинкер Paradyz Ilario Beige" },
  { src: "/images/objects/works/lestnica-v-sad.jpg", w: 1280, h: 960, alt: "Уличная лестница в сад из тёмного клинкера" },
  { src: "/images/objects/works/scandiano-ochra-kryltso.jpg", w: 1080, h: 810, alt: "Крыльцо с охристой площадкой и ступенями с насечкой, клинкер Paradyz Scandiano Ochra" },
  { src: "/images/objects/works/viano-antracite-kryltso.jpg", w: 1500, h: 1125, alt: "Крыльцо в две ступени у входной двери, клинкер Paradyz Viano Antracite" },
  { src: "/images/objects/works/kryltso-terrakota.jpg", w: 1600, h: 1200, alt: "Крыльцо с терракотовой плиткой и цветами у входной двери" },
  { src: "/images/objects/works/shirokaya-lestnica.jpg", w: 1280, h: 960, alt: "Широкая уличная лестница входной группы" },
  { src: "/images/objects/works/natural-brown-lestnica.jpg", w: 1080, h: 1080, alt: "Уличная лестница с коваными перилами, клинкер Paradyz Natural Brown" },
  { src: "/images/objects/works/semir-beige-kryltso.jpg", w: 594, h: 594, alt: "Многоугольное крыльцо в три ступени, клинкер Paradyz Semir Beige" },
  { src: "/images/objects/works/viano-antracite-ploshchadka.jpg", w: 1500, h: 1125, alt: "Площадка со ступенью и капиносом из тёмного клинкера, Paradyz Viano Antracite" },
  { src: "/images/objects/works/scandiano-brown-terrasa.jpg", w: 1200, h: 1600, alt: "Терраса с обеденной зоной у кирпичного дома, клинкер Paradyz Scandiano Brown" },
  { src: "/images/objects/works/viano-beige-kryltso.jpg", w: 769, h: 578, alt: "Крыльцо с площадкой в диагональной укладке и ступенями с насечкой, клинкер Paradyz Viano Beige" },
  { src: "/images/objects/works/lestnica-kovanye-perila.jpg", w: 1080, h: 1350, alt: "Крыльцо-лестница с коваными перилами у кирпичного дома" },
  { src: "/images/objects/works/scandiano-rosso-ploshchadka.jpg", w: 1080, h: 1080, alt: "Площадка перед входом с гранитным бордюром, клинкер Paradyz Scandiano Rosso" },
  { src: "/images/objects/works/kryltso-chetyre-stupeni.jpg", w: 1280, h: 960, alt: "Крыльцо в четыре ступени у кирпичного дома" },
  { src: "/images/objects/works/scandiano-brown-lestnica.jpg", w: 1080, h: 1080, alt: "Лестница входной группы в тёмном клинкере, Paradyz Scandiano Brown" },
  { src: "/images/objects/works/ploshchadka-moshchenie.jpg", w: 1080, h: 1350, alt: "Мощение двора крупноформатным керамогранитом 20 мм" },
  { src: "/images/objects/works/kryltso-dve-stupeni.jpg", w: 1200, h: 1600, alt: "Крыльцо в две ступени с площадкой у входной двери" },
  { src: "/images/objects/works/viano-grys-stupen.jpg", w: 1080, h: 1080, alt: "Ступень с насечкой и террасная плита крупным планом, Paradyz Viano Grys" },
  { src: "/images/objects/works/lestnica-vhodnaya-gruppa.jpg", w: 960, h: 1280, alt: "Уличная лестница входной группы со ступенями с насечкой" },
  { src: "/images/objects/works/vnutrennyaya-lestnica.jpg", w: 960, h: 1280, alt: "Внутренняя лестница со ступенями с насечкой" },
];
