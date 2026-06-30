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
CHRISTINE_ID = "wixted-114-27"
BOB_CUMMING_ID = "cumming-107-25"
MONICA_CUMMING_ID = "cumming-107-27"
BRUCE_CUMMING_ID = "cumming-114-23"
MONIQUE_CUMMING_ID = "cumming-114-25"
DANIEL_ID = "wixted-104-31"
MARY_JOAN_ID = "wixted-104-33"
JACK_TRACY_ID = "tracy-103-31"
KATIE_TRACY_ID = "tracy-103-33"
RYAN_ID = "wixted-114-31"
KYLIE_ID = "wixted-114-33"
ALEX_ID = "wixted-114-35"
KATIE_ID = "wixted-114-39"
SEDONA_ID = "wixted-121-31"
BRUCE_CHILD_ID = "wixted-121-33"

SIBLING_IDS = [MATTHEW_ID, RYAN_ID, ALEX_ID]

FOCUS_IDS = [
    MATTHEW_ID, DANIEL_ID, MARY_JOAN_ID, RYAN_ID, KYLIE_ID, ALEX_ID, KATIE_ID,
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
    matthew["parentId"] = DANIEL_ID
    matthew["motherId"] = MARY_JOAN_ID
    matthew["spouseIds"] = [CHRISTINE_ID]
    matthew["isFocus"] = True
    matthew["notes"] = [
        n for n in matthew["notes"]
        if not n.startswith("m. Christine")
    ]
    matthew["notes"].append("m. Christine Kimberly (Cumming) Wixted, 14 Jun 2025")

    # ── Christine & Cumming family ──
    christine = by_id.get(CHRISTINE_ID)
    if not christine:
        christine = {
            "id": CHRISTINE_ID,
            "name": "Christine Kimberly (Cumming) Wixted",
            "col": 27,
            "row": 114,
            "branch": "cumming",
            "generation": 10,
            "recordType": "person",
        }
        people.append(christine)
        by_id[CHRISTINE_ID] = christine
    christine["name"] = "Christine Kimberly (Cumming) Wixted"
    christine["dates"] = "01/28/1991–"
    christine["birthDate"] = "1991-01-28"
    christine["branch"] = "cumming"
    christine["parentId"] = BOB_CUMMING_ID
    christine["motherId"] = MONICA_CUMMING_ID
    christine["spouseIds"] = [MATTHEW_ID]
    christine["notes"] = [
        "01/28/91-",
        "Brea, CA",
        "Born and raised in Brea, CA",
        "Maiden name: Cumming",
        "m. Matthew Scott Wixted, 14 Jun 2025",
    ]

    bob = by_id.get(BOB_CUMMING_ID)
    if not bob:
        bob = {
            "id": BOB_CUMMING_ID,
            "name": 'Robert "Bob" Cumming',
            "col": 25,
            "row": 107,
            "branch": "cumming",
            "generation": 9,
            "recordType": "person",
        }
        people.append(bob)
        by_id[BOB_CUMMING_ID] = bob
    bob["name"] = 'Robert "Bob" Cumming'
    bob["notes"] = ["Brea, CA", "Father of Christine, Bruce, and Monique"]
    bob["spouseIds"] = [MONICA_CUMMING_ID]
    bob["childIds"] = [CHRISTINE_ID, BRUCE_CUMMING_ID, MONIQUE_CUMMING_ID]

    monica = by_id.get(MONICA_CUMMING_ID)
    if not monica:
        monica = {
            "id": MONICA_CUMMING_ID,
            "name": "Monica Cumming",
            "col": 27,
            "row": 107,
            "branch": "cumming",
            "generation": 9,
            "recordType": "person",
        }
        people.append(monica)
        by_id[MONICA_CUMMING_ID] = monica
    monica["name"] = "Monica Cumming"
    monica["dates"] = "–~2007"
    monica["notes"] = ["Brea, CA", "d. when Christine was 16 (~2007)"]
    monica["spouseIds"] = [BOB_CUMMING_ID]
    monica["childIds"] = [CHRISTINE_ID, BRUCE_CUMMING_ID, MONIQUE_CUMMING_ID]

    for cid, cname, cdates, cnotes in [
        (BRUCE_CUMMING_ID, "Bruce Cumming", "", ["Brea, CA", "Brother of Christine"]),
        (MONIQUE_CUMMING_ID, "Monique Cumming", "–05/2020", [
            "Brea, CA", "d. May 2020, Brea, CA", "Sister of Christine",
        ]),
    ]:
        person = by_id.get(cid)
        if not person:
            person = {
                "id": cid,
                "col": 23 if cid == BRUCE_CUMMING_ID else 25,
                "row": 114,
                "branch": "cumming",
                "generation": 10,
                "recordType": "person",
            }
            people.append(person)
            by_id[cid] = person
        person["name"] = cname
        person["dates"] = cdates
        person["notes"] = cnotes
        person["parentId"] = BOB_CUMMING_ID
        person["motherId"] = MONICA_CUMMING_ID

    # ── Daniel & Mary Joan (parents) ──
    daniel = by_id[DANIEL_ID]
    daniel["parentId"] = "wixted-91-29"
    daniel["motherId"] = "wixted-91-31"
    daniel["spouseIds"] = [MARY_JOAN_ID]
    daniel["childIds"] = SIBLING_IDS

    mary_joan = by_id[MARY_JOAN_ID]
    mary_joan["name"] = "Mary Joan (Tracy) Wixted"
    mary_joan["branch"] = "tracy"
    mary_joan["parentId"] = JACK_TRACY_ID
    mary_joan["motherId"] = KATIE_TRACY_ID
    mary_joan["spouseIds"] = [DANIEL_ID]
    mary_joan["childIds"] = SIBLING_IDS
    if not any("Jack" in n for n in mary_joan.get("notes", [])):
        mary_joan["notes"].append(
            'Daughter of John "Jack" Tracy and Katie (Martin) Tracy'
        )

    jack = by_id.get(JACK_TRACY_ID)
    if not jack:
        jack = {
            "id": JACK_TRACY_ID,
            "name": 'John "Jack" Tracy',
            "col": 31,
            "row": 103,
            "branch": "tracy",
            "generation": 9,
            "recordType": "person",
        }
        people.append(jack)
        by_id[JACK_TRACY_ID] = jack
    jack["name"] = 'John "Jack" Tracy'
    jack["notes"] = ["Whittier, CA area", "Father of Mary Joan (Tracy) Wixted"]
    jack["spouseIds"] = [KATIE_TRACY_ID]
    jack["childIds"] = [MARY_JOAN_ID]

    katie_tracy = by_id.get(KATIE_TRACY_ID)
    if not katie_tracy:
        katie_tracy = {
            "id": KATIE_TRACY_ID,
            "name": "Katie (Martin) Tracy",
            "col": 33,
            "row": 103,
            "branch": "tracy",
            "generation": 9,
            "recordType": "person",
        }
        people.append(katie_tracy)
        by_id[KATIE_TRACY_ID] = katie_tracy
    katie_tracy["name"] = "Katie (Martin) Tracy"
    katie_tracy["notes"] = ["Maiden name: Martin", "Mother of Mary Joan (Tracy) Wixted"]
    katie_tracy["spouseIds"] = [JACK_TRACY_ID]
    katie_tracy["childIds"] = [MARY_JOAN_ID]

    # Reclassify mis-parsed location parent
    bad_parent = by_id.get("wixted-109-39")
    if bad_parent and bad_parent["name"] == "Long Beach,CA":
        bad_parent["recordType"] = "location"
        bad_parent.pop("parentId", None)

    # ── Siblings (Ryan & Alexander) ──
    for pid, bdate, loc in [
        (RYAN_ID, "1989-06-16", "Whittier, CA"),
        (ALEX_ID, "1992-11-20", "Orange, CA"),
    ]:
        p = by_id[pid]
        p["parentId"] = DANIEL_ID
        p["motherId"] = MARY_JOAN_ID
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
    data["meta"]["focusLine"] = [
        MATTHEW_ID, DANIEL_ID, MARY_JOAN_ID,
        "wixted-91-29", "wixted-91-31",
        "wixted-49-25", "wixted-30-29", "wixted-18-3", "wixted-18-1",
    ]

    data["heritage"] = {
        "matthew": {
            "english": 0.375, "german": 0.125, "irish": 0.25, "swedish": 0.25,
        },
        "kevin": data["heritage"].get("kevin", {
            "english": 0.375, "german": 0.125, "irish": 0.25, "swedish": 0.25,
        }),
        "katie": {
            "english": 0.25, "german": 0.25, "irish": 0.125,
            "swedish": 0.125, "mexican": 0.25,
        },
    }

    # ── Ancestry story ──
    stories = data.get("stories", [])
    ancestry_story = {
        "id": "story-matthew-ancestry",
        "title": "Matthew's Wixted Line — Ireland to California",
        "body": (
            "Matthew Scott Wixted (b. 1987, Whittier, CA) descends from the Corning & Rochester, NY Wixteds. "
            "His father Daniel Scott Wixted (b. 1959, Rochester) and mother Mary Joan (Tracy) Wixted "
            "(b. 1961, Whittier) raised the California generation. Grandfather Bruce John Wixted (1933–1995) "
            "and grandmother Evelyn Ruth Jones (1932–1988), a Rochester librarian, moved the family to Phoenix, "
            "AZ in 1963 and Orange County, CA in 1971. The Wixted name in America traces to Thomas James Wixted "
            "(1796–1873) and Mary Hogan of Lambeth, London — with earlier Irish roots in Tipperary. "
            "Henry Wixted (1823–1893) and Henry Joseph Wixted (1866–1942) appear across Corning censuses "
            "for five decades."
        ),
        "personIds": [
            MATTHEW_ID, DANIEL_ID, MARY_JOAN_ID,
            "wixted-91-29", "wixted-91-31",
            "wixted-49-25", "wixted-30-29", "wixted-18-3", "wixted-18-1",
        ],
        "branch": "wixted",
        "tags": ["ancestry", "migration", "family-history"],
        "source": "research",
    }
    stories = [s for s in stories if s.get("id") not in (
        "story-matthew-ancestry", "story-ryan-kylie", "story-matthew-christine",
    )]

    christine_story = {
        "id": "story-matthew-christine",
        "title": "Matthew & Christine Wixted",
        "body": (
            'Matthew Scott Wixted and Christine Kimberly (Cumming) Wixted were married on June 14, 2025. '
            "Christine was born January 28, 1991 in Brea, California, where she was raised. "
            'She is the daughter of Robert "Bob" Cumming and Monica (d. when Christine was 16). '
            "Her siblings are Bruce Cumming and Monique (d. May 2020, Brea, CA)."
        ),
        "personIds": [
            MATTHEW_ID, CHRISTINE_ID, BOB_CUMMING_ID, MONICA_CUMMING_ID,
            BRUCE_CUMMING_ID, MONIQUE_CUMMING_ID,
        ],
        "branch": "wixted",
        "tags": ["family-history", "marriage"],
        "source": "family-update",
    }

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
    stories.insert(0, divorce_story)
    stories.insert(0, christine_story)
    stories.insert(0, ancestry_story)
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
    print(f"Parents: {by_id[DANIEL_ID]['name']} + {by_id[MARY_JOAN_ID]['name']}")
    print(f"Sedona age: {by_id[SEDONA_ID].get('age')}")
    print(f"Bruce age: {by_id[BRUCE_CHILD_ID].get('age')}")
    print(f"Ryan/Kylie divorce story added")


if __name__ == "__main__":
    main()
