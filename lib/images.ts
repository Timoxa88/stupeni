/**
 * Манифест изображений сайта. Файлы лежат в /public/images (скачаны из
 * свободных стоков Unsplash/Pexels, URL проверены). next/image отдаёт их в
 * WebP/AVIF с lazy-load (ТЗ §14/§15). Источник заменяется на реальные фото
 * объектов по мере поступления (ТЗ §5).
 */

export interface SiteImage {
  src: string;
  alt: string;
}

export const IMAGES = {
  hero: {
    src: "/images/hero.jpg",
    alt: "Кирпичное крыльцо со ступенями у входа в дом при дневном свете",
  },
  catClinker: {
    src: "/images/cat-clinker.jpg",
    alt: "Крупный план клинкерных ступеней уличной лестницы — кромки и носики ступеней",
  },
  catSlab: {
    src: "/images/cat-slab.jpg",
    alt: "Современная терраса из крупноформатного керамогранита с мягкой мебелью",
  },
  catWood: {
    src: "/images/cat-wood.jpg",
    alt: "Терраса с покрытием под дерево (декинг-эффект) у фасада дома",
  },
} satisfies Record<string, SiteImage>;

/** Галерея «Примеры работ» (ТЗ §6, блок 14). */
export const GALLERY: SiteImage[] = [
  { src: "/images/gal-porch.jpg", alt: "Крыльцо дома со светлыми ступенями и перилами, ведущими ко входу" },
  { src: "/images/gal-stairs.jpg", alt: "Каменная уличная лестница через ухоженный парк" },
  { src: "/images/gal-terrace.jpg", alt: "Лаунж-зона на открытой террасе с видом на город в вечернем свете" },
  { src: "/images/gal-path.jpg", alt: "Квадратные плиты дорожкой через гальку в современном саду" },
  { src: "/images/gal-pool.jpg", alt: "Край бассейна с тёплой терракотовой клинкерной плиткой-бортиком" },
  { src: "/images/gal-decking.jpg", alt: "Терраса с настилом под дерево и уличной лаунж-мебелью в сумерках" },
];
