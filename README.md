# Wixted Family Tree

An interactive genealogy explorer for the Wixted family, built from research data (v9.5, May 2022).

## Features

- **Interactive tree view** for the main Wixted lineage with pan, zoom, and click-to-explore
- **11 family branches** — Wixted, Evelyn (Swedish), Gilbert, Breitenbach, Clark, Collins, Amor, Nordquist, From Ireland, Mayflower, Danforth
- **Spotlight search** across people, stories, cemeteries, and locations
- **A–Z Directory** with branch filters and research-note filtering
- **Stories browser** for family narratives pulled from the Excel workbook
- **Cemetery explorer** with headstone records and burial locations
- **Person detail panels** with categorized notes, stories, cemetery records, and relatives
- **Deep links** — share any person via `/person/:id`
- **Heritage charts** for Katie and Kevin

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Data

Family data is extracted from the source Excel workbook (`sources/Wixted Family 05-29-2022.xls`):

```bash
pip install -r scripts/requirements.txt
python scripts/extract_data.py   # Excel → family.json
python scripts/enrich_data.py    # Clean, categorize, build stories
```

## Site Sections

- **Family Tree** — Interactive pan/zoom tree (Wixted) or generation grid (all branches)
- **Directory** — A–Z browse with branch and research-note filters
- **Stories** — Family narratives and history-doc research from the workbook
- **Cemetery** — Headstone records and burial location cross-references
- **Search** — Unified search across people, stories, cemeteries, and locations

## Deploy

Deployed on [Vercel](https://vercel.com).