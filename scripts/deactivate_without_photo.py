#!/usr/bin/env python3
"""
Снимает с витрины товары, для которых так и не нашлось фото своего артикула.

Решение заказчика 28.07.2026: «остальное убираем». Источники исчерпаны — свой
сайт, архив объектов на Диске, vipklinker.ru, markastroy.ru, keralux.ru; сайт
stroeher.ru не обходится (одностраничник на JS).

Товар НЕ удаляется из данных, а помечается `active: false`. Так он исчезает
с витрины и из выдачи (queries.activeProducts фильтрует по этому полю), но
остаётся в файле вместе с ценой и составом — вернуть его будет одной правкой,
как только появится съёмка.

Запуск:  python3 scripts/deactivate_without_photo.py [--dry-run] [--revert]
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOGS = [
    ROOT / "lib" / "catalog" / "generated" / "products.ts",
    ROOT / "lib" / "catalog" / "generated" / "paradyz-price.ts",
]

ENTRY = re.compile(
    r'(\n    id: "(?P<id>[^"]+)",\n    brand: "(?P<brand>[^"]+)",)'
    r'(?P<body>.*?)(?P<ph>\n    photos: \[(?P<inner>[^\]]*)\],)',
    re.S,
)


def main() -> int:
    dry = "--dry-run" in sys.argv
    revert = "--revert" in sys.argv
    total_off, by_brand = 0, {}

    for catalog in CATALOGS:
        text = catalog.read_text(encoding="utf-8")
        out = text

        for m in ENTRY.finditer(text):
            pid, brand = m.group("id"), m.group("brand")
            has_photo = "/images/products/" in m.group("inner")
            block = m.group(0)

            if revert:
                if "active: false" in block:
                    out = out.replace(block, block.replace("active: false", "active: true"))
                    total_off += 1
                continue

            if has_photo:
                # вернуть, если фото появилось, а товар был снят раньше
                if "active: false" in block:
                    out = out.replace(block, block.replace("active: false", "active: true"))
                continue

            if "active: true" in block:
                out = out.replace(block, block.replace("active: true", "active: false"))
                total_off += 1
                by_brand[brand] = by_brand.get(brand, 0) + 1

        if not dry:
            catalog.write_text(out, encoding="utf-8")

    verb = "возвращено" if revert else "снято с витрины"
    print(f"{'(dry) ' if dry else ''}{verb}: {total_off}")
    for b, n in sorted(by_brand.items(), key=lambda x: -x[1]):
        print(f"  {b}: {n}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
