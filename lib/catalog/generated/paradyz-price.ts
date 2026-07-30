/**
 * Paradyz — с сайта заказчика hit-ceramics.ru (съём 29.07.2026), цены РОЗНИЧНЫЕ.
 *
 * Система ступеней выложена ПОЭЛЕМЕНТНО: ступень с капиносом и ступень с
 * насечками — разные артикулы, напольная плитка и насечная ступень идут в двух
 * форматах (300×300 и 600×300). У каждого элемента свой артикул, цена, вес,
 * шт/поддон и СВОЁ фото — карточка показывает кадр выбранного элемента.
 *
 * Морозостойкость, водопоглощение и R-класс — из карточек Славдома (прежняя
 * выгрузка); террасные плиты 20 мм — оттуда же без изменений (цены сверены).
 *
 * Сгенерировано scripts/gen_paradyz.py, вручную не править.
 *
 * Ступеней: 45 (элементов 188). Плит: 63.
 */

import type { Product } from "../types";

export const PARADYZ_PRICE_PRODUCTS: Product[] = [
  {
    id: "paradyz-ardis-dark",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Ardis Dark",
    sku: "18337",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18337",
        length_m: 0.6,
        photo: "/images/products/paradyz-ardis-dark/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18273",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-ardis-dark/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Тёмный",
      color_hex: "#5A4636",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-ardis-dark/el-front_notch-600x300.webp",
      "/images/products/paradyz-ardis-dark/el-base-600x300.webp",
      "/images/products/paradyz-ardis-dark/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Ardis Dark — цена, характеристики",
      description: "Клинкерные ступени Paradyz Ardis Dark: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Ardis Dark"
    },
    variants: [
      {
        id: "paradyz-ardis-dark",
        color: "Тёмный",
        color_hex: "#5A4636",
        photo: "/images/products/paradyz-ardis-dark/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-ardis-light",
        color: "Светлый",
        color_hex: "#D6C6AC",
        photo: "/images/products/paradyz-ardis-light/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-ardis-rust",
        color: "Ржавый",
        color_hex: "#A8502F",
        photo: "/images/products/paradyz-ardis-rust/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-ardis-light",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Ardis Light",
    sku: "18626",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18626",
        length_m: 0.6,
        photo: "/images/products/paradyz-ardis-light/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18572",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-ardis-light/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Светлый",
      color_hex: "#D6C6AC",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-ardis-light/el-front_notch-600x300.webp",
      "/images/products/paradyz-ardis-light/el-base-600x300.webp",
      "/images/products/paradyz-ardis-light/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Ardis Light — цена, характеристики",
      description: "Клинкерные ступени Paradyz Ardis Light: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Ardis Light"
    },
    variants: [
      {
        id: "paradyz-ardis-dark",
        color: "Тёмный",
        color_hex: "#5A4636",
        photo: "/images/products/paradyz-ardis-dark/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-ardis-light",
        color: "Светлый",
        color_hex: "#D6C6AC",
        photo: "/images/products/paradyz-ardis-light/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-ardis-rust",
        color: "Ржавый",
        color_hex: "#A8502F",
        photo: "/images/products/paradyz-ardis-rust/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-ardis-rust",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Ardis Rust",
    sku: "18627",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18627",
        length_m: 0.6,
        photo: "/images/products/paradyz-ardis-rust/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18573",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-ardis-rust/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Ржавый",
      color_hex: "#A8502F",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-ardis-rust/el-front_notch-600x300.webp",
      "/images/products/paradyz-ardis-rust/el-base-600x300.webp",
      "/images/products/paradyz-ardis-rust/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Ardis Rust — цена, характеристики",
      description: "Клинкерные ступени Paradyz Ardis Rust: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Ardis Rust"
    },
    variants: [
      {
        id: "paradyz-ardis-dark",
        color: "Тёмный",
        color_hex: "#5A4636",
        photo: "/images/products/paradyz-ardis-dark/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-ardis-light",
        color: "Светлый",
        color_hex: "#D6C6AC",
        photo: "/images/products/paradyz-ardis-light/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-ardis-rust",
        color: "Ржавый",
        color_hex: "#A8502F",
        photo: "/images/products/paradyz-ardis-rust/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-arteon-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Arteon Brown",
    sku: "18640",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18640",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-brown/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18639",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-brown/el-front_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18585",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-arteon-brown/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-arteon-brown/el-front-300x330.webp",
      "/images/products/paradyz-arteon-brown/el-front_notch-300x300.webp",
      "/images/products/paradyz-arteon-brown/el-base-300x300.webp",
      "/images/products/paradyz-arteon-brown/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Arteon Brown — цена, характеристики",
      description: "Клинкерные ступени Paradyz Arteon Brown: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Arteon Brown"
    },
    variants: [
      {
        id: "paradyz-arteon-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-arteon-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-arteon-grys/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-arteon-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-rosso/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-taupe/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-arteon-grys",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Arteon Grys",
    sku: "18643",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18643",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-grys/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18636",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-grys/el-front_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18581",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-arteon-grys/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-arteon-grys/el-front-300x330.webp",
      "/images/products/paradyz-arteon-grys/el-front_notch-300x300.webp",
      "/images/products/paradyz-arteon-grys/el-base-300x300.webp",
      "/images/products/paradyz-arteon-grys/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Arteon Grys — цена, характеристики",
      description: "Клинкерные ступени Paradyz Arteon Grys: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Arteon Grys"
    },
    variants: [
      {
        id: "paradyz-arteon-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-arteon-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-arteon-grys/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-arteon-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-rosso/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-taupe/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-arteon-ochra",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Arteon Ochra",
    sku: "18641",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18641",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-ochra/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18638",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-ochra/el-front_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18584",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-arteon-ochra/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Охра",
      color_hex: "#C7A45C",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-arteon-ochra/el-front-300x330.webp",
      "/images/products/paradyz-arteon-ochra/el-front_notch-300x300.webp",
      "/images/products/paradyz-arteon-ochra/el-base-300x300.webp"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Arteon Ochra — цена, характеристики",
      description: "Клинкерные ступени Paradyz Arteon Ochra: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Arteon Ochra"
    },
    variants: [
      {
        id: "paradyz-arteon-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-arteon-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-arteon-grys/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-arteon-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-rosso/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-taupe/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-arteon-rosso",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Arteon Rosso",
    sku: "18644",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18644",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-rosso/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18635",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-rosso/el-front_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18582",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-arteon-rosso/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Красный",
      color_hex: "#9A8F80",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-arteon-rosso/el-front-300x330.webp",
      "/images/products/paradyz-arteon-rosso/el-front_notch-300x300.webp",
      "/images/products/paradyz-arteon-rosso/el-base-300x300.webp",
      "/images/products/paradyz-arteon-rosso/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Arteon Rosso — цена, характеристики",
      description: "Клинкерные ступени Paradyz Arteon Rosso: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Arteon Rosso"
    },
    variants: [
      {
        id: "paradyz-arteon-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-arteon-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-arteon-grys/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-arteon-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-rosso/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-taupe/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-arteon-taupe",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Arteon Taupe",
    sku: "18642",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18642",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-taupe/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18637",
        length_m: 0.3,
        photo: "/images/products/paradyz-arteon-taupe/el-front_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18583",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-arteon-taupe/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Тёмно-серый",
      color_hex: "#9A8F80",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-arteon-taupe/el-front-300x330.webp",
      "/images/products/paradyz-arteon-taupe/el-front_notch-300x300.webp",
      "/images/products/paradyz-arteon-taupe/el-base-300x300.webp"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Arteon Taupe — цена, характеристики",
      description: "Клинкерные ступени Paradyz Arteon Taupe: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Arteon Taupe"
    },
    variants: [
      {
        id: "paradyz-arteon-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-arteon-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-arteon-grys/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-arteon-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-rosso/el-front-300x330.webp"
      },
      {
        id: "paradyz-arteon-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-arteon-taupe/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-carrizo-bazalt",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Carrizo Bazalt",
    sku: "18628",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18628",
        length_m: 0.6,
        photo: "/images/products/paradyz-carrizo-bazalt/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18574",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-carrizo-bazalt/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Базальт",
      color_hex: "#4A4D4E",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-carrizo-bazalt/el-front_notch-600x300.webp",
      "/images/products/paradyz-carrizo-bazalt/el-base-600x300.webp",
      "/images/products/paradyz-carrizo-bazalt/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Carrizo Bazalt — цена, характеристики",
      description: "Клинкерные ступени Paradyz Carrizo Bazalt: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Carrizo Bazalt"
    },
    variants: [
      {
        id: "paradyz-carrizo-bazalt",
        color: "Базальт",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-carrizo-bazalt/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-carrizo-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-carrizo-grey/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-carrizo-wood",
        color: "Под дерево",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-carrizo-wood/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-carrizo-grey",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Carrizo Grey",
    sku: "18629",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18629",
        length_m: 0.6,
        photo: "/images/products/paradyz-carrizo-grey/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18575",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-carrizo-grey/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-carrizo-grey/el-front_notch-600x300.webp",
      "/images/products/paradyz-carrizo-grey/el-base-600x300.webp",
      "/images/products/paradyz-carrizo-grey/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Carrizo Grey — цена, характеристики",
      description: "Клинкерные ступени Paradyz Carrizo Grey: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Carrizo Grey"
    },
    variants: [
      {
        id: "paradyz-carrizo-bazalt",
        color: "Базальт",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-carrizo-bazalt/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-carrizo-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-carrizo-grey/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-carrizo-wood",
        color: "Под дерево",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-carrizo-wood/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-carrizo-wood",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Carrizo Wood",
    sku: "18630",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18630",
        length_m: 0.6,
        photo: "/images/products/paradyz-carrizo-wood/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18576",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-carrizo-wood/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Под дерево",
      color_hex: "#9A8F80",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-carrizo-wood/el-front_notch-600x300.webp",
      "/images/products/paradyz-carrizo-wood/el-base-600x300.webp",
      "/images/products/paradyz-carrizo-wood/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Carrizo Wood — цена, характеристики",
      description: "Клинкерные ступени Paradyz Carrizo Wood: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Carrizo Wood"
    },
    variants: [
      {
        id: "paradyz-carrizo-bazalt",
        color: "Базальт",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-carrizo-bazalt/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-carrizo-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-carrizo-grey/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-carrizo-wood",
        color: "Под дерево",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-carrizo-wood/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-cloud-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Cloud Brown",
    sku: "18664",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18664",
        length_m: 0.3,
        photo: "/images/products/paradyz-cloud-brown/el-front_notch-300x300.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18665",
        photo: "/images/products/paradyz-cloud-brown/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18586",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-cloud-brown/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-cloud-brown/el-front_notch-300x300.webp",
      "/images/products/paradyz-cloud-brown/el-corner_notch-300x300.webp",
      "/images/products/paradyz-cloud-brown/el-base-300x300.webp",
      "/images/products/paradyz-cloud-brown/photo_0_own.jpg",
      "/images/products/paradyz-cloud-brown/photo_1.png",
      "/images/products/paradyz-cloud-brown/photo_1_b24.jpg",
      "/images/objects/catalog/cloud-brown-1.jpg",
      "/images/objects/catalog/cloud-brown-2.jpg",
      "/images/objects/catalog/cloud-brown-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Cloud Brown — цена, характеристики",
      description: "Клинкерные ступени Paradyz Cloud Brown: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Cloud Brown"
    },
    variants: [
      {
        id: "paradyz-cloud-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-cloud-brown/el-front_notch-300x300.webp"
      },
      {
        id: "paradyz-cloud-rosa",
        color: "Розовый",
        color_hex: "#C98B7A",
        photo: "/images/products/paradyz-cloud-rosa/el-front_notch-300x300.webp"
      }
    ]
  },
  {
    id: "paradyz-cloud-brown-duro",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Cloud Brown Duro",
    sku: "18668",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18668",
        length_m: 0.3,
        photo: "/images/products/paradyz-cloud-brown-duro/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18666",
        length_m: 0.3,
        photo: "/images/products/paradyz-cloud-brown-duro/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18669",
        photo: "/images/products/paradyz-cloud-brown-duro/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18667",
        photo: "/images/products/paradyz-cloud-brown-duro/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18587",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-cloud-brown-duro/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-cloud-brown-duro/el-front-300x330.webp",
      "/images/products/paradyz-cloud-brown-duro/el-front_notch-300x300.webp",
      "/images/products/paradyz-cloud-brown-duro/el-corner_l-330x330.webp",
      "/images/products/paradyz-cloud-brown-duro/el-corner_notch-300x300.webp",
      "/images/products/paradyz-cloud-brown-duro/el-base-300x300.webp",
      "/images/products/paradyz-cloud-brown-duro/photo_1.png",
      "/images/objects/catalog/cloud-brown-1.jpg",
      "/images/objects/catalog/cloud-brown-2.jpg",
      "/images/objects/catalog/cloud-brown-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Cloud Brown Duro — цена, характеристики",
      description: "Клинкерные ступени Paradyz Cloud Brown Duro: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Cloud Brown Duro"
    }
  },
  {
    id: "paradyz-cloud-rosa",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Cloud Rosa",
    sku: "18672",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18672",
        length_m: 0.3,
        photo: "/images/products/paradyz-cloud-rosa/el-front_notch-300x300.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18670",
        photo: "/images/products/paradyz-cloud-rosa/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18588",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-cloud-rosa/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Розовый",
      color_hex: "#C98B7A",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-cloud-rosa/el-front_notch-300x300.webp",
      "/images/products/paradyz-cloud-rosa/el-corner_notch-300x300.webp",
      "/images/products/paradyz-cloud-rosa/el-base-300x300.webp",
      "/images/products/paradyz-cloud-rosa/photo_0_own.jpg",
      "/images/products/paradyz-cloud-rosa/photo_1.png"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Cloud Rosa — цена, характеристики",
      description: "Клинкерные ступени Paradyz Cloud Rosa: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Cloud Rosa"
    },
    variants: [
      {
        id: "paradyz-cloud-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-cloud-brown/el-front_notch-300x300.webp"
      },
      {
        id: "paradyz-cloud-rosa",
        color: "Розовый",
        color_hex: "#C98B7A",
        photo: "/images/products/paradyz-cloud-rosa/el-front_notch-300x300.webp"
      }
    ]
  },
  {
    id: "paradyz-cloud-rosa-duro",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Cloud Rosa Duro",
    sku: "18674",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18674",
        length_m: 0.3,
        photo: "/images/products/paradyz-cloud-rosa-duro/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18673",
        length_m: 0.3,
        photo: "/images/products/paradyz-cloud-rosa-duro/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18675",
        photo: "/images/products/paradyz-cloud-rosa-duro/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18671",
        photo: "/images/products/paradyz-cloud-rosa-duro/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18589",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-cloud-rosa-duro/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Розовый",
      color_hex: "#C98B7A",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-cloud-rosa-duro/el-front-300x330.webp",
      "/images/products/paradyz-cloud-rosa-duro/el-front_notch-300x300.webp",
      "/images/products/paradyz-cloud-rosa-duro/el-corner_l-330x330.webp",
      "/images/products/paradyz-cloud-rosa-duro/el-corner_notch-300x300.webp",
      "/images/products/paradyz-cloud-rosa-duro/el-base-300x300.webp",
      "/images/products/paradyz-cloud-rosa-duro/photo_1.png"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Cloud Rosa Duro — цена, характеристики",
      description: "Клинкерные ступени Paradyz Cloud Rosa Duro: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Cloud Rosa Duro"
    }
  },
  {
    id: "paradyz-eremite-beige",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Eremite Beige",
    sku: "18631",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18631",
        length_m: 0.6,
        photo: "/images/products/paradyz-eremite-beige/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18577",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-eremite-beige/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-eremite-beige/el-front_notch-600x300.webp",
      "/images/products/paradyz-eremite-beige/el-base-600x300.webp",
      "/images/products/paradyz-eremite-beige/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Eremite Beige — цена, характеристики",
      description: "Клинкерные ступени Paradyz Eremite Beige: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Eremite Beige"
    },
    variants: [
      {
        id: "paradyz-eremite-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-eremite-beige/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-crema",
        color: "Кремовый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-eremite-crema/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-sand",
        color: "Песочный",
        color_hex: "#D2BE9A",
        photo: "/images/products/paradyz-eremite-sand/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-eremite-taupe/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-eremite-crema",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Eremite Crema",
    sku: "18632",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18632",
        length_m: 0.6,
        photo: "/images/products/paradyz-eremite-crema/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18578",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-eremite-crema/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Кремовый",
      color_hex: "#9A8F80",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-eremite-crema/el-front_notch-600x300.webp",
      "/images/products/paradyz-eremite-crema/el-base-600x300.webp",
      "/images/products/paradyz-eremite-crema/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Eremite Crema — цена, характеристики",
      description: "Клинкерные ступени Paradyz Eremite Crema: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Eremite Crema"
    },
    variants: [
      {
        id: "paradyz-eremite-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-eremite-beige/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-crema",
        color: "Кремовый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-eremite-crema/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-sand",
        color: "Песочный",
        color_hex: "#D2BE9A",
        photo: "/images/products/paradyz-eremite-sand/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-eremite-taupe/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-eremite-sand",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Eremite Sand",
    sku: "18633",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18633",
        length_m: 0.6,
        photo: "/images/products/paradyz-eremite-sand/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18579",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-eremite-sand/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Песочный",
      color_hex: "#D2BE9A",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-eremite-sand/el-front_notch-600x300.webp",
      "/images/products/paradyz-eremite-sand/el-base-600x300.webp",
      "/images/products/paradyz-eremite-sand/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Eremite Sand — цена, характеристики",
      description: "Клинкерные ступени Paradyz Eremite Sand: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Eremite Sand"
    },
    variants: [
      {
        id: "paradyz-eremite-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-eremite-beige/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-crema",
        color: "Кремовый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-eremite-crema/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-sand",
        color: "Песочный",
        color_hex: "#D2BE9A",
        photo: "/images/products/paradyz-eremite-sand/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-eremite-taupe/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-eremite-taupe",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Eremite Taupe",
    sku: "18634",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18634",
        length_m: 0.6,
        photo: "/images/products/paradyz-eremite-taupe/el-front_notch-600x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18580",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-eremite-taupe/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Тёмно-серый",
      color_hex: "#9A8F80",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-eremite-taupe/el-front_notch-600x300.webp",
      "/images/products/paradyz-eremite-taupe/el-base-600x300.webp",
      "/images/products/paradyz-eremite-taupe/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Eremite Taupe — цена, характеристики",
      description: "Клинкерные ступени Paradyz Eremite Taupe: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Eremite Taupe"
    },
    variants: [
      {
        id: "paradyz-eremite-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-eremite-beige/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-crema",
        color: "Кремовый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-eremite-crema/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-sand",
        color: "Песочный",
        color_hex: "#D2BE9A",
        photo: "/images/products/paradyz-eremite-sand/el-front_notch-600x300.webp"
      },
      {
        id: "paradyz-eremite-taupe",
        color: "Тёмно-серый",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-eremite-taupe/el-front_notch-600x300.webp"
      }
    ]
  },
  {
    id: "paradyz-ilario-beige",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Ilario Beige",
    sku: "18336",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18336",
        length_m: 0.3,
        photo: "/images/products/paradyz-ilario-beige/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18647",
        length_m: 0.3,
        photo: "/images/products/paradyz-ilario-beige/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18335",
        length_m: 0.6,
        photo: "/images/products/paradyz-ilario-beige/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18649",
        photo: "/images/products/paradyz-ilario-beige/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18652",
        photo: "/images/products/paradyz-ilario-beige/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18331",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-ilario-beige/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18593",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-ilario-beige/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-ilario-beige/el-front-300x330.webp",
      "/images/products/paradyz-ilario-beige/el-front_notch-300x300.webp",
      "/images/products/paradyz-ilario-beige/el-front_notch-600x300.webp",
      "/images/products/paradyz-ilario-beige/el-corner_l-330x330.webp",
      "/images/products/paradyz-ilario-beige/el-corner_notch-300x300.webp",
      "/images/products/paradyz-ilario-beige/el-base-300x300.webp",
      "/images/products/paradyz-ilario-beige/el-base-600x300.webp",
      "/images/products/paradyz-ilario-beige/photo_0_own.jpg",
      "/images/products/paradyz-ilario-beige/photo_1.png",
      "/images/products/paradyz-ilario-beige/photo_1_b24.jpg",
      "/images/objects/catalog/ilario-beige-1.jpg",
      "/images/objects/catalog/ilario-beige-2.jpg",
      "/images/objects/catalog/ilario-beige-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Ilario Beige — цена, характеристики",
      description: "Клинкерные ступени Paradyz Ilario Beige: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Ilario Beige"
    },
    variants: [
      {
        id: "paradyz-ilario-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-ilario-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-ilario-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-ilario-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-ilario-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-ilario-ochra/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-ilario-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Ilario Brown",
    sku: "18654",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18654",
        length_m: 0.3,
        photo: "/images/products/paradyz-ilario-brown/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18657",
        length_m: 0.3,
        photo: "/images/products/paradyz-ilario-brown/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18658",
        length_m: 0.6,
        photo: "/images/products/paradyz-ilario-brown/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18653",
        photo: "/images/products/paradyz-ilario-brown/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18656",
        photo: "/images/products/paradyz-ilario-brown/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18590",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-ilario-brown/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18594",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-ilario-brown/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-ilario-brown/el-front-300x330.webp",
      "/images/products/paradyz-ilario-brown/el-front_notch-300x300.webp",
      "/images/products/paradyz-ilario-brown/el-front_notch-600x300.webp",
      "/images/products/paradyz-ilario-brown/el-corner_l-330x330.webp",
      "/images/products/paradyz-ilario-brown/el-corner_notch-300x300.webp",
      "/images/products/paradyz-ilario-brown/el-base-300x300.webp",
      "/images/products/paradyz-ilario-brown/el-base-600x300.webp",
      "/images/products/paradyz-ilario-brown/photo_0_own.jpg",
      "/images/products/paradyz-ilario-brown/photo_1.png",
      "/images/products/paradyz-ilario-brown/photo_1_b24.jpg",
      "/images/objects/catalog/ilario-brown-1.jpg",
      "/images/objects/catalog/ilario-brown-2.jpg",
      "/images/objects/catalog/ilario-brown-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Ilario Brown — цена, характеристики",
      description: "Клинкерные ступени Paradyz Ilario Brown: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Ilario Brown"
    },
    variants: [
      {
        id: "paradyz-ilario-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-ilario-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-ilario-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-ilario-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-ilario-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-ilario-ochra/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-ilario-ochra",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Ilario Ochra",
    sku: "18662",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18662",
        length_m: 0.3,
        photo: "/images/products/paradyz-ilario-ochra/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18660",
        length_m: 0.3,
        photo: "/images/products/paradyz-ilario-ochra/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18661",
        length_m: 0.6,
        photo: "/images/products/paradyz-ilario-ochra/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18651",
        photo: "/images/products/paradyz-ilario-ochra/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18659",
        photo: "/images/products/paradyz-ilario-ochra/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18591",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-ilario-ochra/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18595",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-ilario-ochra/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Охра",
      color_hex: "#C7A45C",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-ilario-ochra/el-front-300x330.webp",
      "/images/products/paradyz-ilario-ochra/el-front_notch-300x300.webp",
      "/images/products/paradyz-ilario-ochra/el-front_notch-600x300.webp",
      "/images/products/paradyz-ilario-ochra/el-corner_l-330x330.webp",
      "/images/products/paradyz-ilario-ochra/el-corner_notch-300x300.webp",
      "/images/products/paradyz-ilario-ochra/el-base-300x300.webp",
      "/images/products/paradyz-ilario-ochra/el-base-600x300.webp",
      "/images/products/paradyz-ilario-ochra/photo_0_own.jpg",
      "/images/products/paradyz-ilario-ochra/photo_1.png",
      "/images/products/paradyz-ilario-ochra/photo_1_b24.jpg",
      "/images/objects/catalog/ilario-ochra-1.jpg",
      "/images/objects/catalog/ilario-ochra-2.jpg",
      "/images/objects/catalog/ilario-ochra-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Ilario Ochra — цена, характеристики",
      description: "Клинкерные ступени Paradyz Ilario Ochra: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Ilario Ochra"
    },
    variants: [
      {
        id: "paradyz-ilario-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-ilario-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-ilario-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-ilario-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-ilario-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-ilario-ochra/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-mattone-pietra-beige",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Mattone Pietra Beige",
    sku: "18681",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18681",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-pietra-beige/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18680",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-pietra-beige/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18682",
        photo: "/images/products/paradyz-mattone-pietra-beige/el-corner_l-330x330.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18616",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-mattone-pietra-beige/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      frost_resistance: "F100"
    },
    photos: [
      "/images/products/paradyz-mattone-pietra-beige/el-front-300x330.webp",
      "/images/products/paradyz-mattone-pietra-beige/el-front_notch-300x300.webp",
      "/images/products/paradyz-mattone-pietra-beige/el-corner_l-330x330.webp",
      "/images/products/paradyz-mattone-pietra-beige/el-base-300x300.webp",
      "/images/products/paradyz-mattone-pietra-beige/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Mattone Pietra Beige — цена, характеристики",
      description: "Клинкерные ступени Paradyz Mattone Pietra Beige: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Mattone Pietra Beige"
    },
    variants: [
      {
        id: "paradyz-mattone-pietra-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-mattone-pietra-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-pietra-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-mattone-pietra-grafit/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-pietra-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-mattone-pietra-ochra/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-mattone-pietra-grafit",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Mattone Pietra Grafit",
    sku: "18676",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18676",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-pietra-grafit/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18677",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-pietra-grafit/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18679",
        photo: "/images/products/paradyz-mattone-pietra-grafit/el-corner_l-330x330.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18615",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-mattone-pietra-grafit/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Графит",
      color_hex: "#4A4D4E",
      frost_resistance: "F100"
    },
    photos: [
      "/images/products/paradyz-mattone-pietra-grafit/el-front-300x330.webp",
      "/images/products/paradyz-mattone-pietra-grafit/el-front_notch-300x300.webp",
      "/images/products/paradyz-mattone-pietra-grafit/el-corner_l-330x330.webp",
      "/images/products/paradyz-mattone-pietra-grafit/el-base-300x300.webp",
      "/images/products/paradyz-mattone-pietra-grafit/texture.jpg",
      "/images/objects/catalog/mattone-grafit-1.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Mattone Pietra Grafit — цена, характеристики",
      description: "Клинкерные ступени Paradyz Mattone Pietra Grafit: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Mattone Pietra Grafit"
    },
    variants: [
      {
        id: "paradyz-mattone-pietra-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-mattone-pietra-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-pietra-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-mattone-pietra-grafit/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-pietra-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-mattone-pietra-ochra/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-mattone-pietra-ochra",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Mattone Pietra Ochra",
    sku: "18684",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18684",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-pietra-ochra/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18683",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-pietra-ochra/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18685",
        photo: "/images/products/paradyz-mattone-pietra-ochra/el-corner_l-330x330.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18617",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-mattone-pietra-ochra/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Охра",
      color_hex: "#C7A45C",
      frost_resistance: "F100"
    },
    photos: [
      "/images/products/paradyz-mattone-pietra-ochra/el-front-300x330.webp",
      "/images/products/paradyz-mattone-pietra-ochra/el-front_notch-300x300.webp",
      "/images/products/paradyz-mattone-pietra-ochra/el-corner_l-330x330.webp",
      "/images/products/paradyz-mattone-pietra-ochra/el-base-300x300.webp",
      "/images/products/paradyz-mattone-pietra-ochra/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Mattone Pietra Ochra — цена, характеристики",
      description: "Клинкерные ступени Paradyz Mattone Pietra Ochra: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Mattone Pietra Ochra"
    },
    variants: [
      {
        id: "paradyz-mattone-pietra-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-mattone-pietra-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-pietra-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-mattone-pietra-grafit/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-pietra-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-mattone-pietra-ochra/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-mattone-sabbia-beige",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Mattone Sabbia Beige",
    sku: "18687",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18687",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-sabbia-beige/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18686",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-sabbia-beige/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18688",
        photo: "/images/products/paradyz-mattone-sabbia-beige/el-corner_l-330x330.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18612",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-mattone-sabbia-beige/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      frost_resistance: "F100"
    },
    photos: [
      "/images/products/paradyz-mattone-sabbia-beige/el-front-300x330.webp",
      "/images/products/paradyz-mattone-sabbia-beige/el-front_notch-300x300.webp",
      "/images/products/paradyz-mattone-sabbia-beige/el-corner_l-330x330.webp",
      "/images/products/paradyz-mattone-sabbia-beige/el-base-300x300.webp",
      "/images/products/paradyz-mattone-sabbia-beige/photo_0_own.jpg",
      "/images/products/paradyz-mattone-sabbia-beige/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Mattone Sabbia Beige — цена, характеристики",
      description: "Клинкерные ступени Paradyz Mattone Sabbia Beige: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Mattone Sabbia Beige"
    },
    variants: [
      {
        id: "paradyz-mattone-sabbia-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-mattone-sabbia-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-sabbia-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-mattone-sabbia-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-sabbia-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-mattone-sabbia-grafit/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-mattone-sabbia-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Mattone Sabbia Brown",
    sku: "18690",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18690",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-sabbia-brown/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18689",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-sabbia-brown/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18691",
        photo: "/images/products/paradyz-mattone-sabbia-brown/el-corner_l-330x330.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18613",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-mattone-sabbia-brown/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100"
    },
    photos: [
      "/images/products/paradyz-mattone-sabbia-brown/el-front-300x330.webp",
      "/images/products/paradyz-mattone-sabbia-brown/el-front_notch-300x300.webp",
      "/images/products/paradyz-mattone-sabbia-brown/el-corner_l-330x330.webp",
      "/images/products/paradyz-mattone-sabbia-brown/el-base-300x300.webp",
      "/images/products/paradyz-mattone-sabbia-brown/photo_0_own.jpg",
      "/images/products/paradyz-mattone-sabbia-brown/texture.jpg"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Mattone Sabbia Brown — цена, характеристики",
      description: "Клинкерные ступени Paradyz Mattone Sabbia Brown: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Mattone Sabbia Brown"
    },
    variants: [
      {
        id: "paradyz-mattone-sabbia-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-mattone-sabbia-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-sabbia-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-mattone-sabbia-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-sabbia-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-mattone-sabbia-grafit/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-mattone-sabbia-grafit",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Mattone Sabbia Grafit",
    sku: "18692",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18692",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-sabbia-grafit/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18694",
        length_m: 0.3,
        photo: "/images/products/paradyz-mattone-sabbia-grafit/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18693",
        photo: "/images/products/paradyz-mattone-sabbia-grafit/el-corner_l-330x330.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18614",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-mattone-sabbia-grafit/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Графит",
      color_hex: "#4A4D4E",
      frost_resistance: "F100"
    },
    photos: [
      "/images/products/paradyz-mattone-sabbia-grafit/el-front-300x330.webp",
      "/images/products/paradyz-mattone-sabbia-grafit/el-front_notch-300x300.webp",
      "/images/products/paradyz-mattone-sabbia-grafit/el-corner_l-330x330.webp",
      "/images/products/paradyz-mattone-sabbia-grafit/el-base-300x300.webp",
      "/images/products/paradyz-mattone-sabbia-grafit/photo_0_own.jpg",
      "/images/products/paradyz-mattone-sabbia-grafit/texture.jpg",
      "/images/objects/catalog/mattone-grafit-1.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Mattone Sabbia Grafit — цена, характеристики",
      description: "Клинкерные ступени Paradyz Mattone Sabbia Grafit: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Mattone Sabbia Grafit"
    },
    variants: [
      {
        id: "paradyz-mattone-sabbia-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-mattone-sabbia-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-sabbia-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-mattone-sabbia-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-mattone-sabbia-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-mattone-sabbia-grafit/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-natural-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Natural Brown",
    sku: "18695",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18695",
        length_m: 0.3,
        photo: "/images/products/paradyz-natural-brown/el-front_notch-300x300.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18697",
        photo: "/images/products/paradyz-natural-brown/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18596",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-natural-brown/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-natural-brown/el-front_notch-300x300.webp",
      "/images/products/paradyz-natural-brown/el-corner_notch-300x300.webp",
      "/images/products/paradyz-natural-brown/el-base-300x300.webp",
      "/images/products/paradyz-natural-brown/photo_0_own.jpg",
      "/images/products/paradyz-natural-brown/photo_1.png",
      "/images/products/paradyz-natural-brown/photo_1_b24.jpg",
      "/images/objects/catalog/natural-brown-1.jpg",
      "/images/objects/catalog/natural-brown-2.jpg",
      "/images/objects/catalog/natural-brown-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Natural Brown — цена, характеристики",
      description: "Клинкерные ступени Paradyz Natural Brown: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Natural Brown"
    },
    variants: [
      {
        id: "paradyz-natural-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-natural-brown/el-front_notch-300x300.webp"
      },
      {
        id: "paradyz-natural-rosa",
        color: "Розовый",
        color_hex: "#C98B7A",
        photo: "/images/products/paradyz-natural-rosa/el-front_notch-300x300.webp"
      }
    ]
  },
  {
    id: "paradyz-natural-brown-duro",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Natural Brown Duro",
    sku: "18698",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18698",
        length_m: 0.3,
        photo: "/images/products/paradyz-natural-brown-duro/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18699",
        length_m: 0.3,
        photo: "/images/products/paradyz-natural-brown-duro/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18700",
        photo: "/images/products/paradyz-natural-brown-duro/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18701",
        photo: "/images/products/paradyz-natural-brown-duro/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18597",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-natural-brown-duro/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-natural-brown-duro/el-front-300x330.webp",
      "/images/products/paradyz-natural-brown-duro/el-front_notch-300x300.webp",
      "/images/products/paradyz-natural-brown-duro/el-corner_l-330x330.webp",
      "/images/products/paradyz-natural-brown-duro/el-corner_notch-300x300.webp",
      "/images/products/paradyz-natural-brown-duro/el-base-300x300.webp",
      "/images/products/paradyz-natural-brown-duro/photo_1.png",
      "/images/objects/catalog/natural-brown-1.jpg",
      "/images/objects/catalog/natural-brown-2.jpg",
      "/images/objects/catalog/natural-brown-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Natural Brown Duro — цена, характеристики",
      description: "Клинкерные ступени Paradyz Natural Brown Duro: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Natural Brown Duro"
    }
  },
  {
    id: "paradyz-natural-rosa",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Natural Rosa",
    sku: "18702",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18702",
        length_m: 0.3,
        photo: "/images/products/paradyz-natural-rosa/el-front_notch-300x300.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18704",
        photo: "/images/products/paradyz-natural-rosa/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18599",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-natural-rosa/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Розовый",
      color_hex: "#C98B7A",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-natural-rosa/el-front_notch-300x300.webp",
      "/images/products/paradyz-natural-rosa/el-corner_notch-300x300.webp",
      "/images/products/paradyz-natural-rosa/el-base-300x300.webp",
      "/images/products/paradyz-natural-rosa/photo_0_own.jpg",
      "/images/products/paradyz-natural-rosa/photo_1.png"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Natural Rosa — цена, характеристики",
      description: "Клинкерные ступени Paradyz Natural Rosa: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Natural Rosa"
    },
    variants: [
      {
        id: "paradyz-natural-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-natural-brown/el-front_notch-300x300.webp"
      },
      {
        id: "paradyz-natural-rosa",
        color: "Розовый",
        color_hex: "#C98B7A",
        photo: "/images/products/paradyz-natural-rosa/el-front_notch-300x300.webp"
      }
    ]
  },
  {
    id: "paradyz-natural-rosa-duro",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Natural Rosa Duro",
    sku: "18706",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18706",
        length_m: 0.3,
        photo: "/images/products/paradyz-natural-rosa-duro/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18703",
        length_m: 0.3,
        photo: "/images/products/paradyz-natural-rosa-duro/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18707",
        photo: "/images/products/paradyz-natural-rosa-duro/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18705",
        photo: "/images/products/paradyz-natural-rosa-duro/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18598",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-natural-rosa-duro/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Розовый",
      color_hex: "#C98B7A",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-natural-rosa-duro/el-front-300x330.webp",
      "/images/products/paradyz-natural-rosa-duro/el-front_notch-300x300.webp",
      "/images/products/paradyz-natural-rosa-duro/el-corner_l-330x330.webp",
      "/images/products/paradyz-natural-rosa-duro/el-corner_notch-300x300.webp",
      "/images/products/paradyz-natural-rosa-duro/el-base-300x300.webp",
      "/images/products/paradyz-natural-rosa-duro/photo_1.png"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Natural Rosa Duro — цена, характеристики",
      description: "Клинкерные ступени Paradyz Natural Rosa Duro: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Natural Rosa Duro"
    }
  },
  {
    id: "paradyz-scandiano-beige",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Scandiano Beige",
    sku: "18708",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18708",
        length_m: 0.3,
        photo: "/images/products/paradyz-scandiano-beige/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18709",
        length_m: 0.3,
        photo: "/images/products/paradyz-scandiano-beige/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18710",
        length_m: 0.6,
        photo: "/images/products/paradyz-scandiano-beige/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18711",
        photo: "/images/products/paradyz-scandiano-beige/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18712",
        photo: "/images/products/paradyz-scandiano-beige/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18618",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-scandiano-beige/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18622",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-scandiano-beige/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-scandiano-beige/el-front-300x330.webp",
      "/images/products/paradyz-scandiano-beige/el-front_notch-300x300.webp",
      "/images/products/paradyz-scandiano-beige/el-front_notch-600x300.webp",
      "/images/products/paradyz-scandiano-beige/el-corner_l-330x330.webp",
      "/images/products/paradyz-scandiano-beige/el-corner_notch-300x300.webp",
      "/images/products/paradyz-scandiano-beige/el-base-300x300.webp",
      "/images/products/paradyz-scandiano-beige/el-base-600x300.webp",
      "/images/products/paradyz-scandiano-beige/photo_0_own.jpg",
      "/images/products/paradyz-scandiano-beige/photo_1.png",
      "/images/products/paradyz-scandiano-beige/photo_1_b24.jpg",
      "/images/objects/catalog/scandiano-beige-1.jpg",
      "/images/objects/catalog/scandiano-beige-2.jpg",
      "/images/objects/catalog/scandiano-beige-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Scandiano Beige — цена, характеристики",
      description: "Клинкерные ступени Paradyz Scandiano Beige: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Scandiano Beige"
    },
    variants: [
      {
        id: "paradyz-scandiano-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-scandiano-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-scandiano-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-scandiano-brown/el-front_notch-300x300.webp"
      },
      {
        id: "paradyz-scandiano-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-scandiano-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-scandiano-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-scandiano-rosso/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-scandiano-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Scandiano Brown",
    sku: "18714",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18714",
        length_m: 0.3,
        photo: "/images/products/paradyz-scandiano-brown/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18715",
        length_m: 0.6,
        photo: "/images/products/paradyz-scandiano-brown/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18716",
        photo: "/images/products/paradyz-scandiano-brown/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18717",
        photo: "/images/products/paradyz-scandiano-brown/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18619",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-scandiano-brown/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18623",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-scandiano-brown/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-scandiano-brown/el-front_notch-300x300.webp",
      "/images/products/paradyz-scandiano-brown/el-front_notch-600x300.webp",
      "/images/products/paradyz-scandiano-brown/el-corner_l-330x330.webp",
      "/images/products/paradyz-scandiano-brown/el-corner_notch-300x300.webp",
      "/images/products/paradyz-scandiano-brown/el-base-300x300.webp",
      "/images/products/paradyz-scandiano-brown/el-base-600x300.webp",
      "/images/products/paradyz-scandiano-brown/photo_0_own.jpg",
      "/images/products/paradyz-scandiano-brown/photo_1.png",
      "/images/products/paradyz-scandiano-brown/photo_1_b24.jpg",
      "/images/objects/catalog/scandiano-brown-1.jpg",
      "/images/objects/catalog/scandiano-brown-2.jpg",
      "/images/objects/catalog/scandiano-brown-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Scandiano Brown — цена, характеристики",
      description: "Клинкерные ступени Paradyz Scandiano Brown: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Scandiano Brown"
    },
    variants: [
      {
        id: "paradyz-scandiano-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-scandiano-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-scandiano-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-scandiano-brown/el-front_notch-300x300.webp"
      },
      {
        id: "paradyz-scandiano-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-scandiano-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-scandiano-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-scandiano-rosso/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-scandiano-ochra",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Scandiano Ochra",
    sku: "18713",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18713",
        length_m: 0.3,
        photo: "/images/products/paradyz-scandiano-ochra/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18718",
        length_m: 0.3,
        photo: "/images/products/paradyz-scandiano-ochra/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18719",
        length_m: 0.6,
        photo: "/images/products/paradyz-scandiano-ochra/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18720",
        photo: "/images/products/paradyz-scandiano-ochra/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18721",
        photo: "/images/products/paradyz-scandiano-ochra/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18620",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-scandiano-ochra/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18624",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-scandiano-ochra/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Охра",
      color_hex: "#C7A45C",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-scandiano-ochra/el-front-300x330.webp",
      "/images/products/paradyz-scandiano-ochra/el-front_notch-300x300.webp",
      "/images/products/paradyz-scandiano-ochra/el-front_notch-600x300.webp",
      "/images/products/paradyz-scandiano-ochra/el-corner_l-330x330.webp",
      "/images/products/paradyz-scandiano-ochra/el-corner_notch-300x300.webp",
      "/images/products/paradyz-scandiano-ochra/el-base-300x300.webp",
      "/images/products/paradyz-scandiano-ochra/el-base-600x300.webp",
      "/images/products/paradyz-scandiano-ochra/photo_0_own.jpg",
      "/images/products/paradyz-scandiano-ochra/photo_1.png",
      "/images/products/paradyz-scandiano-ochra/photo_1_b24.jpg",
      "/images/objects/catalog/scandiano-ochra-1.jpg",
      "/images/objects/catalog/scandiano-ochra-2.jpg",
      "/images/objects/catalog/scandiano-ochra-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Scandiano Ochra — цена, характеристики",
      description: "Клинкерные ступени Paradyz Scandiano Ochra: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Scandiano Ochra"
    },
    variants: [
      {
        id: "paradyz-scandiano-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-scandiano-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-scandiano-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-scandiano-brown/el-front_notch-300x300.webp"
      },
      {
        id: "paradyz-scandiano-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-scandiano-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-scandiano-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-scandiano-rosso/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-scandiano-rosso",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Scandiano Rosso",
    sku: "18722",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18722",
        length_m: 0.3,
        photo: "/images/products/paradyz-scandiano-rosso/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18723",
        length_m: 0.3,
        photo: "/images/products/paradyz-scandiano-rosso/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18724",
        length_m: 0.6,
        photo: "/images/products/paradyz-scandiano-rosso/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18725",
        photo: "/images/products/paradyz-scandiano-rosso/el-corner_l-330x330.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18621",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-scandiano-rosso/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18625",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-scandiano-rosso/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Красный",
      color_hex: "#9A8F80",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-scandiano-rosso/el-front-300x330.webp",
      "/images/products/paradyz-scandiano-rosso/el-front_notch-300x300.webp",
      "/images/products/paradyz-scandiano-rosso/el-front_notch-600x300.webp",
      "/images/products/paradyz-scandiano-rosso/el-corner_l-330x330.webp",
      "/images/products/paradyz-scandiano-rosso/el-base-300x300.webp",
      "/images/products/paradyz-scandiano-rosso/el-base-600x300.webp",
      "/images/products/paradyz-scandiano-rosso/photo_0_own.jpg",
      "/images/products/paradyz-scandiano-rosso/photo_1.png",
      "/images/products/paradyz-scandiano-rosso/photo_1_b24.jpg",
      "/images/objects/catalog/scandiano-rosso-1.jpg",
      "/images/objects/catalog/scandiano-rosso-2.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Scandiano Rosso — цена, характеристики",
      description: "Клинкерные ступени Paradyz Scandiano Rosso: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Scandiano Rosso"
    },
    variants: [
      {
        id: "paradyz-scandiano-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-scandiano-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-scandiano-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-scandiano-brown/el-front_notch-300x300.webp"
      },
      {
        id: "paradyz-scandiano-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-scandiano-ochra/el-front-300x330.webp"
      },
      {
        id: "paradyz-scandiano-rosso",
        color: "Красный",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-scandiano-rosso/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-semir-beige",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Semir Beige",
    sku: "18727",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18727",
        length_m: 0.3,
        photo: "/images/products/paradyz-semir-beige/el-front-300x330.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18729",
        photo: "/images/products/paradyz-semir-beige/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18730",
        photo: "/images/products/paradyz-semir-beige/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18600",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-semir-beige/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-semir-beige/el-front-300x330.webp",
      "/images/products/paradyz-semir-beige/el-corner_l-330x330.webp",
      "/images/products/paradyz-semir-beige/el-corner_notch-300x300.webp",
      "/images/products/paradyz-semir-beige/el-base-300x300.webp",
      "/images/products/paradyz-semir-beige/photo_0_own.jpg",
      "/images/products/paradyz-semir-beige/photo_1.png",
      "/images/products/paradyz-semir-beige/photo_1_b24.jpg",
      "/images/objects/catalog/semir-beige-1.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Semir Beige — цена, характеристики",
      description: "Клинкерные ступени Paradyz Semir Beige: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Semir Beige"
    },
    variants: [
      {
        id: "paradyz-semir-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-semir-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-semir-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-semir-grafit/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-rosa",
        color: "Розовый",
        color_hex: "#C98B7A",
        photo: "/images/products/paradyz-semir-rosa/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-semir-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Semir Brown",
    sku: "18732",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18732",
        length_m: 0.3,
        photo: "/images/products/paradyz-semir-brown/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 256,
        price_rub: 350,
        sku: "18733",
        length_m: 0.3,
        photo: "/images/products/paradyz-semir-brown/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18731",
        photo: "/images/products/paradyz-semir-brown/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18734",
        photo: "/images/products/paradyz-semir-brown/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18601",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-semir-brown/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-semir-brown/el-front-300x330.webp",
      "/images/products/paradyz-semir-brown/el-front_notch-300x300.webp",
      "/images/products/paradyz-semir-brown/el-corner_l-330x330.webp",
      "/images/products/paradyz-semir-brown/el-corner_notch-300x300.webp",
      "/images/products/paradyz-semir-brown/el-base-300x300.webp",
      "/images/products/paradyz-semir-brown/photo_0_own.jpg",
      "/images/products/paradyz-semir-brown/photo_1.png",
      "/images/products/paradyz-semir-brown/photo_1_b24.jpg",
      "/images/objects/catalog/semir-brown-1.jpg",
      "/images/objects/catalog/semir-brown-2.jpg",
      "/images/objects/catalog/semir-brown-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Semir Brown — цена, характеристики",
      description: "Клинкерные ступени Paradyz Semir Brown: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Semir Brown"
    },
    variants: [
      {
        id: "paradyz-semir-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-semir-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-semir-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-semir-grafit/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-rosa",
        color: "Розовый",
        color_hex: "#C98B7A",
        photo: "/images/products/paradyz-semir-rosa/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-semir-grafit",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Semir Grafit",
    sku: "18736",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18736",
        length_m: 0.3,
        photo: "/images/products/paradyz-semir-grafit/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 256,
        price_rub: 350,
        sku: "18735",
        length_m: 0.3,
        photo: "/images/products/paradyz-semir-grafit/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18737",
        photo: "/images/products/paradyz-semir-grafit/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18738",
        photo: "/images/products/paradyz-semir-grafit/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18602",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-semir-grafit/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Графит",
      color_hex: "#4A4D4E",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-semir-grafit/el-front-300x330.webp",
      "/images/products/paradyz-semir-grafit/el-front_notch-300x300.webp",
      "/images/products/paradyz-semir-grafit/el-corner_l-330x330.webp",
      "/images/products/paradyz-semir-grafit/el-corner_notch-300x300.webp",
      "/images/products/paradyz-semir-grafit/el-base-300x300.webp",
      "/images/products/paradyz-semir-grafit/photo_0_own.jpg",
      "/images/products/paradyz-semir-grafit/photo_1.png",
      "/images/products/paradyz-semir-grafit/photo_1_b24.jpg",
      "/images/objects/catalog/semir-grafit-1.jpg",
      "/images/objects/catalog/semir-grafit-2.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Semir Grafit — цена, характеристики",
      description: "Клинкерные ступени Paradyz Semir Grafit: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Semir Grafit"
    },
    variants: [
      {
        id: "paradyz-semir-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-semir-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-semir-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-semir-grafit/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-rosa",
        color: "Розовый",
        color_hex: "#C98B7A",
        photo: "/images/products/paradyz-semir-rosa/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-semir-rosa",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Semir Rosa",
    sku: "18739",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18739",
        length_m: 0.3,
        photo: "/images/products/paradyz-semir-rosa/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 256,
        price_rub: 350,
        sku: "18740",
        length_m: 0.3,
        photo: "/images/products/paradyz-semir-rosa/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18741",
        photo: "/images/products/paradyz-semir-rosa/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18742",
        photo: "/images/products/paradyz-semir-rosa/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18603",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-semir-rosa/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Розовый",
      color_hex: "#C98B7A",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-semir-rosa/el-front-300x330.webp",
      "/images/products/paradyz-semir-rosa/el-front_notch-300x300.webp",
      "/images/products/paradyz-semir-rosa/el-corner_l-330x330.webp",
      "/images/products/paradyz-semir-rosa/el-corner_notch-300x300.webp",
      "/images/products/paradyz-semir-rosa/el-base-300x300.webp",
      "/images/products/paradyz-semir-rosa/photo_0_own.jpg",
      "/images/products/paradyz-semir-rosa/photo_1.png",
      "/images/products/paradyz-semir-rosa/photo_1_b24.jpg",
      "/images/objects/catalog/semir-rosa-1.jpg",
      "/images/objects/catalog/semir-rosa-2.jpg",
      "/images/objects/catalog/semir-rosa-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Semir Rosa — цена, характеристики",
      description: "Клинкерные ступени Paradyz Semir Rosa: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Semir Rosa"
    },
    variants: [
      {
        id: "paradyz-semir-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-semir-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-semir-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-semir-grafit/el-front-300x330.webp"
      },
      {
        id: "paradyz-semir-rosa",
        color: "Розовый",
        color_hex: "#C98B7A",
        photo: "/images/products/paradyz-semir-rosa/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-taurus-brown",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Taurus Brown",
    sku: "18764",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18764",
        length_m: 0.3,
        photo: "/images/products/paradyz-taurus-brown/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 256,
        price_rub: 350,
        sku: "18765",
        length_m: 0.3,
        photo: "/images/products/paradyz-taurus-brown/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18763",
        photo: "/images/products/paradyz-taurus-brown/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18766",
        photo: "/images/products/paradyz-taurus-brown/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18604",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-taurus-brown/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-taurus-brown/el-front-300x330.webp",
      "/images/products/paradyz-taurus-brown/el-front_notch-300x300.webp",
      "/images/products/paradyz-taurus-brown/el-corner_l-330x330.webp",
      "/images/products/paradyz-taurus-brown/el-corner_notch-300x300.webp",
      "/images/products/paradyz-taurus-brown/el-base-300x300.webp",
      "/images/products/paradyz-taurus-brown/photo_0_own.jpg",
      "/images/products/paradyz-taurus-brown/photo_1.png"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Taurus Brown — цена, характеристики",
      description: "Клинкерные ступени Paradyz Taurus Brown: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Taurus Brown"
    },
    variants: [
      {
        id: "paradyz-taurus-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-taurus-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-taurus-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-taurus-grys/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-taurus-grys",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Taurus Grys",
    sku: "18761",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18761",
        length_m: 0.3,
        photo: "/images/products/paradyz-taurus-grys/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 256,
        price_rub: 350,
        sku: "18762",
        length_m: 0.3,
        photo: "/images/products/paradyz-taurus-grys/el-front_notch-300x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18759",
        photo: "/images/products/paradyz-taurus-grys/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18760",
        photo: "/images/products/paradyz-taurus-grys/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18605",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-taurus-grys/el-base-300x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-taurus-grys/el-front-300x330.webp",
      "/images/products/paradyz-taurus-grys/el-front_notch-300x300.webp",
      "/images/products/paradyz-taurus-grys/el-corner_l-330x330.webp",
      "/images/products/paradyz-taurus-grys/el-corner_notch-300x300.webp",
      "/images/products/paradyz-taurus-grys/el-base-300x300.webp",
      "/images/products/paradyz-taurus-grys/photo_0_own.jpg",
      "/images/products/paradyz-taurus-grys/photo_1.png"
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Taurus Grys — цена, характеристики",
      description: "Клинкерные ступени Paradyz Taurus Grys: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Taurus Grys"
    },
    variants: [
      {
        id: "paradyz-taurus-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-taurus-brown/el-front-300x330.webp"
      },
      {
        id: "paradyz-taurus-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-taurus-grys/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-viano-antracite",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Viano Antracite",
    sku: "18743",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18743",
        length_m: 0.3,
        photo: "/images/products/paradyz-viano-antracite/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18744",
        length_m: 0.3,
        photo: "/images/products/paradyz-viano-antracite/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18747",
        length_m: 0.6,
        photo: "/images/products/paradyz-viano-antracite/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18745",
        photo: "/images/products/paradyz-viano-antracite/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18746",
        photo: "/images/products/paradyz-viano-antracite/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18606",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-viano-antracite/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18609",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-viano-antracite/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Антрацит",
      color_hex: "#3A3C3B",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-viano-antracite/el-front-300x330.webp",
      "/images/products/paradyz-viano-antracite/el-front_notch-300x300.webp",
      "/images/products/paradyz-viano-antracite/el-front_notch-600x300.webp",
      "/images/products/paradyz-viano-antracite/el-corner_l-330x330.webp",
      "/images/products/paradyz-viano-antracite/el-corner_notch-300x300.webp",
      "/images/products/paradyz-viano-antracite/el-base-300x300.webp",
      "/images/products/paradyz-viano-antracite/el-base-600x300.webp",
      "/images/products/paradyz-viano-antracite/photo_0_own.jpg",
      "/images/products/paradyz-viano-antracite/photo_1.png",
      "/images/products/paradyz-viano-antracite/photo_1_b24.jpg",
      "/images/objects/catalog/viano-antracite-1.jpg",
      "/images/objects/catalog/viano-antracite-2.jpg",
      "/images/objects/catalog/viano-antracite-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Viano Antracite — цена, характеристики",
      description: "Клинкерные ступени Paradyz Viano Antracite: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Viano Antracite"
    },
    variants: [
      {
        id: "paradyz-viano-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-viano-antracite/el-front-300x330.webp"
      },
      {
        id: "paradyz-viano-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-viano-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-viano-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-viano-grys/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-viano-beige",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Viano Beige",
    sku: "18753",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18753",
        length_m: 0.3,
        photo: "/images/products/paradyz-viano-beige/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18751",
        length_m: 0.3,
        photo: "/images/products/paradyz-viano-beige/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18750",
        length_m: 0.6,
        photo: "/images/products/paradyz-viano-beige/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18749",
        photo: "/images/products/paradyz-viano-beige/el-corner_l-330x330.webp"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18748",
        photo: "/images/products/paradyz-viano-beige/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18607",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-viano-beige/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18610",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-viano-beige/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-viano-beige/el-front-300x330.webp",
      "/images/products/paradyz-viano-beige/el-front_notch-300x300.webp",
      "/images/products/paradyz-viano-beige/el-front_notch-600x300.webp",
      "/images/products/paradyz-viano-beige/el-corner_l-330x330.webp",
      "/images/products/paradyz-viano-beige/el-corner_notch-300x300.webp",
      "/images/products/paradyz-viano-beige/el-base-300x300.webp",
      "/images/products/paradyz-viano-beige/el-base-600x300.webp",
      "/images/products/paradyz-viano-beige/photo_0_own.jpg",
      "/images/products/paradyz-viano-beige/photo_1.png",
      "/images/products/paradyz-viano-beige/photo_1_b24.jpg",
      "/images/objects/catalog/viano-beige-1.jpg",
      "/images/objects/catalog/viano-beige-2.jpg",
      "/images/objects/catalog/viano-beige-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Viano Beige — цена, характеристики",
      description: "Клинкерные ступени Paradyz Viano Beige: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Viano Beige"
    },
    variants: [
      {
        id: "paradyz-viano-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-viano-antracite/el-front-300x330.webp"
      },
      {
        id: "paradyz-viano-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-viano-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-viano-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-viano-grys/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-viano-grys",
    brand: "Paradyz",
    product_type: "step_system",
    application: [
      "kryltso",
      "lestnitsa-ulitsa"
    ],
    category: "terrasnyy-klinker",
    collection: "Viano Grys",
    sku: "18755",
    active: true,
    price_updated_at: "2026-07-29",
    elements: [
      {
        code: "front",
        name: "Ступень фронтальная (с капиносом)",
        size_mm: "300x330x11",
        unit: "pcs",
        weight_kg: 3.0,
        per_pallet: 216,
        price_rub: 2000,
        sku: "18755",
        length_m: 0.3,
        photo: "/images/products/paradyz-viano-grys/el-front-300x330.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 546,
        price_rub: 350,
        sku: "18757",
        length_m: 0.3,
        photo: "/images/products/paradyz-viano-grys/el-front_notch-300x300.webp"
      },
      {
        code: "front_notch",
        name: "Ступень фронтальная (с насечками)",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 700,
        sku: "18756",
        length_m: 0.6,
        photo: "/images/products/paradyz-viano-grys/el-front_notch-600x300.webp"
      },
      {
        code: "corner_l",
        name: "Угловая ступень (с капиносом)",
        size_mm: "330x330x11",
        unit: "pcs",
        weight_kg: 3.78,
        per_pallet: 124,
        price_rub: 3300,
        sku: "18772"
      },
      {
        code: "corner_notch",
        name: "Угловая ступень (с насечками)",
        size_mm: "300x300x11",
        unit: "pcs",
        weight_kg: 2.3,
        per_pallet: 420,
        price_rub: 500,
        sku: "18758",
        photo: "/images/products/paradyz-viano-grys/el-corner_notch-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "300x300x8.5",
        unit: "pcs",
        weight_kg: 1.77,
        per_pallet: 588,
        price_rub: 250,
        sku: "18608",
        per_sqm: 11.111,
        photo: "/images/products/paradyz-viano-grys/el-base-300x300.webp"
      },
      {
        code: "base",
        name: "Базовая плитка",
        size_mm: "600x300x8.5",
        unit: "pcs",
        weight_kg: 3.55,
        per_pallet: 256,
        price_rub: 500,
        sku: "18611",
        per_sqm: 5.556,
        photo: "/images/products/paradyz-viano-grys/el-base-600x300.webp"
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      frost_resistance: "F100",
      water_absorption_pct: 0.5,
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-viano-grys/el-front-300x330.webp",
      "/images/products/paradyz-viano-grys/el-front_notch-300x300.webp",
      "/images/products/paradyz-viano-grys/el-front_notch-600x300.webp",
      "/images/products/paradyz-viano-grys/el-corner_notch-300x300.webp",
      "/images/products/paradyz-viano-grys/el-base-300x300.webp",
      "/images/products/paradyz-viano-grys/el-base-600x300.webp",
      "/images/products/paradyz-viano-grys/photo_0_own.jpg",
      "/images/products/paradyz-viano-grys/photo_1.png",
      "/images/products/paradyz-viano-grys/photo_1_b24.jpg",
      "/images/objects/catalog/viano-grys-1.jpg",
      "/images/objects/catalog/viano-grys-2.jpg",
      "/images/objects/catalog/viano-grys-3.jpg",
    ],
    seo: {
      title: "Клинкерные ступени Paradyz Viano Grys — цена, характеристики",
      description: "Клинкерные ступени Paradyz Viano Grys: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Клинкерные ступени Paradyz Viano Grys"
    },
    variants: [
      {
        id: "paradyz-viano-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-viano-antracite/el-front-300x330.webp"
      },
      {
        id: "paradyz-viano-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-viano-beige/el-front-300x330.webp"
      },
      {
        id: "paradyz-viano-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-viano-grys/el-front-300x330.webp"
      }
    ]
  },
  {
    id: "paradyz-agawood-brown",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "AGAWOOD BROWN",
    sku: "5900139004473",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "wood",
      color: "Коричневый",
      color_hex: "#7A4B33"
    },
    photos: [

    ],
    seo: {
      title: "Керамогранит под дерево Paradyz AGAWOOD BROWN — цена, характеристики",
      description: "Керамогранит под дерево Paradyz AGAWOOD BROWN: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz AGAWOOD BROWN"
    }
  },
  {
    id: "paradyz-architeq-grey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "ARCHITEQ GREY",
    sku: "5900139010077",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-architeq-grey/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz ARCHITEQ GREY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz ARCHITEQ GREY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz ARCHITEQ GREY"
    },
    variants: [
      {
        id: "paradyz-architeq-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-architeq-grey/texture.jpg"
      },
      {
        id: "paradyz-architeq-mocca",
        color: "MOCCA",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-architeq-mocca/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-architeq-mocca",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "ARCHITEQ MOCCA",
    sku: "5900139010114",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "MOCCA",
      color_hex: "#9A8F80",
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-architeq-mocca/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz ARCHITEQ MOCCA — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz ARCHITEQ MOCCA: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz ARCHITEQ MOCCA"
    },
    variants: [
      {
        id: "paradyz-architeq-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-architeq-grey/texture.jpg"
      },
      {
        id: "paradyz-architeq-mocca",
        color: "MOCCA",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-architeq-mocca/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-authority-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "AUTHORITY BEIGE",
    sku: "5900139004182",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-authority-beige/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz AUTHORITY BEIGE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz AUTHORITY BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz AUTHORITY BEIGE"
    },
    variants: [
      {
        id: "paradyz-authority-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-authority-beige/photo_1.png"
      },
      {
        id: "paradyz-authority-graphite",
        color: "GRAPHITE",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-authority-graphite/photo_1.png"
      },
      {
        id: "paradyz-authority-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-authority-grey/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-authority-graphite",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "AUTHORITY GRAPHITE",
    sku: "5900139004250",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "GRAPHITE",
      color_hex: "#4A4D4E",
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-authority-graphite/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz AUTHORITY GRAPHITE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz AUTHORITY GRAPHITE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz AUTHORITY GRAPHITE"
    },
    variants: [
      {
        id: "paradyz-authority-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-authority-beige/photo_1.png"
      },
      {
        id: "paradyz-authority-graphite",
        color: "GRAPHITE",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-authority-graphite/photo_1.png"
      },
      {
        id: "paradyz-authority-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-authority-grey/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-authority-grey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "AUTHORITY GREY",
    sku: "5900139004229",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      slip_resistance: "R10"
    },
    photos: [
      "/images/products/paradyz-authority-grey/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz AUTHORITY GREY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz AUTHORITY GREY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz AUTHORITY GREY"
    },
    variants: [
      {
        id: "paradyz-authority-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-authority-beige/photo_1.png"
      },
      {
        id: "paradyz-authority-graphite",
        color: "GRAPHITE",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-authority-graphite/photo_1.png"
      },
      {
        id: "paradyz-authority-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-authority-grey/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-burlington-blue",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "BURLINGTON BLUE",
    sku: "5902610587603",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      }
    ],
    specs: {
      surface: "structured",
      color: "BLUE",
      color_hex: "#4A5A6B",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-burlington-blue/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz BURLINGTON BLUE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz BURLINGTON BLUE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz BURLINGTON BLUE"
    },
    variants: [
      {
        id: "paradyz-burlington-blue",
        color: "BLUE",
        color_hex: "#4A5A6B",
        photo: "/images/products/paradyz-burlington-blue/photo_1.png"
      },
      {
        id: "paradyz-burlington-ivory",
        color: "IVORY",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-burlington-ivory/photo_1.png"
      },
      {
        id: "paradyz-burlington-rust",
        color: "Ржавый",
        color_hex: "#A8502F",
        photo: "/images/products/paradyz-burlington-rust/photo_1.png"
      },
      {
        id: "paradyz-burlington-silver",
        color: "Серебристый",
        color_hex: "#B4B3AE",
        photo: "/images/products/paradyz-burlington-silver/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-burlington-ivory",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "BURLINGTON IVORY",
    sku: "5902610587627",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "IVORY",
      color_hex: "#9A8F80",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-burlington-ivory/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz BURLINGTON IVORY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz BURLINGTON IVORY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz BURLINGTON IVORY"
    },
    variants: [
      {
        id: "paradyz-burlington-blue",
        color: "BLUE",
        color_hex: "#4A5A6B",
        photo: "/images/products/paradyz-burlington-blue/photo_1.png"
      },
      {
        id: "paradyz-burlington-ivory",
        color: "IVORY",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-burlington-ivory/photo_1.png"
      },
      {
        id: "paradyz-burlington-rust",
        color: "Ржавый",
        color_hex: "#A8502F",
        photo: "/images/products/paradyz-burlington-rust/photo_1.png"
      },
      {
        id: "paradyz-burlington-silver",
        color: "Серебристый",
        color_hex: "#B4B3AE",
        photo: "/images/products/paradyz-burlington-silver/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-burlington-rust",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "BURLINGTON RUST",
    sku: "5902610587641",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Ржавый",
      color_hex: "#A8502F",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-burlington-rust/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz BURLINGTON RUST — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz BURLINGTON RUST: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz BURLINGTON RUST"
    },
    variants: [
      {
        id: "paradyz-burlington-blue",
        color: "BLUE",
        color_hex: "#4A5A6B",
        photo: "/images/products/paradyz-burlington-blue/photo_1.png"
      },
      {
        id: "paradyz-burlington-ivory",
        color: "IVORY",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-burlington-ivory/photo_1.png"
      },
      {
        id: "paradyz-burlington-rust",
        color: "Ржавый",
        color_hex: "#A8502F",
        photo: "/images/products/paradyz-burlington-rust/photo_1.png"
      },
      {
        id: "paradyz-burlington-silver",
        color: "Серебристый",
        color_hex: "#B4B3AE",
        photo: "/images/products/paradyz-burlington-silver/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-burlington-silver",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "BURLINGTON SILVER",
    sku: "5902610587665",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Серебристый",
      color_hex: "#B4B3AE",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-burlington-silver/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz BURLINGTON SILVER — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz BURLINGTON SILVER: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz BURLINGTON SILVER"
    },
    variants: [
      {
        id: "paradyz-burlington-blue",
        color: "BLUE",
        color_hex: "#4A5A6B",
        photo: "/images/products/paradyz-burlington-blue/photo_1.png"
      },
      {
        id: "paradyz-burlington-ivory",
        color: "IVORY",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-burlington-ivory/photo_1.png"
      },
      {
        id: "paradyz-burlington-rust",
        color: "Ржавый",
        color_hex: "#A8502F",
        photo: "/images/products/paradyz-burlington-rust/photo_1.png"
      },
      {
        id: "paradyz-burlington-silver",
        color: "Серебристый",
        color_hex: "#B4B3AE",
        photo: "/images/products/paradyz-burlington-silver/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-cementech-eclipse",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "CEMENTECH ECLIPSE",
    sku: "5900139004474",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "ECLIPSE",
      color_hex: "#9A8F80"
    },
    photos: [

    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz CEMENTECH ECLIPSE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz CEMENTECH ECLIPSE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz CEMENTECH ECLIPSE"
    },
    variants: [
      {
        id: "paradyz-cementech-eclipse",
        color: "ECLIPSE",
        color_hex: "#9A8F80",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-cementech-moon",
        color: "MOON",
        color_hex: "#9A8F80",
        photo: "/images/cat-slab.jpg"
      }
    ]
  },
  {
    id: "paradyz-cementech-moon",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "CEMENTECH MOON",
    sku: "5900139004475",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "MOON",
      color_hex: "#9A8F80"
    },
    photos: [

    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz CEMENTECH MOON — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz CEMENTECH MOON: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz CEMENTECH MOON"
    },
    variants: [
      {
        id: "paradyz-cementech-eclipse",
        color: "ECLIPSE",
        color_hex: "#9A8F80",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-cementech-moon",
        color: "MOON",
        color_hex: "#9A8F80",
        photo: "/images/cat-slab.jpg"
      }
    ]
  },
  {
    id: "paradyz-garden-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "GARDEN BEIGE",
    sku: "5902610587207",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-garden-beige/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz GARDEN BEIGE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz GARDEN BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz GARDEN BEIGE"
    },
    variants: [
      {
        id: "paradyz-garden-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-garden-beige/photo_1.png"
      },
      {
        id: "paradyz-garden-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-garden-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-garden-grys",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "GARDEN GRYS",
    sku: "5902610587245",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-garden-grys/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz GARDEN GRYS — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz GARDEN GRYS: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz GARDEN GRYS"
    },
    variants: [
      {
        id: "paradyz-garden-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-garden-beige/photo_1.png"
      },
      {
        id: "paradyz-garden-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-garden-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-ingastone-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "INGASTONE BEIGE",
    sku: "5900139004476",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C"
    },
    photos: [

    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz INGASTONE BEIGE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz INGASTONE BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz INGASTONE BEIGE"
    },
    variants: [
      {
        id: "paradyz-ingastone-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-ingastone-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-ingastone-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/cat-slab.jpg"
      }
    ]
  },
  {
    id: "paradyz-ingastone-brown",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "INGASTONE BROWN",
    sku: "5900139004477",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33"
    },
    photos: [

    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz INGASTONE BROWN — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz INGASTONE BROWN: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz INGASTONE BROWN"
    },
    variants: [
      {
        id: "paradyz-ingastone-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-ingastone-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-ingastone-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/cat-slab.jpg"
      }
    ]
  },
  {
    id: "paradyz-ingastone-grey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "INGASTONE GREY",
    sku: "5900139004478",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86"
    },
    photos: [

    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz INGASTONE GREY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz INGASTONE GREY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz INGASTONE GREY"
    },
    variants: [
      {
        id: "paradyz-ingastone-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-ingastone-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-ingastone-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/cat-slab.jpg"
      }
    ]
  },
  {
    id: "paradyz-ingastone-light-grey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "INGASTONE LIGHT GREY",
    sku: "5900139004479",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "LIGHT GREY",
      color_hex: "#D6C6AC"
    },
    photos: [

    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz INGASTONE LIGHT GREY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz INGASTONE LIGHT GREY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz INGASTONE LIGHT GREY"
    }
  },
  {
    id: "paradyz-magnetik-antracite",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "MAGNETIK ANTRACITE",
    sku: "5900139013337",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Антрацит",
      color_hex: "#3A3C3B",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-magnetik-antracite/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz MAGNETIK ANTRACITE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz MAGNETIK ANTRACITE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz MAGNETIK ANTRACITE"
    },
    variants: [
      {
        id: "paradyz-magnetik-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-magnetik-antracite/texture.jpg"
      },
      {
        id: "paradyz-magnetik-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-magnetik-beige/texture.jpg"
      },
      {
        id: "paradyz-magnetik-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-magnetik-bianco/texture.jpg"
      },
      {
        id: "paradyz-magnetik-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-magnetik-brown/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-magnetik-grafit/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-magnetik-grys/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-magnetik-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "MAGNETIK BEIGE",
    sku: "5900139013351",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-magnetik-beige/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz MAGNETIK BEIGE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz MAGNETIK BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz MAGNETIK BEIGE"
    },
    variants: [
      {
        id: "paradyz-magnetik-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-magnetik-antracite/texture.jpg"
      },
      {
        id: "paradyz-magnetik-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-magnetik-beige/texture.jpg"
      },
      {
        id: "paradyz-magnetik-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-magnetik-bianco/texture.jpg"
      },
      {
        id: "paradyz-magnetik-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-magnetik-brown/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-magnetik-grafit/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-magnetik-grys/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-magnetik-bianco",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "MAGNETIK BIANCO",
    sku: "5900139011487",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Белый",
      color_hex: "#E4DED2",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-magnetik-bianco/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz MAGNETIK BIANCO — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz MAGNETIK BIANCO: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz MAGNETIK BIANCO"
    },
    variants: [
      {
        id: "paradyz-magnetik-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-magnetik-antracite/texture.jpg"
      },
      {
        id: "paradyz-magnetik-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-magnetik-beige/texture.jpg"
      },
      {
        id: "paradyz-magnetik-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-magnetik-bianco/texture.jpg"
      },
      {
        id: "paradyz-magnetik-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-magnetik-brown/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-magnetik-grafit/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-magnetik-grys/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-magnetik-brown",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "MAGNETIK BROWN",
    sku: "5900139011524",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Коричневый",
      color_hex: "#7A4B33",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-magnetik-brown/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz MAGNETIK BROWN — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz MAGNETIK BROWN: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz MAGNETIK BROWN"
    },
    variants: [
      {
        id: "paradyz-magnetik-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-magnetik-antracite/texture.jpg"
      },
      {
        id: "paradyz-magnetik-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-magnetik-beige/texture.jpg"
      },
      {
        id: "paradyz-magnetik-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-magnetik-bianco/texture.jpg"
      },
      {
        id: "paradyz-magnetik-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-magnetik-brown/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-magnetik-grafit/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-magnetik-grys/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-magnetik-grafit",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "MAGNETIK GRAFIT",
    sku: "5900139013382",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Графит",
      color_hex: "#4A4D4E",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-magnetik-grafit/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz MAGNETIK GRAFIT — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz MAGNETIK GRAFIT: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz MAGNETIK GRAFIT"
    },
    variants: [
      {
        id: "paradyz-magnetik-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-magnetik-antracite/texture.jpg"
      },
      {
        id: "paradyz-magnetik-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-magnetik-beige/texture.jpg"
      },
      {
        id: "paradyz-magnetik-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-magnetik-bianco/texture.jpg"
      },
      {
        id: "paradyz-magnetik-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-magnetik-brown/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-magnetik-grafit/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-magnetik-grys/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-magnetik-grys",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "MAGNETIK GRYS",
    sku: "5900139011548",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-magnetik-grys/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz MAGNETIK GRYS — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz MAGNETIK GRYS: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz MAGNETIK GRYS"
    },
    variants: [
      {
        id: "paradyz-magnetik-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-magnetik-antracite/texture.jpg"
      },
      {
        id: "paradyz-magnetik-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-magnetik-beige/texture.jpg"
      },
      {
        id: "paradyz-magnetik-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-magnetik-bianco/texture.jpg"
      },
      {
        id: "paradyz-magnetik-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-magnetik-brown/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-magnetik-grafit/texture.jpg"
      },
      {
        id: "paradyz-magnetik-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-magnetik-grys/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-minster-black",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "MINSTER BLACK",
    sku: "5900139009750",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      }
    ],
    specs: {
      surface: "structured",
      color: "Чёрный",
      color_hex: "#2E2E2C",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-minster-black/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz MINSTER BLACK — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz MINSTER BLACK: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz MINSTER BLACK"
    },
    variants: [
      {
        id: "paradyz-minster-black",
        color: "Чёрный",
        color_hex: "#2E2E2C",
        photo: "/images/products/paradyz-minster-black/photo_1.png"
      },
      {
        id: "paradyz-minster-rustic",
        color: "RUSTIC",
        color_hex: "#9A7B5F",
        photo: "/images/products/paradyz-minster-rustic/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-minster-rustic",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "MINSTER RUSTIC",
    sku: "5900139006889",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      }
    ],
    specs: {
      surface: "structured",
      color: "RUSTIC",
      color_hex: "#9A7B5F",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-minster-rustic/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz MINSTER RUSTIC — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz MINSTER RUSTIC: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz MINSTER RUSTIC"
    },
    variants: [
      {
        id: "paradyz-minster-black",
        color: "Чёрный",
        color_hex: "#2E2E2C",
        photo: "/images/products/paradyz-minster-black/photo_1.png"
      },
      {
        id: "paradyz-minster-rustic",
        color: "RUSTIC",
        color_hex: "#9A7B5F",
        photo: "/images/products/paradyz-minster-rustic/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-natural-rocks-basalt",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "NATURAL ROCKS BASALT",
    sku: "5900139006893",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "BASALT",
      color_hex: "#9A8F80"
    },
    photos: [
      "/images/products/paradyz-natural-rocks-basalt/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz NATURAL ROCKS BASALT — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz NATURAL ROCKS BASALT: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz NATURAL ROCKS BASALT"
    },
    variants: [
      {
        id: "paradyz-natural-rocks-basalt",
        color: "BASALT",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-natural-rocks-basalt/texture.jpg"
      },
      {
        id: "paradyz-natural-rocks-silver",
        color: "Серебристый",
        color_hex: "#B4B3AE",
        photo: "/images/products/paradyz-natural-rocks-silver/texture.jpg"
      },
      {
        id: "paradyz-natural-rocks-titan",
        color: "TITAN",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-natural-rocks-titan/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-natural-rocks-gold-sand",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "NATURAL ROCKS GOLD SAND",
    sku: "5900139006894",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "GOLD SAND",
      color_hex: "#C2A15A"
    },
    photos: [
      "/images/products/paradyz-natural-rocks-gold-sand/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz NATURAL ROCKS GOLD SAND — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz NATURAL ROCKS GOLD SAND: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz NATURAL ROCKS GOLD SAND"
    }
  },
  {
    id: "paradyz-natural-rocks-silver",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "NATURAL ROCKS SILVER",
    sku: "5900139006895",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Серебристый",
      color_hex: "#B4B3AE"
    },
    photos: [
      "/images/products/paradyz-natural-rocks-silver/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz NATURAL ROCKS SILVER — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz NATURAL ROCKS SILVER: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz NATURAL ROCKS SILVER"
    },
    variants: [
      {
        id: "paradyz-natural-rocks-basalt",
        color: "BASALT",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-natural-rocks-basalt/texture.jpg"
      },
      {
        id: "paradyz-natural-rocks-silver",
        color: "Серебристый",
        color_hex: "#B4B3AE",
        photo: "/images/products/paradyz-natural-rocks-silver/texture.jpg"
      },
      {
        id: "paradyz-natural-rocks-titan",
        color: "TITAN",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-natural-rocks-titan/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-natural-rocks-titan",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "NATURAL ROCKS TITAN",
    sku: "5900139006896",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "TITAN",
      color_hex: "#9A8F80"
    },
    photos: [
      "/images/products/paradyz-natural-rocks-titan/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz NATURAL ROCKS TITAN — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz NATURAL ROCKS TITAN: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz NATURAL ROCKS TITAN"
    },
    variants: [
      {
        id: "paradyz-natural-rocks-basalt",
        color: "BASALT",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-natural-rocks-basalt/texture.jpg"
      },
      {
        id: "paradyz-natural-rocks-silver",
        color: "Серебристый",
        color_hex: "#B4B3AE",
        photo: "/images/products/paradyz-natural-rocks-silver/texture.jpg"
      },
      {
        id: "paradyz-natural-rocks-titan",
        color: "TITAN",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-natural-rocks-titan/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-naturio-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "NATURIO BEIGE",
    sku: "5900139004480",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Бежевый",
      color_hex: "#C9B79C"
    },
    photos: [

    ],
    seo: {
      title: "Керамогранит под дерево Paradyz NATURIO BEIGE — цена, характеристики",
      description: "Керамогранит под дерево Paradyz NATURIO BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz NATURIO BEIGE"
    },
    variants: [
      {
        id: "paradyz-naturio-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/cat-wood.jpg"
      },
      {
        id: "paradyz-naturio-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/cat-wood.jpg"
      },
      {
        id: "paradyz-naturio-honey",
        color: "Медовый",
        color_hex: "#C98F4B",
        photo: "/images/cat-wood.jpg"
      }
    ]
  },
  {
    id: "paradyz-naturio-brown",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "NATURIO BROWN",
    sku: "5900139004481",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Коричневый",
      color_hex: "#7A4B33"
    },
    photos: [

    ],
    seo: {
      title: "Керамогранит под дерево Paradyz NATURIO BROWN — цена, характеристики",
      description: "Керамогранит под дерево Paradyz NATURIO BROWN: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz NATURIO BROWN"
    },
    variants: [
      {
        id: "paradyz-naturio-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/cat-wood.jpg"
      },
      {
        id: "paradyz-naturio-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/cat-wood.jpg"
      },
      {
        id: "paradyz-naturio-honey",
        color: "Медовый",
        color_hex: "#C98F4B",
        photo: "/images/cat-wood.jpg"
      }
    ]
  },
  {
    id: "paradyz-naturio-honey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "NATURIO HONEY",
    sku: "5900139004482",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Медовый",
      color_hex: "#C98F4B"
    },
    photos: [

    ],
    seo: {
      title: "Керамогранит под дерево Paradyz NATURIO HONEY — цена, характеристики",
      description: "Керамогранит под дерево Paradyz NATURIO HONEY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz NATURIO HONEY"
    },
    variants: [
      {
        id: "paradyz-naturio-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/cat-wood.jpg"
      },
      {
        id: "paradyz-naturio-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/cat-wood.jpg"
      },
      {
        id: "paradyz-naturio-honey",
        color: "Медовый",
        color_hex: "#C98F4B",
        photo: "/images/cat-wood.jpg"
      }
    ]
  },
  {
    id: "paradyz-naturio-light-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "NATURIO LIGHT BEIGE",
    sku: "5900139004483",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "LIGHT BEIGE",
      color_hex: "#D6C6AC"
    },
    photos: [

    ],
    seo: {
      title: "Керамогранит под дерево Paradyz NATURIO LIGHT BEIGE — цена, характеристики",
      description: "Керамогранит под дерево Paradyz NATURIO LIGHT BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz NATURIO LIGHT BEIGE"
    }
  },
  {
    id: "paradyz-optimal-antracite",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "OPTIMAL ANTRACITE",
    sku: "5902610587924",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Антрацит",
      color_hex: "#3A3C3B",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-optimal-antracite/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz OPTIMAL ANTRACITE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz OPTIMAL ANTRACITE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz OPTIMAL ANTRACITE"
    },
    variants: [
      {
        id: "paradyz-optimal-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-optimal-antracite/photo_1.png"
      },
      {
        id: "paradyz-optimal-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-optimal-beige/photo_1.png"
      },
      {
        id: "paradyz-optimal-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-optimal-grafit/photo_1.png"
      },
      {
        id: "paradyz-optimal-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-optimal-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-optimal-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "OPTIMAL BEIGE",
    sku: "5902610587979",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-optimal-beige/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz OPTIMAL BEIGE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz OPTIMAL BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz OPTIMAL BEIGE"
    },
    variants: [
      {
        id: "paradyz-optimal-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-optimal-antracite/photo_1.png"
      },
      {
        id: "paradyz-optimal-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-optimal-beige/photo_1.png"
      },
      {
        id: "paradyz-optimal-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-optimal-grafit/photo_1.png"
      },
      {
        id: "paradyz-optimal-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-optimal-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-optimal-grafit",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "OPTIMAL GRAFIT",
    sku: "5902610588075",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Графит",
      color_hex: "#4A4D4E",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-optimal-grafit/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz OPTIMAL GRAFIT — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz OPTIMAL GRAFIT: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz OPTIMAL GRAFIT"
    },
    variants: [
      {
        id: "paradyz-optimal-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-optimal-antracite/photo_1.png"
      },
      {
        id: "paradyz-optimal-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-optimal-beige/photo_1.png"
      },
      {
        id: "paradyz-optimal-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-optimal-grafit/photo_1.png"
      },
      {
        id: "paradyz-optimal-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-optimal-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-optimal-grys",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "OPTIMAL GRYS",
    sku: "5902610588020",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x895",
        size_mm: "595x895x20",
        thickness_mm: 20,
        weight_kg: 22.45,
        per_sqm: 1.877,
        per_pallet: 42,
        price_rub_pcs: 3330,
        price_rub_sqm: 6250
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-optimal-grys/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz OPTIMAL GRYS — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz OPTIMAL GRYS: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz OPTIMAL GRYS"
    },
    variants: [
      {
        id: "paradyz-optimal-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-optimal-antracite/photo_1.png"
      },
      {
        id: "paradyz-optimal-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-optimal-beige/photo_1.png"
      },
      {
        id: "paradyz-optimal-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-optimal-grafit/photo_1.png"
      },
      {
        id: "paradyz-optimal-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-optimal-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-path-antracite",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "PATH ANTRACITE",
    sku: "5902610587122",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Антрацит",
      color_hex: "#3A3C3B",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-path-antracite/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz PATH ANTRACITE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz PATH ANTRACITE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz PATH ANTRACITE"
    },
    variants: [
      {
        id: "paradyz-path-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-path-antracite/photo_1.png"
      },
      {
        id: "paradyz-path-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-path-beige/photo_1.png"
      },
      {
        id: "paradyz-path-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-path-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-path-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "PATH BEIGE",
    sku: "5902610586835",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-path-beige/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz PATH BEIGE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz PATH BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz PATH BEIGE"
    },
    variants: [
      {
        id: "paradyz-path-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-path-antracite/photo_1.png"
      },
      {
        id: "paradyz-path-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-path-beige/photo_1.png"
      },
      {
        id: "paradyz-path-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-path-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-path-grys",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "PATH GRYS",
    sku: "5902610587160",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-path-grys/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz PATH GRYS — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz PATH GRYS: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz PATH GRYS"
    },
    variants: [
      {
        id: "paradyz-path-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/products/paradyz-path-antracite/photo_1.png"
      },
      {
        id: "paradyz-path-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-path-beige/photo_1.png"
      },
      {
        id: "paradyz-path-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-path-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-pure-art-basalt",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "PURE ART BASALT",
    sku: "5902610586774",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "BASALT",
      color_hex: "#9A8F80"
    },
    photos: [
      "/images/products/paradyz-pure-art-basalt/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz PURE ART BASALT — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz PURE ART BASALT: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz PURE ART BASALT"
    },
    variants: [
      {
        id: "paradyz-pure-art-basalt",
        color: "BASALT",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-pure-art-basalt/texture.jpg"
      },
      {
        id: "paradyz-pure-art-greige",
        color: "GREIGE",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-pure-art-greige/texture.jpg"
      },
      {
        id: "paradyz-pure-art-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-pure-art-grey/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-pure-art-dark-grey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "PURE ART DARK GREY",
    sku: "5904584152870",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "DARK GREY",
      color_hex: "#5A4636"
    },
    photos: [
      "/images/products/paradyz-pure-art-dark-grey/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz PURE ART DARK GREY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz PURE ART DARK GREY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz PURE ART DARK GREY"
    }
  },
  {
    id: "paradyz-pure-art-greige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "PURE ART GREIGE",
    sku: "5902610586934",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "GREIGE",
      color_hex: "#9A8F80"
    },
    photos: [
      "/images/products/paradyz-pure-art-greige/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz PURE ART GREIGE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz PURE ART GREIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz PURE ART GREIGE"
    },
    variants: [
      {
        id: "paradyz-pure-art-basalt",
        color: "BASALT",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-pure-art-basalt/texture.jpg"
      },
      {
        id: "paradyz-pure-art-greige",
        color: "GREIGE",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-pure-art-greige/texture.jpg"
      },
      {
        id: "paradyz-pure-art-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-pure-art-grey/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-pure-art-grey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "PURE ART GREY",
    sku: "5902610503023",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86"
    },
    photos: [
      "/images/products/paradyz-pure-art-grey/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz PURE ART GREY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz PURE ART GREY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz PURE ART GREY"
    },
    variants: [
      {
        id: "paradyz-pure-art-basalt",
        color: "BASALT",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-pure-art-basalt/texture.jpg"
      },
      {
        id: "paradyz-pure-art-greige",
        color: "GREIGE",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-pure-art-greige/texture.jpg"
      },
      {
        id: "paradyz-pure-art-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-pure-art-grey/texture.jpg"
      }
    ]
  },
  {
    id: "paradyz-ritual-grey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "RITUAL GREY",
    sku: "5900139004809",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-ritual-grey/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz RITUAL GREY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz RITUAL GREY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz RITUAL GREY"
    },
    variants: [
      {
        id: "paradyz-ritual-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-ritual-grey/photo_1.png"
      },
      {
        id: "paradyz-ritual-taupe",
        color: "TAUPE",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-ritual-taupe/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-ritual-light-grey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "RITUAL LIGHT GREY",
    sku: "5900139004823",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "LIGHT GREY",
      color_hex: "#D6C6AC",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-ritual-light-grey/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz RITUAL LIGHT GREY — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz RITUAL LIGHT GREY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz RITUAL LIGHT GREY"
    }
  },
  {
    id: "paradyz-ritual-taupe",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "RITUAL TAUPE",
    sku: "5900139004847",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "TAUPE",
      color_hex: "#9A8F80",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-ritual-taupe/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz RITUAL TAUPE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz RITUAL TAUPE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz RITUAL TAUPE"
    },
    variants: [
      {
        id: "paradyz-ritual-grey",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-ritual-grey/photo_1.png"
      },
      {
        id: "paradyz-ritual-taupe",
        color: "TAUPE",
        color_hex: "#9A8F80",
        photo: "/images/products/paradyz-ritual-taupe/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-rustic-gold",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "RUSTIC GOLD —",
    sku: "5902610503054",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "—",
      color_hex: "#9A8F80"
    },
    photos: [
      "/images/products/paradyz-rustic-gold/texture.jpg"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz RUSTIC GOLD — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz RUSTIC GOLD: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz RUSTIC GOLD"
    }
  },
  {
    id: "paradyz-rustland-brown",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "RUSTLAND BROWN",
    sku: "5900139004311",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Коричневый",
      color_hex: "#7A4B33",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-rustland-brown/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz RUSTLAND BROWN — цена, характеристики",
      description: "Керамогранит под дерево Paradyz RUSTLAND BROWN: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz RUSTLAND BROWN"
    },
    variants: [
      {
        id: "paradyz-rustland-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-rustland-brown/photo_1.png"
      },
      {
        id: "paradyz-rustland-naturale",
        color: "Натуральный",
        color_hex: "#C09A6B",
        photo: "/images/products/paradyz-rustland-naturale/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-rustland-naturale",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "RUSTLAND NATURALE",
    sku: "5900139009354",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Натуральный",
      color_hex: "#C09A6B",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-rustland-naturale/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz RUSTLAND NATURALE — цена, характеристики",
      description: "Керамогранит под дерево Paradyz RUSTLAND NATURALE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz RUSTLAND NATURALE"
    },
    variants: [
      {
        id: "paradyz-rustland-brown",
        color: "Коричневый",
        color_hex: "#7A4B33",
        photo: "/images/products/paradyz-rustland-brown/photo_1.png"
      },
      {
        id: "paradyz-rustland-naturale",
        color: "Натуральный",
        color_hex: "#C09A6B",
        photo: "/images/products/paradyz-rustland-naturale/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-salado-antracite",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "SALADO ANTRACITE",
    sku: "5900139004485",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Антрацит",
      color_hex: "#3A3C3B"
    },
    photos: [

    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz SALADO ANTRACITE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz SALADO ANTRACITE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz SALADO ANTRACITE"
    },
    variants: [
      {
        id: "paradyz-salado-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-salado-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/cat-slab.jpg"
      }
    ]
  },
  {
    id: "paradyz-salado-grys",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "SALADO GRYS",
    sku: "5900139004486",
    active: false,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      },
      {
        code: "595x1195",
        size_mm: "595x1195x20",
        thickness_mm: 20,
        weight_kg: 30.82,
        per_sqm: 1.41,
        per_pallet: 30,
        price_rub_pcs: 4504,
        price_rub_sqm: 6350
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86"
    },
    photos: [

    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz SALADO GRYS — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz SALADO GRYS: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz SALADO GRYS"
    },
    variants: [
      {
        id: "paradyz-salado-antracite",
        color: "Антрацит",
        color_hex: "#3A3C3B",
        photo: "/images/cat-slab.jpg"
      },
      {
        id: "paradyz-salado-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/cat-slab.jpg"
      }
    ]
  },
  {
    id: "paradyz-sherwood-bianco",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "SHERWOOD BIANCO",
    sku: "5902610578861",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Белый",
      color_hex: "#E4DED2"
    },
    photos: [
      "/images/products/paradyz-sherwood-bianco/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz SHERWOOD BIANCO — цена, характеристики",
      description: "Керамогранит под дерево Paradyz SHERWOOD BIANCO: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz SHERWOOD BIANCO"
    },
    variants: [
      {
        id: "paradyz-sherwood-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-sherwood-bianco/photo_1.png"
      },
      {
        id: "paradyz-sherwood-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-sherwood-grys/photo_1.png"
      },
      {
        id: "paradyz-sherwood-naturale",
        color: "Натуральный",
        color_hex: "#C09A6B",
        photo: "/images/products/paradyz-sherwood-naturale/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-sherwood-grys",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "SHERWOOD GRYS",
    sku: "5902610578885",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Серый",
      color_hex: "#8A8A86"
    },
    photos: [
      "/images/products/paradyz-sherwood-grys/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz SHERWOOD GRYS — цена, характеристики",
      description: "Керамогранит под дерево Paradyz SHERWOOD GRYS: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz SHERWOOD GRYS"
    },
    variants: [
      {
        id: "paradyz-sherwood-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-sherwood-bianco/photo_1.png"
      },
      {
        id: "paradyz-sherwood-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-sherwood-grys/photo_1.png"
      },
      {
        id: "paradyz-sherwood-naturale",
        color: "Натуральный",
        color_hex: "#C09A6B",
        photo: "/images/products/paradyz-sherwood-naturale/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-sherwood-naturale",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "SHERWOOD NATURALE",
    sku: "5902610578908",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Натуральный",
      color_hex: "#C09A6B",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-sherwood-naturale/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz SHERWOOD NATURALE — цена, характеристики",
      description: "Керамогранит под дерево Paradyz SHERWOOD NATURALE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz SHERWOOD NATURALE"
    },
    variants: [
      {
        id: "paradyz-sherwood-bianco",
        color: "Белый",
        color_hex: "#E4DED2",
        photo: "/images/products/paradyz-sherwood-bianco/photo_1.png"
      },
      {
        id: "paradyz-sherwood-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-sherwood-grys/photo_1.png"
      },
      {
        id: "paradyz-sherwood-naturale",
        color: "Натуральный",
        color_hex: "#C09A6B",
        photo: "/images/products/paradyz-sherwood-naturale/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-terrace-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "TERRACE BEIGE",
    sku: "5902610586996",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Бежевый",
      color_hex: "#C9B79C",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-terrace-beige/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz TERRACE BEIGE — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz TERRACE BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz TERRACE BEIGE"
    },
    variants: [
      {
        id: "paradyz-terrace-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-terrace-beige/photo_1.png"
      },
      {
        id: "paradyz-terrace-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-terrace-grafit/photo_1.png"
      },
      {
        id: "paradyz-terrace-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-terrace-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-terrace-grafit",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "TERRACE GRAFIT",
    sku: "5902610587078",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Графит",
      color_hex: "#4A4D4E",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-terrace-grafit/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz TERRACE GRAFIT — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz TERRACE GRAFIT: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz TERRACE GRAFIT"
    },
    variants: [
      {
        id: "paradyz-terrace-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-terrace-beige/photo_1.png"
      },
      {
        id: "paradyz-terrace-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-terrace-grafit/photo_1.png"
      },
      {
        id: "paradyz-terrace-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-terrace-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-terrace-grys",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "terrasnye-plastiny",
    collection: "TERRACE GRYS",
    sku: "5902610587030",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "595x595",
        size_mm: "595x595x20",
        thickness_mm: 20,
        weight_kg: 15,
        per_sqm: 2.83,
        per_pallet: 60,
        price_rub_pcs: 1767,
        price_rub_sqm: 5000
      }
    ],
    specs: {
      surface: "structured",
      color: "Серый",
      color_hex: "#8A8A86",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-terrace-grys/photo_1.png"
    ],
    seo: {
      title: "Террасные пластины 20 мм Paradyz TERRACE GRYS — цена, характеристики",
      description: "Террасные пластины 20 мм Paradyz TERRACE GRYS: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Террасные пластины 20 мм Paradyz TERRACE GRYS"
    },
    variants: [
      {
        id: "paradyz-terrace-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-terrace-beige/photo_1.png"
      },
      {
        id: "paradyz-terrace-grafit",
        color: "Графит",
        color_hex: "#4A4D4E",
        photo: "/images/products/paradyz-terrace-grafit/photo_1.png"
      },
      {
        id: "paradyz-terrace-grys",
        color: "Серый",
        color_hex: "#8A8A86",
        photo: "/images/products/paradyz-terrace-grys/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-trueland-gold",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "TRUELAND GOLD",
    sku: "5902610590122",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Золотистый",
      color_hex: "#C2A15A",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-trueland-gold/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz TRUELAND GOLD — цена, характеристики",
      description: "Керамогранит под дерево Paradyz TRUELAND GOLD: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz TRUELAND GOLD"
    },
    variants: [
      {
        id: "paradyz-trueland-gold",
        color: "Золотистый",
        color_hex: "#C2A15A",
        photo: "/images/products/paradyz-trueland-gold/photo_1.png"
      },
      {
        id: "paradyz-trueland-honey",
        color: "Медовый",
        color_hex: "#C98F4B",
        photo: "/images/products/paradyz-trueland-honey/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-trueland-honey",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "TRUELAND HONEY",
    sku: "5900139004410",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Медовый",
      color_hex: "#C98F4B",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-trueland-honey/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz TRUELAND HONEY — цена, характеристики",
      description: "Керамогранит под дерево Paradyz TRUELAND HONEY: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz TRUELAND HONEY"
    },
    variants: [
      {
        id: "paradyz-trueland-gold",
        color: "Золотистый",
        color_hex: "#C2A15A",
        photo: "/images/products/paradyz-trueland-gold/photo_1.png"
      },
      {
        id: "paradyz-trueland-honey",
        color: "Медовый",
        color_hex: "#C98F4B",
        photo: "/images/products/paradyz-trueland-honey/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-willow-beige",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "WILLOW BEIGE",
    sku: "5900139004458",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Бежевый",
      color_hex: "#C9B79C",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-willow-beige/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz WILLOW BEIGE — цена, характеристики",
      description: "Керамогранит под дерево Paradyz WILLOW BEIGE: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz WILLOW BEIGE"
    },
    variants: [
      {
        id: "paradyz-willow-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-willow-beige/photo_1.png"
      },
      {
        id: "paradyz-willow-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-willow-ochra/photo_1.png"
      }
    ]
  },
  {
    id: "paradyz-willow-ochra",
    brand: "Paradyz",
    product_type: "slab",
    application: [
      "terrasa",
      "dorozhki",
      "landshaft-opory"
    ],
    category: "plastiny-pod-derevo",
    collection: "WILLOW OCHRA",
    sku: "5900139004472",
    active: true,
    price_updated_at: "2026-06-01",
    formats: [
      {
        code: "295x1195",
        size_mm: "295x1195x20",
        thickness_mm: 20,
        weight_kg: 15.41,
        per_sqm: 2.83,
        per_pallet: 64,
        price_rub_pcs: 2527,
        price_rub_sqm: 7150
      }
    ],
    specs: {
      surface: "wood",
      color: "Охра",
      color_hex: "#C7A45C",
      slip_resistance: "R11"
    },
    photos: [
      "/images/products/paradyz-willow-ochra/photo_1.png"
    ],
    seo: {
      title: "Керамогранит под дерево Paradyz WILLOW OCHRA — цена, характеристики",
      description: "Керамогранит под дерево Paradyz WILLOW OCHRA: розничная цена, поэлементный расчёт комплекта, доставка по России и СНГ.",
      h1: "Керамогранит под дерево Paradyz WILLOW OCHRA"
    },
    variants: [
      {
        id: "paradyz-willow-beige",
        color: "Бежевый",
        color_hex: "#C9B79C",
        photo: "/images/products/paradyz-willow-beige/photo_1.png"
      },
      {
        id: "paradyz-willow-ochra",
        color: "Охра",
        color_hex: "#C7A45C",
        photo: "/images/products/paradyz-willow-ochra/photo_1.png"
      }
    ]
  }
];
