#!/usr/bin/env python3
"""
Добор фото по двум источникам, присланным заказчиком 28.07.2026:

  * markastroy.ru — САЙТ ЗАВОДА (коллекция NATUR: Вишня, Дюна, Шоколад);
  * keralux.ru (ООО «Кералюкс») — дилер Interbau, у него разложены ABELL и ALPEN
    по номерам цвета, а именно их у нас и не хватало.

Третий присланный адрес, stroeher.ru, не обходится: это одностраничник на JS,
в sitemap только главная, ссылок на серии в HTML нет. Позиции Stroeher, которых
не нашлось на прошлом шаге, остаются без фото.

Сопоставление — по НОМЕРУ цвета, а не по названию: у нас id вида
interbau-abell-270-zhelto-bezhevyi (цвет по-русски), а у дилера
interbau-abell-270-ocker-... (цвет по-немецки). Общий и однозначный ключ — «270».

Правило по чужим кадрам то же, что и в fetch_vipklinker_photos.py: берём как
есть, кадр с водяным знаком ПРОПУСКАЕМ, знаки не затираем.

Запуск:
    python3 scripts/fetch_more_photos.py [--dry-run]
    python3 scripts/wire_product_photos.py --force
"""

import re
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CATALOGS = [
    ROOT / "lib" / "catalog" / "generated" / "products.ts",
    ROOT / "lib" / "catalog" / "generated" / "paradyz-price.ts",
]
DST = ROOT / "public" / "images" / "products"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

OG_IMAGE = re.compile(r'<meta property="og:image" content="([^"]+)"')


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def has_watermark(im: Image.Image) -> bool:
    """См. fetch_vipklinker_photos.has_watermark — та же логика и та же осторожность."""
    w, h = im.size
    corner = im.convert("L").crop((int(w * 0.55), int(h * 0.82), w, h))
    px = list(corner.getdata())
    if len(px) < 100:
        return False
    median = sorted(px)[len(px) // 2]
    contrast = sum(1 for p in px if abs(p - median) > 60) / len(px)
    return 0.02 < contrast < 0.30


def save(pid: str, url: str, suffix: str, dry: bool) -> str:
    out = DST / pid / f"photo_3_{suffix}.jpg"
    if out.exists():
        return "есть"
    if dry:
        return "нашлось"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        raw = Image.open(BytesIO(r.read()))
        # у завода PNG с прозрачным фоном: без подложки в JPEG он станет чёрным
        if raw.mode in ("RGBA", "LA", "P"):
            raw = raw.convert("RGBA")
            bg = Image.new("RGB", raw.size, (255, 255, 255))
            bg.paste(raw, mask=raw.split()[-1])
            im = bg
        else:
            im = raw.convert("RGB")
    if has_watermark(im):
        return "знак"
    if im.width > 1400:
        im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, "JPEG", quality=88, optimize=True, progressive=True)
    return "скачано"


def catalog_ids(brand: str) -> list[str]:
    ids = []
    for c in CATALOGS:
        t = c.read_text(encoding="utf-8")
        ids += [m.group(1) for m in
                re.finditer(rf'\n    id: "([^"]+)",\n    brand: "{re.escape(brand)}"', t)]
    return ids


# Завод отдаёт раздел одной страницей, без ссылок на карточки товаров, а имена
# файлов — хеши. Соответствие «файл → цвет» проверено глазами 28.07.2026:
# 1 — красная (Вишня), 2 — песочная (Дюна), 3 — коричневая (Шоколад).
# Для трёх позиций явный список честнее хрупкого парсинга по близости текста.
MARKASTROY = {
    "markastroy-natur-vishnya":
        "/upload/resize_cache/iblock/9b2/1144_934_140cd750bba9870f18aada2478b24840a/"
        "wmm4um13uoup2v0jt7nqrb9k0gq7acjg.png",
    "markastroy-natur-dyuna":
        "/upload/resize_cache/iblock/5b6/1144_934_140cd750bba9870f18aada2478b24840a/"
        "0xiagx9l3w71g20pbgd5pn2b8zx8c327.png",
    "markastroy-natur-shokolad":
        "/upload/resize_cache/iblock/c90/xad3qufn0ahqb24nhhbco1h6jtdixxht/"
        "1144_934_140cd750bba9870f18aada2478b24840a/stupen-SHokolad.png",
}


def do_markastroy(dry: bool) -> dict[str, int]:
    """Завод: 3 позиции NATUR, кадр товара (не «на объекте»)."""
    base = "https://markastroy.ru"
    stat: dict[str, int] = {}
    for pid, path in MARKASTROY.items():
        r = save(pid, base + path, "mk", dry)
        stat[r] = stat.get(r, 0) + 1
    return stat


def do_keralux(dry: bool) -> dict[str, int]:
    """Дилер Interbau: сопоставляем по номеру цвета в слаге товара."""
    base = "https://keralux.ru"
    seen: dict[tuple[str, str], str] = {}
    for page_no in range(1, 12):
        url = (f"{base}/production/klinkernaya-plitka-i-stupeni/"
               f"{'' if page_no == 1 else f'?PAGEN_1={page_no}'}")
        try:
            html = fetch(url)
        except Exception:  # noqa: BLE001
            break
        found = re.findall(
            r'href="(/production/klinkernaya-plitka-i-stupeni/interbau-([a-z]+)-(\d{3})-[a-z0-9-]+/)"',
            html)
        if not found:
            break
        for link, series, num in found:
            seen.setdefault((series, num), link)

    stat: dict[str, int] = {}
    for pid in catalog_ids("Interbau"):
        m = re.match(r"interbau-([a-z]+)-.*?(\d{3})", pid)
        if not m:
            stat["без номера"] = stat.get("без номера", 0) + 1
            continue
        link = seen.get((m.group(1), m.group(2)))
        if not link:
            stat["не нашлось"] = stat.get("не нашлось", 0) + 1
            continue
        img = OG_IMAGE.search(fetch(base + link))
        if not img:
            stat["без og:image"] = stat.get("без og:image", 0) + 1
            continue
        src = img.group(1)
        if src.startswith("/"):
            src = base + src
        r = save(pid, src, "kl", dry)
        stat[r] = stat.get(r, 0) + 1
    return stat


def main() -> int:
    dry = "--dry-run" in sys.argv
    for name, fn in (("markastroy.ru (завод)", do_markastroy),
                     ("keralux.ru (дилер Interbau)", do_keralux)):
        try:
            print(f"\n{name}: {fn(dry)}")
        except Exception as e:  # noqa: BLE001
            print(f"\n{name}: ошибка — {e}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
