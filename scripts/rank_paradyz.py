#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Порядок карточек Paradyz для лендинга «Ступени» — по тому же правилу,
что и разделы каталога hit-ceramics.ru (см. hit-ceramics-hero/sort-klinker-2026-08-01):

  A. есть свободный остаток  → по остатку в м², при равенстве — по выручке;
  B. остатка нет, но продавалось → по выручке янв–июнь 2026;
  C. остальное → по алфавиту.

Отличие от основного сайта: там карточка = один элемент (капинос / базовая
плитка), здесь карточка = коллекция+цвет целиком, поэтому остаток и продажи
СУММИРУЮТСЯ по всем её элементам (ступень, капинос, угловая, базовая плитка).

Источники:
  остатки — июль/склад/Анализ_остатков_01_08_2026.xlsx, лист «Все SKU» (на 01.08.2026);
  продажи — июнь/отгрузки/янв-июнь.xls (колонка «Сумма»).
Результат — lib/catalog/generated/paradyz-rank.ts (id → место + факты).
"""
import json
import re
import sys
from collections import defaultdict

import openpyxl
import xlrd

BASE = ("/mnt/c/Users/Administrator/Desktop/Управленческая отчётность ЗЕ ВАН/"
        "управленческая отчетность оперативная")
STOCK_XLSX = f"{BASE}/июль/склад/Анализ_остатков_01_08_2026.xlsx"
SALES_XLS = f"{BASE}/июнь/отгрузки/янв-июнь.xls"
PROJECT = "/mnt/c/Users/Administrator/Desktop/Сайты/Проекты/stupeni"
OUT_TS = f"{PROJECT}/lib/catalog/generated/paradyz-rank.ts"

# Категории 1С, которые к ступеням и террасным плитам отношения не имеют.
# «Фасадная плитка» — другой товар той же коллекции: её остаток сюда брать нельзя.
# Бренд не фильтруем: террасные плиты 20 мм лежат в 1С под брендом
# «Террасные плиты (все производители)», хотя это тот же Paradyz.
STOCK_SKIP_CATS = {"Фасадная плитка", "Подоконники", "Кирпич"}
# Строки отгрузок берём только «ступенчато-напольные» — по маркерам в названии
# (PLYTA TARASOWA — так в 1С названы террасные плиты 20 мм).
SALES_MARKERS = ("ступень", "капинос", "подступен", "плитка базовая",
                 "напольная", "террас", "угловая", "tarasowa")
# Строки отгрузок, которые надо отбросить даже при совпадении маркера.
SALES_STOP = ("фасад",)

LATIN = re.compile(r"[A-Za-z]{2,}")
SIZE = re.compile(r"\d+[.,]?\d*\s*[xх*Xх]\s*\d+[.,]?\d*(?:\s*[xх*X]\s*\d+[.,]?\d*)?")


def toks(name: str) -> set:
    """Латинские слова названия — у Paradyz это коллекция + цвет + серия (Duro)."""
    s = SIZE.sub(" ", name)
    return {w.lower() for w in LATIN.findall(s)}


def area_m2(name: str):
    """Площадь одной штуки, м². Размеры в наименованиях 1С — в сантиметрах."""
    s = name.replace(",", ".")
    m = re.search(r"(\d{2,3}(?:\.\d)?)\s*[xх*X]\s*(\d{2,3}(?:\.\d)?)", s)
    if not m:
        return None
    a, b = float(m.group(1)), float(m.group(2))
    if a > 100 or b > 100:            # размер записан в мм
        a, b = a / 10, b / 10
    return round(a * b / 10000, 5)    # см² → м²


# ── источники ────────────────────────────────────────────────────────────────
def read_stock():
    wb = openpyxl.load_workbook(STOCK_XLSX, data_only=True, read_only=True)
    ws = wb["Все SKU"]
    rows = ws.iter_rows(values_only=True)
    hdr = next(rows)
    out = []
    for r in rows:
        d = dict(zip(hdr, r))
        name = d.get("Наименование")
        if not name:
            continue
        if str(d.get("Категория") or "") in STOCK_SKIP_CATS:
            continue
        free = int(d.get("Свободный") or 0)
        out.append({"name": str(name), "free": free, "toks": toks(str(name)),
                    "area": area_m2(str(name)), "brand": str(d.get("Бренд") or ""),
                    "cat": str(d.get("Категория") or ""),
                    "free_rub": float(d.get("Свободный ₽") or 0)})
    return out


def read_sales():
    sh = xlrd.open_workbook(SALES_XLS).sheet_by_index(0)
    agg = defaultdict(lambda: {"qty": 0.0, "sum": 0.0})
    for i in range(sh.nrows):
        name = str(sh.cell_value(i, 0)).strip()
        if not name or name.startswith(("Реализация", "Номенклатура")):
            continue
        if str(sh.cell_value(i, 1)).strip():      # строки-заголовки/итоги
            continue
        low = name.lower()
        if not any(m in low for m in SALES_MARKERS) or any(s in low for s in SALES_STOP):
            continue

        def num(col):
            try:
                return float(sh.cell_value(i, col) or 0)
            except (ValueError, TypeError):
                return 0.0

        agg[name]["qty"] += num(2)
        agg[name]["sum"] += num(4)
    return [{"name": n, "toks": toks(n), **v} for n, v in agg.items()]


# ── сопоставление ────────────────────────────────────────────────────────────
def assign(rows, products):
    """Каждая строка 1С уходит товару с САМЫМ ДЛИННЫМ совпавшим набором слов.

    Иначе «Cloud Brown Duro 30х33 ступень» досталась бы и Cloud Brown, и
    Cloud Brown Duro — серия Duro это отдельный артикул с отдельным остатком.
    """
    hits = defaultdict(list)
    unmatched = []
    for row in rows:
        cands = [p for p in products if p["toks"] and p["toks"] <= row["toks"]]
        if not cands:
            unmatched.append(row)
            continue
        best = max(len(p["toks"]) for p in cands)
        for p in cands:
            if len(p["toks"]) == best:
                hits[p["id"]].append(row)
    return hits, unmatched


def main():
    from parse_catalog import load_ts_array

    catalog = load_ts_array(f"{PROJECT}/lib/catalog/generated/paradyz-price.ts",
                            "PARADYZ_PRICE_PRODUCTS: Product[] = ")
    products = [{"id": p["id"], "collection": p["collection"],
                 "active": bool(p.get("active")),
                 "type": p["product_type"],
                 "toks": toks(p["collection"])}
                for p in catalog]

    stock, sales = read_stock(), read_sales()
    st_hits, st_rest = assign(stock, products)
    sl_hits, sl_rest = assign(sales, products)

    rows = []
    for p in products:
        srows = st_hits.get(p["id"], [])
        free_m2 = sum((r["area"] or 0.09) * r["free"] for r in srows)
        rows.append({
            "id": p["id"], "collection": p["collection"], "active": p["active"],
            "free_m2": round(free_m2, 1),
            "free_rub": round(sum(r["free_rub"] for r in srows)),
            "sold_sum": round(sum(r["sum"] for r in sl_hits.get(p["id"], []))),
            "stock_rows": [r["name"] for r in srows],
            "sales_rows": [r["name"] for r in sl_hits.get(p["id"], [])],
        })

    A = sorted([r for r in rows if r["free_m2"] > 0],
               key=lambda r: (-r["free_m2"], -r["sold_sum"]))
    B = sorted([r for r in rows if r["free_m2"] <= 0 and r["sold_sum"] > 0],
               key=lambda r: -r["sold_sum"])
    C = sorted([r for r in rows if r["free_m2"] <= 0 and r["sold_sum"] <= 0],
               key=lambda r: r["collection"])

    order = []
    for group, start in ((A, 100), (B, 1000), (C, 2000)):
        s = start
        for r in group:
            order.append({**r, "sort": s})
            s += 10

    json.dump(order, open("paradyz_rank.json", "w"), ensure_ascii=False, indent=1)  # аудит рядом со скриптом
    print(f"карточек {len(rows)} | в наличии {len(A)} | без остатка, но продавалось {len(B)} | "
          f"остальное {len(C)}")
    print(f"строк 1С: остатки {len(stock)} (не сопоставлено {len(st_rest)}), "
          f"отгрузки {len(sales)} (не сопоставлено {len(sl_rest)})")
    print("\nТоп-15 по остатку:")
    for r in order[:15]:
        print(f"  SORT {r['sort']:>4} | {r['free_m2']:>9.1f} м² | {r['sold_sum']:>10} ₽ | "
              f"{r['collection']}{'' if r['active'] else '  (скрыт)'}")
    print("\nБез остатка, но продавалось (топ-10):")
    for r in order[len(A):len(A) + 10]:
        print(f"  SORT {r['sort']:>4} | {r['sold_sum']:>10} ₽ | {r['collection']}")
    if "--audit" in sys.argv:
        print("\nЧто на что село (все карточки с остатком):")
        for r in order:
            if r["free_m2"] <= 0:
                continue
            print(f'  {r["collection"]}  → {r["free_m2"]} м²')
            for n in r["stock_rows"]:
                print("      ", n)
    if st_rest:
        print(f"\nНе сопоставленные строки остатков ({len(st_rest)}, "
              f"свободный остаток {sum(r['free'] for r in st_rest)} шт), первые 20:")
        for r in sorted(st_rest, key=lambda r: -r["free"])[:20]:
            print("  ", r["cat"], "|", r["name"][:80], "| своб", r["free"])
    if "--write" in sys.argv:
        write_ts(order)


def write_ts(order):
    lines = [
        "/**",
        " * Порядок карточек Paradyz в листингах — по тому же правилу, что и разделы",
        " * каталога hit-ceramics.ru: сверху то, чего больше на складе, затем то, чего",
        " * нет, но что продавалось, затем остальное по алфавиту.",
        " *",
        " * Остаток — свободный (за вычетом резервов), в м², просуммированный по всем",
        " * элементам карточки (ступень, капинос, угловая, базовая плитка).",
        " * Источники: Анализ_остатков_01_08_2026.xlsx (срез на 01.08.2026) и",
        " * отгрузки янв–июнь 2026. Сгенерировано scripts/rank_paradyz.py, руками не править.",
        " */",
        "",
        "export interface ParadyzRank {",
        "  /** Место в листинге: меньше — выше. */",
        "  sort: number;",
        "  /** Свободный остаток, м² (0 — на складе нет). */",
        "  freeM2: number;",
        "  /** Выручка янв–июнь 2026, ₽ (0 — не продавалось). */",
        "  soldSum: number;",
        "}",
        "",
        "export const PARADYZ_RANK: Record<string, ParadyzRank> = {",
    ]
    for r in order:
        lines.append(f'  "{r["id"]}": {{ sort: {r["sort"]}, freeM2: {r["free_m2"]}, '
                     f'soldSum: {r["sold_sum"]} }},')
    lines += ["};", ""]
    open(OUT_TS, "w", encoding="utf-8").write("\n".join(lines))
    print(f"\nзаписано: {OUT_TS} ({len(order)} артикулов)")


if __name__ == "__main__":
    main()
