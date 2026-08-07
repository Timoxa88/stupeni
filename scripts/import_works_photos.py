#!/usr/bin/env python3
"""
Галерея «Наши работы» — импорт собственной съёмки объектов (07.08.2026).

Источник: папка Кирилла `Downloads/ступени` (26 кадров с телефона и из мессенджеров).
Заменяет прежнюю подборку из архива Битрикс24.Диска (`fetch_b24_objects.py`,
файлы /images/objects/*.jpg) — это уже не кадры производителя и не архив дилера,
а наши объекты, снятые на месте.

Что делает: exif_transpose (кадры с телефона лежат повёрнутыми), даунскейл до
1600 по длинной стороне, JPEG q85 БЕЗ метаданных (PIL пишет файл заново — GPS
и модель камеры не переносятся), вывод в public/images/objects/works/.

Правила отбора (см. site-content-third-party-policy):
  * НЕ берём кадры с вывесками сторонних заведений — «АмаЛьЯ» и «Хмельнiцкi»
    (photo_2024-12-23 12.17.38 / .42): на сайте не должно быть чужих брендов.
  * НЕ берём тёмный кадр WhatsApp 2023-08-17 — ступени на нём не читаются.
  * Никакой гео-привязки ни в имени файла, ни в подписи. Коллекция указывается
    ТОЛЬКО там, где она известна из имени исходника (файлы «1-1 Semir Rosa» и т.п.
    назвал Кирилл); для безымянных кадров подпись описывает сцену без коллекции —
    угадывать коллекцию по фото нельзя.

Перегенерация: положить исходники в SRC и запустить. Итоговый манифест
(src → alt) живёт в lib/images.ts → OBJECTS.
"""

from pathlib import Path

from PIL import Image, ImageOps

import os

# В WSL «Загрузки» Кирилла — на стороне Windows; переопределяется через WORKS_SRC.
SRC = Path(os.environ.get("WORKS_SRC") or "/mnt/c/Users/Administrator/Downloads/ступени")
if not SRC.exists():
    SRC = Path.home() / "Downloads" / "ступени"
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "objects" / "works"
MAX_SIDE = 1600
QUALITY = 85

# исходник -> (имя файла на сайте, alt)
PHOTOS: list[tuple[str, str, str]] = [
    ("1-1 Semir Rosa.jpg", "semir-rosa-lestnica.jpg",
     "Уличная лестница в четыре ступени вдоль фасада, клинкер Paradyz Semir Rosa"),
    ("1-1 Viano Antracite.jpeg", "viano-antracite-ploshchadka.jpg",
     "Площадка со ступенью и капиносом из тёмного клинкера, Paradyz Viano Antracite"),
    ("1-1 Viano Beige.jpg", "viano-beige-kryltso.jpg",
     "Крыльцо с площадкой в диагональной укладке и ступенями с насечкой, клинкер Paradyz Viano Beige"),
    ("1-11 Scandiano Ochra.jpg", "scandiano-ochra-kryltso.jpg",
     "Крыльцо с охристой площадкой и ступенями с насечкой, клинкер Paradyz Scandiano Ochra"),
    ("1-2 Viano Antracite.jpeg", "viano-antracite-kryltso.jpg",
     "Крыльцо в две ступени у входной двери, клинкер Paradyz Viano Antracite"),
    ("1-3 Natural Brown.jpg", "natural-brown-lestnica.jpg",
     "Уличная лестница с коваными перилами, клинкер Paradyz Natural Brown"),
    ("1-3 Scandiano Rosso.jpg", "scandiano-rosso-ploshchadka.jpg",
     "Площадка перед входом с гранитным бордюром, клинкер Paradyz Scandiano Rosso"),
    ("1-4 Ilario Beige.jpg", "ilario-beige-kryltso.jpg",
     "Крыльцо с широкой площадкой и ступенями с насечкой, клинкер Paradyz Ilario Beige"),
    ("1-6 Scandiano Brown.jpg", "scandiano-brown-lestnica.jpg",
     "Лестница входной группы в тёмном клинкере, Paradyz Scandiano Brown"),
    ("2-1 Semir Beige.jpg", "semir-beige-kryltso.jpg",
     "Многоугольное крыльцо в три ступени, клинкер Paradyz Semir Beige"),
    ("2-1 Viano Grys.jpg", "viano-grys-stupen.jpg",
     "Ступень с насечкой и террасная плита крупным планом, Paradyz Viano Grys"),
    ("2-2 Scandiano Brown.jpeg", "scandiano-brown-terrasa.jpg",
     "Терраса с обеденной зоной у кирпичного дома, клинкер Paradyz Scandiano Brown"),
    ("5-99 Viano Grys.jpg", "viano-grys-lestnica.jpg",
     "Полукруглая парадная лестница с коваными перилами, клинкер Paradyz Viano Grys"),
    ("viano grys+viano antracite1.jpeg", "viano-grys-antracite-veranda.jpg",
     "Веранда с полом в шахматную укладку, клинкер Paradyz Viano Grys и Viano Antracite"),
    # кадры без известной коллекции — подпись только по сцене
    ("751aa64f-8ac9-4305-acf8-01402d292041.jpg", "kryltso-terrakota.jpg",
     "Крыльцо с терракотовой плиткой и цветами у входной двери"),
    ("WhatsApp Image 2023-06-11 at 17.46.33.jpeg", "lestnica-kovanye-perila.jpg",
     "Крыльцо-лестница с коваными перилами у кирпичного дома"),
    ("WhatsApp Image 2023-06-12 at 17.29.16.jpeg", "ploshchadka-moshchenie.jpg",
     "Мощение двора крупноформатным керамогранитом 20 мм"),
    ("WhatsApp Image 2024-07-19 at 11.57.09.jpeg", "kryltso-dve-stupeni.jpg",
     "Крыльцо в две ступени с площадкой у входной двери"),
    ("photo_2023-07-19 11.48.39.jpeg", "lestnica-vhodnaya-gruppa.jpg",
     "Уличная лестница входной группы со ступенями с насечкой"),
    ("photo_2025-02-18 09.55.42.jpeg", "shirokaya-lestnica.jpg",
     "Широкая уличная лестница входной группы"),
    ("photo_2025-12-03 18.03.57.jpeg", "vnutrennyaya-lestnica.jpg",
     "Внутренняя лестница со ступенями с насечкой"),
    ("photo_5265092420259937751_y.jpg", "lestnica-v-sad.jpg",
     "Уличная лестница в сад из тёмного клинкера"),
    ("snapedit_1751291479936.jpg", "kryltso-chetyre-stupeni.jpg",
     "Крыльцо в четыре ступени у кирпичного дома"),
]

SKIPPED = {
    "photo_2024-12-23 12.17.38.jpeg": "вывеска стороннего заведения",
    "photo_2024-12-23 12.17.42.jpeg": "вывеска стороннего заведения",
    "WhatsApp Image 2023-08-17 at 13.52.58.jpeg": "тёмный кадр, ступени не читаются",
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for src_name, out_name, alt in PHOTOS:
        src = SRC / src_name
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        im.save(OUT / out_name, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        rows.append((out_name, im.width, im.height, alt))
        print(f"{src_name:50s} -> {out_name:36s} {im.width}x{im.height}")

    print("\n// вставить в lib/images.ts → OBJECTS")
    for name, w, h, alt in rows:
        print(f'  {{ src: "/images/objects/works/{name}", w: {w}, h: {h}, alt: "{alt}" }},')
    for name, why in SKIPPED.items():
        print(f"# пропущен: {name} — {why}")


if __name__ == "__main__":
    main()
