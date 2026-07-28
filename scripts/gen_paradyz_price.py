#!/usr/bin/env python3
"""
Каталог Paradyz — из «Прайс Paradyz полный от 01.06.26.xlsx» (РОЗНИЧНЫЕ цены).

Источники по приоритету:
  1) прайс   — артикул, коллекция, наименование, размер, вес, шт/м², шт/уп, шт/поддон,
               РОЗНИЧНАЯ цена ₽/шт (проверено: AUTHORITY BEIGE 595×595 = 1 766,78 ₽ —
               совпадает с ценой на hit-ceramics.ru);
  2) Славдом — R-класс, марка морозостойкости, водопоглощение (в прайсе их нет);
  3) hit-ceramics.ru — фото товара.

Выход: lib/catalog/generated/paradyz-price.ts (PARADYZ_PRICE_PRODUCTS).
Замещает Paradyz из общего каталога и модуль wood-hc.
"""
import json, os, re, urllib.request

D = os.path.dirname(os.path.abspath(__file__))
SITE = "/mnt/c/Users/Administrator/Desktop/Сайты/Проекты/stupeni"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
PRICE_DATE = "2026-06-01"      # прайс действителен с этой даты
WOOD = {"RUSTLAND", "SHERWOOD", "WILLOW", "TRUELAND", "AGAWOOD", "NATURIO"}

COLOR_HEX = {
    "dark": "#5A4636", "light": "#D6C6AC", "rust": "#A8502F", "beige": "#C9B79C",
    "brown": "#7A4B33", "ochra": "#C7A45C", "grys": "#8A8A86", "grey": "#8A8A86",
    "naturale": "#C09A6B", "bianco": "#E4DED2", "nero": "#2E2E2C", "grafit": "#4A4D4E",
    "silver": "#B4B3AE", "gold": "#C2A15A", "honey": "#C98F4B", "sand": "#D2BE9A",
    "terra": "#A8502F", "cotto": "#A8502F", "marrone": "#6E4A34", "tundra": "#8B8378",
    "red": "#9B3D2A", "black": "#2E2E2C", "white": "#EDE9E1", "cream": "#DCCFB8",
    "antracite": "#3A3C3B", "anthracite": "#3A3C3B", "bazalt": "#4A4D4E", "blue": "#4A5A6B",
    "rosa": "#C98B7A", "verde": "#5B6B4F", "graphite": "#4A4D4E", "rustic": "#9A7B5F",
}
COLOR_RU = {
    "dark": "Тёмный", "light": "Светлый", "rust": "Ржавый", "beige": "Бежевый",
    "brown": "Коричневый", "ochra": "Охра", "grys": "Серый", "grey": "Серый",
    "naturale": "Натуральный", "bianco": "Белый", "nero": "Чёрный", "grafit": "Графит",
    "silver": "Серебристый", "gold": "Золотистый", "honey": "Медовый", "sand": "Песочный",
    "terra": "Терракота", "cotto": "Котто", "marrone": "Коричневый", "tundra": "Тундра",
    "red": "Красный", "black": "Чёрный", "white": "Белый", "antracite": "Антрацит",
}

ELEMENT_NAME = {
    "front": "Ступень фронтальная (с капиносом)", "corner_l": "Угловая ступень с капиносом",
    "riser": "Подступёнок", "base": "Базовая плитка", "plinth": "Цоколь / плинтус",
}


def element_of(name):
    """Код элемента по наименованию прайса. None → в карточку не берём."""
    n = name.lower()
    if "подоконник" in n:
        return None                                   # другая товарная группа
    if "подступ" in n:
        return "riser"
    if "цоколь" in n or "плинтус" in n:
        return "plinth"
    nose = "капинос" in n
    if "углов" in n:
        return "corner_l" if nose else None           # угол без капиноса — не элемент системы
    if "ступень" in n:
        # «Ступень простая структурная (без капиноса, с насечками)» — проступь без носика,
        # калькулятор её не считает: пропускаем, чтобы не подменять фронтальную ступень
        return "front" if nose else None
    if "плитка" in n:
        return "base"
    return None


def fnum(v):
    if v in (None, ""):
        return None
    m = re.search(r"\d+(?:[.,]\d+)?", str(v).replace(" ", "").replace("\xa0", ""))
    return float(m.group().replace(",", ".")) if m else None


def slug(s):
    tr = {"а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ж": "zh", "з": "z",
          "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p",
          "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch",
          "ш": "sh", "щ": "sch", "ы": "y", "э": "e", "ю": "yu", "я": "ya", "ь": "", "ъ": "",
          "ё": "e"}
    s = "".join(tr.get(c, c) for c in s.lower())
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-")


STOP = re.compile(r"^(плитка|ступень|подступенник|цоколь|плинтус|капинос|угловой|угловая|"
                  r"gres|szkl|rekt|struktura|mat|str|structura|поверхность|\d)", re.I)


def color_of(name, collection):
    """Цвет = слова между коллекцией и словом-элементом/техприставкой."""
    rest = name
    if collection and rest.lower().startswith(collection.lower()):
        rest = rest[len(collection):]
    out = []
    for tok in rest.strip(" -,/").split():
        if STOP.match(tok):
            break
        out.append(tok.strip(",/"))
        if len(out) == 2:
            break
    return " ".join(out).strip() or "—"


def photos_for(pid, photo_url, photo_dst, is_wood, kind):
    """Фото карточки: своё с hit-ceramics.ru → текстура производителя paradyz.com → заглушка."""
    out = []
    if photo_url:
        out.append(photo_dst)
    tex = os.path.join(SITE, "public", "images", "products", pid, "texture.jpg")
    if os.path.exists(tex):
        out.append(f"/images/products/{pid}/texture.jpg")
    if out:
        return out
    return ["/images/cat-wood.jpg"] if is_wood else (
        ["/images/cat-clinker.jpg"] if kind == "step" else ["/images/cat-slab.jpg"])


def main():
    sh = json.load(open(os.path.join(D, "paradyz-price", "sheets.json"), encoding="utf-8"))
    sl = json.load(open(os.path.join(D, "slavdom", "products.json"), encoding="utf-8"))
    hc = json.load(open(os.path.join(D, "hitceramics", "products.json"), encoding="utf-8"))

    # характеристики Славдома: (КОЛЛЕКЦИЯ, цвет) → карточка
    sl_idx = {}
    for r in sl:
        if (r.get("brand") or "") != "Paradyz":
            continue
        m = re.search(r"Paradyz\s+([A-Za-z]+),?\s*([A-Za-z]+)", r.get("name") or "")
        if m:
            sl_idx.setdefault((m.group(1).upper(), m.group(2).lower()), r)

    # фото с их сайта: (КОЛЛЕКЦИЯ, цвет) → url
    hc_photo = {}
    for r in hc:
        if not r.get("photo"):
            continue
        m = re.search(r"(?:Paradyz\s+)?([A-Z][A-Za-z]+)\s+([A-Za-z]+)", r["name"])
        if m:
            hc_photo.setdefault((m.group(1).upper(), m.group(2).lower()), r["photo"])

    groups = {}

    # ── ступени и клинкерная плитка ────────────────────────────────────────────
    for r in sh["Клинкерные ступени подоконники "][6:]:
        if len(r) < 10 or not (r[0] or "").strip().isdigit():
            continue
        art, coll, purpose, name, size = r[0], r[1], r[2], r[3], r[4]
        if purpose.strip().lower() == "подоконник":
            continue
        code = element_of(name)
        if not code:
            continue
        price = fnum(r[9])
        if not price:
            continue
        color = color_of(name, coll)
        dims = [fnum(x) for x in re.findall(r"[\d,]+", size)]
        e = {
            "code": code, "name": ELEMENT_NAME[code],
            "size_mm": "x".join(str(int(d)) if d == int(d) else str(d) for d in dims),
            "unit": "pcs",
            "weight_kg": fnum(r[5]) or 0,
            "per_pallet": int(fnum(r[8])) if fnum(r[8]) else None,
            "price_rub": round(price),
            "_art": art, "_per_pack": fnum(r[7]),
        }
        if code in ("front", "riser", "plinth") and dims:
            e["length_m"] = round(dims[0] / 1000, 3)
        if code == "front" and len(dims) >= 3:
            # Тип и длина кромки — по фактической геометрии, а НЕ по строке прайса:
            # прайс называл «с капиносом» и простые ступени. Толщина < 10 мм —
            # «простая с насечками» (насечки вдоль длинной стороны, она и лежит
            # вдоль кромки: 300x600 → 0.6). Капиносная — глубина 330 в размере
            # первая, вдоль кромки идёт меньшая сторона (330x300 → 0.3).
            if dims[-1] < 10:
                e["name"] = "Ступень простая (с насечками)"
                e["length_m"] = round(max(dims[0], dims[1]) / 1000, 3)
            else:
                e["length_m"] = round(min(dims[0], dims[1]) / 1000, 3)
        if code == "base" and fnum(r[6]):
            e["per_sqm"] = fnum(r[6])
        groups.setdefault((coll.strip(), color, "step"), []).append(e)

    # ── террасные плиты 20 мм ──────────────────────────────────────────────────
    for r in sh["Террасные плиты 20 мм"][7:]:
        if len(r) < 11 or not (r[0] or "").strip().isdigit():
            continue
        art, coll, name, size = r[0], r[1].strip(), r[3], r[4]
        price = fnum(r[10])
        if not price or not coll:
            continue
        dims = [fnum(x) for x in re.findall(r"[\d,]+", size)]
        if len(dims) < 2:
            continue
        color = color_of(name, coll)
        fmt = {
            "code": f"{int(dims[0])}x{int(dims[1])}",
            "size_mm": "x".join(str(int(d)) if d == int(d) else str(d) for d in dims),
            "thickness_mm": int(fnum(r[5]) or 20),
            "weight_kg": fnum(r[6]) or 0,
            "per_sqm": fnum(r[7]) or 0,
            "per_pallet": int(fnum(r[9])) if fnum(r[9]) else None,
            "price_rub_pcs": round(price),
            "price_rub_sqm": round(fnum(r[12])) if len(r) > 12 and fnum(r[12]) else 0,
            "_art": art,
        }
        groups.setdefault((coll, color, "slab"), []).append(fmt)

    products, photo_jobs = [], []
    for (coll, color, kind), items in sorted(groups.items()):
        pid = slug(f"paradyz-{coll}-{color}")
        key = (coll.upper().split()[0], color.lower().split()[0])
        src = sl_idx.get(key, {})
        f = src.get("features_raw", {})
        is_wood = coll.upper().split()[0] in WOOD

        specs = {"surface": "wood" if is_wood else "structured",
                 "color": COLOR_RU.get(color.lower(), color),
                 "color_hex": COLOR_HEX.get(color.lower().split()[0], "#9A8F80")}
        if f.get("Марка морозостойкости"):
            specs["frost_resistance"] = f["Марка морозостойкости"]
        if fnum(f.get("Водопоглощение, %")) is not None:
            specs["water_absorption_pct"] = fnum(f.get("Водопоглощение, %"))
        if f.get("Класс противоскольжения"):
            specs["slip_resistance"] = f["Класс противоскольжения"].split(",")[0].strip()

        photo_url = hc_photo.get(key)
        photo_dst = f"/images/products/{pid}/photo_1.png"
        if photo_url:
            photo_jobs.append((photo_url, os.path.join(SITE, "public", photo_dst.lstrip("/"))))

        if kind == "step":
            order = ["front", "corner_l", "riser", "base", "plinth"]
            elems = {}
            for e in items:
                prev = elems.get(e["code"])
                if prev is None or (e["code"] != "base" and (e.get("length_m") or 0) > (prev.get("length_m") or 0)):
                    elems[e["code"]] = e
            payload = sorted(elems.values(), key=lambda x: order.index(x["code"]))
            category, kind_ru = ("terrasnyy-klinker", "клинкерные ступени")
            sku = payload[0]["_art"]
        else:
            payload = sorted(items, key=lambda x: x["price_rub_pcs"])
            category = "plastiny-pod-derevo" if is_wood else "terrasnye-plastiny"
            kind_ru = "керамогранит под дерево" if is_wood else "террасные пластины 20 мм"
            sku = payload[0]["_art"]

        title = f"Paradyz {coll} {color}".replace(" —", "")
        products.append({
            "id": pid, "brand": "Paradyz",
            "product_type": "step_system" if kind == "step" else "slab",
            "application": (["kryltso", "lestnitsa-ulitsa"] if kind == "step"
                            else ["terrasa", "dorozhki", "landshaft-opory"]),
            "category": category, "collection": f"{coll} {color}".strip(),
            "sku": sku, "active": True, "price_updated_at": PRICE_DATE,
            "elements": [{k: v for k, v in e.items() if not k.startswith("_")} for e in payload] if kind == "step" else None,
            "formats": [{k: v for k, v in e.items() if not k.startswith("_")} for e in payload] if kind == "slab" else None,
            "specs": specs,
            "photos": photos_for(pid, photo_url, photo_dst, is_wood, kind),
            "seo": {
                "title": f"{kind_ru.capitalize()} {title} — цена, характеристики",
                "description": f"{kind_ru.capitalize()} {title}: розничная цена, поэлементный "
                               "расчёт комплекта, доставка по России и СНГ.",
                "h1": f"{kind_ru.capitalize()} {title}",
            },
        })

    got = 0
    for url, dst in photo_jobs:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if os.path.exists(dst):
            got += 1
            continue
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=45) as rsp, open(dst, "wb") as fh:
                fh.write(rsp.read())
            got += 1
        except Exception as e:
            print("  !! фото", url, e)

    bycoll = {}
    for p in products:
        bycoll.setdefault((p["collection"].rsplit(" ", 1)[0], p["product_type"]), []).append(p)
    for ps in bycoll.values():
        if len(ps) > 1:
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
            return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'
        if isinstance(v, list):
            return "[\n" + ",\n".join(sp + "  " + ts(x, ind + 1) for x in v) + "\n" + sp + "]"
        if isinstance(v, dict):
            items = [(k, x) for k, x in v.items() if x is not None]
            return "{\n" + ",\n".join(f"{sp}  {k}: {ts(x, ind + 1)}" for k, x in items) + "\n" + sp + "}"
        raise TypeError(type(v))

    header = f'''/**
 * Paradyz — из прайса «Прайс Paradyz полный от 01.06.26.xlsx», цены РОЗНИЧНЫЕ.
 * Артикул, размер, вес, шт/м², шт/поддон и цена — из прайса; R-класс, морозостойкость
 * и водопоглощение подмешаны из карточек Славдома; фото — с hit-ceramics.ru.
 * Сгенерировано scripts/gen_paradyz_price.py, вручную не править.
 *
 * Товаров: {len(products)}. Прайс действителен с 01.06.2026.
 */

import type {{ Product }} from "../types";

export const PARADYZ_PRICE_PRODUCTS: Product[] = '''
    out = os.path.join(SITE, "lib", "catalog", "generated", "paradyz-price.ts")
    open(out, "w", encoding="utf-8").write(header + ts(products, 0) + ";\n")

    import collections as C
    print(f"товаров Paradyz: {len(products)} | фото: {got}")
    print("тип:", dict(C.Counter(p["product_type"] for p in products)))
    print("категории:", dict(C.Counter(p["category"] for p in products)))
    el = C.Counter(e["code"] for p in products if p["elements"] for e in p["elements"])
    print("элементы:", dict(el))
    print("со спеками Славдома:", sum(1 for p in products if len(p["specs"]) > 3),
          "| с фото:", sum(1 for p in products if "products/" in p["photos"][0]))


if __name__ == "__main__":
    main()
