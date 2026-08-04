import { NextResponse } from "next/server";
import { buildQuiz } from "@/lib/quiz/build";
import { primeOverrides } from "@/lib/store/products";

export const runtime = "nodejs";

/**
 * Данные квиза (шаги с картинками + компактная подборка товаров).
 *
 * Отдельным роутом, а не пропсами страницы: квиз висит на всех листингах
 * каталога, и вшивать ~15 КБ JSON в RSC-payload каждой из ~130 страниц ради
 * модалки, которую откроет меньшинство, незачем. Клиент запрашивает данные
 * в момент первого открытия и держит их в памяти вкладки.
 */
export async function GET() {
  await primeOverrides();
  return NextResponse.json(buildQuiz(), {
    // Каталог меняется правками из админки — минута, как у страниц (revalidate=60).
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
