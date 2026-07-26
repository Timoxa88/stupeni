"use client";

import { useState } from "react";
import { DOWNLOADS } from "@/lib/content/site";
import { LeadForm } from "@/components/forms/LeadForm";
import { withBase } from "@/lib/base";

/**
 * Хаб загрузок для архитекторов (ТЗ §6 блок 15). Тех. листы и каталоги —
 * свободно; BIM/CAD и текстуры — после лёгкой профи-регистрации
 * (Имя + Email + Компания), заявка → CRM с тегом «Профи-регистрация».
 */
export function ArchitectsHub() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <section id="architects" className="bg-graphite-deep text-sand scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <p className="eyebrow text-clinker-bright">Архитекторам и бюро</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
          Хаб профессиональных загрузок
        </h2>
        <p className="mt-4 max-w-2xl text-sand/80">
          BIM/CAD-узлы крыльца и лестницы, раскладки на опорах HILST, тех. листы,
          PDF-каталоги и текстуры для рендеров. Персональный менеджер и спец-цены на объём.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Загрузки */}
          <div className="grid gap-4 sm:grid-cols-2">
            {DOWNLOADS.map((group) => (
              <div key={group.group} className="rounded-card border border-sand/15 bg-sand/[0.05] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">{group.group}</h3>
                  {group.gated ? (
                    <span className="rounded-full bg-clinker/20 px-2.5 py-1 text-xs font-semibold text-clinker-bright">
                      профи
                    </span>
                  ) : (
                    <span className="rounded-full bg-sand/10 px-2.5 py-1 text-xs font-semibold text-sand/70">
                      свободно
                    </span>
                  )}
                </div>
                <ul className="mt-3 space-y-2">
                  {group.items.map((it) => {
                    const locked = group.gated && !unlocked;
                    return (
                      <li key={it.title} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-sand/85">
                          {it.title} <span className="text-sand/50">· {it.format}</span>
                        </span>
                        {locked ? (
                          <span className="shrink-0 text-sand/45" aria-label="Доступно после регистрации">
                            🔒
                          </span>
                        ) : (
                          <a href={withBase(it.url)} download className="shrink-0 font-semibold text-clinker-bright">
                            Скачать
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Профи-регистрация */}
          <div className="rounded-card bg-white/[0.06] p-6 sm:p-8">
            {unlocked ? (
              <div className="text-center">
                <h3 className="font-display text-xl font-bold text-sand">Доступ открыт ✓</h3>
                <p className="mt-2 text-sand/80">
                  BIM/CAD-модели и текстуры разблокированы. Персональный менеджер
                  свяжется по спец-ценам на объём.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl font-bold text-sand">Профи-регистрация</h3>
                <p className="mt-1.5 text-sm text-sand/75">
                  Откроет доступ к BIM/CAD и текстурам. Тех. листы и каталоги — без регистрации.
                </p>
                <div className="mt-4">
                  <LeadForm
                    tag="Профи-регистрация"
                    variant="dark"
                    fields={["email", "company"]}
                    submitLabel="Открыть доступ"
                    successText="Доступ открыт. Файлы BIM/CAD и текстуры теперь доступны для скачивания."
                    onSuccess={() => setUnlocked(true)}
                    comment="Профи-регистрация (хаб загрузок)"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
