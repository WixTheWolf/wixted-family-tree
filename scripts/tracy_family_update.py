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
EDUARDO = "tracy-104-29"
IRENE = "tracy-104-23"
CHILDREN = [BRIAN, JOHN, ANNE, MARY]
SAN_ANDREAS = "4420 San Andreas Ave, Los Angeles, CA 90065"
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
                "Confirmed father of Joan Marie (Tracy) Jeisi (1924 obituary, 2014 death)",
                "Research: likely also father of John \"Jack\" Tracy",
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
                "Confirmed mother of Joan Marie (Tracy) Jeisi",
                "Research: likely also mother of John \"Jack\" Tracy",
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
            "deathDate": "2014-04-08",
            "searchText": "joan marie (tracy) jeisi 10/28/1924–04/08/2014 tracy rowland heights white emerson whittier",
        },
        {
            "id": BRIAN,
            "name": "Brian G Tracy",
            "dates": "",
            "notes": [
                "Oldest sibling — Brian, John, Anne, Mary Joan",
                "Also recorded as Bryan Tracy (Joan Jeisi 2014 obituary)",
                "Research: Brian Gerard Tracy, b. September 1957, Los Angeles Co. (public records)",
                "Distinct from motivational speaker Brian Tracy (b. 1944, Solana Beach)",
                SAN_ANDREAS,
                "Phone (323) 842-7451 (public directory; shared with Irene Leyva Tracy)",
                "Spouse: Irene Leyva Tracy (b. 4 Nov 1958, Los Angeles Co.)",
                "Public directories link to John Tracy, Catherine Tracy, Katrina Irene Tracy",
                "Not in CA Birth Index under Tracy + mother Martin (free search)",
                "Nephew of Joan Marie (Tracy) Jeisi",
            ],
            "col": 21,
            "row": 104,
            "branch": "tracy",
            "generation": 8,
            "parentId": JACK,
            "motherId": KATIE,
            "recordType": "person",
            "spouseIds": [IRENE],
            "siblingIds": [JOHN, ANNE, MARY],
            "searchText": "brian g tracy tracy san andreas 90065 bryan irene leyva september 1957",
        },
        {
            "id": IRENE,
            "name": "Irene Leyva Tracy",
            "dates": "",
            "notes": [
                "Wife of Brian G Tracy (public records)",
                "Research: b. 4 Nov 1958, Los Angeles Co. (OpenDataUSA / Radaris)",
                SAN_ANDREAS,
                "Also known as Irene L / Irene V Leyva / Irene Leyvatracy",
                "Phone (323) 842-7450–7451 (public directory, San Andreas address)",
                "Public directories link to Brian, John, and Catherine Tracy",
            ],
            "col": 23,
            "row": 104,
            "branch": "tracy",
            "generation": 8,
            "recordType": "person",
            "spouseIds": [BRIAN],
            "birthDate": "1958-11-04",
            "searchText": "irene leyva tracy brian san andreas los angeles 90065 november 1958",
        },
        {
            "id": JOHN,
            "name": "John Tracy",
            "dates": "",
            "notes": [
                "Second sibling — Brian, John, Anne, Mary Joan",
                "Research: b. ~April 1959, Los Angeles Co., age 67 (OpenDataUSA)",
                "Associated with Brian at 4420 San Andreas Ave in public directories (Spokeo/Radaris)",
                "Son of John \"Jack\" Tracy and Katie (Martin) Tracy",
                "Public records link to Mary Wixted via Katrina Irene Tracy (~b. 1986, Spokeo)",
                "Not Spencer Tracy's son (1924–2007) or Boeing executive John J. Tracy (b. 1954)",
                "Not in CA Birth Index under Tracy + mother Martin (free search)",
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
            "name": "Anne E (Tracy) Davalos",
            "dates": "",
            "notes": [
                "Third sibling — Brian, John, Anne, Mary Joan",
                "Married name: Davalos",
                "Rowland Heights, CA — 18984 Barroso St (public property records)",
                "Research: b. May 1960, Los Angeles Co., age 66 (OpenDataUSA)",
                "Spouse: Eduardo E Davalos (same address; married per public records)",
                "Property co-owned May 2004 (BlockShopper / LA County assessor)",
                "Not in CA Birth Index as Anne Tracy (free search)",
                "Niece of Joan Marie (Tracy) Jeisi (2014 obituary)",
            ],
            "col": 27,
            "row": 104,
            "branch": "tracy",
            "generation": 8,
            "parentId": JACK,
            "motherId": KATIE,
            "recordType": "person",
            "spouseIds": [EDUARDO],
            "siblingIds": [BRIAN, JOHN, MARY],
            "searchText": "anne e (tracy) davalos tracy rowland heights barroso eduardo sibling mary joan",
        },
        {
            "id": EDUARDO,
            "name": "Eduardo E Davalos",
            "dates": "",
            "notes": [
                "Husband of Anne E (Tracy) Davalos (research)",
                "Rowland Heights, CA — 18984 Barroso St",
                "Co-owner with Anne E Davalos since May 2004 (public property records)",
                "Whittier/Rowland Heights Tracy family connection via marriage",
            ],
            "col": 29,
            "row": 104,
            "branch": "tracy",
            "generation": 8,
            "recordType": "person",
            "spouseIds": [ANNE],
            "searchText": "eduardo e davalos tracy anne rowland heights barroso 91748",
        },
    ]

    for person in new_people:
        upsert_person(people, lookup, person)

    jack = lookup[JACK]
    jack["parentId"] = WALTER
    jack["motherId"] = CECELIA
    jack["siblingIds"] = [JOAN]
    jack["notes"] = [
        "Whittier / Rowland Heights / Los Angeles, CA area",
        "Also known as John \"Jack\" Tracy",
        "Son of Walter & Cecelia (McDonough) Tracy (inferred via sister Joan Jeisi obituary)",
        "Father of Brian, John, Anne, and Mary Joan Tracy",
        "Public access: no obituary, birth, or marriage index hit for Jack + Katie Martin (LA County)",
        "Family services: White Emerson Mortuary (Whittier) & Rowland Heights parishes",
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
        "Public access: parents unknown; no Katie Martin + Jack Tracy marriage in free indexes",
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
        "Not in California Birth Index as Mary Joan Tracy (workbook is primary source)",
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
            bid["count"] = 11
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
            "Brian G Tracy (oldest), John Tracy, Anne (Tracy) Davalos, and Mary Joan. "
            "Their parents are John \"Jack\" Tracy and Katie (Martin) Tracy of the Whittier area. "
            "Research links the Tracy line to Walter Tracy and Cecelia (McDonough) Tracy of New Jersey "
            "through Joan Marie (Tracy) Jeisi (1924–2014), Jack's sister — her 2014 obituary names "
            "nieces Anne Davalos and Mary Wixted and nephew Bryan/Brian Tracy. "
            "Anne E (Tracy) Davalos is associated with Rowland Heights, CA in public records (~b. May 1960), "
            "married to Eduardo E Davalos — co-owners of 18984 Barroso St since May 2004. "
            "Mary Joan married Daniel Scott Wixted on June 28, 1986. The Tracy name continues through "
            "granddaughter Sedona Tracy Wixted."
        ),
        "personIds": [MARY, JACK, KATIE, BRIAN, IRENE, JOHN, ANNE, EDUARDO, JOAN, WALTER, CECELIA, "wixted-121-31"],
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
            "Family order (oldest to youngest): Brian G Tracy, John Tracy, Anne E (Tracy) Davalos, "
            "Mary Joan (Tracy) Wixted. Confirmed by family and Joan Jeisi's 2014 obituary (nephew Bryan "
            "Tracy; nieces Anne Davalos and Mary Wixted). Public records cluster Brian Gerard Tracy "
            "(b. Sep 1957, LA Co.) and John Tracy (b. ~Apr 1959, LA Co.) at 4420 San Andreas Ave, Los "
            "Angeles 90065. Irene Leyva Tracy (b. 4 Nov 1958) shares the address and phone (323) 842-7451. "
            "Spokeo/Radaris link Katrina Irene Tracy (~b. 1986) and Catherine Tracy to the cluster and "
            "Mary Wixted — relationships unverified. Anne (b. May 1960, LA Co.) and Mary Joan (7 Jul 1961, "
            "Whittier) fit sibling spacing; neither in free CA Birth Index as Tracy + mother Martin. Anne "
            "lives in Rowland Heights with Eduardo E Davalos (18984 Barroso St)."
        ),
        "personIds": [BRIAN, IRENE, JOHN, ANNE, EDUARDO, MARY, JACK, KATIE, WALTER, CECELIA, JOAN],
        "branch": "tracy",
        "tags": ["research", "family-history", "public-records"],
        "source": "research",
    }

    by_id["story-tracy-public-access-audit"] = {
        "id": "story-tracy-public-access-audit",
        "title": "Tracy Line — Public Access Research Audit",
        "body": (
            "What free public sources confirmed: Joan Jeisi obituary (Walter/Cecelia Tracy, NJ 1924; "
            "nieces Anne Davalos & Mary Wixted; nephew Bryan/Brian Tracy). Anne E Davalos (b. May 1960, "
            "LA Co.) + Eduardo E Davalos at 18984 Barroso St, Rowland Heights (property records, May 2004). "
            "Brian Gerard Tracy (b. Sep 1957, LA Co.) and John Tracy (b. ~Apr 1959, LA Co.) at 4420 San "
            "Andreas Ave, Los Angeles 90065 with Irene Leyva Tracy (b. 4 Nov 1958). Spokeo/Radaris link "
            "Katrina Irene Tracy (~b. 1986) and Catherine Tracy to Mary Wixted — unverified. Mary Joan's "
            "birth (7 Jul 1961, Whittier) and Daniel Wixted marriage (28 Jun 1986) from family workbook. "
            "What public access did NOT resolve without paid/vital certificates: Jack Tracy birth/death, "
            "Katie (Martin) Tracy's parents, Jack & Katie marriage date, exact birth certificates for "
            "Brian/John/Anne in the California Birth Index (no Tracy + Martin mother matches; Mary Joan "
            "not indexed under that name), Daniel & Mary Joan Wixted in the 1960–1985 CA marriage index "
            "(1986 is after index cutoff), Walter/Cecelia Tracy NJ census without paid FamilySearch depth. "
            "Next steps: LA County Registrar-Recorder (Norwalk); WAGS Whittier History Room; FamilySearch "
            "NJ Tracy/McDonough."
        ),
        "personIds": [BRIAN, IRENE, JOHN, ANNE, EDUARDO, MARY, JACK, KATIE, JOAN, WALTER, CECELIA],
        "branch": "tracy",
        "tags": ["research", "public-records", "audit"],
        "source": "public-records",
    }

    by_id["story-anne-eduardo-davalos"] = {
        "id": "story-anne-eduardo-davalos",
        "title": "Anne & Eduardo Davalos — Rowland Heights",
        "body": (
            "Anne E (Tracy) Davalos, third of the Tracy siblings, appears in Joan Marie (Tracy) Jeisi's "
            "2014 obituary as a surviving niece alongside Mary Wixted. Public records associate Anne with "
            "Rowland Heights, California (~b. May 1960, Los Angeles County) and list Eduardo E Davalos as "
            "her spouse at 18984 Barroso St, Rowland Heights, CA 91748. Property records show Anne and "
            "Eduardo as co-owners of the Barroso Street residence since May 2004. This places the Davalos "
            "branch in the same Whittier–Rowland Heights corridor where Joan Jeisi's funeral was held "
            "(White Emerson Mortuary, Whittier; St. Elizabeth Ann Seton Church and Queen of Heaven Cemetery, "
            "Rowland Heights)."
        ),
        "personIds": [ANNE, EDUARDO, JOAN, JACK, KATIE, MARY],
        "branch": "tracy",
        "tags": ["research", "family-history", "public-records"],
        "source": "public-records",
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
        {
            "id": "res-ca-birth-index",
            "title": "California Birth Index (1905–1995) — Free Search",
            "desc": "Free statewide birth index; no Tracy+Martin sibling matches found for this family in public search.",
            "url": "https://californiabirthindex.org/",
            "category": "genealogy",
            "tags": ["Tracy", "birth", "California", "Los Angeles"],
            "verified": True,
        },
        {
            "id": "res-ca-marriage-index-fs",
            "title": "California Marriage Index 1960–1985 — FamilySearch Wiki",
            "desc": "Guide to CA marriage records; 1986 Daniel/Mary Joan marriage requires LA County Registrar (post-index).",
            "url": "https://www.familysearch.org/en/wiki/How_to_Find_California_Marriage_Records",
            "category": "genealogy",
            "tags": ["Tracy", "Wixted", "marriage", "California"],
            "verified": True,
        },
        {
            "id": "res-la-county-assessor",
            "title": "LA County Assessor — Property Records",
            "desc": "Search ownership history for Rowland Heights properties (e.g. Anne & Eduardo Davalos, 18984 Barroso St).",
            "url": "https://portal.assessor.lacounty.gov/",
            "category": "genealogy",
            "tags": ["Rowland Heights", "Davalos", "Tracy", "property"],
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
    links[ANNE] = [
        {
            "label": "Joan Jeisi obituary (lists niece Anne Davalos)",
            "url": "https://www.whiteemerson.com/obituaries/joan-marie-jeisi",
            "type": "obituary",
        },
        {
            "label": "18984 Barroso St property record (Rowland Heights)",
            "url": "https://blockshopper.com/ca/los-angeles-county/rowland-heights-cdp/property/8272029028/18984-barroso-street",
            "type": "research",
        },
        {
            "label": "Anne E Davalos — OpenDataUSA (b. May 1960, LA Co.)",
            "url": "https://opendatausa.com/anne-davalos",
            "type": "research",
        },
    ]
    links[EDUARDO] = [{
        "label": "Rowland Heights property — 18984 Barroso St",
        "url": "https://blockshopper.com/ca/los-angeles-county/rowland-heights-cdp/property/8272029028/18984-barroso-street",
        "type": "research",
    }]
    links[BRIAN] = [
        {
            "label": "Joan Jeisi obituary (lists nephew Bryan Tracy)",
            "url": "https://www.whiteemerson.com/obituaries/joan-marie-jeisi",
            "type": "obituary",
        },
        {
            "label": "4420 San Andreas Ave — Veripages directory",
            "url": "https://veripages.com/name/Brian/Tracy/CA/",
            "type": "research",
        },
        {
            "label": "Brian G Tracy — ufind.name San Andreas directory",
            "url": "https://ufind.name/Brian+Tracy",
            "type": "research",
        },
    ]
    links[JOHN] = [
        {
            "label": "John Tracy — California public records (Veripages)",
            "url": "https://veripages.com/name/John/Tracy/CA/",
            "type": "research",
        },
        {
            "label": "Katrina Irene Tracy — Spokeo relative cluster",
            "url": "https://www.spokeo.com/Katrina-Tracy",
            "type": "research",
        },
    ]
    links[IRENE] = [
        {
            "label": "Irene Leyva Tracy — OpenDataUSA (b. 4 Nov 1958)",
            "url": "https://opendatausa.com/irene-leyva",
            "type": "research",
        },
        {
            "label": "4420 San Andreas Ave — Radaris directory",
            "url": "https://radaris.com/p/Irene/Tracy/",
            "type": "research",
        },
    ]
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
    gid2 = "seed-davalos-rowland-heights"
    if gid2 not in {g["id"] for g in assets["gallery"]}:
        assets["gallery"].append({
            "id": gid2,
            "personId": ANNE,
            "title": "Anne & Eduardo Davalos — Rowland Heights Property",
            "type": "research",
            "url": "https://blockshopper.com/ca/los-angeles-county/rowland-heights-cdp/property/8272029028/18984-barroso-street",
            "caption": "18984 Barroso St — Anne E & Eduardo E Davalos, co-owners since May 2004",
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
