#!/usr/bin/env python3
"""
Генератор реального каталога сайта из данных Славдома (626 карточек, съём 26.07.2026).

Вход:  scratchpad/slavdom/products.json
Выход: lib/catalog/generated/products.ts  (Product[] под модель lib/catalog/types.ts)
       + отчёт по покрытию в scratchpad/slavdom/catalog-report.md

Товар сайта = «бренд + коллекция + цвет» (как paradyz-taurus-brown в демо-каталоге),
элементы товара = SKU этой группы (проступь/угол/подступёнок/плитка/плинтус).

Цены: см. PRICE_COEF. По умолчанию 1.0 — цена Славдома как есть, ПОТОМУ ЧТО решения
по прайсу ЗЕ ВАН нет. Это осознанное допущение: карточка помечена «цена справочная,
не является публичной офертой». Меняется одним числом здесь + пересборка.
"""
import json, os, re, unicodedata, collections

D = os.path.dirname(os.path.abspath(__file__))
SITE = "/mnt/c/Users/Administrator/Desktop/Сайты/Проекты/stupeni"
PHOTO_SRC = "/mnt/c/Users/Administrator/Desktop/Парсинг ХИТ КЕРАМИКС/Контент сайтов/Парсинг для лендинга Ступени"

PRICE_COEF = 1.0                 # 1.0 = цена рынка (Славдом) без наценки
PRICE_DATE = "2026-07-26"

BRAND = {"Paradyz": "Paradyz", "Stroeher": "Stroeher", "EXAGRES": "Exagres",
         "Interbau": "Interbau", "Westerwaelder Klinker": "Westerwälder Klinker",
         "MARKAСТРОЙ": "Маркастрой"}
BRAND_SLUG = {"Paradyz": "paradyz", "Stroeher": "stroeher", "Exagres": "exagres",
              "Interbau": "interbau", "Westerwälder Klinker": "westerwalder-klinker",
              "Маркастрой": "markastroy"}

# Локальные фото производителей (спарсены ранее) → коллекции Славдома. Только явные соответствия.
PHOTO_MAP = {
    ("Exagres", "Ardenas"): "Exagres/products/ardenas",
    ("Exagres", "Litos"): "Exagres/products/litos",
    ("Exagres", "Vega"): "Exagres/products/vega",
    ("Exagres", "Bedford"): "Exagres/products/bedford",
    ("Stroeher", "Selected"): "Stroeher/products/selected",
    ("Stroeher", "Keraplatte Roccia"): "Stroeher/products/roccia-next",
    ("Stroeher", "Keraplatte Terra"): "Stroeher/products/terra",
    ("Stroeher", "Keraplatte Aera"): "Stroeher/products/aera",
    ("Westerwälder Klinker", "ATRIUM"): "Westerwald Klinker/products/stupeni-atrium",
    ("Westerwälder Klinker", "MONTMARTRE"): "Westerwald Klinker/products/stupeni-montmartre",
    ("Маркастрой", "Natur"): "Маркастрой/products/klinkernye-stupeni",
    ("Interbau", "Columbia"): "Interbau/products/terrassenplatten-columbia",
}
# Заглушки, пока нет своей съёмки (ТЗ §5 требует реальные объекты, не сток).
FALLBACK = {"step_system": ["/images/cat-clinker.jpg", "/images/gal-porch.jpg"],
            "slab": ["/images/cat-slab.jpg", "/images/gal-terrace.jpg"],
            "wood": ["/images/cat-wood.jpg", "/images/gal-decking.jpg"]}

COLOR_HEX = {
    "бежевый": "#C9B79C", "белый": "#EDE9E1", "серый": "#8A8A86", "темно-серый": "#5A5C5B",
    "тёмно-серый": "#5A5C5B", "светло-серый": "#B4B3AE", "графитовый": "#4A4D4E",
    "черный": "#2E2E2C", "чёрный": "#2E2E2C", "коричневый": "#7A4B33",
    "терракотовый": "#A8502F", "красный": "#9B3D2A", "оранжевый": "#C06A34",
    "желтый": "#C7A45C", "жёлтый": "#C7A45C", "песочный": "#D2BE9A",
    "кремовый": "#DCCFB8", "антрацит": "#3A3C3B", "бордовый": "#6E2F2A",
    "зеленый": "#5B6B4F", "зелёный": "#5B6B4F", "синий": "#4A5A6B",
    "бело-серый": "#D6D3CB", "серо-коричневый": "#8B7561", "многоцветный": "#9A8F80",
}

SIZE_TAIL = re.compile(r",?\s*\d{2,4}\s*[*xх×]\s*\d{2,4}.*$")
ELEM_PREFIX = re.compile(
    r"^(?:Клинкерн\w+|Керамогранит|Террасн\w+|Напольн\w+|Крупноформатн\w+|Ступень|Ступени|"
    r"Плитка|Плита|Угловая\s+ступень|Угловой\s+элемент|Подступ[её]нок|Цоколь|Плинтус|Мозаика|"
    r"Борт\w*|Модерн|кантик|с\s+прямым\s+носиком|флорентинер|уличная|для\s+\S+|из\s+\S+)\s*", re.I)


def group_key(name, brand):
    s = SIZE_TAIL.sub("", name).strip(" ,")
    prev = None
    while prev != s:
        prev = s
        s = ELEM_PREFIX.sub("", s).strip()
    i = s.lower().find(brand.lower())
    if i >= 0:
        s = s[i + len(brand):]
    s = re.sub(r"\bцвет\b|\bтон\b", "", s, flags=re.I)
    s = re.sub(r"\((?:[^()]*)\)", " ", s)
    return re.sub(r"\s+", " ", s).strip(" ,-–—")


def element_of(name):
    """Код элемента модели сайта. None → SKU в товар не включаем (неоднозначный)."""
    n = name.lower()
    corner = "углов" in n
    if "подступ" in n:
        return "riser"
    if "плинтус" in n or "цоколь" in n:
        return "plinth"
    if "мозаика" in n or "борт" in n:
        return None
    nose = ("капинос" in n or "прямым носиком" in n or "флорентинер" in n
            or "кантик" in n or "носик" in n)
    if corner:
        return "corner_l" if nose else None      # угловая без капиноса — не наш элемент
    if nose:
        return "front"
    if "насечк" in n:
        return None                              # проступь без капиноса — не путаем калькулятор
    if "ступень" in n:
        return "front"
    if "плитка" in n or "плита" in n or "керамогранит" in n:
        return "base"
    return None


ELEMENT_NAME = {"front": "Ступень фронтальная (с капиносом)", "corner_l": "Угловая ступень",
                "corner_r": "Угловая ступень (правая)", "riser": "Подступёнок",
                "base": "Базовая плитка", "plinth": "Плинтус ступенчатый"}


def slugify(s):
    s = unicodedata.normalize("NFKD", s)
    tr = {"а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "zh",
          "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o",
          "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts",
          "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu",
          "я": "ya", "ä": "a", "ö": "o", "ü": "u", "ß": "ss"}
    out = []
    for ch in s.lower():
        out.append(tr.get(ch, ch))
    s = "".join(out)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return re.sub(r"-{2,}", "-", s)


def fnum(v):
    if v in (None, ""):
        return None
    m = re.search(r"\d+(?:[.,]\d+)?", str(v).replace(" ", ""))
    return float(m.group().replace(",", ".")) if m else None


def surface_of(feats, name):
    s = (feats.get("Поверхность") or "").lower()
    pat = (feats.get("Рисунок") or "").lower()
    if "дерев" in pat or "дерев" in name.lower() or "wood" in name.lower():
        return "wood"
    if "структур" in s or "рельеф" in s or "насечк" in s:
        return "structured"
    if "матов" in s:
        return "matte"
    if "глад" in s or "полиров" in s:
        return "smooth"
    return "structured"


def main():
    rows = json.load(open(os.path.join(D, "slavdom", "products.json"), encoding="utf-8"))
    groups = collections.defaultdict(list)
    for r in rows:
        b = BRAND.get(r.get("brand") or "")
        if not b:
            continue
        groups[(b, group_key(r.get("name") or "", r.get("brand") or ""))].append(r)

    products, report = [], []
    for (brand, gname), items in sorted(groups.items()):
        elems = {}
        for r in items:
            code = element_of(r.get("name") or "")
            if not code:
                continue
            price = r.get("price")
            if not price:
                continue
            f = r.get("features_raw", {})
            length_mm = fnum(f.get("Длина, мм")) or fnum(r.get("length_mm"))
            per_sqm = fnum(f.get("Количество шт/м2"))
            size = (r.get("size_mm") or "").replace("*", "x").replace("х", "x")
            e = {
                "code": code, "name": ELEMENT_NAME[code], "size_mm": size,
                "unit": "pcs",
                "weight_kg": fnum(r.get("weight_kg")) or 0,
                "per_pallet": int(fnum(r.get("per_pallet"))) if r.get("per_pallet") else None,
                "price_rub": round(price * PRICE_COEF),
                "length_m": round(length_mm / 1000, 3) if length_mm and code in ("front", "riser", "plinth") else None,
                "per_sqm": per_sqm if code == "base" else None,
                "_price_m2": round(r["price_per_m2"]) if r.get("price_per_m2") else None,
                "_sku": r.get("sku"), "_url": r.get("url"), "_status": r.get("status"),
            }
            # выбор среди дублей: для линейных элементов — самый длинный (меньше швов),
            # для базовой плитки — САМЫЙ МЕЛКИЙ формат (классическая база площадки,
            # иначе в «базу» попадает крупноформат 1200×600 и калькулятор считает не то)
            def area(x):
                d = [float(n.replace(",", ".")) for n in re.findall(r"[\d,]+", x["size_mm"])[:2]] or [0, 0]
                return d[0] * d[1] if len(d) == 2 else 0
            prev = elems.get(code)
            if prev is None:
                elems[code] = e
            elif code == "base":
                if area(e) and area(e) < area(prev):
                    elems[code] = e
            elif (e["length_m"] or 0) > (prev["length_m"] or 0):
                elems[code] = e
        if "front" not in elems and "base" not in elems:
            continue

        first = items[0]
        f = first.get("features_raw", {})
        name_all = " ".join(x.get("name", "") for x in items)
        surface = surface_of(f, name_all)
        is_step = "front" in elems
        color_ru = (first.get("color") or "").strip().lower()
        # марку морозостойкости берём ТОЛЬКО из явного поля: «морозостойкая» без марки
        # не даёт права написать F100 (ТЗ: не выдумывать данные)
        frost = (f.get("Марка морозостойкости") or "").strip()
        wa = fnum(f.get("Водопоглощение, %"))
        slip = (f.get("Класс противоскольжения") or "").split(",")[0].strip()

        collection = gname.split(",")[0].strip()
        color_name = gname[len(collection):].strip(" ,") or (first.get("color") or "")
        pid = slugify(f"{BRAND_SLUG[brand]}-{gname}")

        # фото: локальные фото производителя, иначе заглушка
        photos, photo_src = [], None
        for (b2, coll), rel in PHOTO_MAP.items():
            if b2 == brand and coll.lower() in collection.lower():
                p = os.path.join(PHOTO_SRC, rel)
                if os.path.isdir(p):
                    photo_src = rel
                    files = [fn for fn in sorted(os.listdir(p))
                             if fn.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))]
                    # фото цвета этого товара — вперёд: в папках производителей цвет
                    # часто в имени файла (photo_1_shokolad.png, photo_4_dyuna_obekt.jpg).
                    # Иначе карточке «Дюна» подставлялось фото «Шоколад».
                    ctokens = [slugify(t) for t in re.split(r"[\s,/]+", gname) if len(t) > 2]
                    NEUTRAL = re.compile(r"^photo_\d+\.[a-z]+$", re.I)
                    def mine(fn):
                        f_ = slugify(fn)
                        return any(t and t in f_ for t in ctokens)
                    # берём фото своего цвета и нейтральные; ЧУЖОЙ цвет не показываем
                    files = [fn for fn in files if mine(fn) or NEUTRAL.match(fn)]
                    def rank(fn):
                        return (0 if mine(fn) else 1, fn)
                    for fn in sorted(files, key=rank)[:4]:
                        photos.append((os.path.join(p, fn), f"/images/products/{pid}/{fn}"))
                break
        kind = "wood" if surface == "wood" else ("step_system" if is_step else "slab")
        photo_urls = [dst for _, dst in photos] or FALLBACK[kind]

        # применение и категория
        thick = max([fnum(x.get("thickness_mm")) or 0 for x in items] or [0])
        thick_slab = thick >= 18                      # 20 мм = террасная пластина
        app = ["kryltso", "lestnitsa-ulitsa"] if is_step else ["terrasa", "dorozhki"]
        if not is_step and thick_slab:
            app.append("landshaft-opory")

        if surface == "wood":
            category, title_kind = "plastiny-pod-derevo", "керамогранит под дерево"
        elif is_step:
            category, title_kind = "terrasnyy-klinker", "клинкерные ступени"
        elif thick_slab:
            category, title_kind = "terrasnye-plastiny", "террасные пластины 20 мм"
        else:
            # тонкая клинкерная напольная плитка — это террасный клинкер, а не «пластины 20 мм»
            category, title_kind = "terrasnyy-klinker", "клинкерная напольная плитка"

        products.append({
            "id": pid, "brand": brand,
            "product_type": "step_system" if is_step else "slab",
            "application": app, "category": category, "collection": collection,
            "sku": (first.get("sku") or pid).strip(),
            "active": True,
            "price_updated_at": PRICE_DATE,
            "elements": [
                {k: v for k, v in e.items() if not k.startswith("_") and v is not None}
                for e in sorted(elems.values(), key=lambda x: ["front", "corner_l", "corner_r", "riser", "base", "plinth"].index(x["code"]))
            ] if is_step else None,
            "formats": None if is_step else [
                {"code": e["size_mm"], "size_mm": e["size_mm"],
                 "thickness_mm": int(fnum(e["size_mm"].split("x")[-1]) or thick or 20),
                 "weight_kg": e["weight_kg"], "per_sqm": e.get("per_sqm") or 0,
                 "per_pallet": e.get("per_pallet"), "price_rub_pcs": e["price_rub"],
                 "price_rub_sqm": e.get("_price_m2") or (round(e["price_rub"] * (e.get("per_sqm") or 0)) if e.get("per_sqm") else 0)}
                for e in elems.values() if e["code"] == "base"
            ],
            "specs": {"surface": surface, "color": (color_name or color_ru or "—"),
                      "color_hex": COLOR_HEX.get(color_ru, "#9A9690"),
                      "frost_resistance": frost or None,
                      "water_absorption_pct": wa,
                      "slip_resistance": slip or None},
            "photos": photo_urls,
            "seo": {
                "title": f"{title_kind.capitalize()} {brand} {gname} — цена, характеристики",
                "description": (f"{title_kind.capitalize()} {brand} {gname}: "
                                + (f"морозостойкость {frost}, " if frost else "")
                                + (f"противоскольжение {slip}, " if slip else "")
                                + "поэлементный расчёт комплекта, доставка по РФ и СНГ."),
                "h1": f"{title_kind.capitalize()} {brand} {gname}",
            },
            "_photos_copy": photos, "_photo_src": photo_src,
            "_elements_src": [(e["code"], e.get("_sku"), e.get("_url")) for e in elems.values()],
        })
        report.append((brand, gname, "ступени" if is_step else "пластины",
                       len(elems), photo_src or "заглушка"))

    # копируем фото
    copied = 0
    for p in products:
        for src, dst in p["_photos_copy"]:
            out = os.path.join(SITE, "public", dst.lstrip("/"))
            os.makedirs(os.path.dirname(out), exist_ok=True)
            if not os.path.exists(out):
                with open(src, "rb") as a, open(out, "wb") as b:
                    b.write(a.read())
            copied += 1

    # варианты (цветовые чипы): товары одной коллекции одного бренда
    bycoll = collections.defaultdict(list)
    for p in products:
        bycoll[(p["brand"], p["collection"])].append(p)
    for (b, c), ps in bycoll.items():
        if len(ps) < 2:
            continue
        for p in ps:
            p["variants"] = [{"id": q["id"], "color": q["specs"]["color"],
                              "color_hex": q["specs"]["color_hex"], "photo": q["photos"][0]}
                             for q in ps]

    def ts(v, ind=0):
        sp = "  " * ind
        if v is None:
            return "undefined"
        if isinstance(v, bool):
            return "true" if v else "false"
        if isinstance(v, (int, float)):
            return repr(v)
        if isinstance(v, str):
            return '"' + v.replace('\\', '\\\\').replace('"', '\\"') + '"'
        if isinstance(v, list):
            if not v:
                return "[]"
            inner = ",\n".join(sp + "  " + ts(x, ind + 1) for x in v)
            return "[\n" + inner + "\n" + sp + "]"
        if isinstance(v, dict):
            items = [(k, x) for k, x in v.items() if not k.startswith("_") and x is not None]
            inner = ",\n".join(f'{sp}  {k if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", k) else chr(34)+k+chr(34)}: {ts(x, ind + 1)}' for k, x in items)
            return "{\n" + inner + "\n" + sp + "}"
        raise TypeError(type(v))

    header = f'''/**
 * РЕАЛЬНЫЙ каталог — сгенерирован из карточек slavdom.ru (съём {PRICE_DATE}).
 * Не править вручную: правки затрёт следующая генерация
 * (scratchpad/gen_catalog.py, копия в папке парсинга «_Славдом (рыночные цены)»).
 *
 * Цены: рыночные (розница дистрибьютора), коэффициент {PRICE_COEF}. До решения по
 * прайсу ЗЕ ВАН показываются как справочные (в карточке есть дисклеймер об оферте).
 * Наличие (stock_status) СОЗНАТЕЛЬНО не заполнено: остатки Славдома — не наши,
 * источник правды — 1С (ТЗ B.9).
 *
 * Товаров: {len(products)}. Фото: у части коллекций — официальные фото производителя
 * (спарсены ранее), у остальных заглушки до своей съёмки (ТЗ §5 запрещает сток).
 */

import type {{ Product }} from "../types";

export const REAL_PRODUCTS: Product[] = '''
    body = ts([{k: v for k, v in p.items() if not k.startswith("_")} for p in products], 0)
    os.makedirs(os.path.join(SITE, "lib", "catalog", "generated"), exist_ok=True)
    open(os.path.join(SITE, "lib", "catalog", "generated", "products.ts"), "w",
         encoding="utf-8").write(header + body + ";\n")

    # отчёт
    lines = ["# Каталог сайта из данных Славдома — покрытие", "",
             f"Товаров: **{len(products)}** (ступени: {sum(1 for p in products if p['product_type']=='step_system')}, "
             f"пластины: {sum(1 for p in products if p['product_type']=='slab')}). Фото скопировано файлов: {copied}.", "",
             "| Бренд | Товар | Тип | Элементов | Фото |", "|---|---|---|---|---|"]
    for b, g, t, n, ph in sorted(report):
        lines.append(f"| {b} | {g} | {t} | {n} | {ph} |")
    open(os.path.join(D, "slavdom", "catalog-report.md"), "w", encoding="utf-8").write("\n".join(lines) + "\n")

    print(f"товаров: {len(products)} | ступеней: {sum(1 for p in products if p['product_type']=='step_system')} "
          f"| пластин: {sum(1 for p in products if p['product_type']=='slab')}")
    print(f"фото скопировано: {copied}; с фото производителя: {sum(1 for p in products if p['_photo_src'])}")
    bb = collections.Counter(p["brand"] for p in products)
    for k, v in bb.most_common():
        print(f"  {k:24} {v:3}")
    el = collections.Counter(e["code"] for p in products if p["elements"] for e in p["elements"])
    print("элементы:", dict(el))


if __name__ == "__main__":
    main()
