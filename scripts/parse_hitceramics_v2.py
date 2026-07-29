#!/usr/bin/env python3
"""
Парсер каталога hit-ceramics.ru — версия 2 (новый движок, съём 29.07.2026).

Зачем v2: сайт заказчика переехал с /shop/landshaftnye-materialy/... на
/catalog/klinkernye_stupeni_i_plitka/ и сменил шаблон. Старый парсер получает 404,
а ссылки на фото из его выгрузки (userfiles/shop/list_cats/…) больше не отдаются —
кэш превью пересобран. Поэтому старая выгрузка (scripts/hitceramics/) — только
исторический слепок, источник правды теперь здесь.

Что даёт новый шаблон и чего не было в старом:
  * товар = ЭЛЕМЕНТ системы (ступень с капиносом / с насечками / угловая обоих
    типов / напольная плитка), а не коллекция целиком — и у каждого своё фото;
  * размер лежит в SKU-дереве («Размер, мм»), поэтому 30×30 и 30×60 — разные
    карточки с разными ценами;
  * на детальной странице есть вес кг/шт, шт/поддон, шт/уп, морозостойкость,
    водопоглощение, марка прочности, поверхность и коллекция.

Выход: scripts/hitceramics-v2/{cards.json, details.json}.
Только stdlib: urllib + re.
"""
import html
import json
import os
import re
import sys
import time
import urllib.request

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, "hitceramics-v2")
BASE = "https://hit-ceramics.ru"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120 Safari/537.36")

SECTIONS = {
    "klinkernye-stupeni-i-plitka": "/catalog/klinkernye_stupeni_i_plitka/",
    "terrasnye-plity-i-plastiny": "/catalog/terrasnye_plity_i_plastiny/",
}

# Карточка листинга: <div class="col-lg-3 col-md-4 … item item-parent …">.
# Границу берём по началу следующей карточки либо по блоку пагинации.
CARD = re.compile(
    r'<div class="col-lg-3\s+col-md-4[^"]*item item-parent.*?'
    r'(?=<div class="col-lg-3\s+col-md-4[^"]*item item-parent|<div class="module-pagination)',
    re.S,
)


def clean(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def fetch(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": UA, "Accept-Encoding": "identity"})
            with urllib.request.urlopen(req, timeout=45) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:
            if i == tries - 1:
                print("  !!", url, e)
                return ""
            time.sleep(2)


def parse_cards(doc, section):
    out = []
    for m in CARD.finditer(doc):
        c = m.group(0)
        name = re.search(r'<meta itemprop="name" content="([^"]*)"', c)
        url = re.search(r'<link itemprop="url" href="([^"]*)"', c)
        if not (name and url):
            continue
        did = re.search(r'data-id="(\d+)"', c)
        img = re.search(r'<meta itemprop="image" content="([^"]*)"', c)
        art = re.search(r'article_block" data-name="[^"]*" data-value="([^"]*)"', c)
        # data-value первой цены — цена активного предложения (SKU)
        price = re.search(
            r'<div class="price font-bold[^"]*" data-currency="RUB" data-value="([\d.]+)"', c)
        desc = re.search(r'<meta itemprop="description" content="([^"]*)"', c)
        out.append({
            "section": section,
            "id": did.group(1) if did else None,
            "name": html.unescape(name.group(1)).strip(),
            "url": url.group(1),
            # detail-URL без ?oid= — для страницы характеристик
            "detail_url": re.sub(r"\?.*$", "", url.group(1)),
            "img": img.group(1) if img else None,
            "article": html.unescape(art.group(1)) if art else None,
            "price": float(price.group(1)) if price else None,
            "desc": html.unescape(desc.group(1)) if desc else None,
            "sizes": re.findall(r'title="Размер, мм: ([^"]*)"', c),
            "color": (lambda m: html.unescape(m.group(1)) if m else None)(
                re.search(r'title="Цвет: ([^"]*)"', c)),
            "unit": (lambda m: m.group(1) if m else None)(
                re.search(r'title="Единица измерения: ([^"]*)"', c)),
        })
    return out


# Характеристики детальной страницы: пары «имя — значение» идут подряд в
# properties-group--table. Разметка вложенная, поэтому берём текст блока целиком
# и режем по известным именам свойств — так надёжнее, чем ловить пары регуляркой.
PROP_NAMES = [
    "Вид плитки", "Страна", "Производитель", "Поверхность", "Марка прочности",
    "Морозостойкость", "Водопоглощение", "Количество шт/поддон", "Количество шт/уп",
    "Количество шт/м2", "Количество шт/м²", "Коллекция", "Вес, кг/шт", "Вес, кг/м2",
    "Размер, мм", "Цвет", "Единица измерения", "Артикул", "Класс противоскольжения",
]


def parse_details(doc):
    i = doc.find("properties-group properties-group--table")
    if i < 0:
        i = doc.find('class="props_block"')
    if i < 0:
        return {}
    text = clean(doc[i:i + 12000])
    # позиции всех известных имён свойств в тексте
    hits = []
    for p in PROP_NAMES:
        for m in re.finditer(re.escape(p), text):
            hits.append((m.start(), m.end(), p))
    hits.sort()
    # убираем перекрытия («Вес, кг/шт» внутри «Вес, кг/м2» и т.п.)
    picked, last_end = [], -1
    for s, e, p in hits:
        if s >= last_end:
            picked.append((s, e, p))
            last_end = e
    props = {}
    for k, (s, e, p) in enumerate(picked):
        stop = picked[k + 1][0] if k + 1 < len(picked) else len(text)
        val = text[e:stop].strip(" :—- ")
        if val and p not in props:
            props[p] = val
    return props


def main():
    only_details = "--details-only" in sys.argv
    os.makedirs(OUT, exist_ok=True)
    cards_path = os.path.join(OUT, "cards.json")

    if only_details and os.path.exists(cards_path):
        cards = json.load(open(cards_path, encoding="utf-8"))
    else:
        cards, seen = [], set()
        for section, path in SECTIONS.items():
            page = 1
            while True:
                url = f"{BASE}{path}" + (f"?PAGEN_1={page}" if page > 1 else "")
                doc = fetch(url)
                if not doc:
                    break
                got = parse_cards(doc, section)
                # Ключ — id элемента, а не url: первый товар листинга отдаётся
                # дважды (в «top_wrapper» и в сетке) с разным ?oid=, и по url
                # дубль не ловился — в выгрузку попадали два одинаковых элемента.
                fresh = [c for c in got if (c["id"] or c["url"]) not in seen]
                for c in fresh:
                    seen.add(c["id"] or c["url"])
                cards.extend(fresh)
                print(f"  {section} стр.{page}: карточек {len(got)}, новых {len(fresh)}")
                if not fresh or f"PAGEN_1={page + 1}" not in doc:
                    break
                page += 1
                time.sleep(0.6)
        json.dump(cards, open(cards_path, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        print(f"карточек всего: {len(cards)}")

    # детальные страницы — за характеристиками
    det_path = os.path.join(OUT, "details.json")
    details = json.load(open(det_path, encoding="utf-8")) if os.path.exists(det_path) else {}
    todo = [c for c in cards if c["id"] and c["id"] not in details]
    print(f"детальных страниц к съёму: {len(todo)} (уже есть {len(details)})")
    for n, c in enumerate(todo, 1):
        doc = fetch(BASE + c["detail_url"] if c["detail_url"].startswith("/") else c["detail_url"])
        if doc:
            details[c["id"]] = parse_details(doc)
        if n % 20 == 0:
            print(f"  {n}/{len(todo)}")
            json.dump(details, open(det_path, "w", encoding="utf-8"),
                      ensure_ascii=False, indent=1)
        time.sleep(0.4)
    json.dump(details, open(det_path, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    filled = sum(1 for v in details.values() if v)
    print(f"характеристик собрано: {filled}/{len(details)}")


if __name__ == "__main__":
    main()
