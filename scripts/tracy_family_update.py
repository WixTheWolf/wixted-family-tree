"""
Add Tracy siblings and research from family confirmation + Joan Jeisi obituary.
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

DATA = Path(__file__).parent.parent / "src" / "data" / "family.json"
EXTERNAL = Path(__file__).parent.parent / "src" / "data" / "externalResources.json"
ASSETS = Path(__file__).parent.parent / "src" / "data" / "assets.json"

JACK = "tracy-103-31"
KATIE = "tracy-103-33"
MARY = "wixted-104-33"
WALTER = "tracy-102-29"
CECELIA = "tracy-102-31"
JOAN = "tracy-103-29"
BRIAN = "tracy-104-21"
JOHN = "tracy-104-25"
ANNE = "tracy-104-27"
CHILDREN = [BRIAN, JOHN, ANNE, MARY]
SIBLING_IDS = CHILDREN


def upsert_person(people: list[dict], lookup: dict[str, dict], person: dict) -> None:
    if person["id"] in lookup:
        lookup[person["id"]].update(person)
    else:
        people.append(person)
        lookup[person["id"]] = person


def apply_tracy_family(data: dict) -> dict:
    """Apply Tracy sibling research to family.json data in place."""
    people = data["people"]
    lookup = {p["id"]: p for p in people}

    new_people = [
        {
            "id": WALTER,
            "name": "Walter Tracy",
            "dates": "",
            "notes": [
                "New Jersey origins (per daughter Joan's obituary)",
                "Married Cecelia (McDonough) Tracy",
                "Research: likely grandfather of Mary Joan (Tracy) Wixted",
            ],
            "col": 29,
            "row": 102,
            "branch": "tracy",
            "generation": 10,
            "recordType": "person",
            "spouseIds": [CECELIA],
            "childIds": [JOAN, JACK],
            "searchText": "walter tracy tracy new jersey origins cecelia mcDonough grandfather mary joan tracy wixted",
        },
        {
            "id": CECELIA,
            "name": "Cecelia (McDonough) Tracy",
            "dates": "",
            "notes": [
                "Maiden name: McDonough",
                "New Jersey origins (per daughter Joan's obituary)",
                "Research: likely grandmother of Mary Joan (Tracy) Wixted",
            ],
            "col": 31,
            "row": 102,
            "branch": "tracy",
            "generation": 10,
            "recordType": "person",
            "spouseIds": [WALTER],
            "childIds": [JOAN, JACK],
            "searchText": "cecelia (mcDonough) tracy tracy maiden name mcDonough new jersey grandmother mary joan",
        },
        {
            "id": JOAN,
            "name": "Joan Marie (Tracy) Jeisi",
            "dates": "10/28/1924–04/08/2014",
            "notes": [
                "Born New Jersey to Walter & Cecelia (McDonough) Tracy",
                "Died Rowland Heights, CA — age 89",
                "Sister of John \"Jack\" Tracy (research)",
                "Aunt of Brian, John, Anne, and Mary Joan Tracy",
                "Services: White Emerson Mortuary, Whittier · Queen of Heaven Cemetery, Rowland Heights",
            ],
            "col": 29,
            "row": 103,
            "branch": "tracy",
            "generation": 9,
            "parentId": WALTER,
            "motherId": CECELIA,
            "recordType": "person",
            "birthDate": "1924-10-28",
            "searchText": "joan marie (tracy) jeisi 10/28/1924–04/08/2014 tracy rowland heights white emerson whittier",
        },
        {
            "id": BRIAN,
            "name": "Brian Tracy",
            "dates": "",
            "notes": [
                "Oldest sibling — Brian, John, Anne, Mary Joan",
                "Also recorded as Bryan Tracy (Joan Jeisi 2014 obituary)",
                "Nephew of Joan Marie (Tracy) Jeisi",
                "Whittier / Rowland Heights, CA area",
            ],
            "col": 21,
            "row": 104,
            "branch": "tracy",
            "generation": 8,
            "parentId": JACK,
            "motherId": KATIE,
            "recordType": "person",
            "siblingIds": [JOHN, ANNE, MARY],
            "searchText": "brian tracy tracy oldest sibling bryan tracy nephew joan jeisi whittier",
        },
        {
            "id": JOHN,
            "name": "John Tracy",
            "dates": "",
            "notes": [
                "Second sibling — Brian, John, Anne, Mary Joan",
                "Son of John \"Jack\" Tracy and Katie (Martin) Tracy",
                "Whittier, CA area",
                "Not the actor Spencer Tracy's son (different John Tracy family)",
            ],
            "col": 25,
            "row": 104,
            "branch": "tracy",
            "generation": 8,
            "parentId": JACK,
            "motherId": KATIE,
            "recordType": "person",
            "siblingIds": [BRIAN, ANNE, MARY],
            "searchText": "john tracy tracy sibling brian anne mary joan whittier jack katie martin",
        },
        {
            "id": ANNE,
            "name": "Anne (Tracy) Davalos",
            "dates": "",
            "notes": [
                "Third sibling — Brian, John, Anne, Mary Joan",
                "Married name: Davalos",
                "Rowland Heights, CA (18984 Barroso St — public records)",
                "Research: b. ~May 1960, Los Angeles Co. (public records, unverified)",
                "Niece of Joan Marie (Tracy) Jeisi (2014 obituary)",
            ],
            "col": 27,
            "row": 104,
            "branch": "tracy",
            "generation": 8,
            "parentId": JACK,
            "motherId": KATIE,
            "recordType": "person",
            "siblingIds": [BRIAN, JOHN, MARY],
            "searchText": "anne (tracy) davalos tracy rowland heights sibling mary joan whittier barroso",
        },
    ]

    for person in new_people:
        upsert_person(people, lookup, person)

    jack = lookup[JACK]
    jack["parentId"] = WALTER
    jack["motherId"] = CECELIA
    jack["siblingIds"] = [JOAN]
    jack["notes"] = [
        "Whittier, CA area",
        "Also known as John \"Jack\" Tracy",
        "Son of Walter & Cecelia (McDonough) Tracy (research via Joan Jeisi obituary)",
        "Father of Brian, John, Anne, and Mary Joan Tracy",
    ]
    jack["childIds"] = CHILDREN
    jack["searchText"] = (
        'john "jack" tracy tracy whittier walter cecelia mcDonough brian john anne mary joan'
    )

    katie = lookup[KATIE]
    katie["notes"] = [
        "Maiden name: Martin",
        "Mother of Brian, John, Anne, and Mary Joan Tracy",
        "Whittier, CA area",
    ]
    katie["childIds"] = CHILDREN

    mary = lookup[MARY]
    mary["notes"] = [
        "07/07/61-",
        "Whittier,CA",
        "Youngest sibling — Brian, John, Anne, Mary Joan",
        "m. Daniel Scott Wixted, Jun 28 1986",
        "Daughter of John \"Jack\" Tracy and Katie (Martin) Tracy",
        "Niece of Joan Marie (Tracy) Jeisi",
    ]
    mary["siblingIds"] = [BRIAN, JOHN, ANNE]
    mary["searchText"] = (
        "mary joan (tracy) wixted tracy youngest sibling brian john anne whittier daniel wixted 1986"
    )
    if not mary.get("birthDate"):
        mary["birthDate"] = "1961-07-07"

    joan = lookup[JOAN]
    joan["siblingIds"] = [JACK]

    for bid in data["branches"]:
        if bid["id"] == "tracy":
            bid["count"] = 9
            bid["desc"] = (
                "Mary Joan Tracy line — Walter & Cecelia to Jack, Katie Martin, and four children"
            )

    data["meta"]["personCount"] = len(
        [p for p in people if p.get("recordType", "person") == "person"]
    )

    stories = data.get("stories", [])
    by_id = {s["id"]: s for s in stories}

    by_id["story-tracy-line"] = {
        "id": "story-tracy-line",
        "title": "The Tracy Line — Jack, Katie & Four Children",
        "body": (
            "Mary Joan (Tracy) Wixted (b. 7 Jul 1961, Whittier, CA) is the youngest of four siblings: "
            "Brian Tracy (oldest), John Tracy, Anne (Tracy) Davalos, and Mary Joan. "
            "Their parents are John \"Jack\" Tracy and Katie (Martin) Tracy of the Whittier area. "
            "Research links the Tracy line to Walter Tracy and Cecelia (McDonough) Tracy of New Jersey "
            "through Joan Marie (Tracy) Jeisi (1924–2014), Jack's sister — her 2014 obituary names "
            "nieces Anne Davalos and Mary Wixted and nephew Bryan/Brian Tracy. "
            "Anne Davalos is associated with Rowland Heights, CA in public records (~b. May 1960). "
            "Mary Joan married Daniel Scott Wixted on June 28, 1986. The Tracy name continues through "
            "granddaughter Sedona Tracy Wixted."
        ),
        "personIds": [MARY, JACK, KATIE, BRIAN, JOHN, ANNE, JOAN, WALTER, CECELIA, "wixted-121-31"],
        "branch": "tracy",
        "tags": ["family-history", "ancestry", "research"],
        "source": "family-update",
    }

    by_id["story-joan-tracy-jeisi"] = {
        "id": "story-joan-tracy-jeisi",
        "title": "Joan Marie (Tracy) Jeisi — Aunt of the Whittier Tracys",
        "body": (
            "Joan Marie Jeisi was born Joan Marie Tracy on October 28, 1924 in New Jersey to Walter "
            "and Cecelia (McDonough) Tracy. She died April 8, 2014 in Rowland Heights, California, at age 89. "
            "Her obituary (White Emerson Mortuary, Whittier) lists surviving nieces Anne Davalos and "
            "Mary Wixted and nephew Bryan Tracy — confirming the Tracy siblings of Mary Joan's generation. "
            "Mass was held at St. Elizabeth Ann Seton Catholic Church, Rowland Heights; burial at "
            "Queen of Heaven Cemetery."
        ),
        "personIds": [JOAN, WALTER, CECELIA, JACK, ANNE, BRIAN, MARY],
        "branch": "tracy",
        "tags": ["obituary", "research", "family-history"],
        "source": "public-records",
    }

    by_id["story-tracy-siblings-research"] = {
        "id": "story-tracy-siblings-research",
        "title": "Tracy Siblings — Research Notes",
        "body": (
            "Family order (oldest to youngest): Brian Tracy, John Tracy, Anne (Tracy) Davalos, "
            "Mary Joan (Tracy) Wixted. Confirmed by family and corroborated by Joan Jeisi's 2014 obituary "
            "(nephew Bryan Tracy; nieces Anne Davalos and Mary Wixted). Brian is also spelled Bryan in "
            "that obituary. Anne is linked to Rowland Heights, CA (18984 Barroso St) in public records; "
            "approximate birth May 1960, Los Angeles County. Mary Joan's birth (7 Jul 1961, Whittier) and "
            "marriage to Daniel Wixted (28 Jun 1986) are documented in the family workbook. "
            "Birth dates for Brian and John remain unverified — LA County Registrar or WAGS Whittier "
            "vital index may hold records."
        ),
        "personIds": [BRIAN, JOHN, ANNE, MARY, JACK, KATIE],
        "branch": "tracy",
        "tags": ["research", "family-history"],
        "source": "research",
    }

    data["stories"] = list(by_id.values())
    data["meta"]["storyCount"] = len(data["stories"])
    return data


def apply_tracy_external(ext: dict) -> dict:
    new_res = [
        {
            "id": "res-joan-jeisi-obit",
            "title": "Joan Marie (Tracy) Jeisi Obituary (2014)",
            "desc": "White Emerson Mortuary, Whittier — confirms Tracy siblings Anne Davalos, Mary Wixted, and Bryan Tracy.",
            "url": "https://www.whiteemerson.com/obituaries/joan-marie-jeisi",
            "category": "obituaries",
            "tags": ["Tracy", "Whittier", "Rowland Heights", "Jeisi"],
            "verified": True,
        },
        {
            "id": "res-wags-whittier",
            "title": "Whittier Area Genealogical Society (WAGS)",
            "desc": "Local research assistance for Whittier and southeastern LA County families since 1981.",
            "url": "https://wagswhittier.org/",
            "category": "libraries",
            "tags": ["Whittier", "Tracy", "Wixted", "LA County"],
            "verified": True,
        },
        {
            "id": "res-whittier-vitals-index",
            "title": "Whittier Vital Records Index (1888–1957)",
            "desc": "WAGS abstracted births, marriages, deaths from Whittier newspapers — Whittier Public Library History Room.",
            "url": "https://localhistory.whittierlibrary.org/collections/genealogy",
            "category": "libraries",
            "tags": ["Whittier", "marriage", "Tracy"],
            "verified": True,
        },
        {
            "id": "res-la-county-vitals",
            "title": "LA County Registrar — Marriage & Birth Records",
            "desc": "Official source for Daniel & Mary Joan Wixted marriage (Jun 28 1986) and Tracy birth records.",
            "url": "https://apps.lavote.net/BDM",
            "category": "genealogy",
            "tags": ["Los Angeles", "marriage", "Tracy", "Wixted"],
            "verified": True,
        },
        {
            "id": "res-queen-of-heaven-cemetery",
            "title": "Queen of Heaven Cemetery — Rowland Heights",
            "desc": "Burial place of Joan Marie (Tracy) Jeisi (2014). Tracy family services in Rowland Heights/Whittier area.",
            "url": "https://www.findagrave.com/cemetery/2287424/queen-of-heaven-cemetery-and-mausoleum",
            "category": "cemetery",
            "tags": ["Tracy", "Jeisi", "Rowland Heights"],
            "verified": True,
        },
        {
            "id": "res-st-elizabeth-seton-rh",
            "title": "St. Elizabeth Ann Seton Catholic Church — Rowland Heights",
            "desc": "Mass location for Joan Jeisi funeral (2014); Tracy family Whittier/Rowland Heights parish connections.",
            "url": "https://setonchurch.org/",
            "category": "research",
            "tags": ["Tracy", "Rowland Heights", "Jeisi"],
            "verified": True,
        },
    ]
    existing = {r["id"] for r in ext["resources"]}
    for r in new_res:
        if r["id"] not in existing:
            ext["resources"].insert(0, r)
    ext["meta"]["stats"]["resources"] = len(ext["resources"])

    links = ext.setdefault("personLinks", {})
    links[JOAN] = [{
        "label": "Joan Jeisi obituary — White Emerson Mortuary",
        "url": "https://www.whiteemerson.com/obituaries/joan-marie-jeisi",
        "type": "obituary",
    }]
    links[JACK] = links.get(JACK, []) + [{
        "label": "Whittier Area Genealogical Society",
        "url": "https://wagswhittier.org/",
        "type": "research",
    }]
    links[MARY] = links.get(MARY, []) + [{
        "label": "LA County marriage records (1986)",
        "url": "https://apps.lavote.net/BDM",
        "type": "research",
    }]
    links[ANNE] = [{
        "label": "Joan Jeisi obituary (lists niece Anne Davalos)",
        "url": "https://www.whiteemerson.com/obituaries/joan-marie-jeisi",
        "type": "obituary",
    }]
    links[BRIAN] = [{
        "label": "Joan Jeisi obituary (lists nephew Bryan Tracy)",
        "url": "https://www.whiteemerson.com/obituaries/joan-marie-jeisi",
        "type": "obituary",
    }]
    return ext


def apply_tracy_assets(assets: dict) -> dict:
    gid = "seed-joan-jeisi-obit"
    if gid not in {g["id"] for g in assets["gallery"]}:
        assets["gallery"].append({
            "id": gid,
            "personId": JOAN,
            "title": "Joan Marie (Tracy) Jeisi Obituary (2014)",
            "type": "obituary",
            "url": "https://www.whiteemerson.com/obituaries/joan-marie-jeisi",
            "caption": "Confirms Tracy siblings — nieces Anne Davalos & Mary Wixted, nephew Bryan Tracy",
            "addedAt": date.today().isoformat(),
            "source": "site",
        })
    return assets


def main() -> None:
    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)

    apply_tracy_family(data)
    data["meta"]["updated"] = date.today().isoformat()

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    with open(EXTERNAL, encoding="utf-8") as f:
        ext = json.load(f)
    apply_tracy_external(ext)
    ext["meta"]["researched"] = date.today().isoformat()
    with open(EXTERNAL, "w", encoding="utf-8") as f:
        json.dump(ext, f, ensure_ascii=False, indent=2)

    with open(ASSETS, encoding="utf-8") as f:
        assets = json.load(f)
    apply_tracy_assets(assets)
    with open(ASSETS, "w", encoding="utf-8") as f:
        json.dump(assets, f, ensure_ascii=False, indent=2)

    lookup = {p["id"]: p for p in data["people"]}
    print(f"Tracy family updated. Children: {[lookup[i]['name'] for i in CHILDREN]}")
    print(f"Person count: {data['meta']['personCount']}")


if __name__ == "__main__":
    main()
