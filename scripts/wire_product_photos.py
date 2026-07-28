#!/usr/bin/env python3
"""
Подтягивает в сгенерированный каталог фото, которые УЖЕ лежат в
public/images/products/<id>/, но на которые каталог не ссылается.

Как получилась рассинхронизация: gen_catalog.py проставляет фото только по
явной таблице PHOTO_MAP (бренд+коллекция → папка парсинга). Текстуры Paradyz
скачивались позже отдельным скриптом (fetch_paradyz_textures.py) прямо в
public/images/products/<id>/, а каталог после этого не перегенерировали —
99 товаров с готовыми фото продолжали показывать заглушку категории.
На витрине это выглядело как четыре одинаковые карточки подряд.

Скрипт правит ТОЛЬКО поле photos и только там, где сейчас стоит заглушка,
а на диске есть файлы. Цены, характеристики и состав не трогает.

Запуск:  python3 scripts/wire_product_photos.py [--dry-run]
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "lib" / "catalog" / "generated" / "products.ts"
PHOTOS = ROOT / "public" / "images" / "products"
EXT = (".jpg", ".jpeg", ".png", ".webp")


def files_for(pid: str) -> list[str]:
    d = PHOTOS / pid
    if not d.is_dir():
        return []
    return [f"/images/products/{pid}/{f.name}" for f in sorted(d.iterdir())
            if f.suffix.lower() in EXT][:4]


def main() -> int:
    dry = "--dry-run" in sys.argv
    text = CATALOG.read_text(encoding="utf-8")

    # каждый товар: "id" ... "photos": [ ... ]
    pat = re.compile(r'(\n    id: "(?P<id>[^"]+)",)(?P<body>.*?)(?P<ph>\n    photos: \[\n(?P<inner>.*?)\n    \],)',
                     re.S)

    patched, already, missing = 0, 0, []

    def repl(m: re.Match) -> str:
        nonlocal patched, already
        pid = m.group("id")
        inner = m.group("inner")
        has_own = "/images/products/" in inner
        found = files_for(pid)
        if has_own or not found:
            if has_own:
                already += 1
            else:
                missing.append(pid)
            return m.group(0)
        new_inner = ",\n".join(f'      "{u}"' for u in found)
        patched += 1
        return f'{m.group(1)}{m.group("body")}\n    photos: [\n{new_inner}\n    ],'

    out = pat.sub(repl, text)
    total = len(re.findall(r'\n    id: "', text))

    if not dry:
        CATALOG.write_text(out, encoding="utf-8")

    print(f"товаров в каталоге: {total}")
    print(f"уже имели своё фото: {already}")
    print(f"{'(dry) ' if dry else ''}подключено фото с диска: {patched}")
    print(f"осталось на заглушке (фото нет вовсе): {len(missing)}")
    if missing:
        print("  первые:", ", ".join(missing[:8]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
