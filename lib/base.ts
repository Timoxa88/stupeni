/**
 * Базовый путь приложения (для деплоя на подпуть, напр. br2nd.tech/stupeni).
 * Задаётся при сборке через NEXT_PUBLIC_BASE_PATH (инлайнится Next в клиент).
 *
 * Next автоматически добавляет basePath к <Link>, next/image и /public-ассетам,
 * НО НЕ к ручным fetch()/sendBeacon() и сырым <a href="/...">. Для них — withBase.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Префиксует абсолютный путь базовым путём (для fetch и сырых ссылок). */
export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  if (BASE_PATH && path.startsWith(`${BASE_PATH}/`)) return path; // уже с префиксом
  return `${BASE_PATH}${path}`;
}
