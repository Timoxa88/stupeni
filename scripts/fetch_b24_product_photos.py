#!/usr/bin/env python3
"""
Второй источник фото для Paradyz — архив объектов на Битрикс24.Диске.

Зачем нужен: Paradyz мы берём со своего сайта, но на hit-ceramics.ru выложены
не все коллекции из прайса — своего фото хватает примерно на треть позиций.
При этом на Диске в «Информация для дилера / Фото объекты Paradyz» лежат папки,
названные ровно как артикул («Scandiano Beige», «Viano Grys», «Ardis Dark»), и
внутри — снимки объектов с этим материалом.

Это фото объекта, а не плитки на белом фоне, но кадр честный: он показывает
именно этот цвет этой коллекции. Для карточки это лучше плашки.

Берём только «наполка» (полы и ступени — наш профиль) и «отливы».
Раздел «фасады» исключён: там кадры целых домов и стройплощадок.

Порядок работы:
    export B24_WEBHOOK=https://hit-ceramics.bitrix24.ru/rest/1/<токен>
    python3 scripts/fetch_b24_product_photos.py
    python3 scripts/wire_product_photos.py --force

Файл кладём как photo_1_b24.jpg — после photo_0_own.jpg со своего сайта,
чтобы своё фото оставалось главным кадром.
"""

import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "lib" / "catalog" / "generated" / "products.ts"
DST = ROOT / "public" / "images" / "products"
ROOT_FOLDER = "187703"  # Фото объекты Paradyz
# ТОЛЬКО полы, ступени и отливы. Раздел «фасады» сознательно исключён: там кадры
# целых домов и стройплощадок, а карточка — про напольную плитку и ступени.
# Фасадный кадр на такой карточке врёт о типе товара не меньше, чем чужой цвет.
SECTION_RANK = {"Paradyz наполка": 0, "Paradyz отливы": 1}
MAX_W = 1400
EXT = re.compile(r"\.(jpe?g|png|webp)$", re.I)


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


def norm(s: str) -> str:
    """«Ilario Biege» и «ilario-beige» должны сойтись."""
    s = re.sub(r"[^a-zA-Z0-9]+", " ", s.lower()).strip()
    fix = {"biege": "beige", "antracit": "antracite", "nero": "nero"}
    return " ".join(fix.get(w, w) for w in s.split())


def main() -> int:
    webhook = os.environ.get("B24_WEBHOOK", "").rstrip("/")
    if not webhook:
        print("Задайте B24_WEBHOOK")
        return 1

    # индекс Диска: нормализованное имя папки → список (ранг раздела, файлы)
    index: dict[str, list] = {}
    for section in children(webhook, ROOT_FOLDER):
        if section["TYPE"] != "folder":
            continue
        rank = SECTION_RANK.get(section["NAME"])
        if rank is None:
            continue
        for coll in children(webhook, section["ID"]):
            if coll["TYPE"] != "folder":
                continue
            files = [f for f in children(webhook, coll["ID"])
                     if f["TYPE"] == "file" and EXT.search(f["NAME"])]
            if files:
                index.setdefault(norm(coll["NAME"]), []).append((rank, files))

    ids = re.findall(r'\n    id: "(paradyz-[^"]+)"', CATALOG.read_text(encoding="utf-8"))
    print(f"папок на Диске: {len(index)} | товаров Paradyz: {len(ids)}")

    SKIP = {"duro", "gladkaya", "strukturnaya", "pietra"}
    ok, miss = 0, []
    tmp = DST / ".tmp"
    for pid in ids:
        toks = [w for w in pid.replace("paradyz-", "").split("-") if w not in SKIP]
        cand = None
        # пробуем «первые N слов» как коллекцию + последнее слово как цвет
        for i in range(len(toks) - 1, 0, -1):
            key = " ".join(toks[:i] + [toks[-1]]) if i < len(toks) - 1 else " ".join(toks)
            if key in index:
                cand = index[key]
                break
        if not cand:
            miss.append(pid)
            continue

        rank, files = sorted(cand, key=lambda x: x[0])[0]
        d = DST / pid
        d.mkdir(parents=True, exist_ok=True)
        out = d / "photo_1_b24.jpg"
        if out.exists():
            ok += 1
            continue
        # самый крупный файл папки — обычно самый качественный кадр
        # среди .jpg попадаются переименованные видео — берём первый файл,
        # который PIL реально открывает как картинку
        for best in sorted(files, key=lambda f: -int(f.get("SIZE") or 0)):
            try:
                urllib.request.urlretrieve(best["DOWNLOAD_URL"], tmp)
                Image.open(tmp).verify()
                break
            except Exception:  # noqa: BLE001 — не картинка, пробуем следующий
                continue
        else:
            miss.append(pid)
            continue
        try:
            with Image.open(tmp) as raw:
                im = ImageOps.exif_transpose(raw).convert("RGB")
                if im.width > MAX_W:
                    im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
                im.save(out, "JPEG", quality=85, optimize=True, progressive=True)
            ok += 1
        except Exception as e:  # noqa: BLE001
            print(f"  ошибка {pid}: {e}")
    if tmp.exists():
        tmp.unlink()

    print(f"подобрано фото объекта: {ok}")
    print(f"без пары на Диске: {len(miss)}")
    if miss:
        print("  ", ", ".join(x.replace("paradyz-", "") for x in miss[:15]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
