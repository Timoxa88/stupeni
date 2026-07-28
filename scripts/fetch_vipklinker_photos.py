#!/usr/bin/env python3
"""
Фото для брендов, которых нет ни на своём сайте, ни в архиве на Диске:
Exagres, Stroeher, Westerwälder Klinker, Interbau.

Источник — vipklinker.ru (ООО «Евро Импорт»), взят по прямому решению заказчика
28.07.2026. Это дилерский интернет-магазин, а не сайт завода, поэтому:

  * кадры берём КАК ЕСТЬ. Проверено выборкой: карточки товаров там — чистые
    каталожные рендеры 768×768 без водяных знаков, снимать нечего;
  * если знак на кадре всё же попадётся — такой кадр ПРОПУСКАЕМ (см. SKIP_MARKED
    ниже), а не затираем: удаление сведений об авторстве это ст. 1300 ГК;
  * происхождение фиксируется здесь и в имени файла photo_2_vk.jpg, чтобы через
    полгода было видно, откуда кадр, и его можно было заменить своей съёмкой.

Приоритет имён в папке товара: photo_0_own (свой сайт) → photo_1_b24 (архив
объектов) → photo_2_vk (этот скрипт). Первый по алфавиту становится главным.

Запуск:
    python3 scripts/fetch_vipklinker_photos.py [--dry-run]
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
BASE = "https://vipklinker.ru/klinkernye-stupeni"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

# бренд в каталоге → слаг раздела на витрине
# Слаги разделов витрины. Страницы filter-brend-* отдают тот же товар, но
# отрисовывают меньше карточек, поэтому берём «человеческие» разделы.
SECTIONS = {
    "Exagres": "exagres",
    "Stroeher": "stroeher-ks",
    "Westerwälder Klinker": "westerwalder-ks",
    "Interbau": "interbau",
}

# слова, которые есть в id, но не в названии на витрине (или наоборот)
IGNORE = {"klinker", "keraplatte", "euramic", "loftstufe", "stupeni", "i", "napolnaya",
          "plitka", "gladkaya", "strukturnaya", "duro", "s", "kapinosom"}

CARD = re.compile(
    r'<a aria-label="([^"]+)"[^>]*>.*?<img src="(https://vipklinker\.ru/wp-content/uploads/[^"]+)"',
    re.S,
)


PRODUCT_LINK = re.compile(r'href="(https://vipklinker\.ru/klinkernye-stupeni/[a-z0-9-]+/[a-z0-9-]+)"')
OG_IMAGE = re.compile(r'<meta property="og:image" content="([^"]+)"')
OG_TITLE = re.compile(r'<meta property="og:title" content="([^"]+)"')


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def toks(s: str) -> set[str]:
    return {t for t in re.sub(r"[^a-z0-9]+", " ", s.lower()).split()
            if len(t) > 1 and t not in IGNORE}


def full_size(url: str) -> str:
    """…/albaroc-boal-300x300.webp → …/albaroc-boal.webp"""
    return re.sub(r"-\d+x\d+(\.\w+)$", r"\1", url)


def has_watermark(im: Image.Image) -> bool:
    """
    Ищем впечатанный знак в правом нижнем углу.

    Первая версия считала признаком знака просто светлый или тёмный угол — и
    отсекла 16 нормальных кадров Westerwälder, у которых товар снят на белом
    фоне. Однотонный угол это как раз ФОН, а не знак.

    Признак знака: угол в основном однороден (фон), но внутри есть заметное
    меньшинство резко контрастных пикселей — буквы и логотип. Ровный фон даёт
    почти ноль таких пикселей, фактура — много и равномерно.
    """
    w, h = im.size
    corner = im.convert("L").crop((int(w * 0.55), int(h * 0.82), w, h))
    px = list(corner.getdata())
    if len(px) < 100:
        return False
    px_sorted = sorted(px)
    median = px_sorted[len(px_sorted) // 2]
    contrast = sum(1 for p in px if abs(p - median) > 60) / len(px)
    return 0.02 < contrast < 0.30


WKS = re.compile(r"WKS\s?(\d{4,6})")


def catalog_ids() -> list[tuple[str, str, str | None]]:
    """(id, бренд, артикул WKS если есть).

    У Westerwälder на витрине в названии стоит только артикул («WKS 31150
    Atrium»), без имени цвета, а у нас id по цвету. Сопоставлять по цвету
    там нечем — зато артикул есть в поле sku нашего каталога, и это точное
    совпадение вместо догадки.
    """
    out = []
    for c in CATALOGS:
        text = c.read_text(encoding="utf-8")
        for m in re.finditer(r'\n    id: "([^"]+)",\n    brand: "([^"]+)",(.*?)\n    \},\n', text, re.S):
            art = WKS.search(m.group(3))
            out.append((m.group(1), m.group(2), art.group(1) if art else None))
    return out


def main() -> int:
    dry = "--dry-run" in sys.argv
    ids = catalog_ids()

    got = marked = 0
    missed: list[str] = []
    for brand, slug in SECTIONS.items():
        try:
            html = fetch(f"{BASE}/{slug}")
        except Exception as e:  # noqa: BLE001
            print(f"{brand}: раздел не открылся — {e}")
            continue
        cards = [(name, full_size(src)) for name, src in CARD.findall(html)]
        if not cards:
            # Раздел отдаёт не карточки категорий, а отдельные страницы товаров
            # (так устроен Westerwälder: ссылки по артикулам WKS, без картинки
            # в листинге). Заходим на каждую и берём og:title + og:image.
            for link in sorted(set(PRODUCT_LINK.findall(html))):
                try:
                    page = fetch(link)
                except Exception:  # noqa: BLE001
                    continue
                img = OG_IMAGE.search(page)
                ttl = OG_TITLE.search(page)
                if img and ttl:
                    cards.append((ttl.group(1), full_size(img.group(1))))
        index = [(toks(name), src) for name, src in cards]
        mine = [(pid, art) for pid, b, art in ids if b == brand]
        print(f"\n{brand}: карточек на витрине {len(cards)}, наших товаров {len(mine)}")

        for pid, art in mine:
            best, score = None, 0.0
            if art:
                # точное совпадение по артикулу
                for tk, src in index:
                    if art in tk:
                        best, score = src, 1.0
                        break
            if not best:
                want = toks(pid.replace("-", " "))
                for tk, src in index:
                    s = len(want & tk) / len(want) if want else 0
                    if s > score:
                        score, best = s, src
            if not best or score < 0.999:
                missed.append(pid)
                continue

            out = DST / pid / "photo_2_vk.jpg"
            if out.exists():
                got += 1
                continue
            if dry:
                got += 1
                continue
            try:
                req = urllib.request.Request(best, headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=60) as r:
                    raw = r.read()
                im = Image.open(BytesIO(raw)).convert("RGB")
                if has_watermark(im):
                    marked += 1
                    continue
                out.parent.mkdir(parents=True, exist_ok=True)
                im.save(out, "JPEG", quality=88, optimize=True, progressive=True)
                got += 1
            except Exception as e:  # noqa: BLE001
                print(f"  ошибка {pid}: {e}")

    print(f"\n{'(dry) ' if dry else ''}скачано: {got}")
    print(f"пропущено из-за знака на кадре: {marked}")
    print(f"не нашлось на витрине: {len(missed)}")
    if missed:
        print("  ", ", ".join(missed[:12]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
