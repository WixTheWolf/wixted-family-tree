"""
Enrich family.json extracted from the Wixted Family Excel workbook.

- Classifies mis-parsed Excel cells (cemetery headers, locations, narratives)
- Fixes obvious extraction errors (swapped dates/SSN fields, truncated names)
- Adds generation numbers to all branches
- Builds searchable stories from narrative notes and history-doc references
- Produces cemetery-location cross-references from location records
"""

import json
import re
from pathlib import Path

IN_PATH = Path(__file__).parent.parent / "src" / "data" / "family.json"
OUT_PATH = IN_PATH

LOCATION_PATTERNS = [
    r"\bcem\b", r"cemetery", r"mt hope", r"all saints", r"riverview cem",
    r"mansfield center", r"four corners cem", r"wood cem", r"green mount",
    r"erwin cemetery", r"kimmel cem", r"wanner mennonite", r"new haven,\s*conn",
    r"new providence pres cem", r"in erwin and kiehle cem",
]

NARRATIVE_PATTERNS = [
    r"moved with", r"family tree goes back", r"daughter of phillip",
    r"niagara falls and john", r"civil war co g", r"\(not related\)",
    r"henry breitenbach of",
]

DATE_LINE_RE = re.compile(
    r"(\d{1,2}/\d{1,2}/\d{2,4}|\d{4})[\-/](\d{1,2}/\d{1,2}/\d{2,4}|\d{4})"
)


def classify_record(person: dict) -> str:
    name = person.get("name", "")
    low = name.lower()

    for pat in NARRATIVE_PATTERNS:
        if re.search(pat, low):
            return "narrative"

    for pat in LOCATION_PATTERNS:
        if re.search(pat, low):
            return "location"

    if low.endswith(" to") or low.endswith(" and"):
        return "narrative"

    if re.match(r"^civil war", low):
        return "narrative"

    return "person"


def fix_truncated_name(name: str) -> str:
    fixes = {
        "Margaret Breitenbach Bayer (daughter of Phillip & Auguste": "Margaret Breitenbach Bayer",
        "Henry Breitenbach of Niagara Falls and John": "Henry Breitenbach",
    }
    return fixes.get(name, name)


def fix_person_fields(person: dict) -> dict:
    person["name"] = fix_truncated_name(person["name"])

    # Bruce John Wixted: SSN ended up in dates field
    if person["name"] == "Bruce John Wixted" and person.get("dates", "").startswith("SS"):
        for note in person.get("notes", []):
            if DATE_LINE_RE.search(note):
                person["dates"] = note
                person["notes"] = [n for n in person["notes"] if n != note]
                break

    # Katie: birth date in notes
    if "Katie Alyson Wixted" in person["name"] and not person.get("dates"):
        for note in person.get("notes", []):
            if re.match(r"\d{2}/\d{2}/\d{2}-", note):
                person["dates"] = note
                break

    return person


def categorize_note(text: str) -> str:
    low = text.lower()
    if re.match(r"^c\d{4}\b", low):
        return "census"
    if low.startswith("d."):
        return "death"
    if "history doc" in low:
        return "research"
    if any(w in low for w in ("photo", "obituary", "grave")):
        return "media"
    if any(w in low for w in ("immigrat", "came to", "came ", "ship ")):
        return "immigration"
    if low.startswith("m.") or "married" in low:
        return "marriage"
    if any(w in low for w in ("librarian", "fireman", "trackwalker", "rr ", "co g")):
        return "occupation"
    if re.search(r"[A-Z][a-z]+,\s*[A-Z]{2}", text) or "ny" in low or "rochester" in low:
        return "location"
    if len(text) > 60 or text.count(",") >= 2:
        return "narrative"
    return "general"


def add_generations(people: list[dict]) -> None:
    by_branch: dict[str, list[dict]] = {}
    for p in people:
        by_branch.setdefault(p["branch"], []).append(p)

    for branch_people in by_branch.values():
        rows = sorted(set(p["row"] for p in branch_people))
        row_gen = {row: i for i, row in enumerate(rows)}
        for p in branch_people:
            p["generation"] = row_gen[p["row"]]


def find_related_person_ids(person: dict, all_people: list[dict]) -> list[str]:
    """Find people mentioned in a narrative or location record."""
    text = person["name"] + " " + " ".join(person.get("notes", []))
    related = []
    for p in all_people:
        if p["id"] == person["id"]:
            continue
        if p.get("recordType", "person") != "person":
            continue
        parts = [x for x in re.split(r"[\s\-,&]+", p["name"]) if len(x) > 2]
        for part in parts:
            if part.lower() in ("wixted", "breitenbach", "jones", "gilbert"):
                if part.lower() in text.lower():
                    related.append(p["id"])
                    break
            elif re.search(rf"\b{re.escape(part)}\b", text, re.I):
                related.append(p["id"])
                break

    # Same row neighbors in wixted branch
    if person["branch"] == "wixted":
        neighbors = [
            p for p in all_people
            if p["branch"] == "wixted"
            and p["row"] == person["row"]
            and p.get("recordType", "person") == "person"
        ]
        for n in neighbors:
            if n["id"] not in related:
                related.append(n["id"])

    return related[:5]


def build_stories(people: list[dict]) -> list[dict]:
    stories = []
    story_id = 0

    for p in people:
        rtype = p.get("recordType", "person")

        if rtype == "narrative":
            story_id += 1
            body_parts = [p["name"]] + p.get("notes", [])
            stories.append({
                "id": f"story-{story_id}",
                "title": p["name"][:80],
                "body": " ".join(body_parts),
                "personIds": find_related_person_ids(p, people),
                "branch": p["branch"],
                "tags": ["family-history", "narrative"],
                "source": "excel-notes",
            })
            continue

        # History doc references
        history_notes = [n for n in p.get("notes", []) if "history doc" in n.lower()]
        if history_notes:
            other_notes = [n for n in p.get("notes", []) if n not in history_notes]
            if other_notes:
                story_id += 1
                stories.append({
                    "id": f"story-{story_id}",
                    "title": f"{p['name']} — Colonial Research",
                    "body": "; ".join(other_notes),
                    "personIds": [p["id"]],
                    "branch": p["branch"],
                    "tags": ["history-doc", "colonial"],
                    "source": "excel-research",
                })

        # Long narrative notes on real people
        narrative_notes = [n for n in p.get("notes", []) if categorize_note(n) == "narrative" and len(n) > 40]
        for note in narrative_notes:
            story_id += 1
            stories.append({
                "id": f"story-{story_id}",
                "title": f"{p['name']}",
                "body": note,
                "personIds": [p["id"]],
                "branch": p["branch"],
                "tags": ["biography"],
                "source": "excel-notes",
            })

    return stories


def build_location_refs(people: list[dict]) -> list[dict]:
    refs = []
    for p in people:
        if p.get("recordType") != "location":
            continue
        refs.append({
            "id": f"loc-{p['id']}",
            "name": p["name"],
            "branch": p["branch"],
            "notes": p.get("notes", []),
            "relatedPersonIds": find_related_person_ids(p, people),
        })
    return refs


def build_search_text(person: dict, branch_label: str) -> str:
    parts = [person["name"], person.get("dates", ""), branch_label]
    parts.extend(person.get("notes", []))
    if person.get("recordType") == "location":
        parts.append("cemetery burial location")
    return " ".join(parts).lower()


def main():
    with open(IN_PATH, encoding="utf-8") as f:
        data = json.load(f)

    branch_labels = {b["id"]: b["label"] for b in data["branches"]}
    people = data["people"]

    for p in people:
        fix_person_fields(p)
        p["recordType"] = classify_record(p)
        p["categorizedNotes"] = [
            {"category": categorize_note(n), "text": n}
            for n in p.get("notes", [])
        ]

    add_generations(people)

    # Re-link wixted parentIds only for person records
    wixted = [p for p in people if p["branch"] == "wixted" and p.get("recordType") == "person"]
    rows = sorted(set(p["row"] for p in wixted))
    row_gen = {row: i for i, row in enumerate(rows)}
    by_gen: dict[int, list] = {}
    for p in wixted:
        gen = row_gen[p["row"]]
        p["generation"] = gen
        by_gen.setdefault(gen, []).append(p)

    for gen in sorted(by_gen.keys()):
        if gen == 0:
            continue
        parents = by_gen.get(gen - 1, [])
        children = by_gen[gen]
        for child in children:
            if not parents:
                continue
            best = min(parents, key=lambda par: abs(par["col"] - child["col"]))
            if abs(best["col"] - child["col"]) <= 12:
                child["parentId"] = best["id"]

    for p in people:
        label = branch_labels.get(p["branch"], p["branch"])
        p["searchText"] = build_search_text(p, label)

    stories = build_stories(people)
    location_refs = build_location_refs(people)

    person_count = sum(1 for p in people if p.get("recordType", "person") == "person")
    data["people"] = people
    data["stories"] = stories
    data["locationRefs"] = location_refs
    data["meta"]["enriched"] = True
    data["meta"]["personCount"] = person_count
    data["meta"]["storyCount"] = len(stories)

    for b in data["branches"]:
        b["count"] = sum(
            1 for p in people
            if p["branch"] == b["id"] and p.get("recordType", "person") == "person"
        )

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Enriched {len(people)} records ({person_count} people)")
    print(f"Stories: {len(stories)}, Location refs: {len(location_refs)}")
    print(f"Filtered: {len(people) - person_count} non-person records reclassified")


if __name__ == "__main__":
    main()
