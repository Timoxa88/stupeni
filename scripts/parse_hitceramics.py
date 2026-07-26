#!/usr/bin/env python3
"""
Парсер каталога hit-ceramics.ru (СВОЙ сайт заказчика — значит, СВОИ цены).

Разделы под лендинг «Ступени»:
  /shop/landshaftnye-materialy/klinkernye-stupeni-i-plitka/   — террасный клинкер
  /shop/materialy-dlya-terras/terrasnye-plity/                — террасные пластины
  /shop/materialy-dlya-terras/terrasnaya-doska-deking/        — декинг («под дерево»)

Пагинация — путём: /pageN/ (не ?PAGEN). Карточка листинга (CMS с js_shop_*):
  good_id, название с размером, бренд, «Цена за шт» (par_55) и «Цена за м²» (par_56),
  размер, фото /userfiles/shop/...

Только stdlib: urllib + re.
"""
import csv, html, json, os, re, time, urllib.request

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, "hitceramics")
BASE = "https://hit-ceramics.ru"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120 Safari/537.36")

SECTIONS = {
    "klinkernye-stupeni-i-plitka": "/shop/landshaftnye-materialy/klinkernye-stupeni-i-plitka/",
    # у «плит» и «декинга» товары лежат не в корне раздела, а в подразделах
    # (бренд Paradyz / CM Decking) — обходим их напрямую
    "terrasnye-plity": "/shop/materialy-dlya-terras/terrasnye-plity/terrasnye-plity-i-plastiny-paradyz-paradizh/",
    "deking-terrasnaya-doska": "/shop/materialy-dlya-terras/terrasnaya-doska-deking/cm-decking/terrasnaya-doska/",
    "deking-sadovyy-parket": "/shop/materialy-dlya-terras/terrasnaya-doska-deking/cm-decking/sadovyy-parket/",
}

CARD = re.compile(r'<div class="js_shop shop-item[^"]*"(.*?)(?=<div class="js_shop shop-item|<div class="shop_pagination|$)', re.S)


def clean(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def num(s):
    if not s:
        return None
    s = s.replace("\xa0", "").replace(" ", "").replace(",", ".")
    m = re.search(r"\d+(?:\.\d+)?", s)
    return float(m.group()) if m else None


def fetch(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "identity"})
            with urllib.request.urlopen(req, timeout=45) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:
            if i == tries - 1:
                print("  !!", url, e)
                return ""
            time.sleep(2)


def parse_cards(doc, section):
    out = []
    for m in CARD.finditer(doc):
        c = m.group(1)
        link = re.search(r'class="shop-item-title"[^>]*href="([^"]+)"', c) or \
               re.search(r'<a href="(https://hit-ceramics\.ru/shop/[^"]+)"', c)
        title = re.search(r'class="shop-item-title"[^>]*>(.*?)</a>', c, re.S)
        if not (link and title):
            continue
        gid = re.search(r'name="good_id" value="(\d+)"', c)
        brand = re.search(r'class="shop_brand"><a[^>]*>(.*?)</a>', c, re.S)
        size = re.search(r'class="shop_razmer"><div>(.*?)</div>', c, re.S)
        img = re.search(r'<img src="([^"]+)"', c)
        prices = {}
        for pm in re.finditer(r'shop_param_price par_(\d+)[^>]*>.*?<span class="title">(.*?)</span>(.*?)<span class="currency">', c, re.S):
            key = re.sub(r"\s+", "", clean(pm.group(2)))   # «Цена за м<sup>2</sup>» → «Ценазам2»
            prices[key] = num(clean(pm.group(3)))
        avail = re.search(r'class="shop_nalichie[^"]*"[^>]*>(.*?)</div>', c, re.S)
        art = re.search(r'class="shop_artikul[^"]*"[^>]*>(.*?)</div>', c, re.S)
        name = clean(title.group(1))
        out.append({
            "section": section,
            "good_id": gid.group(1) if gid else None,
            "name": name,
            "brand": clean(brand.group(1)) if brand else None,
            "size": clean(size.group(1)) if size else None,
            "article": clean(art.group(1)) if art else None,
            "price_pcs": prices.get("Ценазашт"),
            "price_m2": prices.get("Ценазам2") or prices.get("Ценазам²"),
            "prices_raw": prices,
            "availability": clean(avail.group(1)) if avail else None,
            "url": link.group(1),
            "photo": (BASE + img.group(1)) if img and img.group(1).startswith("/") else (img.group(1) if img else None),
        })
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    all_rows, seen = [], set()
    for name, path in SECTIONS.items():
        page = 1
        while True:
            url = BASE + path + (f"page{page}/" if page > 1 else "")
            doc = fetch(url)
            if not doc:
                break
            cards = parse_cards(doc, name)
            fresh = [c for c in cards if c["url"] not in seen]
            for c in fresh:
                seen.add(c["url"])
            print(f"  {name} стр.{page}: карточек {len(cards)}, новых {len(fresh)}")
            all_rows.extend(fresh)
            if not fresh or f"page{page + 1}/" not in doc:
                break
            page += 1
            time.sleep(0.8)

    json.dump(all_rows, open(os.path.join(OUT, "products.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    cols = ["section", "good_id", "brand", "name", "size", "article", "price_pcs",
            "price_m2", "availability", "url", "photo"]
    with open(os.path.join(OUT, "products.csv"), "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore", delimiter=";")
        w.writeheader()
        for r in all_rows:
            w.writerow(r)
    print(f"\nвсего товаров: {len(all_rows)}")
    import collections
    for k, v in collections.Counter(r["section"] for r in all_rows).items():
        print(f"  {k:32} {v}")
    print("с ценой за шт:", sum(1 for r in all_rows if r["price_pcs"]),
          "| с ценой за м²:", sum(1 for r in all_rows if r["price_m2"]),
          "| с фото:", sum(1 for r in all_rows if r["photo"]))


if __name__ == "__main__":
    main()
