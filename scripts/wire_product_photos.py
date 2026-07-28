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

import hashlib
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "lib" / "catalog" / "generated" / "products.ts"
PHOTOS = ROOT / "public" / "images" / "products"
EXT = (".jpg", ".jpeg", ".png", ".webp")


def shared_hashes() -> set[str]:
    """
    Кадры, которые лежат сразу у нескольких артикулов, — это фото КОЛЛЕКЦИИ,
    а не цвета. Такой кадр показывать нельзя: у Exagres Ardenas один и тот же
    рендер бассейна стоял и на Antracita (чёрный), и на Marfil (бежевый).
    Возвращаем их хеши, чтобы карточка ушла на честную плашку цвета.
    """
    seen: dict[str, set[str]] = defaultdict(set)
    for d in PHOTOS.iterdir():
        if not d.is_dir():
            continue
        for f in d.iterdir():
            if f.suffix.lower() in EXT:
                seen[hashlib.md5(f.read_bytes()).hexdigest()].add(d.name)
    return {h for h, owners in seen.items() if len(owners) > 1}


SHARED = shared_hashes()


def files_for(pid: str) -> list[str]:
    d = PHOTOS / pid
    if not d.is_dir():
        return []
    out = []
    for f in sorted(d.iterdir()):
        if f.suffix.lower() not in EXT:
            continue
        if hashlib.md5(f.read_bytes()).hexdigest() in SHARED:
            continue
        out.append(f"/images/products/{pid}/{f.name}")
    return out[:4]


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
        # --force переписывает и то, что уже проставлено: нужно, когда появились
        # фото со своего сайта и они должны вытеснить текстуры производителя.
        if (has_own and "--force" not in sys.argv) or not found:
            if has_own:
                already += 1
            else:
                missing.append(pid)
            return m.group(0) if found or has_own else m.group(0).replace(
                m.group("ph"), "\n    photos: [],")
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
