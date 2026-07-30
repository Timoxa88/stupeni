import { getFaq } from "@/lib/store/content";
import { HOME_FAQ } from "@/lib/content/faq";
import { saveFaqAction } from "../../content-actions";

export const dynamic = "force-dynamic";

export default async function AdminFaq({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const items = await getFaq("home");
  const isDefault = JSON.stringify(items) === JSON.stringify(HOME_FAQ);

  return (
    <div className="max-w-3xl">
      <h1 className="a-h1">FAQ главной</h1>
      <p className="a-muted mt-1 mb-6 max-w-3xl">
        Вопросы и ответы с главной страницы. Видимый текст размечается FAQPage Schema —
        поэтому формулировки важны для выдачи. Пустой вопрос или ответ удаляет пункт;
        полностью пустой список возвращает исходный FAQ проекта.
      </p>

      {saved ? (
        <div className="a-card a-card-pad mb-5 border-[#b9c6b3] bg-[#f2f6f0]">
          <p className="text-sm font-semibold text-[#3c5236]">✓ FAQ сохранён</p>
        </div>
      ) : null}

      <div className="a-card a-card-pad">
        <p className="a-muted mb-4 text-sm">
          {isDefault ? "Сейчас используется FAQ из кода проекта." : "FAQ переопределён из админки."}
        </p>
        <form action={saveFaqAction}>
          <input type="hidden" name="target" value="home" />
          <div className="grid gap-4">
            {[...items, { q: "", a: "" }, { q: "", a: "" }].map((it, i) => (
              <div key={i} className="grid gap-2">
                <input
                  name={`q-${i}`}
                  className="a-input font-semibold"
                  placeholder="Вопрос"
                  defaultValue={it.q}
                />
                <textarea name={`a-${i}`} className="a-textarea" placeholder="Ответ" defaultValue={it.a} />
              </div>
            ))}
          </div>
          <button className="a-btn a-btn-primary mt-4" type="submit">
            Сохранить FAQ
          </button>
        </form>
      </div>
    </div>
  );
}
