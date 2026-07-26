import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Заявление о доступности",
  description:
    "Заявление о доступности сайта Hit Ceramics: ГОСТ Р 52872-2019, WCAG 2.2 AA, клавиатурная навигация, контраст.",
  alternates: { canonical: "/accessibility" },
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-xl font-bold text-ink">{children}</h2>
);

export default function AccessibilityPage() {
  return (
    <LegalLayout
      slug="accessibility"
      title="Заявление о доступности"
      updated="18.06.2026"
      intro="Мы стремимся сделать сайт доступным для всех пользователей, включая людей с ограниченными возможностями."
    >
      <H2>Нормативная база</H2>
      <p>
        Сайт разрабатывается с ориентиром на ГОСТ Р 52872-2019 «Интернет-ресурсы и другая
        информация… Требования доступности» и международные рекомендации WCAG 2.2 уровня AA
        как способ их выполнения.
      </p>
      <H2>Что реализовано</H2>
      <p>
        Семантическая разметка и landmark-структура; ссылка «к содержимому»; клавиатурная
        навигация с видимым фокусом; диалоги с фокус-трапом и закрытием по Esc; контраст
        текста не ниже 4.5:1; альтернативный текст у изображений; учёт
        <code> prefers-reduced-motion</code>; целевые размеры интерактивных элементов не
        менее 24×24 px; фокус не перекрывается фиксированными панелями.
      </p>
      <H2>Обратная связь</H2>
      <p>
        Если вы столкнулись с барьером доступности, сообщите нам на {SITE.email} — мы
        оперативно исправим и при необходимости предоставим информацию в доступном формате.
      </p>
    </LegalLayout>
  );
}
