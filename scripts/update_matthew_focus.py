"""
Update family data: Matthew Wixted as focus, relationship fixes, current ages.
"""

import json
import re
from datetime import date
from pathlib import Path

DATA = Path(__file__).parent.parent / "src" / "data" / "family.json"
ASSETS = Path(__file__).parent.parent / "public" / "assets" / "manifest.json"
TODAY = date.today()

MATTHEW_ID = "wixted-114-29"
KEVIN_ID = "wixted-104-37"
ANGELA_ID = "wixted-104-39"
RYAN_ID = "wixted-114-31"
KYLIE_ID = "wixted-114-33"
ALEX_ID = "wixted-114-35"
KATIE_ID = "wixted-114-39"
SEDONA_ID = "wixted-121-31"
BRUCE_CHILD_ID = "wixted-121-33"

FOCUS_IDS = [
    MATTHEW_ID, KEVIN_ID, ANGELA_ID, RYAN_ID, KYLIE_ID, ALEX_ID, KATIE_ID,
    SEDONA_ID, BRUCE_CHILD_ID, "wixted-104-21", "wixted-91-31",
]


def parse_birth(person: dict) -> date | None:
    texts = [person.get("dates", "")] + person.get("notes", [])
    for text in texts:
        if not text or "age today" in text.lower():
            continue
        m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{2,4})", text)
        if m:
            mo, d, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
            if y < 100:
                y += 1900 if y > 30 else 2000
            try:
                return date(y, mo, d)
            except ValueError:
                pass
        m = re.search(r"(\d{4})-(\d{2})-(\d{2})", text)
        if m:
            try:
                return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
            except ValueError:
                pass
    return None


def compute_age(birth: date) -> str:
    years = TODAY.year - birth.year
    months = TODAY.month - birth.month
    if TODAY.day < birth.day:
        months -= 1
    if months < 0:
        years -= 1
        months += 12
    if years < 2:
        total_months = (TODAY.year - birth.year) * 12 + TODAY.month - birth.month
        if TODAY.day < birth.day:
            total_months -= 1
        return f"{total_months} months" if total_months < 24 else f"{years} years"
    decimal = round(years + months / 12, 1)
    return f"{decimal} years"


def format_dates(birth: date, died: date | None = None) -> str:
    bd = birth.strftime("%m/%d/%Y")
    if died:
        return f"{bd}–{died.strftime('%m/%d/%Y')}"
    return f"{bd}–"


def strip_stale_age_notes(notes: list[str]) -> list[str]:
    return [
        n for n in notes
        if not re.search(r"age\s*(today|e today)", n, re.I)
        and not re.match(r"^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$", n.strip())
    ]


def main():
    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)

    people = data["people"]
    by_id = {p["id"]: p for p in people}

    # ── Matthew ──
    matthew = by_id[MATTHEW_ID]
    matthew["name"] = "Matthew Scott Wixted"
    matthew["dates"] = "10/10/1987–"
    matthew["birthDate"] = "1987-10-10"
    matthew["notes"] = strip_stale_age_notes(matthew["notes"]) + ["Whittier, CA"]
    matthew["notes"] = list(dict.fromkeys(matthew["notes"]))
    matthew["parentId"] = KEVIN_ID
    matthew["motherId"] = ANGELA_ID
    matthew["isFocus"] = True

    # ── Kevin & Angela (parents) ──
    kevin = by_id[KEVIN_ID]
    kevin["dates"] = "04/14/1956–"
    kevin["birthDate"] = "1956-04-14"
    kevin["notes"] = strip_stale_age_notes(kevin["notes"])
    kevin["notes"] = [n for n in kevin["notes"] if "div" not in n.lower() or "1993" in n]
    if not any("Rochester" in n for n in kevin["notes"]):
        kevin["notes"].insert(0, "Rochester, NY")
    kevin["spouseIds"] = [ANGELA_ID]
    kevin["notes"].append("m. Angela Maxine Amor, May 29 1993 · div. Dec 2005")

    angela = by_id[ANGELA_ID]
    angela["dates"] = "12/17/1954–"
    angela["birthDate"] = "1954-12-17"
    angela["notes"] = strip_stale_age_notes(angela["notes"])
    angela["spouseIds"] = [KEVIN_ID]
    angela["notes"].append("Long Beach, CA")

    # Reclassify mis-parsed location parent
    bad_parent = by_id.get("wixted-109-39")
    if bad_parent and bad_parent["name"] == "Long Beach,CA":
        bad_parent["recordType"] = "location"
        bad_parent.pop("parentId", None)

    # ── Siblings ──
    for pid, bdate, loc in [
        (RYAN_ID, "1989-06-16", "Whittier, CA"),
        (ALEX_ID, "1992-11-20", "Orange, CA"),
        (KATIE_ID, "1993-09-27", None),
    ]:
        p = by_id[pid]
        p["parentId"] = KEVIN_ID
        p["motherId"] = ANGELA_ID
        bd = date.fromisoformat(bdate)
        p["birthDate"] = bdate
        p["dates"] = format_dates(bd)
        p["notes"] = strip_stale_age_notes(p["notes"])
        if loc and loc not in p["notes"]:
            p["notes"].insert(0, loc)

    # ── Ryan & Kylie (divorced) ──
    ryan = by_id[RYAN_ID]
    ryan["notes"] = [n for n in ryan["notes"] if "m Octorber" not in n and "m." not in n.lower()[:2]]
    ryan["notes"].append("m. Kylie Renee, October 13, 2018 · divorced")
    ryan["exSpouseIds"] = [KYLIE_ID]
    ryan["childIds"] = [SEDONA_ID, BRUCE_CHILD_ID]

    kylie = by_id[KYLIE_ID]
    kylie["dates"] = "08/21/1992–"
    kylie["birthDate"] = "1992-08-21"
    kylie["notes"] = strip_stale_age_notes(kylie["notes"])
    if "Placentia, CA" not in kylie["notes"]:
        kylie["notes"].insert(0, "Placentia, CA")
    kylie["notes"].append("m. Ryan Patrick Wixted, October 13, 2018 · divorced")
    kylie.pop("parentId", None)
    kylie["spouseIds"] = []
    kylie["exSpouseIds"] = [RYAN_ID]
    kylie["childIds"] = [SEDONA_ID, BRUCE_CHILD_ID]
    kylie["recordType"] = "person"

    # ── Ryan & Kylie's children ──
    sedona = by_id[SEDONA_ID]
    sedona["dates"] = "08/24/2019–"
    sedona["birthDate"] = "2019-08-24"
    sedona["notes"] = strip_stale_age_notes(sedona["notes"])
    sedona["parentId"] = RYAN_ID
    sedona["motherId"] = KYLIE_ID

    bruce = by_id[BRUCE_CHILD_ID]
    bruce["dates"] = "07/24/2021–"
    bruce["birthDate"] = "2021-07-24"
    bruce["notes"] = strip_stale_age_notes(bruce["notes"])
    bruce["parentId"] = RYAN_ID
    bruce["motherId"] = KYLIE_ID

    # ── Refresh ages for all people with birth dates ──
    for p in people:
        if p.get("recordType", "person") != "person":
            continue
        birth = parse_birth(p)
        if birth:
            if not p.get("birthDate"):
                p["birthDate"] = birth.isoformat()
            p["age"] = compute_age(birth)
            p["notes"] = strip_stale_age_notes(p.get("notes", []))

    # Rebuild search text for updated people
    branch_labels = {b["id"]: b["label"] for b in data["branches"]}
    for p in people:
        label = branch_labels.get(p["branch"], p["branch"])
        parts = [p["name"], p.get("dates", ""), label] + p.get("notes", [])
        if p.get("age"):
            parts.append(p["age"])
        p["searchText"] = " ".join(parts).lower()

    # ── Meta & heritage ──
    data["meta"]["focus"] = "Matthew Scott Wixted"
    data["meta"]["rootPersonId"] = MATTHEW_ID
    data["meta"]["updated"] = TODAY.isoformat()
    data["meta"]["focusLine"] = FOCUS_IDS

    data["heritage"] = {
        "matthew": data["heritage"].get("katie", {
            "english": 0.25, "german": 0.25, "irish": 0.125,
            "swedish": 0.125, "mexican": 0.25,
        }),
        "kevin": data["heritage"].get("kevin", {
            "english": 0.375, "german": 0.125, "irish": 0.25, "swedish": 0.25,
        }),
    }

    # ── Ryan/Kylie divorce story ──
    stories = data.get("stories", [])
    divorce_story = {
        "id": "story-ryan-kylie",
        "title": "Ryan & Kylie Wixted",
        "body": (
            "Ryan Patrick Wixted and Kylie Renee were married on October 13, 2018. "
            "They are now divorced. Their children are Sedona Tracy Wixted (b. August 24, 2019) "
            "and Bruce William Wixted (b. July 24, 2021), both born in Orange, CA."
        ),
        "personIds": [RYAN_ID, KYLIE_ID, SEDONA_ID, BRUCE_CHILD_ID],
        "branch": "wixted",
        "tags": ["family-history", "marriage"],
        "source": "family-update",
    }
    stories = [s for s in stories if s.get("id") != "story-ryan-kylie"]
    stories.insert(0, divorce_story)
    data["stories"] = stories
    data["meta"]["storyCount"] = len(stories)

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # ── Assets manifest ──
    ASSETS.parent.mkdir(parents=True, exist_ok=True)
    manifest = {
        "people": {
            MATTHEW_ID: {
                "photo": "https://avatars.githubusercontent.com/u/198108406?v=4",
                "role": "focus",
            },
        },
        "documents": [
            {"title": "Family Workbook", "desc": "Wixted Family v9.5 research spreadsheet", "type": "spreadsheet", "icon": "📊"},
            {"title": "Cemetery Records", "desc": "28 headstone records across NY, CA, and beyond", "type": "cemetery", "icon": "🪦"},
            {"title": "Colonial History Docs", "desc": "Gilbert line research — Mayflower & New Haven", "type": "research", "icon": "📜"},
            {"title": "Census References", "desc": "92 family members with census citations", "type": "census", "icon": "📋"},
            {"title": "Gravesite Photos", "desc": "Referenced in McGraw, Doane, Bursley lines", "type": "photo", "icon": "📷"},
        ],
    }
    with open(ASSETS, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Updated focus: {data['meta']['focus']}")
    print(f"Matthew age: {by_id[MATTHEW_ID].get('age')}")
    print(f"Sedona age: {by_id[SEDONA_ID].get('age')}")
    print(f"Bruce age: {by_id[BRUCE_CHILD_ID].get('age')}")
    print(f"Ryan/Kylie divorce story added")


if __name__ == "__main__":
    main()
