#!/usr/bin/env python3
"""Merge a contribution-manifest.json export into src/data/assets.json."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS_PATH = ROOT / "src" / "data" / "assets.json"


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/ingest_contribution.py contribution-manifest.json")
        sys.exit(1)

    manifest_path = Path(sys.argv[1])
    if not manifest_path.exists():
        print(f"File not found: {manifest_path}")
        sys.exit(1)

    incoming = json.loads(manifest_path.read_text())
    new_entries = incoming.get("gallery", [])
    if not new_entries:
        print("No gallery entries in manifest.")
        sys.exit(1)

    assets = json.loads(ASSETS_PATH.read_text())
    gallery = assets.setdefault("gallery", [])
    existing_ids = {e.get("id") for e in gallery}
    existing_urls = {e.get("url") for e in gallery}

    added = 0
    for entry in new_entries:
        if entry.get("id") in existing_ids or entry.get("url") in existing_urls:
            continue
        gallery.append(entry)
        added += 1

    ASSETS_PATH.write_text(json.dumps(assets, indent=2) + "\n")
    print(f"Added {added} entries to {ASSETS_PATH} ({len(gallery)} total)")


if __name__ == "__main__":
    main()
