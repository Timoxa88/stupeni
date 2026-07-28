#!/usr/bin/env python3
"""
Галерея реальных объектов: тянет фото из Битрикс24.Диска и кладёт в public/images/objects/.

Источник — внутренняя папка портала hit-ceramics.bitrix24.ru:
«Информация для дилера / Фото объекты Paradyz / Paradyz наполка» (folderId 187687,
родитель 187703 — там же «фасады», «отливы», «крупноформатная плитка», «светлые фасады»).
Внутри 19 подпапок по коллекциям Paradyz, 246 файлов: фото реальных объектов с
российских участков (крыльца, лестницы, террасы), снятые на телефон, плюс видео.

Отбор ручной: PICKS ниже — кадры без впечатанных логотипов и дат, где видно
материал и сценарий. Полный обход дерева и контактные листы для пересмотра —
в scratchpad-скриптах walk_b24.py / sheet.py (одноразовые).

Токен вебхука в скрипт НЕ зашит: берётся из переменной окружения B24_WEBHOOK,
например
    export B24_WEBHOOK=https://hit-ceramics.bitrix24.ru/rest/1/<токен>
    python3 scripts/fetch_b24_objects.py
"""

import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

FOLDER_ID = "187687"  # Paradyz наполка
DST = Path(__file__).resolve().parent.parent / "public" / "images" / "objects"
MAX_W = 1600

# файл в public/images/objects ← (коллекция, имя файла на Диске), подпись = alt на сайте
PICKS = [
    ("natural-brown-kryltso", "Natural Brown", "2-8 Natural Brown.jpg",
     "Крыльцо-подиум в три ступени, клинкер Paradyz Natural Brown"),
    ("scandiano-brown-terrasa", "Scandiano Brown", "2-2 Scandiano Brown.jpeg",
     "Терраса с обеденной зоной у кирпичного дома, клинкер Paradyz Scandiano Brown"),
    ("scandiano-brown-kryltso", "Scandiano Brown", "2-1 Scandiano Brown.jpeg",
     "Входная группа и площадка с креслом, клинкер Paradyz Scandiano Brown"),
    ("scandiano-ochra-lestnica", "Scandiano Ochra", "1-19 Scandiano Ochra.jpg",
     "Уличная лестница в семь ступеней с капиносом, клинкер Paradyz Scandiano Ochra"),
    ("scandiano-ochra-stupeni", "Scandiano Ochra", "1-4 Scandiano Ochra.jpg",
     "Ступени с капиносом крупным планом, клинкер Paradyz Scandiano Ochra"),
    ("scandiano-rosso-stupeni", "Scandiano Rosso", "1-2 Scandiano Rosso.jpg",
     "Терракотовые ступени с рифлёной проступью, клинкер Paradyz Scandiano Rosso"),
    ("semir-brown-kryltso", "Semir Brown", "1-5 Semir Brown.jpg",
     "Широкое крыльцо с кирпичным цоколем, клинкер Paradyz Semir Brown"),
    ("semir-rosa-kryltso", "Semir Rosa", "1-2 Semir Rosa.jpg",
     "Входная группа с терракотовыми ступенями, клинкер Paradyz Semir Rosa"),
    ("cloud-brown-kryltso", "Cloud Brown", "0B212A68-4D67-4D4D-9351-D62BBE2BDB47_1_105_c.jpeg",
     "Крыльцо с тёмными ступенями и каменным цоколем, клинкер Paradyz Cloud Brown"),
    ("cloud-brown-terrasa", "Cloud Brown", "4ED6874E-A50B-4E66-A1BA-6BBA4F05A001.jpeg",
     "Терраса с кованым ограждением, клинкер Paradyz Cloud Brown"),
    ("ilario-brown-kryltso", "Ilario Brown", "WhatsApp Image 2023-06-11 at 17.46.53.jpeg",
     "Крыльцо под навесом у кирпичного дома, клинкер Paradyz Ilario Brown"),
    ("viano-grys-lestnica", "Viano Grys", "5-91 Viano Grys.jpg",
     "Парадная лестница в сад с коваными перилами, клинкер Paradyz Viano Grys"),
]


def api(webhook, method, **params):
    data = urllib.parse.urlencode(params).encode()
    with urllib.request.urlopen(f"{webhook}/{method}.json", data=data, timeout=60) as r:
        return json.load(r)


def children(webhook, fid):
    out, start = [], 0
    while True:
        d = api(webhook, "disk.folder.getchildren", id=fid, start=start)
        out += d.get("result", [])
        if d.get("next") is None:
            return out
        start = d["next"]


def main() -> int:
    webhook = os.environ.get("B24_WEBHOOK", "").rstrip("/")
    if not webhook:
        print("Задайте B24_WEBHOOK (вебхук портала со scope disk)")
        return 1

    # индекс «коллекция → {имя файла: URL}»
    index = {}
    for folder in children(webhook, FOLDER_ID):
        if folder["TYPE"] != "folder":
            continue
        index[folder["NAME"]] = {
            f["NAME"]: f.get("DOWNLOAD_URL", "")
            for f in children(webhook, folder["ID"])
            if f["TYPE"] == "file"
        }

    DST.mkdir(parents=True, exist_ok=True)
    tmp = DST / ".tmp"
    ok = 0
    for slug, coll, fname, alt in PICKS:
        url = index.get(coll, {}).get(fname)
        if not url:
            print(f"НЕ НАЙДЕН на Диске: {coll} / {fname}")
            continue
        urllib.request.urlretrieve(url, tmp)
        # exif_transpose обязателен: снимки с телефонов лежат с EXIF-поворотом,
        # без него половина кадров уезжает набок.
        with Image.open(tmp) as raw:
            im = ImageOps.exif_transpose(raw).convert("RGB")
            if im.width > MAX_W:
                im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
            out = DST / f"{slug}.jpg"
            im.save(out, "JPEG", quality=86, optimize=True, progressive=True)
        print(f"{slug:<26} {im.size[0]}x{im.size[1]:<5} {out.stat().st_size // 1024:>4} КБ  ← {coll}/{fname}")
        ok += 1

    if tmp.exists():
        tmp.unlink()
    print(f"\nготово: {ok} из {len(PICKS)}")
    print("Подписи (alt) для lib/images.ts — в PICKS этого файла.")
    return 0 if ok == len(PICKS) else 1


if __name__ == "__main__":
    raise SystemExit(main())
