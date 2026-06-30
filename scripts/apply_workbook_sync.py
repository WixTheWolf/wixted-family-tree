"""
Apply corrections from Wixted Family 05-29-2022.xls to family.json.

Validates Matthew's line against the workbook grid and fixes heritage,
parent links, marriage dates, and Bruce/Evelyn family structure.
"""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

DATA = Path(__file__).parent.parent / "src" / "data" / "family.json"

# Heritage from workbook Katie sheet (rows 17 & 19)
HERITAGE_KEVIN = {"english": 0.375, "german": 0.125, "irish": 0.25, "swedish": 0.25}
HERITAGE_KATIE = {
    "english": 0.25,
    "german": 0.25,
    "irish": 0.125,
    "swedish": 0.125,
    "mexican": 0.25,  # Angela Maxine Amor line — not Matthew's line
}
HERITAGE_MATTHEW = dict(HERITAGE_KEVIN)  # Daniel's line = same Wixted/Jones mix as Kevin

BRUCE_SR = "wixted-91-29"
EVELYN = "wixted-91-31"
DANIEL = "wixted-104-31"
MARY_JOAN = "wixted-104-33"
KEVIN = "wixted-104-37"
ANGELA = "wixted-104-39"
MATTHEW = "wixted-114-29"
RYAN = "wixted-114-31"
ALEX = "wixted-114-35"
KATIE = "wixted-114-39"
BRUCE_JR = "wixted-104-21"
LYNN = "wixted-104-27"
BRUCE_CHILDREN = [BRUCE_JR, LYNN, DANIEL, KEVIN]
DANIEL_CHILDREN = [MATTHEW, RYAN, ALEX]


def by_id(people: list[dict]) -> dict[str, dict]:
    return {p["id"]: p for p in people}


def set_notes(person: dict, notes: list[str]) -> None:
    person["notes"] = notes
    person["categorizedNotes"] = [{"category": "general", "text": n} for n in notes[:8]]


def main() -> None:
    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)

    people = data["people"]
    lookup = by_id(people)

    # ── Heritage (workbook Katie sheet) ──
    data["heritage"] = {
        "matthew": HERITAGE_MATTHEW,
        "kevin": HERITAGE_KEVIN,
        "katie": HERITAGE_KATIE,
    }

    # ── Bruce & Evelyn (workbook rows 91–92, 96, 99–101) ──
    bruce = lookup[BRUCE_SR]
    bruce["notes"] = [
        "04/03/33-03/11/95 (62)",
        "SS117-22-6934",
        "Tech Mfg Executive",
        "Rochester,NY",
        "Rancho Mirage, CA",
        "Divorced Evelyn 7/30/75",
        "c1940 Roch 6 629 Thurston",
    ]
    bruce["spouseIds"] = [EVELYN]
    bruce["childIds"] = BRUCE_CHILDREN

    evelyn = lookup[EVELYN]
    evelyn["dates"] = "08/27/32-12/15/88 (56)"
    evelyn["notes"] = [
        "SS112-24-1440",
        "Librarian",
        "Rochester,NY",
        "Fairhaven Mem Santa Ana, CA — m. 12/8/1951",
    ]
    evelyn["spouseIds"] = [BRUCE_SR]
    evelyn["childIds"] = BRUCE_CHILDREN

    # ── Bruce & Evelyn's four children (workbook row 104) ──
    for pid in [BRUCE_JR, LYNN]:
        child = lookup[pid]
        child["parentId"] = BRUCE_SR
        child["motherId"] = EVELYN

    # ── Daniel & Mary Joan (workbook: m. Jun 28 1986) ──
    daniel = lookup[DANIEL]
    daniel["dates"] = "03/12/1959–"
    daniel["notes"] = [
        "03/12/59-",
        "Rochester,NY",
        "m. Mary Joan Tracy, Jun 28 1986",
    ]
    daniel["parentId"] = BRUCE_SR
    daniel["motherId"] = EVELYN
    daniel["spouseIds"] = [MARY_JOAN]
    daniel["childIds"] = DANIEL_CHILDREN

    mary = lookup[MARY_JOAN]
    mary["notes"] = [
        "07/07/61-",
        "Whittier,CA",
        "m. Daniel Scott Wixted, Jun 28 1986",
    ]
    mary["spouseIds"] = [DANIEL]
    mary["childIds"] = DANIEL_CHILDREN
    mary.pop("parentId", None)

    # ── Kevin & Angela (workbook row 104 cols 37–39) ──
    kevin = lookup[KEVIN]
    kevin["parentId"] = BRUCE_SR
    kevin["motherId"] = EVELYN
    kevin["childIds"] = [KATIE]

    angela = lookup[ANGELA]
    angela["branch"] = "amor"
    angela.pop("parentId", None)
    angela["notes"] = [
        "12/17/54-",
        "Long Beach, CA",
        "See Amor page — Mexican heritage via Amor line",
        "m. Kevin Paul Wixted, May 29 1993 · div. Dec 2005",
    ]
    angela["spouseIds"] = [KEVIN]
    angela["childIds"] = [KATIE]

    # ── Matthew's generation (workbook row 114) ──
    for pid in DANIEL_CHILDREN:
        p = lookup[pid]
        p["parentId"] = DANIEL
        p["motherId"] = MARY_JOAN

    # ── Katie = Kevin + Angela's daughter, NOT Matthew's sibling ──
    katie = lookup[KATIE]
    katie["parentId"] = KEVIN
    katie["motherId"] = ANGELA
    katie["notes"] = ["09/27/93-", "Mission Viejo, CA"]
    katie["dates"] = "09/27/1993–"

    # ── Meta ──
    data["meta"]["updated"] = date.today().isoformat()
    data["meta"]["version"] = "v9.5+workbook-sync"

    # Rebuild search text for touched people
    branch_labels = {b["id"]: b["label"] for b in data["branches"]}
    touched = {
        BRUCE_SR, EVELYN, DANIEL, MARY_JOAN, KEVIN, ANGELA,
        MATTHEW, RYAN, ALEX, KATIE, BRUCE_JR, LYNN,
    }
    for pid in touched:
        p = lookup[pid]
        label = branch_labels.get(p["branch"], p["branch"])
        parts = [p["name"], p.get("dates", ""), label] + p.get("notes", [])
        if p.get("age"):
            parts.append(p["age"])
        p["searchText"] = " ".join(parts).lower()

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("Workbook sync applied.")
    print(f"  Matthew heritage: {data['heritage']['matthew']}")
    print(f"  Katie heritage (incl. Mexican): {data['heritage']['katie']}")
    print(f"  Bruce children: {[lookup[i]['name'] for i in BRUCE_CHILDREN]}")
    print(f"  Daniel children: {[lookup[i]['name'] for i in DANIEL_CHILDREN]}")
    print(f"  Katie parents: {lookup[KATIE].get('parentId')} + {lookup[KATIE].get('motherId')}")


if __name__ == "__main__":
    main()
