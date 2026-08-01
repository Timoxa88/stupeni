#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Достаёт массив товаров из сгенерированного TS-файла каталога в JSON."""
import json
import re


def load_ts_array(path: str, marker: str):
    s = open(path, encoding="utf-8").read()
    i = s.index(marker) + len(marker)
    depth = 0
    end = len(s)
    for j in range(i, len(s)):
        if s[j] == "[":
            depth += 1
        elif s[j] == "]":
            depth -= 1
            if depth == 0:
                end = j + 1
                break
    body = s[i:end]
    body = re.sub(r"(?m)^(\s*)([A-Za-z_][A-Za-z0-9_]*):", r'\1"\2":', body)
    body = re.sub(r",(\s*[}\]])", r"\1", body)          # висячие запятые от патчей фото
    return json.loads(body)


if __name__ == "__main__":
    import collections

    P = "/mnt/c/Users/Administrator/Desktop/Сайты/Проекты/stupeni/lib/catalog/generated"
    par = load_ts_array(f"{P}/paradyz-price.ts", "PARADYZ_PRICE_PRODUCTS: Product[] = ")
    rest = load_ts_array(f"{P}/products.ts", "REAL_PRODUCTS: Product[] = ")
    json.dump(par, open("paradyz_catalog.json", "w"), ensure_ascii=False)
    json.dump(rest, open("rest_catalog.json", "w"), ensure_ascii=False)
    print("Paradyz:", len(par), "active:", sum(1 for d in par if d.get("active")))
    print("Остальные:", len(rest), "active:", sum(1 for d in rest if d.get("active")))
    print(collections.Counter(d["product_type"] for d in par))
    for d in par[:5]:
        print(" ", d["id"], "|", d["collection"], "|", d["specs"].get("color"), "|",
              [e["size_mm"] for e in d.get("elements", [])][:4])
