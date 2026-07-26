#!/usr/bin/env python3
"""
Категория «Террасные пластины под дерево» — из каталога hit-ceramics.ru.

Почему отсюда: это СВОЙ сайт заказчика, значит цены — свои, а не рыночные.
Технические характеристики (вес, шт/поддон, R-класс, морозостойкость, водопоглощение)
у них в листинге не выводятся — их подмешиваем из карточек Славдома по совпадению
«бренд + коллекция + цвет + размер».

Результат дописывается в lib/catalog/generated/products.ts (заменяя товары той же
коллекции, собранные ранее из Славдома) — запускать ПОСЛЕ gen_catalog.py.
"""
import json, os, re, urllib.request

D = os.path.dirname(os.path.abspath(__file__))
SITE = "/mnt/c/Users/Administrator/Desktop/Сайты/Проекты/stupeni"
GEN = os.path.join(SITE, "lib", "catalog", "generated", "products.ts")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

# Керамогранит с текстурой дерева в их каталоге террасных плит.
WOOD_COLLECTIONS = {"RUSTLAND", "SHERWOOD", "WILLOW", "TRUELAND"}

COLOR_HEX = {
    "brown": "#7A4B33", "naturale": "#C09A6B", "grys": "#8A8A86", "bianco": "#E4DED2",
    "ochra": "#C7A45C", "beige": "#C9B79C", "honey": "#C98F4B", "gold": "#C2A15A",
}
COLOR_RU = {
    "brown": "Коричневый", "naturale": "Натуральный", "grys": "Серый", "bianco": "Белый",
    "ochra": "Охра", "beige": "Бежевый", "honey": "Медовый", "gold": "Золотистый",
}


def slug(s):
    tr = {"а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ж": "zh", "з": "z",
          "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p",
          "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch",
          "ш": "sh", "щ": "sch", "ы": "y", "э": "e", "ю": "yu", "я": "ya", "ь": "", "ъ": ""}
    s = "".join(tr.get(c, c) for c in s.lower())
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-")


def parse_name(n):
    """«Террасная плита RUSTLAND BROWN GRES SZKL. REKT. STRUKTURA 2.0 MAT., 295*1195*20»"""
    body = re.sub(r"^Террасная плита\s+", "", n)
    m = re.match(r"([A-Z][A-Z\-]+)\s+([A-Z][A-Za-z]+)", body)
    if not m:
        return None, None
    return m.group(1), m.group(2)


def size_of(s):
    d = [float(x.replace(",", ".")) for x in re.findall(r"[\d,]+", s or "")]
    return d[:3] if len(d) >= 3 else None


def main():
    hc = json.load(open(os.path.join(D, "hitceramics", "products.json"), encoding="utf-8"))
    sl = json.load(open(os.path.join(D, "slavdom", "products.json"), encoding="utf-8"))

    # индекс характеристик Славдома: (коллекция, цвет) → карточка
    sl_idx = {}
    for r in sl:
        if (r.get("brand") or "") != "Paradyz":
            continue
        nm = (r.get("name") or "").lower()
        for c in WOOD_COLLECTIONS:
            if c.lower() in nm:
                col = re.search(rf"{c.lower()}\s*,?\s*([a-zа-я]+)", nm)
                sl_idx[(c, (col.group(1) if col else "").lower())] = r
                break

    products, photos_to_get = [], []
    for r in hc:
        if r["section"] != "terrasnye-plity":
            continue
        coll, color = parse_name(r["name"])
        if coll not in WOOD_COLLECTIONS:
            continue
        dims = size_of(r.get("size") or "")
        if not dims:
            continue
        w, h, th = dims
        per_sqm = round(1 / ((w / 1000) * (h / 1000)), 2)
        pid = slug(f"paradyz-{coll}-{color}")
        src = sl_idx.get((coll, color.lower())) or {}
        f = src.get("features_raw", {})

        def fnum(v):
            m = re.search(r"\d+(?:[.,]\d+)?", str(v or ""))
            return float(m.group().replace(",", ".")) if m else None

        photo_dst = f"/images/products/{pid}/photo_1.png"
        if r.get("photo"):
            photos_to_get.append((r["photo"], os.path.join(SITE, "public", photo_dst.lstrip("/"))))

        specs = {"surface": "wood",
                 "color": COLOR_RU.get(color.lower(), color),
                 "color_hex": COLOR_HEX.get(color.lower(), "#B58A5C")}
        if f.get("Марка морозостойкости"):
            specs["frost_resistance"] = f["Марка морозостойкости"]
        if fnum(f.get("Водопоглощение, %")) is not None:
            specs["water_absorption_pct"] = fnum(f.get("Водопоглощение, %"))
        if f.get("Класс противоскольжения"):
            specs["slip_resistance"] = f["Класс противоскольжения"].split(",")[0].strip()

        products.append({
            "id": pid, "brand": "Paradyz", "product_type": "slab",
            "application": ["terrasa", "dorozhki", "landshaft-opory"],
            "category": "plastiny-pod-derevo",
            "collection": f"{coll.capitalize()} {color}",
            "sku": src.get("sku") or (r.get("good_id") or pid),
            "active": True, "price_updated_at": "2026-07-26",
            "formats": [{
                "code": f"{int(w)}x{int(h)}", "size_mm": f"{int(w)}x{int(h)}x{int(th)}",
                "thickness_mm": int(th),
                "weight_kg": fnum(src.get("weight_kg")) or 0,
                "per_sqm": per_sqm,
                "per_pallet": int(fnum(src.get("per_pallet"))) if src.get("per_pallet") else None,
                "price_rub_pcs": round(r["price_pcs"]) if r.get("price_pcs") else 0,
                "price_rub_sqm": round(r["price_m2"]) if r.get("price_m2") else 0,
            }],
            "specs": specs,
            "photos": [photo_dst if r.get("photo") else "/images/cat-wood.jpg"],
            "seo": {
                "title": f"Керамогранит под дерево Paradyz {coll.capitalize()} {color} 20 мм — цена",
                "description": (f"Террасные пластины под дерево Paradyz {coll.capitalize()} {color}, "
                                f"{int(w)}×{int(h)}×{int(th)} мм: декинг-эффект, укладка на клей или "
                                "регулируемые опоры, расчёт комплекта онлайн."),
                "h1": f"Террасные пластины под дерево Paradyz {coll.capitalize()} {color}",
            },
        })

    # фото с их сайта
    got = 0
    for url, dst in photos_to_get:
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

    # варианты (цветовые чипы) внутри коллекции
    bycoll = {}
    for p in products:
        bycoll.setdefault(p["collection"].split(" ")[0], []).append(p)
    for ps in bycoll.values():
        if len(ps) > 1:
            for p in ps:
                p["variants"] = [{"id": q["id"], "color": q["specs"]["color"],
                                  "color_hex": q["specs"]["color_hex"], "photo": q["photos"][0]}
                                 for q in ps]

    # пишем ОТДЕЛЬНЫМ модулем (правка текста products.ts ломала синтаксис):
    # seed.ts вытеснит из основного каталога товары тех же коллекций по префиксам
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
 * Категория «Террасные пластины под дерево» — из каталога hit-ceramics.ru
 * (свой сайт заказчика → СВОИ цены), характеристики подмешаны из карточек Славдома.
 * Сгенерировано scripts/gen_wood_hc.py, вручную не править.
 *
 * Товаров: {len(products)}. Цена за шт и за м² — как на hit-ceramics.ru на 26.07.2026.
 */

import type {{ Product }} from "../types";

/** Коллекции, которые перекрываются этими данными (вытесняют записи из products.ts). */
export const WOOD_HC_COLLECTIONS = {json.dumps(sorted(WOOD_COLLECTIONS), ensure_ascii=False)} as const;

export const WOOD_HC_PRODUCTS: Product[] = '''
    out = os.path.join(SITE, "lib", "catalog", "generated", "wood-hc.ts")
    open(out, "w", encoding="utf-8").write(header + ts(products, 0) + ";\n")
    dropped = 0

    print(f"товаров «под дерево» с их сайта: {len(products)}; фото получено: {got}; "
          f"вытеснено старых записей тех же коллекций: {dropped}")
    for p in products:
        fmt = p["formats"][0]
        print(f"  {p['id']:34} {fmt['size_mm']:16} {fmt['price_rub_pcs']:>6} ₽/шт  "
              f"{fmt['price_rub_sqm']:>6} ₽/м²  спеки: {'да' if len(p['specs'])>3 else 'нет'}")


if __name__ == "__main__":
    main()
