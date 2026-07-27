#!/usr/bin/env python3
"""
Текстуры Paradyz с сайта производителя (paradyz.com) для товаров каталога,
у которых нет фото с hit-ceramics.ru.

Как ищем: sitemap.produkt.xml → карточка товара «коллекция + цвет» → og:image
(официальное фото 1200×630, без чужих водяных знаков).
Предпочтение — напольным/ступенным позициям (klinkier, stopnica, gres, taras),
а не фасадным (elewacja) и цоколю (cokol).
"""
import json, os, re, time, urllib.request

D = os.path.dirname(os.path.abspath(__file__))
SITE = "/mnt/c/Users/Administrator/Desktop/Сайты/Проекты/stupeni"
GEN = os.path.join(SITE, "lib", "catalog", "generated", "paradyz-price.ts")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

PREFER = ["taras", "stopnica", "klinkier", "gres", "cokol", "mozaika", "elewacja"]


def rank(slug):
    for i, k in enumerate(PREFER):
        if k in slug:
            return i
    return len(PREFER)


def get(url, tries=2):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=45) as r:
                return r.read()
        except Exception as e:
            if i == tries - 1:
                print("   !!", url.rsplit("/", 1)[-1][:50], e)
                return None
            time.sleep(1.5)


def main():
    sm = open(os.path.join(D, "pz-prod.xml"), encoding="utf-8", errors="replace").read()
    urls = re.findall(r"<loc>([^<]+)</loc>", sm)
    prod = [u for u in urls if "/ru/produkty/" in u or "/pl/produkty/" in u]

    ts = open(GEN, encoding="utf-8").read()
    items = []
    for b in ts.split('\n  {\n    id: "')[1:]:
        items.append({
            "id": b.split('"', 1)[0],
            "collection": re.search(r'collection: "([^"]+)"', b).group(1),
            "photo": re.search(r'photos: \[\s*"([^"]+)"', b).group(1),
        })
    missing = [i for i in items if "/products/" not in i["photo"]]

    # у производителя часть цветов пишется иначе; принимаем ЛЮБОЙ из вариантов,
    # иначе алиас ломает уже найденные совпадения (grafit есть, graphite — нет)
    ALIAS = {"bazalt": ["basalt"], "antracite": ["anthracite"], "grafit": ["graphite"]}
    def variants(s):
        return [[t] + ALIAS.get(t, []) for t in re.sub(r"[^a-z0-9]+", " ", s.lower()).split()]
    plan = {}
    for it in missing:
        toks = variants(it["collection"])
        cands = []
        for u in prod:
            slug = re.sub(r"^p\d+-", "", u.rsplit("/", 1)[-1])
            st = set(slug.split("-"))
            if all(any(v in st for v in group) for group in toks):
                cands.append((rank(slug), len(slug), u))
        if cands:
            plan[it["id"]] = sorted(cands)[0][2]

    print(f"товаров без фото: {len(missing)}; нашли карточку производителя: {len(plan)}")
    got, fail = 0, []
    for pid, url in plan.items():
        dst = os.path.join(SITE, "public", "images", "products", pid, "texture.jpg")
        if os.path.exists(dst):
            got += 1
            continue
        html_ = get(url)
        if not html_:
            fail.append(pid)
            continue
        m = re.search(rb'property="og:image" content="([^"]+)"', html_)
        if not m:
            fail.append(pid)
            continue
        img_url = m.group(1).decode()
        data = get(img_url)
        if not data or len(data) < 5000:
            fail.append(pid)
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(dst, "wb") as fh:
            fh.write(data)
        got += 1
        print(f"  ✓ {pid:32} {img_url.rsplit('/', 1)[-1][:44]}")
        time.sleep(0.6)

    json.dump({k: v for k, v in plan.items()}, open(os.path.join(D, "pz_photo_plan.json"), "w",
                                                   encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\nскачано текстур: {got}; не удалось: {len(fail)} {fail[:8]}")
    print("без соответствия у производителя:",
          sorted({i['id'] for i in missing if i['id'] not in plan}))


if __name__ == "__main__":
    main()
