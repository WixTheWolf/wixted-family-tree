# AGENTS.md

## Cursor Cloud specific instructions

This is a Vite + React + TypeScript single-page genealogy app ("Wixted Family Tree"). Family data is committed as static JSON in `src/data/` (e.g. `family.json`), so the dev server is fully functional with no external services.

### Services

- **Frontend (the product):** `npm run dev` (Vite, serves on `http://localhost:5173`). This is the only service required to develop and test the app end to end.
- **Vercel serverless API (`api/*.ts`, optional):** photo gallery/upload endpoints (`/api/gallery`, `/api/upload`, `/api/auth-check`). These run on Vercel (or `vercel dev`) and are NOT served by `npm run dev`. The UI degrades gracefully when they are absent: `BLOB_READ_WRITE_TOKEN` controls cloud-gallery availability and `FAMILY_UPLOAD_KEY` gates uploads (see `.env.example`). Cloud photo features are not needed for core development.

### Commands (defined in `package.json`)

- Run: `npm run dev`
- Build + typecheck: `npm run build` (`tsc && vite build`)
- Preview production build: `npm run preview`
- There is no lint config and no automated test suite in this repo. Use `npm run build` for typecheck-level verification.

### Data regeneration (rarely needed)

- Data regeneration (rarely needed): `pip install -r scripts/requirements.txt` then `python3 scripts/extract_data.py` and `python3 scripts/enrich_data.py`. After extraction, **always run** `python3 scripts/update_matthew_focus.py` — it applies curated Wixted parent links, reclassifies mis-parsed locations, and refreshes living-person ages. The raw Excel `parentId` links are approximate and must not be used without this step.
