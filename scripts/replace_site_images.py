#!/usr/bin/env python3
"""
Замена стоковых изображений сайта (hero, категории, галерея) на официальные фото
производителей из папки парсинга.

Зачем: ТЗ §5 прямо запрещает сток, а в /public/images лежали Unsplash/Pexels.
Приоритет источников по правилу заказчика: свой сайт → сайт производителя →
собственная съёмка → заглушка. Фото объектов и лайфстайл-кадры производителей —
это второй приоритет, то есть законная замена стока.

Карточки товаров это НЕ трогает: у них свои спарсенные фото в
/public/images/products/, а cat-clinker/cat-slab/cat-wood служат им фолбэком —
поэтому в эти три слота ставим кадры, читаемые и как категория, и как материал.

Запуск:  python3 scripts/replace_site_images.py [--dry-run]
"""

import sys
from pathlib import Path

from PIL import Image

SRC_ROOT = Path(
    "/mnt/c/Users/Administrator/Desktop/Парсинг ХИТ КЕРАМИКС/"
    "Контент сайтов/Парсинг для лендинга Ступени"
)
DST = Path(__file__).resolve().parent.parent / "public" / "images"

# target, source, max_width, «есть ли на кадре логотип производителя», описание
MAPPING = [
    (
        "hero.jpg",
        "Exagres/products/gresan/photo_1.jpg",
        2000,
        False,
        "Зимняя терраса с террактовым клинкером Exagres Gresan, ступени и снег",
    ),
    (
        "cat-clinker.jpg",
        "Westerwald Klinker/products/stupeni-atrium/photo_1.jpg",
        1600,
        True,
        "Макро клинкерных ступеней с капиносом (Westerwälder Klinker Atrium)",
    ),
    (
        "cat-slab.jpg",
        "Exagres/products/bedford/photo_1.jpg",
        2000,
        False,
        "Крупноформатный керамогранит Exagres Bedford у бассейна",
    ),
    (
        "cat-wood.jpg",
        "Stroeher/photos/lifestyle_garten.webp",
        1716,
        False,
        "Керамогранит под дерево Stroeher, терраса у воды",
    ),
    (
        "gal-porch.jpg",
        "Маркастрой/objects/stupeni/krylco-dyuna.jpg",
        1280,
        False,
        "Реальный объект: крыльцо с клинкерными ступенями Маркастрой «Дюна»",
    ),
    (
        "gal-stairs.jpg",
        "Westerwald Klinker/products/stupeni-montmartre/photo_1.jpg",
        2000,
        True,
        "Уличная лестница зимой с подсветкой ступеней (Montmartre)",
    ),
    (
        "gal-terrace.jpg",
        "Exagres/objects/терраса/single-family-home-valencia.jpg",
        806,
        False,
        "Реальный объект: терраса частного дома, Валенсия",
    ),
    (
        "gal-path.jpg",
        "Westerwald Klinker/products/bruschatka/photo_2.jpg",
        2000,
        True,
        "Клинкерная брусчатка: подъезд и садовые дорожки",
    ),
    (
        "gal-pool.jpg",
        "Маркастрой/objects/bassein/bassein-shokolad.jpg",
        961,
        False,
        "Реальный объект: борт бассейна клинкером «Шоколад»",
    ),
    (
        "gal-decking.jpg",
        "Exagres/objects/терраса-бассейн/private-pool-benicassim.jpg",
        1536,
        False,
        "Реальный объект: настил под дерево вокруг частного бассейна, Беникассим",
    ),
]


def main() -> int:
    dry = "--dry-run" in sys.argv
    if not SRC_ROOT.is_dir():
        print(f"НЕТ папки парсинга: {SRC_ROOT}")
        return 1

    rows = []
    for target, rel, max_w, watermark, note in MAPPING:
        src = SRC_ROOT / rel
        if not src.is_file():
            print(f"ПРОПУСК (нет файла): {rel}")
            continue

        with Image.open(src) as im:
            im = im.convert("RGB")
            w, h = im.size
            if w > max_w:
                im = im.resize((max_w, round(h * max_w / w)), Image.LANCZOS)
            out = DST / target
            if not dry:
                im.save(out, "JPEG", quality=86, optimize=True, progressive=True)
            size_kb = (out.stat().st_size // 1024) if out.is_file() else 0

        rows.append((target, f"{im.size[0]}x{im.size[1]}", f"{size_kb} КБ", rel, watermark, note))
        print(f"{'(dry) ' if dry else ''}{target:<16} ← {rel}")

    print("\n| файл | размер | вес | источник | логотип производителя |")
    print("|---|---|---|---|---|")
    for t, dim, kb, rel, wm, _ in rows:
        print(f"| {t} | {dim} | {kb} | {rel} | {'да' if wm else 'нет'} |")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
