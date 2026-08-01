/**
 * Длина <title> под выдачу.
 *
 * Яндекс и Google показывают ~65–70 символов, остальное режут многоточием.
 * У карточек товара сложилось «{тип} {бренд} {коллекция} {цвет} — цена,
 * характеристики» плюс шаблон лейаута « — Hit Ceramics» — на длинных немецких
 * названиях выходило до 108 символов, и в выдаче отваливался хвост вместе с
 * названием магазина.
 *
 * Подход: не режем строку посередине, а собираем самый информативный вариант,
 * который влезает в лимит. Приоритет — название товара, затем «цена»
 * (коммерческий интент), затем бренд сайта.
 */

export const TITLE_LIMIT = 70;

const SITE = "Hit Ceramics";
const SUFFIX = ` — ${SITE}`;

/** Убираем хвосты, которые скорее всего уже стоят в исходной строке. */
function stripTails(raw: string): string {
  return raw
    .replace(new RegExp(`\\s*[—–-]\\s*${SITE}\\s*$`, "i"), "")
    .replace(/\s*[—–-]\s*цена,\s*характеристики\s*$/i, "")
    .replace(/\s*[—–-]\s*цена\s*$/i, "")
    .trim();
}

/**
 * Возвращает готовый title (абсолютный — шаблон лейаута к нему уже не
 * применяется, поэтому в page.tsx его передавать как `title: { absolute }`).
 */
export function clampTitle(raw: string, limit = TITLE_LIMIT): string {
  const base = stripTails(raw);

  const candidates = [
    `${base} — цена, характеристики${SUFFIX}`,
    `${base} — цена${SUFFIX}`,
    `${base}${SUFFIX}`,
    `${base} — цена`,
    base,
  ];
  const fits = candidates.find((c) => c.length <= limit);
  if (fits) return fits;

  // Название само длиннее лимита — режем по границе слова, без «висящих» знаков.
  const cut = base.slice(0, limit - 1);
  const atWord = cut.slice(0, cut.lastIndexOf(" "));
  return `${(atWord.length > limit * 0.6 ? atWord : cut).replace(/[\s,;:—–-]+$/, "")}…`;
}
