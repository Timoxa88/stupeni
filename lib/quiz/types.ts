/**
 * Типы квиза-подбора. Модуль без импортов данных — безопасен для клиентских
 * компонентов (каталог в бандл не утягивает, ср. lib/catalog/hrefs.ts).
 *
 * Сами шаги собираются на сервере из живого каталога (lib/quiz/build.ts)
 * и отдаются клиенту по /api/quiz в момент открытия квиза: картинки вариантов —
 * это реальные фото сценариев, элементов системы и цветов, а не отдельный
 * набор ассетов, который пришлось бы поддерживать вручную.
 */

/** Вариант ответа. */
export interface QuizOption {
  value: string;
  label: string;
  /** Подпись мелким под названием (обычно «N позиций»). */
  hint?: string;
  image?: string;
  imageAlt?: string;
  /** Цветовой свотч — для шага выбора цвета (фолбэк, если фото нет). */
  swatch?: string;
}

/**
 * `image`  — плитки с фото (сценарий, элемент, цвет);
 * `choice` — текстовые варианты в один-два столбца;
 * `volume` — быстрые диапазоны + поле для точного объёма.
 */
export type QuizStepKind = "image" | "choice" | "volume";

export interface QuizStep {
  key: string;
  question: string;
  hint?: string;
  kind: QuizStepKind;
  options: QuizOption[];
  /** Показывать «Не знаю — подберите» (ответ необязателен). */
  skippable?: boolean;
}

/** Компактная карточка товара для итоговой подборки (в бандл каталог не тащим). */
export interface QuizPoolItem {
  id: string;
  brand: string;
  title: string;
  photo?: string;
  price: number;
  unit: string;
  /** Коды назначений (ApplicationCode). */
  apps: string[];
  /** Витринная цветовая группа (см. colorGroupOf). */
  color?: string;
  /** step_system | slab. */
  type: string;
}

export interface QuizData {
  steps: QuizStep[];
  pool: QuizPoolItem[];
}
