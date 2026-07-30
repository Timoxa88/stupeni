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
 * Своей съёмки объектов пока нет — когда появится, приоритет за ней.
 */

export interface SiteImage {
  src: string;
  alt: string;
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
 * Галерея объектов (ТЗ §6, блок 14) — реальные крыльца, лестницы и террасы,
 * снятые на объектах, по коллекциям Paradyz.
 *
 * Источник: внутренняя папка Битрикс24.Диска «Информация для дилера / Фото
 * объекты Paradyz / Paradyz наполка» (folderId 187687) — 246 файлов в 19 папках
 * по коллекциям. Отбор и выгрузка — scripts/fetch_b24_objects.py, там же подписи
 * и имена исходников на Диске; там же тянуть ещё, если понадобится больше.
 *
 * Файлы /images/gal-*.jpg остались на своих местах: они служат hero-картинками
 * страниц решений и фолбэком карточек товаров без своего фото.
 *
 * ПРАВИЛО (Кирилл, 28.07.2026): **никакой гео-привязки к фото объектов** — ни
 * города, ни района, ни посёлка ни в подписи, ни в alt, ни в имени файла. Объекты
 * частные, и локация клиента не наша, чтобы её публиковать. Подпись = сценарий +
 * коллекция, этого достаточно. EXIF при пересохранении не копируется (PIL пишет
 * файл заново), но при смене пайплайна проверять, что GPS-тегов в JPEG нет.
 */
export const OBJECTS: SiteImage[] = [
  // 30.07.2026: галерея покрывает ВСЕ 17 цветов Paradyz, по которым есть фото
  // объектов (кадры /objects/catalog/ — те же, что в карточках товаров, отбор
  // см. коммит 8a1dada). Порядок перемешан вручную: соседние кадры — разные
  // коллекции, тёмные/светлые чередуются.
  { src: "/images/objects/scandiano-brown-terrasa.jpg", alt: "Терраса с обеденной зоной у кирпичного дома, клинкер Paradyz Scandiano Brown" },
  { src: "/images/objects/viano-grys-lestnica.jpg", alt: "Парадная лестница в сад с коваными перилами, клинкер Paradyz Viano Grys" },
  { src: "/images/objects/semir-rosa-kryltso.jpg", alt: "Входная группа с терракотовыми ступенями, клинкер Paradyz Semir Rosa" },
  { src: "/images/objects/catalog/ilario-beige-3.jpg", alt: "Крыльцо на каменном цоколе, клинкер Paradyz Ilario Beige" },
  { src: "/images/objects/cloud-brown-kryltso.jpg", alt: "Крыльцо с тёмными ступенями и каменным цоколем, клинкер Paradyz Cloud Brown" },
  { src: "/images/objects/catalog/scandiano-beige-2.jpg", alt: "Крыльцо в три ступени у входной группы, клинкер Paradyz Scandiano Beige" },
  { src: "/images/objects/semir-brown-kryltso.jpg", alt: "Широкое крыльцо с кирпичным цоколем, клинкер Paradyz Semir Brown" },
  { src: "/images/objects/catalog/viano-antracite-3.jpg", alt: "Крыльцо на брусчатой площадке, клинкер Paradyz Viano Antracite" },
  { src: "/images/objects/scandiano-ochra-lestnica.jpg", alt: "Уличная лестница в семь ступеней с капиносом, клинкер Paradyz Scandiano Ochra" },
  { src: "/images/objects/ilario-brown-kryltso.jpg", alt: "Крыльцо под навесом у кирпичного дома, клинкер Paradyz Ilario Brown" },
  { src: "/images/objects/catalog/mattone-grafit-1.jpg", alt: "Крыльцо в три ступени у входа, клинкер Paradyz Mattone Grafit" },
  { src: "/images/objects/natural-brown-kryltso.jpg", alt: "Крыльцо-подиум в три ступени, клинкер Paradyz Natural Brown" },
  { src: "/images/objects/scandiano-brown-kryltso.jpg", alt: "Входная группа и площадка с креслом, клинкер Paradyz Scandiano Brown" },
  { src: "/images/objects/catalog/semir-grafit-1.jpg", alt: "Ступени входной группы с перилами, клинкер Paradyz Semir Grafit" },
  { src: "/images/objects/catalog/ilario-ochra-1.jpg", alt: "Крыльцо с каменными колоннами, клинкер Paradyz Ilario Ochra" },
  { src: "/images/objects/cloud-brown-terrasa.jpg", alt: "Терраса с кованым ограждением, клинкер Paradyz Cloud Brown" },
  { src: "/images/objects/scandiano-ochra-stupeni.jpg", alt: "Ступени с капиносом крупным планом, клинкер Paradyz Scandiano Ochra" },
  { src: "/images/objects/catalog/viano-beige-1.jpg", alt: "Ступени с рифлёной проступью у кирпичной стены, клинкер Paradyz Viano Beige" },
  { src: "/images/objects/catalog/semir-beige-1.jpg", alt: "Полукруглое крыльцо, клинкер Paradyz Semir Beige" },
  { src: "/images/objects/scandiano-rosso-stupeni.jpg", alt: "Терракотовые ступени с рифлёной проступью, клинкер Paradyz Scandiano Rosso" },
];
