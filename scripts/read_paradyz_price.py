#!/usr/bin/env python3
"""Читает «Прайс Paradyz полный от 01.06.26.xlsx» (stdlib: zipfile + re) → JSON/CSV."""
import csv, html, json, os, re, zipfile

SRC = "/mnt/c/Users/Administrator/Downloads/Прайс Paradyz полный от 01.06.26.xlsx"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "paradyz-price")


def col_num(ref):
    """A1 → 0, B1 → 1, AA2 → 26"""
    letters = re.match(r"([A-Z]+)", ref).group(1)
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def load(path=SRC):
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        ss = z.read("xl/sharedStrings.xml").decode("utf-8")
        for si in re.findall(r"<si>(.*?)</si>", ss, re.S):
            shared.append(html.unescape(re.sub(r"<[^>]+>", "", si)))
    wb = z.read("xl/workbook.xml").decode("utf-8")
    names = re.findall(r'<sheet name="([^"]+)"[^>]*r:id="rId(\d+)"', wb)
    sheets = {}
    for name, rid in names:
        fn = f"xl/worksheets/sheet{rid}.xml"
        if fn not in z.namelist():
            continue
        doc = z.read(fn).decode("utf-8")
        rows = []
        for rm in re.finditer(r"<row[^>]*>(.*?)</row>", doc, re.S):
            cells = {}
            for cm in re.finditer(r'<c r="([A-Z]+\d+)"([^>]*)>(.*?)</c>', rm.group(1), re.S):
                ref, attrs, body = cm.group(1), cm.group(2), cm.group(3)
                v = re.search(r"<v>(.*?)</v>", body, re.S)
                if not v:
                    it = re.search(r"<is>(.*?)</is>", body, re.S)
                    val = html.unescape(re.sub(r"<[^>]+>", "", it.group(1))) if it else ""
                else:
                    val = v.group(1)
                    if 't="s"' in attrs:
                        val = shared[int(val)] if val.isdigit() and int(val) < len(shared) else val
                cells[col_num(ref)] = html.unescape(str(val)).strip()
            if cells:
                rows.append([cells.get(i, "") for i in range(max(cells) + 1)])
        sheets[name] = rows
    return sheets


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    sheets = load()
    for name, rows in sheets.items():
        print("=" * 78)
        print(f"ЛИСТ «{name}» — строк {len(rows)}")
        for r in rows[:8]:
            print("   ", [c[:26] for c in r[:12]])
    json.dump(sheets, open(os.path.join(OUT, "sheets.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    for name, rows in sheets.items():
        fn = re.sub(r"[^\w\- ]", "", name).strip()[:40]
        with open(os.path.join(OUT, f"{fn}.csv"), "w", encoding="utf-8-sig", newline="") as fh:
            csv.writer(fh, delimiter=";").writerows(rows)
