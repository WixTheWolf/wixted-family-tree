"""
Add research stories, resources, and gallery seeds from Wixted Family 05-29-2022.xls.
Run after apply_workbook_sync.py.
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

DATA = Path(__file__).parent.parent / "src" / "data" / "family.json"
EXTERNAL = Path(__file__).parent.parent / "src" / "data" / "externalResources.json"
ASSETS = Path(__file__).parent.parent / "src" / "data" / "assets.json"

NEW_STORIES = [
    {
        "id": "story-sarah-mcgraw-bequest",
        "title": "Sarah McGraw's $10,000 Bequest (1957)",
        "body": (
            "Sarah McGraw, who never married, willed her nephew John Leroy Wixted $10,000 in 1957. "
            "John and his wife Hazel later bought a house in Avon, New York — and then bought a Buick "
            "for Evelyn and Bruce Wixted. Family notes also record that Hazel Wixted and Emanuel Jones "
            "received their Social Security cards on the exact same day (November 25, 1936), with "
            "SS numbers only 54 apart."
        ),
        "personIds": ["wixted-73-27", "wixted-73-29", "wixted-91-29", "wixted-91-31"],
        "branch": "wixted",
        "tags": ["family-history", "narrative", "research"],
        "source": "excel-workbook-v9.5",
    },
    {
        "id": "story-evelyn-adoption-dna",
        "title": "Evelyn Jones — Adoption Mystery & DNA",
        "body": (
            "Workbook notes speculated that Evelyn Ruth Jones was possibly adopted based on her looks — "
            "Emanuel Jones was 39 and Grace Gilbert 33 when she was born, late for a first child in that era. "
            "DNA analysis of descendants (Bo and Kevin at 15–20% Swedish) confirmed she was not adopted; "
            "the Swedish line through Jonas F. E. Jones is genuine."
        ),
        "personIds": ["wixted-91-31"],
        "branch": "evelyn",
        "tags": ["ancestry", "research", "DNA"],
        "source": "excel-workbook-v9.5",
    },
    {
        "id": "story-jonas-caronia-1908",
        "title": "Jonas F. E. Jones — SS Caronia, Ellis Island 1908",
        "body": (
            "From the ship manifest of the SS Caronia: departed Liverpool November 7, 1908 (age 15), "
            "arrived New York November 15, 1908. Born Ramsberg, Sweden; last residence Hassleby, Sweden. "
            "Destination Jamestown, New York. Friend Leander Johnsson at 142 Prospect Ave, Jamestown. "
            "Traveling with $30."
        ),
        "personIds": ["wixted-91-31"],
        "branch": "evelyn",
        "tags": ["immigration", "Swedish", "Ellis Island"],
        "source": "excel-workbook-v9.5",
    },
    {
        "id": "story-amor-heritage-french-mexican",
        "title": "Amor Line — French Surname, Mexican via Montez/Rivera",
        "body": (
            "The Amor surname is French, not Mexican — Joseph E. Amor's father came from France. "
            "Mexican heritage in the Kevin/Angela branch enters through Vincenta Rivera and the Montez line: "
            "Marriage of Jesus and Vincenta, 6 December 1895, Santa Maria Magdalena, Magdalena Jaltepec, Oaxaca, Mexico. "
            "This 25% Mexican component appears in Katie Alyson Wixted's heritage chart, not in the Daniel/Matthew Wixted line."
        ),
        "personIds": ["wixted-104-39", "wixted-114-39"],
        "branch": "amor",
        "tags": ["ancestry", "heritage", "research"],
        "source": "excel-workbook-v9.5",
    },
    {
        "id": "story-phillip-short-1681",
        "title": "Phillip Short — Massachusetts 1681",
        "body": (
            "In 1875, Nellie B. Fanton and her single mother Arvilla lived with the Short family. "
            "Mrs Caroline Calkings-Short was Arvilla's cousin. The Gilbert/Evelyn research line "
            "traces back to Phillip Short of Massachusetts, 1681."
        ),
        "personIds": ["wixted-91-31"],
        "branch": "ev-gilbert",
        "tags": ["colonial", "family-history"],
        "source": "excel-workbook-v9.5",
    },
    {
        "id": "story-catherine-rochester-saloon",
        "title": "Catherine Wixted — Rochester Saloon Keeper (1880s)",
        "body": (
            "Rochester city directories and censuses document a Catherine Wixted cluster: "
            "1880 census — Catherine, 41, Ireland, saloon keeper; "
            "1882 directory — Catherine, 59 West Ave, saloon; Julia C. renter, stitcher; Mary, forewoman; "
            "1890 directory — Catherine Wixted, 50 Seward; Mary L Wixted, stenographer. "
            "Further research may link this branch to the Corning Wixted line."
        ),
        "personIds": ["wixted-18-3"],
        "branch": "wixted",
        "tags": ["census", "research", "Rochester"],
        "source": "excel-workbook-v9.5",
    },
    {
        "id": "story-sacred-heart-hainesport",
        "title": "Sacred Heart Cemetery — Hainesport, NJ Wixteds",
        "body": (
            "Irish-born collateral Wixted burials documented in the workbook: "
            "John W. Wixted (1824–1902), Sarah W. Wixted (1829–1894), and Thomas J. Wixted (1854–1915) — "
            "all buried at Sacred Heart Cemetery, Hainesport, New Jersey (gravesite photos referenced in workbook)."
        ),
        "personIds": ["wixted-18-3"],
        "branch": "from-ireland",
        "tags": ["cemetery", "Ireland", "New Jersey"],
        "source": "excel-workbook-v9.5",
    },
]

NEW_RESOURCES = [
    {
        "id": "res-painted-hills-holy-sepulchre",
        "title": "Painted Hills — Holy Sepulchre Cemetery, Bath NY",
        "desc": "Steuben County cemetery index from the family workbook. John & Hazel Wixted burials at Holy Sepulchre, Bath.",
        "url": "http://www.paintedhills.org/STEUBEN/HolySepulcherCem.htm",
        "category": "cemetery",
        "tags": ["Bath", "Steuben", "John Leroy Wixted", "Hazel Wixted"],
        "verified": True,
    },
    {
        "id": "res-sacred-heart-hainesport",
        "title": "Sacred Heart Cemetery — Hainesport, NJ",
        "desc": "Burial place of John W., Sarah, and Thomas J. Wixted — Irish collateral line from workbook FromIRE sheet.",
        "url": "https://www.findagrave.com/cemetery/90967/sacred-heart-cemetery",
        "category": "cemetery",
        "tags": ["New Jersey", "Hainesport", "Irish Wixted"],
        "verified": True,
    },
    {
        "id": "res-ellis-island-caronia",
        "title": "Ellis Island — SS Caronia Passenger Records",
        "desc": "Search Ellis Island manifests for Jonas F. E. Jones arrival November 15, 1908 from Liverpool.",
        "url": "https://www.libertyellisfoundation.org/passenger",
        "category": "genealogy",
        "tags": ["Ellis Island", "Swedish", "Jonas Jones"],
        "verified": True,
    },
    {
        "id": "res-mexico-oaxaca-records",
        "title": "FamilySearch — Oaxaca, Mexico Catholic Records",
        "desc": "Marriage of Jesus Montez and Vincenta Rivera, 6 Dec 1895, Santa Maria Magdalena, Jaltepec — Amor/Mexican line.",
        "url": "https://www.familysearch.org/search/catalog/1703998",
        "category": "origins",
        "tags": ["Oaxaca", "Mexico", "Amor", "Montez"],
        "verified": True,
    },
]

NEW_GALLERY = [
    {
        "id": "seed-painted-hills-bath",
        "personId": "wixted-73-27",
        "title": "Holy Sepulchre Cemetery — Bath, Steuben County",
        "type": "headstone",
        "url": "http://www.paintedhills.org/STEUBEN/HolySepulcherCem.htm",
        "caption": "Workbook reference — John & Hazel Wixted burial index (Painted Hills NYGenWeb)",
        "addedAt": "2026-06-30",
        "source": "site",
    },
    {
        "id": "seed-caronia-ellis",
        "personId": "wixted-91-31",
        "title": "SS Caronia — Jonas Jones Ellis Island 1908",
        "type": "document",
        "url": "https://www.libertyellisfoundation.org/passenger",
        "caption": "Swedish immigration — Liverpool to New York, Nov 1908. Evelyn line ancestor.",
        "addedAt": "2026-06-30",
        "source": "site",
    },
    {
        "id": "seed-oaxaca-marriage",
        "personId": "wixted-104-39",
        "title": "Montez/Rivera Marriage — Jaltepec, Oaxaca 1895",
        "type": "research",
        "url": "https://www.familysearch.org/search/catalog/1703998",
        "caption": "Mexican heritage via Angela Amor line — not Matthew's Wixted line",
        "addedAt": "2026-06-30",
        "source": "site",
    },
    {
        "id": "seed-hero-tipperary",
        "personId": "wixted-18-3",
        "title": "Irish Wixted Origins — Tipperary Baptism Scan",
        "type": "photo",
        "url": "https://www.wikitree.com/photo.php/6/64/Wixted-3.png",
        "previewUrl": "https://www.wikitree.com/photo.php/6/64/Wixted-3.png",
        "caption": "John Wixted baptism, Englishtown, Co. Tipperary 1815 — site hero background",
        "addedAt": "2026-06-30",
        "source": "site",
    },
]

PERSON_LINKS = {
    "wixted-73-27": [
        {
            "label": "Painted Hills — Holy Sepulchre Bath NY",
            "url": "http://www.paintedhills.org/STEUBEN/HolySepulcherCem.htm",
            "type": "cemetery",
        }
    ],
    "wixted-104-39": [
        {
            "label": "Oaxaca Catholic Records — Montez/Rivera",
            "url": "https://www.familysearch.org/search/catalog/1703998",
            "type": "research",
        }
    ],
}


def main() -> None:
    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)

    existing_ids = {s["id"] for s in data.get("stories", [])}
    stories = data.get("stories", [])
    for story in NEW_STORIES:
        if story["id"] not in existing_ids:
            stories.insert(0, story)
            existing_ids.add(story["id"])

    # Fix story-2 if truncated
    for s in stories:
        if s.get("id") == "story-2" and "Orange County" in s.get("body", ""):
            s["body"] = (
                "Bruce & Evelyn Wixted moved with 4 kids from Rochester, NY to Phoenix, AZ in 1963. "
                "Then to Orange County, CA in 1971. In 1975 they divorced and Bruce married Carol."
            )
            s["title"] = "Bruce & Evelyn — Rochester to California"

    data["stories"] = stories
    data["meta"]["storyCount"] = len(stories)
    data["meta"]["updated"] = date.today().isoformat()

    # Fix Angela note
    angela = next((p for p in data["people"] if p["id"] == "wixted-104-39"), None)
    if angela:
        angela["notes"] = [
            n for n in angela.get("notes", [])
            if "Mexican heritage via Amor" not in n
        ]
        angela["notes"].append(
            "Amor surname is French; Mexican heritage via Montez/Rivera (Oaxaca, 1895)"
        )

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    with open(EXTERNAL, encoding="utf-8") as f:
        ext = json.load(f)

    existing_res = {r["id"] for r in ext.get("resources", [])}
    for res in NEW_RESOURCES:
        if res["id"] not in existing_res:
            ext["resources"].insert(0, res)
            existing_res.add(res["id"])

    ext["meta"]["stats"]["resources"] = len(ext["resources"])
    ext["meta"]["researched"] = date.today().isoformat()

    links = ext.setdefault("personLinks", {})
    for pid, new_links in PERSON_LINKS.items():
        current = links.get(pid, [])
        urls = {l["url"] for l in current}
        for link in new_links:
            if link["url"] not in urls:
                current.append(link)
        links[pid] = current

    with open(EXTERNAL, "w", encoding="utf-8") as f:
        json.dump(ext, f, ensure_ascii=False, indent=2)

    with open(ASSETS, encoding="utf-8") as f:
        assets = json.load(f)

    existing_gallery = {g["id"] for g in assets.get("gallery", [])}
    for item in NEW_GALLERY:
        if item["id"] not in existing_gallery:
            assets["gallery"].append(item)

    doc = next((d for d in assets["documents"] if d["title"] == "Online Research Archives"), None)
    if doc:
        doc["desc"] = f"{len(ext['resources'])} verified sources + {len(assets['gallery'])} cataloged photos/docs"

    with open(ASSETS, "w", encoding="utf-8") as f:
        json.dump(assets, f, ensure_ascii=False, indent=2)

    print(f"Stories: {len(stories)} total ({len(NEW_STORIES)} new)")
    print(f"Resources: {len(ext['resources'])}")
    print(f"Gallery: {len(assets['gallery'])} items")


if __name__ == "__main__":
    main()
