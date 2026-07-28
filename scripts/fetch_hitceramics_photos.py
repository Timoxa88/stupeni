#!/usr/bin/env python3
"""
Фото товаров с СОБСТВЕННОГО сайта hit-ceramics.ru — приоритетный источник
(правило заказчика: свой сайт → сайт производителя → своя съёмка → заглушка).

Зачем: в каталоге стояли текстуры paradyz.com 292×256 на белом фоне и рендеры
коллекций, одинаковые на все цвета (Ardenas Antracita — чёрный — иллюстрировался
серым двориком). На своём сайте 645 карточек, у каждой своё фото ИМЕННО этого
артикула, включая цвет.

Порядок работы:
    python3 scripts/parse_hitceramics.py        # снимает каталог своего сайта
    python3 scripts/fetch_hitceramics_photos.py # сопоставляет и качает фото
    python3 scripts/wire_product_photos.py --force  # прописывает в каталог

Сопоставление — по названию карточки: в нём подряд стоят бренд, коллекция и цвет
(«Напольная клинкерная плитка Paradyz Scandiano Brown, 300*600*8.5 мм»), а наш id
собран из тех же слов (paradyz-scandiano-brown). Совпадением считаем, что ВСЕ
значимые слова id встречаются в названии; служебные слова коллекций, которых нет
в названиях на сайте, вынесены в IGNORE.

Файл кладём как photo_0_own.jpg — он сортируется раньше photo_1 и становится
главным кадром карточки.
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "hitceramics" / "products.json"
CATALOG = ROOT / "lib" / "catalog" / "generated" / "products.ts"
DST = ROOT / "public" / "images" / "products"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

# слова, которых на сайте в названии нет, а в id они есть (или наоборот)
IGNORE = {"keraplatte", "klinker", "euramic", "loftstufe", "gladkaya", "strukturnaya",
          "duro", "s", "kapinosom", "prostaya"}


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def tokens(s: str) -> list[str]:
    return [t for t in slugify(s).split() if len(t) > 1 and t not in IGNORE]


def main() -> int:
    if not SRC.exists():
        print(f"Нет {SRC} — сначала прогоните scripts/parse_hitceramics.py")
        return 1
    dry = "--dry-run" in sys.argv

    site = json.loads(SRC.read_text(encoding="utf-8"))
    site_idx = [(set(tokens(x["name"])), x) for x in site if x.get("photo")]

    ids = re.findall(r'\n    id: "([^"]+)"', CATALOG.read_text(encoding="utf-8"))

    matched, missed = [], []
    for pid in ids:
        want = set(tokens(pid.replace("-", " ")))
        if not want:
            continue
        best, score = None, 0.0
        for toks, x in site_idx:
            common = len(want & toks)
            s = common / len(want)
            # цвет обязателен: без последнего слова id совпадение бессмысленно
            if s > score and list(want)[-1:] and common >= 2:
                score, best = s, x
        if best and score >= 0.999:
            matched.append((pid, best))
        else:
            missed.append(pid)

    print(f"товаров в каталоге: {len(ids)}")
    print(f"нашлось на своём сайте: {len(matched)}")
    print(f"не нашлось: {len(missed)}")

    if dry:
        for pid, x in matched[:10]:
            print(f"  {pid:<38} ← {x['name'][:60]}")
        return 0

    ok = 0
    opener = urllib.request.build_opener()
    opener.addheaders = [("User-Agent", UA)]
    for pid, x in matched:
        d = DST / pid
        d.mkdir(parents=True, exist_ok=True)
        out = d / "photo_0_own.jpg"
        if out.exists():
            ok += 1
            continue
        try:
            with opener.open(x["photo"], timeout=40) as r, open(out, "wb") as f:
                f.write(r.read())
            ok += 1
        except Exception as e:  # noqa: BLE001 — сеть, продолжаем по остальным
            print(f"  ошибка {pid}: {e}")
    print(f"скачано/на месте: {ok}")
    if missed:
        print("без своего фото:", ", ".join(missed[:10]), "…" if len(missed) > 10 else "")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
