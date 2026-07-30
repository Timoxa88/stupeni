/**
 * Детерминированное «перемешивание с разнесением» для листингов каталога.
 *
 * Зачем: сгенерированный каталог лежит блоками — десятки позиций одного бренда
 * и одной коллекции подряд, листинг выглядит монотонной простынёй.
 *
 * Почему не Math.random(): порядок обязан совпадать между сборкой, SSR
 * динамических страниц и гидрацией, иначе пагинация по 24 теряет и дублирует
 * позиции между страницами (?page=N режет уже отсортированный массив).
 * Поэтому «случайность» — это FNV-хеш id: стабильная псевдослучайная
 * перестановка, одинаковая в любом окружении.
 *
 * Раскладка жадная, по корзинам «бренд|база коллекции»: соседям запрещена одна
 * коллекция (пока это выполнимо), при прочих равных предпочитаем сменить бренд
 * и черпаем из бо́льших корзин, чтобы хвост не упёрся в одну коллекцию.
 * Полная смена бренда на каждом шаге недостижима: Paradyz — больше половины
 * витрины, соседства минимизируются, но не исчезают.
 */

import type { Product } from "./types";
import { collectionBaseOf } from "./collection-base";

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Стабильно перемешивает список так, чтобы соседние карточки не были из одной
 *  коллекции и по возможности от разных брендов. Вход не мутирует.
 *
 *  База коллекции — общий модуль collection-base (siblings — в пределах
 *  переданного списка). Раньше здесь жила своя копия правила без серии Duro,
 *  и «Cloud Rosa Duro» с «Cloud Brown Duro» уходили в разные корзины — для
 *  taxonomy (и теста смежности) это одна коллекция «Cloud Duro». */
export function diversify(products: Product[]): Product[] {
  if (products.length < 3) return products;

  const collectionsByBrand = new Map<string, string[]>();
  for (const p of products) {
    const list = collectionsByBrand.get(p.brand) ?? [];
    list.push(p.collection);
    collectionsByBrand.set(p.brand, list);
  }
  const keyOf = (p: Product) =>
    `${p.brand}|${collectionBaseOf(p.collection, collectionsByBrand.get(p.brand) ?? [])}`;

  // Корзины; внутри корзины порядок тоже псевдослучайный (по хешу id).
  const buckets = new Map<string, Product[]>();
  const shuffled = [...products].sort(
    (a, b) => fnv1a("v1" + a.id) - fnv1a("v1" + b.id),
  );
  for (const p of shuffled) {
    const key = keyOf(p);
    const list = buckets.get(key) ?? [];
    list.push(p);
    buckets.set(key, list);
  }

  const out: Product[] = [];
  let prevKey = "";
  let prevBrand = "";
  while (out.length < products.length) {
    let bestKey = "";
    let bestScore = -1;
    for (const [key, items] of buckets) {
      if (items.length === 0) continue;
      const brand = key.slice(0, key.indexOf("|"));
      // Приоритеты строго разнесены по разрядам: другая коллекция ≫ другой
      // бренд ≫ размер корзины ≫ хеш-джиттер для разбиения точных ничьих.
      const score =
        (key !== prevKey ? 4_000_000 : 0) +
        (brand !== prevBrand ? 2_000_000 : 0) +
        items.length * 1_000 +
        (fnv1a(key + ":" + out.length) % 1_000);
      if (score > bestScore) {
        bestScore = score;
        bestKey = key;
      }
    }
    const items = buckets.get(bestKey)!;
    const p = items.shift()!;
    out.push(p);
    prevKey = bestKey;
    prevBrand = p.brand;
  }
  return out;
}
