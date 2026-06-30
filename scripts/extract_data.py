import pandas as pd
import json
import re
from pathlib import Path

SOURCE = Path(__file__).parent.parent / "sources" / "Wixted Family 05-29-2022.xls"
FALLBACK_SOURCE = Path(r"C:\Users\Matt\OneDrive - Flavor Factory\Documents\Wixted Family 05-29-2022.xls")
OUT = Path(__file__).parent.parent / "src" / "data" / "family.json"

SKIP_PATTERNS = [
    r"^c\d{4}\s", r"^http", r"^m\.\s", r"^see\s", r"^per\s", r"^this\s",
    r"^since\s", r"^generally", r"^directly\s", r"^blood\s", r"^no blood",
    r"page$", r"^v\d", r"^format$", r"^henrys$", r"^name$", r"^friends:",
    r"grave\s*photo", r"obituary", r"^lived\s", r"^married\s", r"^immigrat",
    r"^article", r"^directory", r"^thanks\s", r"^note\s", r"^only\schild",
    r"^with\s", r"^found\s", r"^holy\s", r"^st\s", r"^route$", r"^ire$",
    r"^ny$", r"^eng$", r"^gravestone$", r"^est\s", r"^pnemonia$", r"^fever$",
    r"^condition\s", r"^deformed", r"^height$", r"^complexion", r"^hair",
    r"^marks\s", r"^place\s", r"^\(\*",
]

DATE_RE = re.compile(r"\d{4}")
NAME_RE = re.compile(r"^[A-Z\(\*][A-Za-z\.\'\-\s\(\)\"]+$")

BRANCHES = {
    "wixted": {"sheet": "Wixted", "label": "Wixted", "desc": "Main Wixted family line — Corning, NY to Rochester"},
    "evelyn": {"sheet": "Evelyn", "label": "Evelyn", "desc": "Swedish ancestry — Kalmar & Småland"},
    "ev-gilbert": {"sheet": "Ev Gilbert", "label": "Gilbert", "desc": "Gilbert line — French & colonial roots"},
    "breitenbach": {"sheet": "Breitenbach", "label": "Breitenbach", "desc": "Breitenbach family branch"},
    "clark": {"sheet": "Clark", "label": "Clark", "desc": "Clark family — Dollie Avarilla line"},
    "collins": {"sheet": "Collins", "label": "Collins", "desc": "Collins family branch"},
    "amor": {"sheet": "Amor", "label": "Amor", "desc": "Amor family research"},
    "jess": {"sheet": "Jess", "label": "Nordquist", "desc": "Jessica Nordquist line"},
    "from-ireland": {"sheet": "FromIRE", "label": "From Ireland", "desc": "Wixteds born in Ireland"},
    "mayflower": {"sheet": "Mayflower", "label": "Mayflower", "desc": "Alden Mayflower descent"},
    "danforth": {"sheet": "Danforth", "label": "Danforth", "desc": "Danforth family line"},
}


def should_skip(text: str) -> bool:
    t = text.strip()
    if len(t) < 3 or len(t) > 80:
        return True
    low = t.lower()
    for pat in SKIP_PATTERNS:
        if re.search(pat, low):
            return True
    if re.match(r"^c\d{4}", t):
        return True
    if t.endswith("==>") or t.endswith("…"):
        return True
    if "=" in t and "born" in low:
        return True
    if low in {"format", "names", "english", "german", "irish", "swedish", "mexican"}:
        return True
    return False


def is_date_line(text: str) -> bool:
    if not DATE_RE.search(text):
        return False
    if re.match(r"^c\d{4}", text):
        return False
    return bool(re.search(r"[\-/]", text) or re.search(r"\(\d+\)", text))


NOT_NAME_PATTERNS = [
    r"\bcem\b", r"cemetery", r"mt hope", r"all saints", r"riverview cem",
    r"new haven,\s*conn", r"civil war co", r"family tree goes back",
    r"moved with", r"\(not related\)", r"green mount", r"erwin cemetery",
    r"wanner mennonite", r"kimmel cem", r"mansfield center", r"wood cem",
    r"in erwin and kiehle cem",
]


def is_likely_name(text: str) -> bool:
    if should_skip(text):
        return False
    if is_date_line(text):
        return False
    if not re.search(r"[A-Za-z]{2,}", text):
        return False
    if re.match(r"^\d", text):
        return False
    low = text.lower()
    for pat in NOT_NAME_PATTERNS:
        if re.search(pat, low):
            return False
    if text.endswith(" to") or text.endswith(" and"):
        return False
    if "Wixted" in text or "McGraw" in text or "Wicksted" in text:
        return True
    if re.match(r"^[A-Z][a-z]+(\s+[A-Z][a-z\.]+)+", text):
        return True
    if re.match(r"^Henry\(\d\)", text):
        return True
    if re.match(r"^[A-Z][a-z]+\s+[A-Z]\.?\s", text):
        return True
    if re.match(r"^[A-Z][a-z]+\s+[A-Z][a-z]+", text) and len(text.split()) <= 5:
        return True
    return False


def collect_notes(df, row, col, date_text):
    notes = []
    for dr in range(1, 10):
        if row + dr >= len(df):
            break
        v = df.iloc[row + dr, col]
        if pd.isna(v):
            continue
        s = str(v).strip()
        if not s or s == date_text:
            continue
        if is_likely_name(s):
            break
        if should_skip(s) and not re.match(r"^c\d{4}", s):
            continue
        if len(s) > 2 and s not in notes:
            notes.append(s)
    return notes[:8]


def parse_generation_rows(df, branch_id):
    people = []
    r = 0
    while r < len(df) - 1:
        row_names = []
        for c in range(len(df.columns)):
            v = df.iloc[r, c]
            if pd.isna(v):
                continue
            s = str(v).strip()
            if is_likely_name(s):
                row_names.append((c, s))

        if len(row_names) >= 2:
            gen = len([p for p in people if p.get("generation") == len(people) // max(len(row_names), 1)]) 
            for c, name in row_names:
                dates = ""
                for dr in range(1, 4):
                    if r + dr >= len(df):
                        break
                    dv = df.iloc[r + dr, c]
                    if pd.notna(dv):
                        ds = str(dv).strip()
                        if is_date_line(ds):
                            dates = ds
                            break
                notes = collect_notes(df, r, c, dates)
                pid = f"{branch_id}-{r}-{c}"
                people.append({
                    "id": pid,
                    "name": name,
                    "dates": dates,
                    "notes": notes,
                    "col": c,
                    "row": r,
                    "branch": branch_id,
                })
            r += 1
            continue
        r += 1

    return people


def link_generations(people):
    if not people:
        return people
    rows = sorted(set(p["row"] for p in people))
    row_gen = {row: i for i, row in enumerate(rows)}
    for p in people:
        p["generation"] = row_gen[p["row"]]

    by_gen = {}
    for p in people:
        by_gen.setdefault(p["generation"], []).append(p)

    for gen in sorted(by_gen.keys()):
        if gen == 0:
            continue
        parents = by_gen.get(gen - 1, [])
        children = by_gen[gen]
        if not parents:
            continue
        for child in children:
            best = min(parents, key=lambda par: abs(par["col"] - child["col"]))
            if abs(best["col"] - child["col"]) <= 12:
                child["parentId"] = best["id"]

    return people


def parse_cemetery(df):
    records = []
    for r in range(len(df)):
        name = df.iloc[r, 3] if len(df.columns) > 3 else None
        if pd.isna(name):
            continue
        name = str(name).strip()
        if len(name) < 2 or name.lower() in {"nan", "cemetery info"}:
            continue
        died = df.iloc[r, 5] if len(df.columns) > 5 else None
        died_str = ""
        if pd.notna(died):
            died_str = str(died)[:10] if hasattr(died, "strftime") else str(died)[:10]
        records.append({
            "id": f"cem-{r}",
            "name": name,
            "age": str(df.iloc[r, 4]).strip() if len(df.columns) > 4 and pd.notna(df.iloc[r, 4]) else "",
            "died": died_str,
            "relation": str(df.iloc[r, 6]).strip() if len(df.columns) > 6 and pd.notna(df.iloc[r, 6]) else "",
            "location": str(df.iloc[r, 8]).strip() if len(df.columns) > 8 and pd.notna(df.iloc[r, 8]) else "",
            "born": str(df.iloc[r, 10]).strip() if len(df.columns) > 10 and pd.notna(df.iloc[r, 10]) else "",
            "notes": str(df.iloc[r, 12]).strip() if len(df.columns) > 12 and pd.notna(df.iloc[r, 12]) else "",
        })
    return records


def resolve_source() -> Path:
    if SOURCE.exists():
        return SOURCE
    if FALLBACK_SOURCE.exists():
        return FALLBACK_SOURCE
    raise FileNotFoundError(
        f"Source workbook not found. Place it at {SOURCE} or {FALLBACK_SOURCE}"
    )


def main():
    source = resolve_source()
    all_people = []
    branch_meta = []

    for bid, meta in BRANCHES.items():
        df = pd.read_excel(source, sheet_name=meta["sheet"], header=None)
        people = parse_generation_rows(df, bid)
        if bid == "wixted":
            people = link_generations(people)
        all_people.extend(people)
        branch_meta.append({
            "id": bid,
            "label": meta["label"],
            "desc": meta["desc"],
            "count": len(people),
        })

    df_cem = pd.read_excel(source, sheet_name="Cemetery", header=None)
    cemetery = parse_cemetery(df_cem)

    # Heritage from workbook Katie sheet — Mexican is Katie/Angela Amor line only
    heritage = {
        "matthew": {"english": 0.375, "german": 0.125, "irish": 0.25, "swedish": 0.25},
        "kevin": {"english": 0.375, "german": 0.125, "irish": 0.25, "swedish": 0.25},
        "katie": {"english": 0.25, "german": 0.25, "irish": 0.125, "swedish": 0.125, "mexican": 0.25},
    }

    out = {
        "meta": {
            "title": "Wixted Family Tree",
            "version": "v9.5",
            "updated": "2022-05-29",
            "focus": "Katie Alyson Wixted",
        },
        "branches": branch_meta,
        "people": all_people,
        "cemetery": cemetery,
        "heritage": heritage,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"Extracted {len(all_people)} people across {len(branch_meta)} branches")
    print(f"Cemetery: {len(cemetery)} records")
    wixted = [p for p in all_people if p["branch"] == "wixted"]
    linked = [p for p in wixted if "parentId" in p]
    print(f"Wixted: {len(wixted)} people, {len(linked)} with parent links")


if __name__ == "__main__":
    main()