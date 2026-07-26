import Image, { type ImageProps } from "next/image";
import { withBase } from "@/lib/base";

/**
 * Обёртка next/image для деплоя на подпуть.
 *
 * Штатный загрузчик Next 16 передаёт `src` в оптимизатор как есть
 * (`/_next/image?url=/images/foo.jpg`), а оптимизатор ищет этот путь у самого
 * приложения — где при `basePath` его нет. Итог: 404-HTML вместо картинки → 400,
 * и на сайте не открывается ни одно изображение (проверено на br2nd.tech/stupeni).
 *
 * Здесь `src` заранее префиксуется basePath: `url=/stupeni/images/foo.jpg` → 200.
 * Кастомный `loaderFile` для этого не годится — он отключает встроенный
 * эндпоинт `/_next/image` (проверено: 404), т.е. убивает и оптимизацию.
 *
 * На проде со своим доменом BASE_PATH пуст и `withBase` ничего не меняет.
 * Правило: во всех компонентах использовать `Img`, а не `next/image` напрямую.
 */
export function Img({ src, alt, ...rest }: ImageProps) {
  const fixed = typeof src === "string" ? withBase(src) : src;
  return <Image src={fixed} alt={alt} {...rest} />;
}
