import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Публичная оферта и условия",
  description: "Условия использования сайта Hit Ceramics и статус размещённой информации.",
  alternates: { canonical: "/offer" },
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-xl font-bold text-ink">{children}</h2>
);

export default function OfferPage() {
  return (
    <LegalLayout
      slug="offer"
      title="Условия и оферта"
      updated="18.06.2026"
      intro="Документ описывает статус информации на сайте и порядок взаимодействия с продавцом."
    >
      <H2>Статус информации о ценах</H2>
      <p>
        Информация о товарах и ценах, размещённая на сайте, носит справочный характер и{" "}
        <strong>не является публичной офертой</strong> (ст. 437 ГК РФ). Цены зависят от
        курса, партии и наличия и уточняются менеджером при оформлении заказа. Итоговая
        стоимость фиксируется в счёте.
      </p>
      <H2>Расчёт калькулятора</H2>
      <p>
        Результат онлайн-калькулятора является предварительной оценкой комплекта и расхода
        материалов и не является счётом или обязательством продавца. Точный состав
        подтверждает менеджер.
      </p>
      <H2>Продавец</H2>
      <p>
        {SITE.legal}, ИНН {SITE.inn}, ОГРН {SITE.ogrn}. Контакты: {SITE.email},
        {" "}+7 499 397-77-27 (Москва), +7 812 901-04-44 (Санкт-Петербург).
      </p>
      <H2>Заключение договора</H2>
      <p>
        Договор купли-продажи заключается после согласования состава заказа, цены и условий
        поставки. Порядок оплаты, доставки, возврата и обмена описан на странице{" "}
        <a href="/payment-delivery" className="font-semibold text-clinker">«Оплата и доставка»</a>.
      </p>
    </LegalLayout>
  );
}
