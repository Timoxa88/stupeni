/**
 * Сборка шагов квиза из живого каталога.
 *
 * Принцип: ни одной картинки «специально под квиз». Сценарии берут кадры
 * страниц решений, элементы системы — фото самих элементов из карточек
 * (`el-<code>-<размер>.webp`), цвета — фото товара самой популярной группы.
 * Поэтому квиз не устаревает: сменились фото в каталоге — сменились и в квизе.
 *
 * Шагов шесть, седьмой (контакты) добавляет клиент — форма живёт в LeadForm
 * со всей валидацией и согласием 152-ФЗ.
 */

import { SOLUTIONS } from "@/lib/content/solutions";
import { activeProducts, basePrice, priceUnitLabel } from "@/lib/catalog/queries";
import { applications } from "@/lib/catalog/taxonomy";
import { COLOR_GROUP_HEX, colorGroupOf, facetsOf } from "@/lib/catalog/facets";
import { productTitle } from "@/lib/catalog/display";
import { plural } from "@/lib/format";
import type { ElementCode, Product } from "@/lib/catalog/types";
import type { QuizData, QuizOption, QuizStep } from "./types";

const positions = (n: number) => `${n} ${plural(n, "позиция", "позиции", "позиций")}`;

/** Paradyz — основной бренд со своими ценами и лучшими фото: его кадры первыми. */
function paradyzFirst(list: Product[]): Product[] {
  return [...list].sort((a, b) => Number(b.brand === "Paradyz") - Number(a.brand === "Paradyz"));
}

/** Фото элемента системы: первый товар, у которого этот код снят отдельным кадром. */
function elementPhoto(list: Product[], codes: ElementCode[]): { src?: string; alt?: string } {
  for (const p of list) {
    for (const e of p.elements ?? []) {
      if (codes.includes(e.code) && e.photo) {
        return { src: e.photo, alt: `${e.name} — ${p.brand} ${productTitle(p)}` };
      }
    }
  }
  return {};
}

const ELEMENT_CHOICES: { value: string; label: string; hint: string; codes: ElementCode[] }[] = [
  {
    value: "front",
    label: "Ступень с капиносом",
    hint: "готовая кромка с носиком",
    codes: ["front"],
  },
  {
    value: "front_notch",
    label: "Ступень с насечками",
    hint: "рельеф на лицевой, кромка подрезкой",
    codes: ["front_notch"],
  },
  {
    value: "corner",
    label: "Угловой элемент",
    hint: "для внешних углов марша",
    codes: ["corner_l", "corner_r", "corner_notch"],
  },
  {
    value: "base",
    label: "Базовая плитка, поле",
    hint: "площадка, терраса, дорожка",
    codes: ["base"],
  },
  {
    value: "riser",
    label: "Подступёнок",
    hint: "вертикальная часть ступени",
    codes: ["riser"],
  },
];

const CONDITION_OPTIONS: QuizOption[] = [
  { value: "street", label: "На улице, открыто", hint: "мороз, снег, наледь" },
  { value: "canopy", label: "Под навесом", hint: "крыльцо, веранда" },
  { value: "water", label: "У воды, бассейн", hint: "нужен класс R11–R12" },
  { value: "indoor", label: "В помещении", hint: "холл, лестница внутри" },
];

const ROLE_OPTIONS: QuizOption[] = [
  { value: "private", label: "Частное лицо" },
  { value: "builder", label: "Строительная компания" },
  { value: "architect", label: "Архитектор, дизайнер" },
  { value: "dealer", label: "Торгующая компания" },
];

const VOLUME_OPTIONS: QuizOption[] = [
  { value: "lt10", label: "До 10 м²", hint: "крыльцо в 3–5 ступеней" },
  { value: "10-30", label: "10–30 м²" },
  { value: "30-60", label: "30–60 м²" },
  { value: "gt60", label: "Больше 60 м²" },
];

export function buildQuiz(): QuizData {
  const all = activeProducts();
  const ordered = paradyzFirst(all);
  const facets = facetsOf(all, { sort: "recommended" });

  // 1. Сценарий: hero-кадры страниц решений — это фото готовых объектов.
  // cardImage сюда не годится: у крыльца это CGI-рендер способа укладки
  // (гребёнка клея), и на вопрос «что облицовываем?» он не отвечает.
  const appOptions: QuizOption[] = applications().map((a) => {
    const s = SOLUTIONS.find((x) => x.slug === a.code);
    return {
      value: a.code,
      label: a.title,
      hint: positions(a.count),
      image: s?.heroImage ?? a.image,
      imageAlt: s?.heroAlt ?? a.imageAlt,
    };
  });

  // 2. Элементы системы: показываем только те, что реально есть в каталоге.
  const elementOptions: QuizOption[] = ELEMENT_CHOICES.flatMap((c) => {
    const count = all.filter((p) =>
      (p.elements ?? []).some((e) => c.codes.includes(e.code)),
    ).length;
    if (count === 0) return [];
    const photo = elementPhoto(ordered, c.codes);
    return [
      {
        value: c.value,
        label: c.label,
        hint: `${c.hint} · ${positions(count)}`,
        image: photo.src,
        imageAlt: photo.alt ?? c.label,
      },
    ];
  });

  // 3. Цвет: витринные группы каталога, у каждой — фото реального товара.
  const colorOptions: QuizOption[] = facets.colors.map((c) => {
    const sample = ordered.find((p) => colorGroupOf(p) === c.value && p.photos[0]);
    return {
      value: c.value,
      label: c.label,
      hint: positions(c.count),
      image: sample?.photos[0],
      imageAlt: sample ? `${sample.brand} ${productTitle(sample)}` : c.label,
      swatch: COLOR_GROUP_HEX[c.value],
    };
  });

  const steps: QuizStep[] = [
    {
      key: "app",
      question: "Что облицовываем?",
      kind: "image",
      options: appOptions,
    },
    {
      key: "element",
      question: "Какие элементы нужны?",
      hint: "Ступень бывает двух исполнений: с капиносом — готовая кромка с носиком, с насечками — кромку формирует подрезка.",
      kind: "image",
      options: elementOptions,
      skippable: true,
    },
    {
      key: "color",
      question: "Какой цвет ищете?",
      kind: "image",
      options: colorOptions,
      skippable: true,
    },
    {
      key: "volume",
      question: "Какой примерный объём?",
      hint: "Точную цифру знать необязательно — комплект в штуках посчитает калькулятор.",
      kind: "volume",
      options: VOLUME_OPTIONS,
      skippable: true,
    },
    {
      key: "conditions",
      question: "Где будут использоваться?",
      kind: "choice",
      options: CONDITION_OPTIONS,
    },
    {
      key: "role",
      question: "Вы выступаете как:",
      kind: "choice",
      options: ROLE_OPTIONS,
    },
  ];

  // Подборка на финальном экране — только Paradyz (решение Кирилла 30.07.2026:
  // основной бренд со своими розничными ценами; остальные — через каталог).
  const pool = all
    .filter((p) => p.brand === "Paradyz")
    .map((p) => ({
      id: p.id,
      brand: p.brand,
      title: productTitle(p),
      photo: p.photos[0],
      price: basePrice(p),
      unit: priceUnitLabel(p),
      apps: p.application,
      color: colorGroupOf(p) ?? undefined,
      type: p.product_type,
    }));

  return { steps, pool };
}
