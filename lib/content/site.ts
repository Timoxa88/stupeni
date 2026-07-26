/** Контент компании: контакты, склады, шоу-румы, счётчики, преимущества, загрузки. */

export const SITE = {
  name: "Hit Ceramics",
  legal: "ООО «ЗЕ ВАН»",
  inn: "7806568970",
  ogrn: "1207800001639",
  // Реальные контакты (ТЗ A.2 E6).
  phone: "+74993977727",
  phoneLabel: "+7 499 397-77-27",
  email: "sales@hit-ceramics.ru",
  // Абсолютный URL площадки (с подпутём, если деплой на подпуть). На проде с
  // собственным доменом — просто https://домен. Задаётся через NEXT_PUBLIC_SITE_URL.
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hit-ceramics.example",
};

/** Превью-деплой (на домене агентства) — не индексируем (NEXT_PUBLIC_PREVIEW=1). */
export const IS_PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

/** Телефоны по городам (ТЗ A.2 E6). */
export const CITY_CONTACTS = [
  { city: "Москва", phone: "+74993977727", phoneLabel: "+7 499 397-77-27" },
  { city: "Санкт-Петербург", phone: "+78129010444", phoneLabel: "+7 812 901-04-44" },
] as const;

export interface Place {
  city: string;
  kind: "showroom" | "warehouse";
  address: string;
  metro?: string;
  hours: string;
  /** Координаты для карты [широта, долгота]. */
  coords: [number, number];
}

export const PLACES: Place[] = [
  {
    city: "Санкт-Петербург",
    kind: "showroom",
    address: "м. Новочеркасская",
    metro: "Новочеркасская",
    hours: "пн–пт 9:00–19:00",
    coords: [59.929, 30.41],
  },
  {
    city: "Москва",
    kind: "showroom",
    address: "м. Калужская",
    metro: "Калужская",
    hours: "пн–пт 9:00–19:00",
    coords: [55.655, 37.54],
  },
  {
    city: "Москва",
    kind: "warehouse",
    address: "Подольск, Домодедовское ш., 1В",
    hours: "пн–пт 9:00–19:00",
    coords: [55.41, 37.55],
  },
  {
    city: "Санкт-Петербург",
    kind: "warehouse",
    address: "Тосненский р-н, Фёдоровское",
    hours: "пн–пт 9:00–19:00",
    coords: [59.69, 30.61],
  },
];

/** Живые счётчики (ТЗ §6 блок 4). Значения — TBD из CMS. */
export const COUNTERS: { value: string; label: string }[] = [
  { value: "11+", label: "лет на рынке" },
  { value: "350", label: "объектов реализовано" },
  { value: "6", label: "брендов-партнёров" },
  { value: "85", label: "регионов доставки" },
];

/** Преимущества (ТЗ §6 блок 5). */
export const ADVANTAGES: { title: string; text: string }[] = [
  { title: "Прямые контракты с заводами", text: "Paradyz, Exagres, Stroeher, Interbau и др. — без посредников и переплат." },
  { title: "Импорт на складе в РФ", text: "Москва и СПб — самовывоз и быстрая отгрузка популярных позиций." },
  { title: "Морозостойкость и R-классы", text: "Материалы для улицы: F100–F150, противоскольжение R10–R12." },
  { title: "Быстрый поэлементный расчёт", text: "Калькулятор считает ступени и плитку в штуках, опоры и материалы." },
  { title: "Доставка по России и СНГ", text: "85 регионов, индивидуальный расчёт логистики под объём." },
  { title: "Документы и гарантия", text: "Сертификаты EN/ГОСТ и тех. листы на каждый артикул." },
];

/** Образовательный блок «Виды и характеристики» (ТЗ §6 блок 11). */
export const EDUCATION: { title: string; text: string }[] = [
  { title: "Клинкер для улицы", text: "Высокотемпературный обжиг, морозостойкость F100+, водопоглощение < 6%, рельеф против скольжения." },
  { title: "Керамогранит 20 мм", text: "Толстый формат для улицы и опор, высокая нагрузка, морозостойкость F150." },
  { title: "Противоскольжение (R-классы)", text: "R10 — вход под навесом, R11 — терраса и лестница, R12 — открытая улица и пандусы." },
  { title: "Системы укладки", text: "На клей по стяжке, на регулируемые опоры (пьедесталы) или на гравийно-песчаное основание." },
];

// ── Хаб загрузок для архитекторов (ТЗ §6 блок 15) ─────────────────────────────

export interface DownloadItem {
  title: string;
  format: string;
  url: string;
  /** Требует профи-регистрации (BIM/CAD, текстуры). */
  gated: boolean;
}

export const DOWNLOADS: { group: string; gated: boolean; items: DownloadItem[] }[] = [
  {
    group: "Технические листы",
    gated: false,
    items: [
      { title: "Тех. листы серий ступеней", format: "PDF", url: "/docs/demo-tech.pdf", gated: false },
      { title: "Тех. листы керамогранита 20 мм", format: "PDF", url: "/docs/demo-tech.pdf", gated: false },
    ],
  },
  {
    group: "Каталоги и прайс-листы",
    gated: false,
    items: [
      { title: "PDF-каталог коллекций", format: "PDF", url: "/docs/demo-catalog.pdf", gated: false },
      { title: "Прайс-лист (актуальный)", format: "PDF", url: "/docs/demo-catalog.pdf", gated: false },
    ],
  },
  {
    group: "BIM / CAD-модели",
    gated: true,
    items: [
      { title: "Узлы крыльца и лестницы", format: ".dwg · .dxf", url: "/docs/demo-bim.zip", gated: true },
      { title: "Раскладки на опорах HILST", format: ".dwg · .ifc", url: "/docs/demo-bim.zip", gated: true },
      { title: "Семейства Revit систем ступеней", format: ".rfa", url: "/docs/demo-bim.zip", gated: true },
    ],
  },
  {
    group: "Текстуры для рендеров",
    gated: true,
    items: [
      { title: "Текстуры коллекций (high-res)", format: "JPG", url: "/docs/demo-textures.zip", gated: true },
    ],
  },
];
