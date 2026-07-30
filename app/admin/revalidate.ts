import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Сброс кэша публичных страниц после правок в админке.
 * Страницы каталога — ISR (revalidate=60), но правку хочется видеть сразу.
 */
export function revalidateCatalog(): void {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/catalog/[app]", "page");
  revalidatePath("/catalog/[app]/[brand]", "page");
  revalidatePath("/catalog/[app]/[brand]/[collection]", "page");
  revalidatePath("/catalog/tovar/[id]", "page");
  revalidatePath("/terrasnyy-klinker");
  revalidatePath("/terrasnye-plastiny");
  revalidatePath("/plastiny-pod-derevo");
  revalidatePath("/producers/[slug]", "page");
  revalidatePath("/resheniya/[slug]", "page");
  revalidatePath("/podbor");
  revalidatePath("/sitemap.xml");
}

export function revalidateContent(): void {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/contacts");
  revalidatePath("/calculator");
}

export function revalidateBlog(): void {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}
