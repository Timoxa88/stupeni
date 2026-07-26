# Hit Ceramics — лендинг клинкерных ступеней и террасного керамогранита

Реализация по ТЗ [`docs/tz_landing_steps_slabs.md`](docs/tz_landing_steps_slabs.md) (v1.1).

**Стек:** Next.js 16 (App Router, SSR/SSG для SEO) · TypeScript · Tailwind CSS 4 · Bun · React 19.

## Запуск

```bash
bun install
bun run dev        # http://localhost:3000
bun test           # тесты движка калькулятора
bun run build      # прод-сборка
```

Скопируйте `.env.example` → `.env.local` и заполните вебхук Битрикс24 (без него
заявки пишутся в лог сервера).

## Что уже сделано

| Область | Статус | Где |
|---|---|---|
| Дизайн-система (направление B, ТЗ §5) | ✅ | [`app/globals.css`](app/globals.css), [`app/layout.tsx`](app/layout.tsx) |
| **Движок калькулятора, Режим A** (ступени, марши, поэлементно, §9.1) | ✅ | [`lib/calculator/mode-a.ts`](lib/calculator/mode-a.ts) |
| **Движок калькулятора, Режим B** (терраса, клей/опоры HILST, §9.2) | ✅ | [`lib/calculator/mode-b.ts`](lib/calculator/mode-b.ts) |
| Справочники: HILST LIFT, FLOOR_MATS, нормы плитки (§8.3, §9.2.4, §9.3) | ✅ | [`lib/calculator/reference.ts`](lib/calculator/reference.ts) |
| Тесты против примеров §9.1.4 / §9.2.7 / §9.2.8 | ✅ 17/17 | [`lib/calculator/calculator.test.ts`](lib/calculator/calculator.test.ts) |
| Интерактивный калькулятор (2 режима, город, реактивно) | ✅ | [`components/calculator/`](components/calculator/) |
| Схема товара + сид-каталог + адаптеры (§17) | ✅ | [`lib/catalog/`](lib/catalog/) |
| Интеграция Битрикс24 (лид, UTM, honeypot, rate-limit) (§12, §15) | ✅ | [`lib/bitrix.ts`](lib/bitrix.ts), [`app/api/lead/route.ts`](app/api/lead/route.ts) |
| Главный лендинг (hero, категории, счётчики, преимущества, решения, CTA) | ✅ частично | [`app/page.tsx`](app/page.tsx) |

Калькулятор — главный дифференциатор по ТЗ — реализован и **поэлементно сверен с
расчётными примерами из документа** (см. тесты).

## Ещё не сделано (следующие итерации)

- Страницы категорий (3), решений (6), брендов (6) — шаблоны под уникальный контент.
- Карточка товара (динамика по элементу/формату), витрина-каталог, сравнение.
- Headless CMS (Strapi/Directus) + CSV-импорт цен (§13).
- Квиз, карта объектов (Яндекс.Карты), видео-герой, блог + HowTo (§11).
- Schema.org, sitemap.xml, robots.txt для AI-краулеров (§4).
- v2: 3D-визуализатор (Replicate), PDF (jsPDF), Telegram-бот, sticky-калькулятор.

## Ответы по TBD (от заказчика)

1. **Домен** — пока не определён (`metadataBase` — заглушка в [`app/layout.tsx`](app/layout.tsx)).
2. **Монтаж/замер компания сама не оказывает** → на странице услуг (§10) эти
   пункты подавать как «через проверенных подрядчиков» либо убрать; ничего
   лишнего не обещать.
3. **Счётчики:** бренды считаются из списка ([`lib/catalog/brands.ts`](lib/catalog/brands.ts),
   `BRANDS_COUNT`), не хардкодятся; объекты — спарсим и добавим позже.
4. **Цены опор HILST LIFT Self-Leveling** (HL0–HL10) перенесены с
   [hilst.ru](https://hilst.ru/product/reguliruemye-opory/hilst-lift-self-leveling/)
   в [`lib/calculator/reference.ts`](lib/calculator/reference.ts) (`HILST_PEDESTALS`);
   в калькуляторе — выбор модели по высоте, цена редактируется.

## Архитектура калькулятора

Движок (`lib/calculator/`) — чистые функции без React, полностью покрытые тестами.
UI (`components/calculator/`) — реактивная обёртка: при любом изменении ввода
результат пересчитывается через `useMemo`, кнопки не требуется (ТЗ §9).
Данные товара и цены приходят из каталога/CMS и **переопределяют дефолты** —
ничего не захардкожено в логике (ТЗ §8.3, §9.6).
