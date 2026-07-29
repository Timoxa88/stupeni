/**
 * Отображаемое имя товара: «коллекция + цвет» без дублей.
 *
 * Данные каталога неровные: у части товаров цвет уже вшит в `collection`
 * («Eremite Crema» + specs.color «Crema» → на витрине выходило «Eremite Crema
 * Crema», а «Mattone Pietra Grafit» + «Графит» — латиница и кириллица одного
 * слова). Дубль ловим транслитерацией: если цвет (в латинице) уже стоит
 * в конце названия коллекции — второй раз его не печатаем.
 *
 * Модуль импортирует только типы — безопасен для клиентских компонентов.
 */

import type { Product } from "./types";

const CYR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .split("")
    .map((ch) => CYR[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Русские имена цветов, которыми генератор прайса подписал specs.color
 * (COLOR_RU в gen_paradyz_price.py), → латинское слово из имени коллекции.
 * Без этого «Eremite Beige» + «Бежевый» не распознавались как один цвет.
 * Ключи — уже в norm()-форме.
 */
const RU_TO_LAT: Record<string, string[]> = {
  "temnyy": ["dark"], "svetlyy": ["light"], "rzhavyy": ["rust"],
  "bezhevyy": ["beige"], "korichnevyy": ["brown", "marrone"], "ohra": ["ochra"],
  "seryy": ["grys", "grey"], "naturalnyy": ["naturale"], "belyy": ["bianco", "white"],
  "chernyy": ["nero", "black"], "grafit": ["grafit"], "serebristyy": ["silver"],
  "zolotistyy": ["gold"], "medovyy": ["honey"], "pesochnyy": ["sand"],
  "terrakota": ["terra"], "kotto": ["cotto"], "tundra": ["tundra"],
  "krasnyy": ["red", "rosso"], "antracit": ["antracite", "anthracite"],
  "rozovyy": ["rosa"], "kremovyy": ["crema", "cream"], "bazalt": ["bazalt"],
  "temno seryy": ["taupe"], "pod derevo": ["wood"],
};

/**
 * Цвет для витрины: пустая строка, если он уже назван в коллекции.
 *
 * Проверяем цвет по ВСЕМ словам коллекции, а не только по последнему: у серии
 * Duro цвет стоит в середине («Cloud Brown Duro»), и хвостовая проверка его не
 * находила — на витрине выходило «Cloud Brown Duro Коричневый».
 */
export function displayColor(p: Product): string {
  const color = p.specs.color?.trim();
  if (!color) return "";
  const c = norm(color);
  if (!c) return color;
  // пробелы по краям — чтобы «grey» не срабатывал внутри «greystone»
  const coll = ` ${norm(p.collection)} `;
  const candidates = [c, ...(RU_TO_LAT[c] ?? [])];
  for (const cand of candidates) {
    if (coll.includes(` ${cand} `)) return "";
  }
  return color;
}

/** «Коллекция + цвет» без дублирования («Eremite Crema», а не «Eremite Crema Crema»). */
export function productTitle(p: Product): string {
  const color = displayColor(p);
  return color ? `${p.collection} ${color}` : p.collection;
}
