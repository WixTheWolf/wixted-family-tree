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

The `scripts/*.py` data pipeline (`npm run data:enrich`, `data:update`) regenerates JSON from an Excel workbook that is NOT committed (`sources/` only has a README). Requires `pip install -r scripts/requirements.txt`. Not required for normal development since the generated JSON is already committed.
