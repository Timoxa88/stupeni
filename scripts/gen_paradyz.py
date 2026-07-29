#!/usr/bin/env python3
"""
Каталог Paradyz — из СВОЕГО сайта заказчика hit-ceramics.ru (съём 29.07.2026).

Заменяет gen_paradyz_price.py, который собирал ступени из «Прайс Paradyz полный
от 01.06.26.xlsx». Причины замены:

  1. Прайс-файла больше нет на диске, а сайт заказчика переехал на новый движок,
     где вся система выложена поэлементно — это лучший из доступных источников
     (цены сверены: террасные плиты 595×595 = 1 766,78 ₽ и ступени с капиносом
     Ilario = 2 000 ₽ совпадают с прежней выгрузкой из прайса).

  2. Прежний генератор терял бо́льшую часть системы:
       * `element_of()` возвращал None для «ступени простой (с насечками)» и для
         угловой без капиноса — эти элементы в карточку не попадали вообще;
       * дедупликация оставляла ОДИН элемент на код, поэтому напольная плитка
         показывалась только в 300×300, хотя у коллекции есть и 600×300;
       * при выборе «самого длинного» элемента насечная ступень 600 мм вытесняла
         капиносную 300 мм — у 14 коллекций из 45 капиноса в карточке не осталось,
         а оставшийся элемент носил код `front` (кромка считалась по цене плитки).

  3. У каждого элемента на новом сайте своё фото — ступень с капиносом больше
     не иллюстрируется кадром базовой плитки.

Источники:
  * scripts/hitceramics-v2/cards.json   — карточки листинга (элемент, размер,
    цена, артикул, фото), см. parse_hitceramics_v2.py;
  * scripts/hitceramics-v2/details.json — характеристики с детальных страниц
    (вес кг/шт, шт/поддон, шт/уп);
  * scripts/hitceramics-v2/paradyz-price-legacy.json — прежняя выгрузка: из неё
    берутся specs (морозостойкость/водопоглощение/R-класс из карточек Славдома),
    объектные фото, цветовые варианты, SEO и ВСЕ террасные плиты 20 мм —
    их структура верна и не трогается.

Выход: lib/catalog/generated/paradyz-price.ts (PARADYZ_PRICE_PRODUCTS).
Только stdlib.
"""
import html
import json
import os
import re
import urllib.request

D = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(D)
SRC = os.path.join(D, "hitceramics-v2")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120 Safari/537.36")
PRICE_DATE = "2026-07-29"

# Наименование на сайте → код элемента и подпись в карточке.
# Порядок важен: «Угловая клинкерная ступень с капиносом» должна проверяться
# раньше «Клинкерная ступень с капиносом» (иначе угловая уйдёт во фронтальную).
ELEMENTS = [
    ("Угловая клинкерная ступень с капиносом", "corner_l", "Угловая ступень (с капиносом)"),
    ("Угловая клинкерная ступень с насечками", "corner_notch", "Угловая ступень (с насечками)"),
    ("Клинкерная ступень с капиносом", "front", "Ступень фронтальная (с капиносом)"),
    ("Клинкерная ступень с насечками", "front_notch", "Ступень фронтальная (с насечками)"),
    ("Напольная клинкерная плитка", "base", "Базовая плитка"),
]

ORDER = ["front", "front_notch", "corner_l", "corner_notch", "riser", "base", "plinth"]

# Технические серии в конце имени коллекции — не часть цвета.
SERIES = {"duro"}

# Прежний генератор писал в specs.color до двух слов подряд, поэтому у Duro-серии
# цветом оказалось «Brown Duro», и витрина печатала «Cloud Brown Duro Brown Duro».
COLOR_RU = {
    "dark": "Тёмный", "light": "Светлый", "rust": "Ржавый", "beige": "Бежевый",
    "brown": "Коричневый", "ochra": "Охра", "grys": "Серый", "grey": "Серый",
    "naturale": "Натуральный", "bianco": "Белый", "nero": "Чёрный", "grafit": "Графит",
    "silver": "Серебристый", "gold": "Золотистый", "honey": "Медовый", "sand": "Песочный",
    "terra": "Терракота", "cotto": "Котто", "marrone": "Коричневый", "tundra": "Тундра",
    "red": "Красный", "black": "Чёрный", "white": "Белый", "antracite": "Антрацит",
    "rosa": "Розовый", "crema": "Кремовый", "taupe": "Тёмно-серый", "bazalt": "Базальт",
    "wood": "Под дерево", "rosso": "Красный",
}


def frost_mark(v):
    """«F-100» → «F100». Не марка («Да», пусто) → None: догадок в спеки не пишем."""
    m = re.search(r"F\s*-?\s*(\d+)", str(v or ""), re.I)
    return f"F{m.group(1)}" if m else None


def clean_color(color):
    """«Brown Duro» → «Коричневый»: серия — не цвет, латиница переводится."""
    toks = [t for t in (color or "").split() if t.lower() not in SERIES]
    key = " ".join(toks).strip()
    return COLOR_RU.get(key.lower(), key) or "—"


def norm_size(s):
    """«300х330х11» / «300х300х8,5» → «300x330x11» / «300x300x8.5» (латиница, точка)."""
    s = s.replace("х", "x").replace("×", "x").replace(",", ".").replace(" ", "")
    return s


def dims(size_mm):
    return [float(x) for x in re.findall(r"\d+(?:\.\d+)?", size_mm)]


def fnum(v):
    if v in (None, ""):
        return None
    m = re.search(r"\d+(?:[.,]\d+)?", str(v).replace(" ", "").replace("\xa0", ""))
    return float(m.group().replace(",", ".")) if m else None


def size_from_desc(desc):
    """Размер из описания карточки: «… ступень простая 300х300х11 мм (10 шт/уп)»."""
    m = re.search(r"(\d+[xх]\d+[xх][\d,\.]+)\s*мм", html.unescape(desc or ""))
    return norm_size(m.group(1)) if m else None


def element_of(name):
    for label, code, title in ELEMENTS:
        if name.lower().startswith(label.lower()):
            rest = re.sub(r"^Paradyz\s+", "", name[len(label):].strip(), flags=re.I)
            return code, title, rest.strip()
    return None, None, None


def slug(s):
    tr = {"а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ж": "zh", "з": "z",
          "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p",
          "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch",
          "ш": "sh", "щ": "sch", "ы": "y", "э": "e", "ю": "yu", "я": "ya", "ь": "", "ъ": "",
          "ё": "e"}
    s = "".join(tr.get(c, c) for c in s.lower())
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-")


def length_m(code, ds):
    """
    Длина элемента вдоль кромки марша, м.
      * капинос — глубина проступи больше ширины (300×330), вдоль кромки идёт
        МЕНЬШАЯ сторона: 300 мм → 0.3;
      * насечки — рифление нанесено вдоль длинной стороны, она и лежит вдоль
        кромки: 600×300 → 0.6.
    """
    if len(ds) < 2:
        return None
    if code in ("front", "riser", "plinth"):
        return round(min(ds[0], ds[1]) / 1000, 3)
    if code == "front_notch":
        return round(max(ds[0], ds[1]) / 1000, 3)
    return None


def main():
    cards = json.load(open(os.path.join(SRC, "cards.json"), encoding="utf-8"))
    details = json.load(open(os.path.join(SRC, "details.json"), encoding="utf-8"))
    legacy = json.load(open(os.path.join(SRC, "paradyz-price-legacy.json"), encoding="utf-8"))
    legacy_by_id = {p["id"]: p for p in legacy}

    steps = [c for c in cards if c["section"] == "klinkernye-stupeni-i-plitka"]

    # Прайс-лист клинкерной линейки Paradyz единый: на каждую пару «элемент+размер»
    # ровно одна цена по всем коллекциям и цветам (проверено на 191 карточке).
    # Поэтому у карточек, где цену на сайте забыли проставить, она берётся отсюда —
    # это не догадка, а та же строка прайса. Решение заказчика от 29.07.2026.
    price_by_kind = {}
    for c in steps:
        code, _, _ = element_of(c["name"])
        size = norm_size(c["sizes"][0]) if c["sizes"] else size_from_desc(c["desc"])
        if code and size and c["price"]:
            price_by_kind.setdefault((code, size), set()).add(round(c["price"]))
    ambiguous = {k: v for k, v in price_by_kind.items() if len(v) > 1}
    for k, v in ambiguous.items():
        print(f"  ! у {k} несколько цен {sorted(v)} — подстановка отключена")

    groups, skipped, borrowed = {}, [], []
    for c in steps:
        code, title, coll_color = element_of(c["name"])
        if not code:
            skipped.append(c["name"])
            continue
        size = norm_size(c["sizes"][0]) if c["sizes"] else size_from_desc(c["desc"])
        if not size:
            skipped.append(c["name"] + " (нет размера)")
            continue
        price = c["price"]
        if not price:
            same = price_by_kind.get((code, size), set())
            if len(same) != 1:
                skipped.append(f"{c['name']} (нет цены, подставить нечего)")
                continue
            price = next(iter(same))
            borrowed.append(f"{coll_color} · {title} {size} → {price} ₽ (арт. {c['article']})")
        c = {**c, "price": price}
        d = details.get(c["id"], {})
        ds = dims(size)
        e = {
            "code": code,
            "name": title,
            "size_mm": size,
            "unit": "pcs",
            "weight_kg": fnum(d.get("Вес, кг/шт")),
            "per_pallet": int(fnum(d.get("Количество шт/поддон")))
                          if fnum(d.get("Количество шт/поддон")) else None,
            "price_rub": round(c["price"]),
            "sku": c["article"],
            "_img": c["img"],
            "_id": c["id"],
            "_dims": ds,
        }
        lm = length_m(code, ds)
        if lm:
            e["length_m"] = lm
        if code == "base" and len(ds) >= 2:
            # шт/м² — чистая геометрия элемента (плитка кладётся без нахлёста)
            e["per_sqm"] = round(1 / ((ds[0] / 1000) * (ds[1] / 1000)), 3)
        groups.setdefault(coll_color, []).append(e)

    print(f"групп ступеней: {len(groups)} | пропущено карточек: {len(skipped)}")
    for s in skipped:
        print("  ?", s)
    if borrowed:
        print(f"цена подставлена из прайса линейки ({len(borrowed)}):")
        for b in borrowed:
            print("   +", b)

    products, photo_jobs = [], []
    for coll_color, raw in sorted(groups.items()):
        # Схлопываем повторы: пара код+размер — это один артикул. Если сайт отдал
        # его дважды с разной ценой, оставляем меньшую (в витрине цена «от»).
        by_key = {}
        for e in raw:
            k = (e["code"], e["size_mm"])
            prev = by_key.get(k)
            if prev is None:
                by_key[k] = e
            elif e["price_rub"] != prev["price_rub"]:
                print(f"  ! {coll_color}: {k} с двумя ценами "
                      f"{prev['price_rub']}/{e['price_rub']} — берём меньшую")
                by_key[k] = min(prev, e, key=lambda x: x["price_rub"])
        elems = list(by_key.values())
        pid = "paradyz-" + slug(coll_color)
        old = legacy_by_id.get(pid)
        if not old:
            print(f"  !! нет прежней записи для {pid} — specs/SEO будут по умолчанию")

        # порядок элементов: тип, внутри типа — от меньшего формата к большему
        elems.sort(key=lambda e: (ORDER.index(e["code"]), e["_dims"][0] * e["_dims"][1]))

        # добор из прежней выгрузки: подступёнок/цоколь, если они там были
        if old:
            have = {(e["code"], e["size_mm"]) for e in elems}
            for oe in old.get("elements") or []:
                if oe["code"] in ("riser", "plinth") and (oe["code"], oe["size_mm"]) not in have:
                    elems.append({**oe, "_img": None, "_dims": dims(oe["size_mm"])})
            elems.sort(key=lambda e: (ORDER.index(e["code"]), e["_dims"][0] * e["_dims"][1]))

        # вес/поддон, которых нет на детальной странице, — из прежней выгрузки
        # (совпадение по коду и набору габаритов; в прайсе размер писался
        # глубиной вперёд: 330x300 против 300x330 на сайте)
        if old:
            okey = {}
            for oe in old.get("elements") or []:
                okey[(oe["code"], tuple(sorted(dims(oe["size_mm"]))))] = oe
            for e in elems:
                oe = okey.get((e["code"], tuple(sorted(e["_dims"]))))
                if not oe:
                    continue
                if e.get("weight_kg") is None and oe.get("weight_kg"):
                    e["weight_kg"] = oe["weight_kg"]
                if e.get("per_pallet") is None and oe.get("per_pallet"):
                    e["per_pallet"] = oe["per_pallet"]

        # фото: у каждого элемента своё, качаем в папку товара.
        # Заглушка движка (noimage_product.svg) — не фото: элемент останется без
        # кадра, и галерея просто не переключится, а не покажет чужой цвет.
        for e in elems:
            img = e.get("_img") or ""
            if not img or "noimage" in img or img.endswith(".svg"):
                continue
            w, h = int(e["_dims"][0]), int(e["_dims"][1])
            dst = f"/images/products/{pid}/el-{e['code']}-{w}x{h}.webp"
            photo_jobs.append((img, os.path.join(SITE, "public", dst.lstrip("/"))))
            e["photo"] = dst

        # галерея товара: сначала фото элементов (первым — то, что даёт обложку
        # листинга), затем прежние объектные кадры, которых нет среди элементов
        gallery = [e["photo"] for e in elems if e.get("photo")]
        for ph in (old or {}).get("photos", []):
            if ph not in gallery and "/images/products/" in ph and "el-" not in ph:
                gallery.append(ph)
        if not gallery:
            gallery = ["/images/cat-clinker.jpg"]

        front = next((e for e in elems if e["code"] == "front"), None)
        sku = (front or elems[0]).get("sku") or (old or {}).get("sku") or ""

        specs = dict((old or {}).get("specs") or {
            "surface": "structured", "color": "—", "color_hex": "#9A8F80"})
        specs["color"] = clean_color(specs.get("color"))

        # Морозостойкость — с карточек СВОЕГО сайта (решение заказчика 29.07.2026):
        # там у всей клинкерной линейки заявлено F-100, тогда как прежняя выгрузка
        # брала F300 из карточек Славдома. Пишем только явную марку вида F\d+;
        # «Да» и прочие нечисловые значения — не марка, такое поле не заполняем.
        marks = {frost_mark(details.get(e["_id"], {}).get("Морозостойкость"))
                 for e in elems if e.get("_id")}
        marks.discard(None)
        if len(marks) == 1:
            specs["frost_resistance"] = marks.pop()
        elif len(marks) > 1:
            print(f"  ! {coll_color}: разные марки морозостойкости {sorted(marks)} — оставил прежнюю")

        products.append({
            "id": pid,
            "brand": "Paradyz",
            "product_type": "step_system",
            "application": (old or {}).get("application") or ["kryltso", "lestnitsa-ulitsa"],
            "category": "terrasnyy-klinker",
            "collection": (old or {}).get("collection") or coll_color,
            "sku": sku,
            "active": True,
            "price_updated_at": PRICE_DATE,
            "elements": [{k: v for k, v in e.items() if not k.startswith("_") and v is not None}
                         for e in elems],
            "formats": None,
            "specs": specs,
            "photos": gallery,
            "seo": (old or {}).get("seo") or {
                "title": f"Клинкерные ступени Paradyz {coll_color} — цена, характеристики",
                "description": f"Клинкерные ступени Paradyz {coll_color}: розничная цена, "
                               "поэлементный расчёт комплекта, доставка по России и СНГ.",
                "h1": f"Клинкерные ступени Paradyz {coll_color}",
            },
        })

    # террасные плиты 20 мм и керамогранит под дерево — из прежней выгрузки как есть
    slabs = [p for p in legacy if p["product_type"] == "slab"]
    step_ids = {p["id"] for p in products}
    dropped = [p["id"] for p in legacy
               if p["product_type"] == "step_system" and p["id"] not in step_ids]
    if dropped:
        print("нет на сайте (сняты с витрины):", ", ".join(dropped))

    # цветовые варианты пересобираем по фактическому составу (обложка = фото
    # первого элемента, т.е. ступени с капиносом там, где она есть)
    bycoll = {}
    for p in products:
        bycoll.setdefault(p["collection"].rsplit(" ", 1)[0], []).append(p)
    for ps in bycoll.values():
        if len(ps) > 1:
            for p in ps:
                p["variants"] = [{"id": q["id"], "color": q["specs"]["color"],
                                  "color_hex": q["specs"]["color_hex"], "photo": q["photos"][0]}
                                 for q in ps]

    got, fail = 0, 0
    for url, dst in photo_jobs:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if os.path.exists(dst) and os.path.getsize(dst) > 0:
            got += 1
            continue
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=45) as rsp, open(dst, "wb") as fh:
                fh.write(rsp.read())
            got += 1
        except Exception as e:
            fail += 1
            print("  !! фото", url, e)

    out_products = products + slabs

    def ts(v, ind=0):
        sp = "  " * ind
        if v is None:
            return "undefined"
        if isinstance(v, bool):
            return "true" if v else "false"
        if isinstance(v, (int, float)):
            return repr(v)
        if isinstance(v, str):
            return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'
        if isinstance(v, list):
            return "[\n" + ",\n".join(sp + "  " + ts(x, ind + 1) for x in v) + "\n" + sp + "]"
        if isinstance(v, dict):
            items = [(k, x) for k, x in v.items() if x is not None]
            return "{\n" + ",\n".join(f"{sp}  {k}: {ts(x, ind + 1)}" for k, x in items) + "\n" + sp + "}"
        raise TypeError(type(v))

    n_el = sum(len(p["elements"]) for p in products)
    header = f'''/**
 * Paradyz — с сайта заказчика hit-ceramics.ru (съём 29.07.2026), цены РОЗНИЧНЫЕ.
 *
 * Система ступеней выложена ПОЭЛЕМЕНТНО: ступень с капиносом и ступень с
 * насечками — разные артикулы, напольная плитка и насечная ступень идут в двух
 * форматах (300×300 и 600×300). У каждого элемента свой артикул, цена, вес,
 * шт/поддон и СВОЁ фото — карточка показывает кадр выбранного элемента.
 *
 * Морозостойкость, водопоглощение и R-класс — из карточек Славдома (прежняя
 * выгрузка); террасные плиты 20 мм — оттуда же без изменений (цены сверены).
 *
 * Сгенерировано scripts/gen_paradyz.py, вручную не править.
 *
 * Ступеней: {len(products)} (элементов {n_el}). Плит: {len(slabs)}.
 */

import type {{ Product }} from "../types";

export const PARADYZ_PRICE_PRODUCTS: Product[] = '''
    out = os.path.join(SITE, "lib", "catalog", "generated", "paradyz-price.ts")
    open(out, "w", encoding="utf-8").write(header + ts(out_products, 0) + ";\n")

    import collections as C
    print(f"\nступеней: {len(products)} | элементов: {n_el} | плит: {len(slabs)}")
    print("элементы:", dict(C.Counter(e["code"] for p in products for e in p["elements"])))
    print("фото элементов:", got, "| не скачано:", fail)
    print("элементов без веса:",
          sum(1 for p in products for e in p["elements"] if "weight_kg" not in e))


if __name__ == "__main__":
    main()
