# Wixted Family Tree

An interactive genealogy explorer for the Wixted family, built from research data (v9.5, May 2022).

## Features

- **Interactive tree view** for the main Wixted lineage with pan, zoom, and click-to-explore
- **11 family branches** — Wixted, Evelyn (Swedish), Gilbert, Breitenbach, Clark, Collins, Amor, Nordquist, From Ireland, Mayflower, Danforth
- **Spotlight search** across all 694+ family members
- **Person detail panels** with notes, cemetery records, and relatives
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

Family data is extracted from the source Excel workbook:

```bash
python scripts/extract_data.py
```

## Deploy

Deployed on [Vercel](https://vercel.com).