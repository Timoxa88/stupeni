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
# ОБА сгенерированных файла. Paradyz в seed.ts полностью вытесняется из
# products.ts и берётся из paradyz-price.ts (там свои, розничные цены), поэтому
# правка только первого файла для Paradyz не даёт на сайте вообще ничего —
# на этом я один раз потерял всю работу по фото Paradyz.
CATALOGS = [
    ROOT / "lib" / "catalog" / "generated" / "products.ts",
    ROOT / "lib" / "catalog" / "generated" / "paradyz-price.ts",
]
PHOTOS = ROOT / "public" / "images" / "products"
EXT = (".jpg", ".jpeg", ".png", ".webp")


# Суффиксы исполнения: это НЕ другой цвет, а другая фактура того же цвета.
FINISH = ("-gladkaya", "-strukturnaya", "-duro", "-matovaya", "-polirovannaya",
          "-rektifikat", "-s-kapinosom")


def color_key(pid: str) -> str:
    """paradyz-cloud-brown-strukturnaya → paradyz-cloud-brown."""
    changed = True
    while changed:
        changed = False
        for s in FINISH:
            if pid.endswith(s):
                pid, changed = pid[: -len(s)], True
    return pid


def shared_hashes() -> set[str]:
    """
    Кадры, которые лежат сразу у нескольких артикулов, — это фото КОЛЛЕКЦИИ,
    а не цвета. Такой кадр показывать нельзя: у Exagres Ardenas один и тот же
    рендер бассейна стоял и на Antracita (чёрный), и на Marfil (бежевый).

    Исключение (по решению заказчика 28.07): если все владельцы кадра — это один
    и тот же цвет в разных исполнениях (Cloud Brown / гладкая / структурная),
    кадр оставляем. Материал на снимке тот же, отличается только фактура.
    А вот Mattone Pietra Grafit и Mattone Sabbia Grafit — разные коллекции,
    и общий кадр у них по-прежнему отсекается.
    """
    seen: dict[str, set[str]] = defaultdict(set)
    for d in PHOTOS.iterdir():
        if not d.is_dir():
            continue
        for f in d.iterdir():
            if f.suffix.lower() in EXT:
                seen[hashlib.md5(f.read_bytes()).hexdigest()].add(d.name)
    return {
        h for h, owners in seen.items()
        if len(owners) > 1 and len({color_key(o) for o in owners}) > 1
    }


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
    for catalog in CATALOGS:
        process(catalog, dry)
    return 0


def process(catalog: Path, dry: bool) -> None:
    text = catalog.read_text(encoding="utf-8")

    # Каждый товар: "id" … "photos": [ … ].
    # Внутренность списка матчим как [^\]]*, а не .*? — иначе форма «photos: []»,
    # которую пишет сам этот скрипт, на следующем прогоне уже не находится,
    # и товар навсегда остаётся без фото, даже когда кадры появились.
    pat = re.compile(
        r'(\n    id: "(?P<id>[^"]+)",)(?P<body>.*?)(?P<ph>\n    photos: \[(?P<inner>[^\]]*)\],)',
        re.S,
    )

    force = "--force" in sys.argv
    patched, already, missing = 0, 0, []

    def repl(m: re.Match) -> str:
        nonlocal patched, already
        pid = m.group("id")
        has_own = "/images/products/" in m.group("inner")
        found = files_for(pid)

        if has_own and not force:
            already += 1
            return m.group(0)
        if not found:
            missing.append(pid)
            # без своего кадра карточка уходит на плашку цвета
            return m.group(0).replace(m.group("ph"), "\n    photos: [],")

        new_inner = ",\n".join(f'      "{u}"' for u in found)
        patched += 1
        return f'{m.group(1)}{m.group("body")}\n    photos: [\n{new_inner}\n    ],'

    out = pat.sub(repl, text)
    total = len(re.findall(r'\n    id: "', text))

    if not dry:
        catalog.write_text(out, encoding="utf-8")

    print(f"\n{catalog.name}: товаров {total}")
    print(f"уже имели своё фото: {already}")
    print(f"{'(dry) ' if dry else ''}подключено фото с диска: {patched}")
    print(f"осталось на заглушке (фото нет вовсе): {len(missing)}")
    if missing:
        print("  первые:", ", ".join(missing[:8]))


if __name__ == "__main__":
    raise SystemExit(main())
