/**
 * Сид-каталог для разработки калькулятора и витрины.
 * В проде заменяется данными из CMS (ТЗ §13, §17). Цены — демонстрационные.
 *
 * Фото берутся из манифеста /public/images (см. lib/images.ts). Реальные фото
 * объектов подставляются по мере поступления.
 */

import type { Product } from "./types";

// Демо-документы: тех. лист и каталог — свободно; BIM/CAD и текстуры — gated
// (профи-регистрация, ТЗ §15 / §8.4 вкладка 5).
const DEMO_DOCS = {
  tech: { name: "Технический лист (PDF)", url: "/docs/demo-tech.pdf", kind: "tech" as const },
  catalog: { name: "Каталог серии (PDF)", url: "/docs/demo-catalog.pdf", kind: "catalog" as const },
  cert: { name: "Сертификат EN/ГОСТ", url: "/docs/demo-cert.pdf", kind: "cert" as const },
  bim: { name: "BIM/CAD-модель (.dwg, .ifc)", url: "/docs/demo-bim.zip", kind: "bim" as const, gated: true },
};

export const SEED_PRODUCTS: Product[] = [
  // ── Террасный клинкер (ступени) ──────────────────────────────────────────
  {
    id: "paradyz-taurus-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: ["kryltso", "lestnitsa-ulitsa"],
    collection: "Taurus",
    sku: "TAURUS-BROWN",
    active: true,
    stock_status: "in_stock",
    price_updated_at: "2026-06-18",
    promo: {
      old_price: 2190,
      discount_percent: 14,
      label: "Акция",
      ends_at: "2026-07-15T23:59:59+03:00",
    },
    variants: [
      { id: "paradyz-taurus-brown", color: "Коричневый", color_hex: "#7A4B33", photo: "/images/cat-clinker.jpg" },
      { id: "paradyz-taurus-grey", color: "Серый", color_hex: "#8A8A86", photo: "/images/gal-stairs.jpg" },
    ],
    elements: [
      { code: "front", name: "Ступень фронтальная", size_mm: "1200x320", length_m: 1.2, unit: "pcs", weight_kg: 9.5, per_pallet: 60, price_rub: 1890 },
      { code: "corner_l", name: "Угловая левая", size_mm: "320x320", unit: "pcs", weight_kg: 3.0, per_pallet: 80, price_rub: 1290 },
      { code: "corner_r", name: "Угловая правая", size_mm: "320x320", unit: "pcs", weight_kg: 3.0, per_pallet: 80, price_rub: 1290 },
      { code: "riser", name: "Подступёнок", size_mm: "1200x150", length_m: 1.2, unit: "pcs", weight_kg: 4.0, per_pallet: 120, price_rub: 760 },
      { code: "base", name: "Базовая плитка", size_mm: "300x300", unit: "sqm", per_sqm: 11.11, weight_kg: 1.6, per_pallet: 480, price_rub: 210 },
      { code: "plinth", name: "Плинтус ступенчатый", size_mm: "300x150", length_m: 0.3, unit: "pcs", weight_kg: 1.2, per_pallet: 200, price_rub: 340 },
    ],
    specs: { surface: "structured", color: "Коричневый", color_hex: "#7A4B33", frost_resistance: "F100", water_absorption_pct: 5.0, slip_resistance: "R11" },
    photos: ["/images/cat-clinker.jpg", "/images/gal-porch.jpg", "/images/gal-stairs.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim, DEMO_DOCS.catalog],
    seo: {
      title: "Клинкерные ступени Paradyz Taurus Brown купить — цена",
      description: "Клинкерные ступени Paradyz Taurus Brown для крыльца и уличной лестницы: морозостойкость F100, R11, поэлементный расчёт.",
      h1: "Клинкерные ступени Paradyz Taurus Brown для крыльца и лестницы",
    },
  },
  {
    id: "paradyz-taurus-grey",
    brand: "Paradyz",
    product_type: "step_system",
    application: ["kryltso", "lestnitsa-ulitsa"],
    collection: "Taurus",
    sku: "TAURUS-GREY",
    active: true,
    variants: [
      { id: "paradyz-taurus-brown", color: "Коричневый", color_hex: "#7A4B33", photo: "/images/cat-clinker.jpg" },
      { id: "paradyz-taurus-grey", color: "Серый", color_hex: "#8A8A86", photo: "/images/gal-stairs.jpg" },
    ],
    elements: [
      { code: "front", name: "Ступень фронтальная", size_mm: "1200x320", length_m: 1.2, unit: "pcs", weight_kg: 9.5, per_pallet: 60, price_rub: 1890 },
      { code: "corner_l", name: "Угловая левая", size_mm: "320x320", unit: "pcs", weight_kg: 3.0, per_pallet: 80, price_rub: 1290 },
      { code: "corner_r", name: "Угловая правая", size_mm: "320x320", unit: "pcs", weight_kg: 3.0, per_pallet: 80, price_rub: 1290 },
      { code: "riser", name: "Подступёнок", size_mm: "1200x150", length_m: 1.2, unit: "pcs", weight_kg: 4.0, per_pallet: 120, price_rub: 760 },
      { code: "base", name: "Базовая плитка", size_mm: "300x300", unit: "sqm", per_sqm: 11.11, weight_kg: 1.6, per_pallet: 480, price_rub: 210 },
      { code: "plinth", name: "Плинтус ступенчатый", size_mm: "300x150", length_m: 0.3, unit: "pcs", weight_kg: 1.2, per_pallet: 200, price_rub: 340 },
    ],
    specs: { surface: "structured", color: "Серый", color_hex: "#8A8A86", frost_resistance: "F100", water_absorption_pct: 5.0, slip_resistance: "R11" },
    photos: ["/images/gal-stairs.jpg", "/images/cat-clinker.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim],
    seo: {
      title: "Клинкерные ступени Paradyz Taurus Grey купить — цена",
      description: "Серые клинкерные ступени Paradyz Taurus для крыльца и лестницы: F100, R11, поэлементный расчёт комплекта.",
      h1: "Клинкерные ступени Paradyz Taurus Grey",
    },
  },
  {
    id: "exagres-base-grey",
    brand: "Exagres",
    product_type: "step_system",
    application: ["kryltso", "lestnitsa-ulitsa", "bassein"],
    collection: "Base",
    sku: "BASE-GREY",
    active: true,
    stock_status: "on_order",
    lead_time_weeks: 8,
    price_updated_at: "2026-06-18",
    elements: [
      { code: "front", name: "Ступень фронтальная", size_mm: "1190x330", length_m: 1.19, unit: "pcs", weight_kg: 9.8, per_pallet: 56, price_rub: 2150 },
      { code: "corner_l", name: "Угловая левая", size_mm: "330x330", unit: "pcs", weight_kg: 3.2, per_pallet: 72, price_rub: 1490 },
      { code: "corner_r", name: "Угловая правая", size_mm: "330x330", unit: "pcs", weight_kg: 3.2, per_pallet: 72, price_rub: 1490 },
      { code: "riser", name: "Подступёнок", size_mm: "1190x150", length_m: 1.19, unit: "pcs", weight_kg: 4.1, per_pallet: 110, price_rub: 820 },
      { code: "base", name: "Базовая плитка", size_mm: "300x600", unit: "sqm", per_sqm: 5.56, weight_kg: 3.4, per_pallet: 240, price_rub: 480 },
    ],
    specs: { surface: "matte", color: "Серый", color_hex: "#8A8A86", frost_resistance: "F150", water_absorption_pct: 3.0, slip_resistance: "R11" },
    photos: ["/images/gal-stairs.jpg", "/images/gal-pool.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim],
    seo: {
      title: "Клинкерные ступени Exagres Base Grey купить — цена",
      description: "Ступени Exagres Base Grey для уличной лестницы и зоны бассейна: F150, R11, поэлементный расчёт комплекта.",
      h1: "Клинкерные ступени Exagres Base Grey",
    },
  },
  {
    id: "markastroy-standart-red",
    brand: "Маркастрой",
    product_type: "step_system",
    application: ["kryltso", "lestnitsa-ulitsa", "dorozhki"],
    collection: "Стандарт",
    sku: "STD-RED",
    active: true,
    stock_status: "in_stock",
    price_updated_at: "2026-06-18",
    promo: { old_price: 1490, discount_percent: 13, label: "Хит" },
    elements: [
      { code: "front", name: "Ступень фронтальная", size_mm: "1200x300", length_m: 1.2, unit: "pcs", weight_kg: 8.8, per_pallet: 64, price_rub: 1290 },
      { code: "corner_l", name: "Угловая левая", size_mm: "300x300", unit: "pcs", weight_kg: 2.7, per_pallet: 90, price_rub: 890 },
      { code: "corner_r", name: "Угловая правая", size_mm: "300x300", unit: "pcs", weight_kg: 2.7, per_pallet: 90, price_rub: 890 },
      { code: "riser", name: "Подступёнок", size_mm: "1200x150", length_m: 1.2, unit: "pcs", weight_kg: 3.6, per_pallet: 130, price_rub: 540 },
      { code: "base", name: "Базовая плитка", size_mm: "300x300", unit: "sqm", per_sqm: 11.11, weight_kg: 1.5, per_pallet: 500, price_rub: 160 },
    ],
    specs: { surface: "structured", color: "Красный", color_hex: "#9B3D2A", frost_resistance: "F100", water_absorption_pct: 6.0, slip_resistance: "R10" },
    photos: ["/images/gal-porch.jpg", "/images/cat-clinker.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert],
    seo: {
      title: "Клинкерные ступени Маркастрой Стандарт красные — цена",
      description: "Российские клинкерные ступени Маркастрой для крыльца и лестницы: наличие, короткие сроки, F100, R10.",
      h1: "Клинкерные ступени Маркастрой Стандарт",
    },
  },
  {
    id: "westerwalder-stahl-anthracite",
    brand: "Westerwälder Klinker",
    product_type: "step_system",
    application: ["kryltso", "lestnitsa-ulitsa", "terrasa"],
    collection: "Stahl",
    sku: "STAHL-ANTH",
    active: true,
    elements: [
      { code: "front", name: "Ступень фронтальная", size_mm: "1240x340", length_m: 1.24, unit: "pcs", weight_kg: 10.4, per_pallet: 52, price_rub: 2780 },
      { code: "corner_l", name: "Угловая левая", size_mm: "340x340", unit: "pcs", weight_kg: 3.5, per_pallet: 64, price_rub: 1890 },
      { code: "corner_r", name: "Угловая правая", size_mm: "340x340", unit: "pcs", weight_kg: 3.5, per_pallet: 64, price_rub: 1890 },
      { code: "riser", name: "Подступёнок", size_mm: "1240x150", length_m: 1.24, unit: "pcs", weight_kg: 4.3, per_pallet: 100, price_rub: 980 },
      { code: "plinth", name: "Плинтус ступенчатый", size_mm: "340x150", length_m: 0.34, unit: "pcs", weight_kg: 1.4, per_pallet: 180, price_rub: 420 },
    ],
    specs: { surface: "structured", color: "Антрацит", color_hex: "#3A3C3B", frost_resistance: "F150", water_absorption_pct: 2.0, slip_resistance: "R12" },
    photos: ["/images/cat-clinker.jpg", "/images/gal-stairs.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim, DEMO_DOCS.catalog],
    seo: {
      title: "Клинкерные ступени Westerwälder Stahl антрацит — цена",
      description: "Немецкие клинкерные ступени Westerwälder Klinker Stahl: F150, R12, для крыльца, лестницы и террасы.",
      h1: "Клинкерные ступени Westerwälder Klinker Stahl Антрацит",
    },
  },
  {
    id: "stroeher-keraplatte-roccia",
    brand: "Stroeher",
    product_type: "step_system",
    application: ["kryltso", "lestnitsa-ulitsa"],
    collection: "Keraplatte Roccia",
    sku: "ROCCIA-841",
    active: true,
    elements: [
      { code: "front", name: "Ступень фронтальная Keraplatte", size_mm: "1180x340", length_m: 1.18, unit: "pcs", weight_kg: 10.1, per_pallet: 54, price_rub: 3150 },
      { code: "corner_l", name: "Угловая левая", size_mm: "340x340", unit: "pcs", weight_kg: 3.4, per_pallet: 66, price_rub: 2090 },
      { code: "corner_r", name: "Угловая правая", size_mm: "340x340", unit: "pcs", weight_kg: 3.4, per_pallet: 66, price_rub: 2090 },
      { code: "riser", name: "Подступёнок", size_mm: "1180x150", length_m: 1.18, unit: "pcs", weight_kg: 4.2, per_pallet: 104, price_rub: 1090 },
      { code: "base", name: "Базовая плитка", size_mm: "300x300", unit: "sqm", per_sqm: 11.11, weight_kg: 1.8, per_pallet: 460, price_rub: 290 },
    ],
    specs: { surface: "structured", color: "Бежево-серый", color_hex: "#B6A790", frost_resistance: "F150", water_absorption_pct: 1.5, slip_resistance: "R11" },
    photos: ["/images/gal-porch.jpg", "/images/cat-clinker.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim, DEMO_DOCS.catalog],
    seo: {
      title: "Клинкерные ступени Stroeher Keraplatte Roccia — цена",
      description: "Премиальные немецкие клинкерные ступени Stroeher Keraplatte Roccia: F150, R11, точная геометрия, прокрас в массе.",
      h1: "Клинкерные ступени Stroeher Keraplatte Roccia",
    },
  },

  // ── Террасные пластины (керамогранит 20 мм) ────────────────────────────────
  {
    id: "stroeher-aera-beige",
    brand: "Stroeher",
    product_type: "slab",
    application: ["terrasa", "dorozhki", "landshaft-opory"],
    collection: "Aera",
    sku: "AERA-BEIGE",
    active: true,
    stock_status: "on_order",
    lead_time_weeks: 6,
    price_updated_at: "2026-06-18",
    formats: [
      { code: "600x600", size_mm: "600x600", thickness_mm: 20, weight_kg: 16, per_sqm: 2.78, per_pallet: 40, price_rub_sqm: 4200, price_rub_pcs: 1512 },
      { code: "800x800", size_mm: "800x800", thickness_mm: 20, weight_kg: 28, per_sqm: 1.56, per_pallet: 30, price_rub_sqm: 4600, price_rub_pcs: 2950 },
    ],
    specs: { surface: "structured", color: "Бежевый", color_hex: "#C9B79C", frost_resistance: "F150", water_absorption_pct: 0.5, slip_resistance: "R11" },
    photos: ["/images/cat-slab.jpg", "/images/gal-terrace.jpg", "/images/gal-path.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim, DEMO_DOCS.catalog],
    seo: {
      title: "Керамогранит Stroeher Aera Beige 20 мм для террасы — цена",
      description: "Крупноформатный керамогранит Stroeher Aera Beige 20 мм для террас и дорожек, укладка на клей или регулируемые опоры.",
      h1: "Террасные пластины Stroeher Aera Beige 20 мм",
    },
  },
  {
    id: "exagres-quarz-grafito",
    brand: "Exagres",
    product_type: "slab",
    application: ["terrasa", "dorozhki", "landshaft-opory", "bassein"],
    collection: "Quarz",
    sku: "QUARZ-GRAFITO",
    active: true,
    promo: { old_price: 4900, discount_percent: 12, label: "−12 %", ends_at: "2026-07-05T23:59:59+03:00" },
    formats: [
      { code: "600x600", size_mm: "600x600", thickness_mm: 20, weight_kg: 16, per_sqm: 2.78, per_pallet: 40, price_rub_sqm: 4320, price_rub_pcs: 1555 },
      { code: "600x1200", size_mm: "600x1200", thickness_mm: 20, weight_kg: 32, per_sqm: 1.39, per_pallet: 40, price_rub_sqm: 4800, price_rub_pcs: 3456 },
    ],
    specs: { surface: "matte", color: "Графит", color_hex: "#4A4D4E", frost_resistance: "F150", water_absorption_pct: 0.3, slip_resistance: "R11" },
    photos: ["/images/gal-terrace.jpg", "/images/cat-slab.jpg", "/images/gal-pool.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim],
    seo: {
      title: "Керамогранит Exagres Quarz Grafito 20 мм для террасы — цена",
      description: "Тёмный крупноформат Exagres Quarz Grafito 20 мм для террас, дорожек и зоны бассейна: F150, R11, на клей или опоры.",
      h1: "Террасные пластины Exagres Quarz Grafito 20 мм",
    },
  },
  {
    id: "interbau-stone-grey",
    brand: "Interbau",
    product_type: "slab",
    application: ["terrasa", "dorozhki", "landshaft-opory"],
    collection: "Stone",
    sku: "STONE-GREY",
    active: true,
    formats: [
      { code: "600x600", size_mm: "600x600", thickness_mm: 20, weight_kg: 16, per_sqm: 2.78, per_pallet: 40, price_rub_sqm: 4050, price_rub_pcs: 1458 },
      { code: "400x800", size_mm: "400x800", thickness_mm: 20, weight_kg: 14, per_sqm: 3.12, per_pallet: 48, price_rub_sqm: 4150, price_rub_pcs: 1330 },
    ],
    specs: { surface: "structured", color: "Серый камень", color_hex: "#9A9690", frost_resistance: "F150", water_absorption_pct: 0.5, slip_resistance: "R11" },
    photos: ["/images/gal-path.jpg", "/images/cat-slab.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert],
    seo: {
      title: "Керамогранит Interbau Stone Grey 20 мм для террасы — цена",
      description: "Керамогранит Interbau Stone Grey 20 мм под камень для террас и дорожек: морозостойкость F150, укладка на опоры.",
      h1: "Террасные пластины Interbau Stone Grey 20 мм",
    },
  },

  // ── Террасные пластины под дерево ──────────────────────────────────────────
  {
    id: "interbau-wood-oak",
    brand: "Interbau",
    product_type: "slab",
    application: ["terrasa", "dorozhki"],
    collection: "Wood",
    sku: "WOOD-OAK",
    active: true,
    stock_status: "on_order",
    lead_time_weeks: 8,
    price_updated_at: "2026-06-18",
    variants: [
      { id: "interbau-wood-oak", color: "Дуб", color_hex: "#B58A5C", photo: "/images/cat-wood.jpg" },
      { id: "paradyz-wood-teak", color: "Тик", color_hex: "#8A5A33", photo: "/images/gal-decking.jpg" },
    ],
    formats: [
      { code: "600x1200", size_mm: "600x1200", thickness_mm: 20, weight_kg: 32, per_sqm: 1.39, per_pallet: 40, price_rub_sqm: 5100, price_rub_pcs: 3672 },
    ],
    specs: { surface: "wood", color: "Дуб", color_hex: "#B58A5C", frost_resistance: "F150", water_absorption_pct: 0.5, slip_resistance: "R11" },
    photos: ["/images/cat-wood.jpg", "/images/gal-decking.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim],
    seo: {
      title: "Керамогранит под дерево Interbau Wood Oak 20 мм — цена",
      description: "Террасные пластины под дерево Interbau Wood Oak 600×1200, 20 мм: декинг-эффект, морозостойкость F150.",
      h1: "Террасные пластины под дерево Interbau Wood Oak",
    },
  },
  {
    id: "paradyz-wood-teak",
    brand: "Paradyz",
    product_type: "slab",
    application: ["terrasa", "dorozhki", "landshaft-opory"],
    collection: "Wood",
    sku: "WOOD-TEAK",
    active: true,
    variants: [
      { id: "interbau-wood-oak", color: "Дуб", color_hex: "#B58A5C", photo: "/images/cat-wood.jpg" },
      { id: "paradyz-wood-teak", color: "Тик", color_hex: "#8A5A33", photo: "/images/gal-decking.jpg" },
    ],
    formats: [
      { code: "300x1200", size_mm: "300x1200", thickness_mm: 20, weight_kg: 17, per_sqm: 2.78, per_pallet: 48, price_rub_sqm: 4800, price_rub_pcs: 1728 },
      { code: "600x1200", size_mm: "600x1200", thickness_mm: 20, weight_kg: 32, per_sqm: 1.39, per_pallet: 40, price_rub_sqm: 4950, price_rub_pcs: 3564 },
    ],
    specs: { surface: "wood", color: "Тик", color_hex: "#8A5A33", frost_resistance: "F150", water_absorption_pct: 0.5, slip_resistance: "R11" },
    photos: ["/images/gal-decking.jpg", "/images/cat-wood.jpg"],
    documents: [DEMO_DOCS.tech, DEMO_DOCS.cert, DEMO_DOCS.bim],
    seo: {
      title: "Керамогранит под дерево Paradyz Wood Teak 20 мм — цена",
      description: "Террасные пластины под дерево Paradyz Wood Teak 20 мм: декинг-эффект, форматы 300×1200 и 600×1200, F150.",
      h1: "Террасные пластины под дерево Paradyz Wood Teak",
    },
  },
];

export function getStepProducts(): Product[] {
  return SEED_PRODUCTS.filter((p) => p.product_type === "step_system" && p.active);
}

export function getSlabProducts(): Product[] {
  return SEED_PRODUCTS.filter((p) => p.product_type === "slab" && p.active);
}
