"""
Update family data: Matthew Wixted as focus, relationship fixes, genealogy accuracy.
"""

import json
import re
from datetime import date
from pathlib import Path

DATA = Path(__file__).parent.parent / "src" / "data" / "family.json"
ASSETS = Path(__file__).parent.parent / "public" / "assets" / "manifest.json"
TODAY = date.today()

# ── Focus family ──
MATTHEW_ID = "wixted-114-29"
KEVIN_ID = "wixted-104-37"
ANGELA_ID = "wixted-104-39"
RYAN_ID = "wixted-114-31"
KYLIE_ID = "wixted-114-33"
ALEX_ID = "wixted-114-35"
KATIE_ID = "wixted-114-39"
SEDONA_ID = "wixted-121-31"
BRUCE_CHILD_ID = "wixted-121-33"

# ── Wixted patriline (curated from workbook chart + county records) ──
THOMAS_ID = "wixted-18-3"
MARY_HOGAN_ID = "wixted-18-1"
HENRY1_ID = "wixted-30-29"
HENRY_JOSEPH_ID = "wixted-49-25"
JOHN_LEROY_ID = "wixted-73-27"
BRUCE_ID = "wixted-91-29"
EVELYN_ID = "wixted-91-31"
BRUCE_JR_ID = "wixted-104-21"
PATRIARCH_ROOT_ID = THOMAS_ID

ROY_AMOR_ID = "amor-89-21"
MAXINE_BAER_ID = "amor-89-19"

BRUCE_EVELYN_CHILDREN = [
    KEVIN_ID,
    "wixted-104-27",  # Lynn Louise Wixted
    "wixted-104-31",  # Daniel Scott Wixted
    BRUCE_JR_ID,
    "wixted-104-17",  # Maura Rachelle Wixted
    "wixted-104-19",  # Kolleen N. Wixted
]

FOCUS_LINE = [
    MATTHEW_ID,
    KEVIN_ID,
    ANGELA_ID,
    BRUCE_ID,
    EVELYN_ID,
    JOHN_LEROY_ID,
    HENRY_JOSEPH_ID,
    HENRY1_ID,
    THOMAS_ID,
    MARY_HOGAN_ID,
]

WIXTED_CURATED_PARENT = {
    HENRY1_ID: THOMAS_ID,
    HENRY_JOSEPH_ID: HENRY1_ID,
    JOHN_LEROY_ID: HENRY_JOSEPH_ID,
    BRUCE_ID: JOHN_LEROY_ID,
    KEVIN_ID: BRUCE_ID,
    MATTHEW_ID: KEVIN_ID,
    RYAN_ID: KEVIN_ID,
    ALEX_ID: KEVIN_ID,
    KATIE_ID: KEVIN_ID,
    **{cid: BRUCE_ID for cid in BRUCE_EVELYN_CHILDREN if cid != KEVIN_ID},
}

WIXTED_CURATED_MOTHER = {
    HENRY1_ID: MARY_HOGAN_ID,
    MATTHEW_ID: ANGELA_ID,
    RYAN_ID: ANGELA_ID,
    ALEX_ID: ANGELA_ID,
    KATIE_ID: ANGELA_ID,
    **{cid: EVELYN_ID for cid in BRUCE_EVELYN_CHILDREN if cid != KEVIN_ID},
}

LOCATION_NAME_PATTERNS = [
    r"rancho mirage",
    r"fairhaven mem",
    r"santa ana,ca",
    r"long beach,ca",
    r"san antonio,tx",
    r"new york,ny",
    r"mt adnah",
    r",ca$",
    r",ny$",
    r",tx$",
    r"mem gardens",
    r"cemetery",
    r"\bcem\b",
]

NARRATIVE_NAME_PATTERNS = [
    r"^either ",
    r"staff nurse",
    r"post office worker",
    r"moved with",
    r"^mother betsy",
    r"^and the other",
]


def expand_two_digit_year(y: int, *, prefer_past: bool = True) -> int:
    if y >= 100:
        return y
    candidate = 1900 + y
    if prefer_past and candidate > TODAY.year:
        return 1800 + y
    if not prefer_past and candidate < 1920:
        return 2000 + y
    return candidate


def parse_mdY(mo: int, d: int, y: int, *, prefer_past: bool = True) -> date | None:
    y = expand_two_digit_year(y, prefer_past=prefer_past)
    try:
        return date(y, mo, d)
    except ValueError:
        return None


def parse_birth_death(person: dict) -> tuple[date | None, date | None]:
    birth = death = None
    texts = [person.get("dates", "")] + person.get("notes", [])

    for text in texts:
        if not text or "age today" in text.lower() or text.strip().startswith("SS"):
            continue

        # 04/03/33-03/11/95 or 8/7/1866-12/30/1942
        range_m = re.search(
            r"(\d{1,2})/(\d{1,2})/(\d{2,4})\s*[\-–]\s*(\d{1,2})/(\d{1,2})/(\d{2,4})",
            text,
        )
        if range_m:
            b = parse_mdY(int(range_m[1]), int(range_m[2]), int(range_m[3]))
            d = parse_mdY(int(range_m[4]), int(range_m[5]), int(range_m[6]))
            if b:
                birth = birth or b
            if d:
                death = death or d
            continue

        range_y = re.search(r"(\d{4})\s*[\-–]\s*(\d{1,2})/(\d{1,2})/(\d{2,4})", text)
        if range_y:
            b = date(int(range_y[1]), 1, 1)
            d = parse_mdY(int(range_y[2]), int(range_y[3]), int(range_y[4]))
            birth = birth or b
            death = death or d
            continue

        born_only = re.search(r"(\d{1,2})/(\d{1,2})/(\d{2,4})\s*[\-–]\s*$", text)
        if born_only:
            b = parse_mdY(int(born_only[1]), int(born_only[2]), int(born_only[3]), prefer_past=False)
            if b:
                birth = birth or b
            continue

        single = re.search(r"(\d{1,2})/(\d{1,2})/(\d{2,4})", text)
        if single and not birth:
            mo, d, y = int(single[1]), int(single[2]), int(single[3])
            parsed = parse_mdY(mo, d, y, prefer_past=y > 30)
            if parsed:
                if parsed.year > TODAY.year:
                    parsed = date(parsed.year - 100, parsed.month, parsed.day)
                birth = parsed

        iso = re.search(r"(\d{4})-(\d{2})-(\d{2})", text)
        if iso and not birth:
            try:
                birth = date(int(iso[1]), int(iso[2]), int(iso[3]))
            except ValueError:
                pass

        partial_death = re.search(
            r"(\d{1,2})/(\d{1,2})/(\d{4})\s*[\-–]\s*(\d{1,2})/(\d{4})",
            text,
        )
        if partial_death:
            b = parse_mdY(
                int(partial_death[1]), int(partial_death[2]), int(partial_death[3])
            )
            d = date(int(partial_death[5]), int(partial_death[4]), 1)
            birth = birth or b
            death = death or d
            continue

        year_span = re.search(r"(\d{4})\s*[\-–]\s*(\d{1,2})/(\d{4})", text)
        if year_span and not death:
            death = date(int(year_span[3]), int(year_span[2]), 1)

        year_span2 = re.search(r"(\d{4})\s*[\-–]\s*(\d{4})", text)
        if year_span2 and not birth:
            birth = date(int(year_span2[1]), 1, 1)
            death = date(int(year_span2[2]), 12, 31)

    if person.get("birthDate") and not birth:
        try:
            birth = date.fromisoformat(person["birthDate"])
        except ValueError:
            pass

    return birth, death


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
    return f"{round(years + months / 12, 1)} years"


def set_life_fields(person: dict) -> None:
    birth, death = parse_birth_death(person)
    if birth:
        person["birthDate"] = birth.isoformat()
    else:
        person.pop("birthDate", None)

    if death:
        person["deathDate"] = death.isoformat()
    else:
        person.pop("deathDate", None)

    if birth and death:
        years = death.year - birth.year - ((death.month, death.day) < (birth.month, birth.day))
        person["age"] = f"d. at {years}"
    elif birth:
        person["age"] = compute_age(birth)
    else:
        person.pop("age", None)


def format_dates(birth: date, died: date | None = None) -> str:
    bd = birth.strftime("%m/%d/%Y")
    if died:
        return f"{bd}–{died.strftime('%m/%d/%Y')}"
    return f"{bd}–"


def strip_stale_age_notes(notes: list[str]) -> list[str]:
    return [
        n
        for n in notes
        if not re.search(r"age\s*(today|e today)", n, re.I)
        and not re.match(r"^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$", n.strip())
    ]


def classify_misparsed_name(name: str) -> str | None:
    low = name.lower()
    for pat in LOCATION_NAME_PATTERNS:
        if re.search(pat, low):
            return "location"
    for pat in NARRATIVE_NAME_PATTERNS:
        if re.search(pat, low):
            return "narrative"
    if low.endswith(" to") or low.endswith(" and"):
        return "narrative"
    return None


def clear_wixted_auto_links(people: list[dict]) -> None:
    for p in people:
        if p["branch"] != "wixted":
            continue
        p.pop("parentId", None)
        p.pop("motherId", None)
        p.pop("childIds", None)


def apply_genealogy_fixes(by_id: dict[str, dict]) -> None:
    clear_wixted_auto_links(list(by_id.values()))

    for child_id, parent_id in WIXTED_CURATED_PARENT.items():
        if child_id in by_id and parent_id in by_id:
            by_id[child_id]["parentId"] = parent_id

    for child_id, mother_id in WIXTED_CURATED_MOTHER.items():
        if child_id in by_id and mother_id in by_id:
            by_id[child_id]["motherId"] = mother_id

    bruce = by_id[BRUCE_ID]
    evelyn = by_id[EVELYN_ID]
    bruce["spouseIds"] = [EVELYN_ID]
    evelyn["spouseIds"] = [BRUCE_ID]
    bruce["childIds"] = [c for c in BRUCE_EVELYN_CHILDREN if c in by_id]

    kevin = by_id[KEVIN_ID]
    kevin["motherId"] = EVELYN_ID
    kevin["spouseIds"] = [ANGELA_ID]

    angela = by_id[ANGELA_ID]
    angela["parentId"] = ROY_AMOR_ID
    angela["motherId"] = MAXINE_BAER_ID
    angela["spouseIds"] = [KEVIN_ID]

    # Disambiguate duplicate Bruce name (grandfather b. 1933 vs son b. 1952)
    bruce_jr = by_id.get(BRUCE_JR_ID)
    if bruce_jr:
        bruce_jr["name"] = "Bruce John Wixted (1952)"
        birth, _ = parse_birth_death(bruce_jr)
        if not birth:
            bruce_jr["birthDate"] = "1952-05-15"
            bruce_jr["dates"] = "05/15/1952–"

    # Normalize Vincent D. Wixted display name
    vincent = by_id.get("wixted-73-77")
    if vincent and vincent["name"] == "Vincent Depaul":
        vincent["name"] = "Vincent D. Wixted"

    # Reclassify mis-parsed workbook cells across all branches
    for p in by_id.values():
        kind = classify_misparsed_name(p.get("name", ""))
        if kind:
            p["recordType"] = kind
            p.pop("parentId", None)
            p.pop("motherId", None)
            p.pop("childIds", None)
            p.pop("spouseIds", None)

    # Fix Evelyn dates (SSN was in dates field)
    evelyn["dates"] = "08/27/1932–12/15/1988"
    evelyn["birthDate"] = "1932-08-27"
    evelyn["deathDate"] = "1988-12-15"
    evelyn["age"] = "d. at 56"

    # Fix Hazel Breitenbach dates in notes (11/6/05 = 1905)
    hazel = by_id.get("wixted-73-29")
    if hazel:
        hazel["dates"] = "11/06/1905–05/1984"


def main():
    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)

    people = data["people"]
    by_id = {p["id"]: p for p in people}

    apply_genealogy_fixes(by_id)

    # ── Matthew ──
    matthew = by_id[MATTHEW_ID]
    matthew["name"] = "Matthew Scott Wixted"
    matthew["dates"] = "10/10/1987–"
    matthew["birthDate"] = "1987-10-10"
    matthew["notes"] = strip_stale_age_notes(matthew["notes"]) + ["Whittier, CA"]
    matthew["notes"] = list(dict.fromkeys(matthew["notes"]))
    matthew["isFocus"] = True

    # ── Kevin & Angela ──
    kevin = by_id[KEVIN_ID]
    kevin["dates"] = "04/14/1956–"
    kevin["birthDate"] = "1956-04-14"
    kevin["notes"] = strip_stale_age_notes(kevin["notes"])
    kevin["notes"] = [n for n in kevin["notes"] if "div" not in n.lower() or "1993" in n]
    if not any("Rochester" in n for n in kevin["notes"]):
        kevin["notes"].insert(0, "Rochester, NY")
    kevin["notes"].append("m. Angela Maxine Amor, May 29 1993 · div. Dec 2005")

    angela = by_id[ANGELA_ID]
    angela["dates"] = "12/17/1954–"
    angela["birthDate"] = "1954-12-17"
    angela["notes"] = strip_stale_age_notes(angela["notes"])
    if "Long Beach, CA" not in angela["notes"]:
        angela["notes"].append("Long Beach, CA")

    # ── Siblings ──
    for pid, bdate, loc in [
        (RYAN_ID, "1989-06-16", "Whittier, CA"),
        (ALEX_ID, "1992-11-20", "Orange, CA"),
        (KATIE_ID, "1993-09-27", None),
    ]:
        p = by_id[pid]
        bd = date.fromisoformat(bdate)
        p["birthDate"] = bdate
        p["dates"] = format_dates(bd)
        p["notes"] = strip_stale_age_notes(p["notes"])
        if loc and loc not in p["notes"]:
            p["notes"].insert(0, loc)

    # ── Ryan & Kylie ──
    ryan = by_id[RYAN_ID]
    ryan["notes"] = [n for n in ryan["notes"] if "m Octorber" not in n and not n.lower().startswith("m.")]
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

    sedona = by_id[SEDONA_ID]
    sedona["dates"] = "08/24/2019–"
    sedona["birthDate"] = "2019-08-24"
    sedona["notes"] = strip_stale_age_notes(sedona["notes"])
    sedona["parentId"] = RYAN_ID
    sedona["motherId"] = KYLIE_ID

    bruce_w = by_id[BRUCE_CHILD_ID]
    bruce_w["dates"] = "07/24/2021–"
    bruce_w["birthDate"] = "2021-07-24"
    bruce_w["notes"] = strip_stale_age_notes(bruce_w["notes"])
    bruce_w["parentId"] = RYAN_ID
    bruce_w["motherId"] = KYLIE_ID

    # ── Life fields for all person records ──
    for p in people:
        if p.get("recordType", "person") != "person":
            p.pop("age", None)
            p.pop("birthDate", None)
            p.pop("deathDate", None)
            continue
        set_life_fields(p)
        p["notes"] = strip_stale_age_notes(p.get("notes", []))

    branch_labels = {b["id"]: b["label"] for b in data["branches"]}
    for p in people:
        label = branch_labels.get(p["branch"], p["branch"])
        parts = [p["name"], p.get("dates", ""), label] + p.get("notes", [])
        if p.get("age"):
            parts.append(p["age"])
        p["searchText"] = " ".join(parts).lower()

    data["meta"]["focus"] = "Matthew Scott Wixted"
    data["meta"]["rootPersonId"] = MATTHEW_ID
    data["meta"]["patriarchRootId"] = PATRIARCH_ROOT_ID
    data["meta"]["updated"] = TODAY.isoformat()
    data["meta"]["focusLine"] = FOCUS_LINE

    data["heritage"] = {
        "matthew": data["heritage"].get(
            "matthew",
            data["heritage"].get(
                "katie",
                {
                    "english": 0.25,
                    "german": 0.25,
                    "irish": 0.125,
                    "swedish": 0.125,
                    "mexican": 0.25,
                },
            ),
        ),
        "kevin": data["heritage"].get(
            "kevin",
            {
                "english": 0.375,
                "german": 0.125,
                "irish": 0.25,
                "swedish": 0.25,
            },
        ),
    }

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

    # Verify patriline chain
    cur = MATTHEW_ID
    print("Patriline chain from Matthew:")
    while cur:
        p = by_id[cur]
        print(f"  {p['name']}")
        cur = p.get("parentId")

    print(f"\nUpdated focus: {data['meta']['focus']}")
    print(f"Matthew age: {by_id[MATTHEW_ID].get('age')}")
    print(f"Bruce (grandfather) age: {by_id[BRUCE_ID].get('age')}")


if __name__ == "__main__":
    main()
