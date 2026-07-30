/**
 * Работа с элементами системы ступеней.
 *
 * Ключевое отличие от прежней модели: у одного кода может быть НЕСКОЛЬКО
 * элементов. Напольная плитка и ступень с насечками выпускаются в двух форматах
 * (300×300 и 600×300), это разные артикулы с разной ценой — раньше генератор
 * оставлял по одному элементу на код, и половина системы просто не доезжала
 * до карточки. Поэтому идентификатор элемента — пара код + размер.
 *
 * Модуль импортирует только типы: безопасен для клиентских компонентов.
 */

import type { ElementCode, Product, ProductElement } from "./types";

/** Порядок вывода в карточке: сначала кромка, потом добор, потом поле. */
export const ELEMENT_ORDER: ElementCode[] = [
  "front",
  "front_notch",
  "corner_l",
  "corner_r",
  "corner_notch",
  "riser",
  "base",
  "plinth",
];

/** Стабильный идентификатор элемента внутри товара. */
export function elementKey(e: ProductElement): string {
  return `${e.code}|${e.size_mm}`;
}

/** «300x300x8.5» → «300×300». Толщину в подпись не тащим — она в характеристиках. */
export function shortSize(size_mm: string): string {
  const [w, h] = size_mm.split(/[x×]/).map((v) => parseFloat(v));
  return w && h ? `${w}×${h}` : size_mm;
}

export function parseSize(size_mm: string): [number, number] {
  const [w, h] = size_mm.split(/[x×]/).map((v) => parseFloat(v));
  return [w || 0, h || 0];
}

/**
 * Подпись элемента для селектора. Размер дописывается только там, где он
 * различает элементы одного кода, — иначе в списке было бы две «Базовые плитки».
 */
export function elementLabel(e: ProductElement, all: ProductElement[]): string {
  const sameCode = all.filter((x) => x.code === e.code);
  return sameCode.length > 1 ? `${e.name}, ${shortSize(e.size_mm)}` : e.name;
}

/** Элементы товара в осмысленном порядке (крупный формат внутри кода — ниже). */
export function orderedElements(p: Product): ProductElement[] {
  return [...(p.elements ?? [])].sort((a, b) => {
    const d = ELEMENT_ORDER.indexOf(a.code) - ELEMENT_ORDER.indexOf(b.code);
    if (d !== 0) return d;
    const [aw, ah] = parseSize(a.size_mm);
    const [bw, bh] = parseSize(b.size_mm);
    return aw * ah - bw * bh;
  });
}

/**
 * Элемент товара по коду. Если кодов несколько (два формата плитки), берётся
 * меньший по площади — это базовый формат коллекции; калькулятор при этом
 * выбирает формат явно (см. baseElement).
 */
export function findElement(p: Product, code: ElementCode): ProductElement | undefined {
  return orderedElements(p).find((e) => e.code === code);
}

/** Все элементы данного кода (например, оба формата напольной плитки). */
export function elementsOf(p: Product, code: ElementCode): ProductElement[] {
  return orderedElements(p).filter((e) => e.code === code);
}

/** Исполнение фронтальной ступени: с капиносом (`front`) или с насечками. */
export type StepFrontType = "front" | "front_notch";

/**
 * Фронтальная ступень для расчёта. `prefer` — явный выбор исполнения
 * (у Paradyz коллекции обычно выпускают оба, и это разные цена и геометрия:
 * капиносная 330 мм / кромка 0,30 м, насечная — формат базовой плитки).
 * Без `prefer` приоритет у капиносной — это «настоящая» ступень системы;
 * насечная идёт в дело, только если капиносной у коллекции нет.
 */
export function frontElement(p: Product, prefer?: StepFrontType): ProductElement | undefined {
  if (prefer) {
    const hit = findElement(p, prefer);
    if (hit) return hit;
  }
  return findElement(p, "front") ?? findElement(p, "front_notch");
}

/** Исполнения фронтальной ступени, которые реально есть у артикула. */
export function stepFrontTypes(p: Product): StepFrontType[] {
  return (["front", "front_notch"] as const).filter((c) => !!findElement(p, c));
}

/** Угловая ступень: следует за исполнением фронтальной (капинос ↔ насечки). */
export function cornerElement(p: Product, prefer?: StepFrontType): ProductElement | undefined {
  if (prefer === "front_notch") {
    return (
      findElement(p, "corner_notch") ?? findElement(p, "corner_l") ?? findElement(p, "corner_r")
    );
  }
  return (
    findElement(p, "corner_l") ?? findElement(p, "corner_r") ?? findElement(p, "corner_notch")
  );
}

/** Напольная плитка выбранного формата (или базовая, если формат не задан). */
export function baseElement(p: Product, size_mm?: string): ProductElement | undefined {
  const list = elementsOf(p, "base");
  if (size_mm) {
    const hit = list.find((e) => e.size_mm === size_mm);
    if (hit) return hit;
  }
  return list[0];
}

/** Норма расхода плитки, шт/м²: из тех. листа, иначе из геометрии. */
export function perSqmOf(e: ProductElement | undefined): number | undefined {
  if (!e) return undefined;
  if (e.per_sqm && e.per_sqm > 0) return e.per_sqm;
  const [w, h] = parseSize(e.size_mm);
  return w > 0 && h > 0 ? 1 / ((w / 1000) * (h / 1000)) : undefined;
}
