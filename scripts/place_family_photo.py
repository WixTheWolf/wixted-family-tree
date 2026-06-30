#!/usr/bin/env python3
"""Copy a family photo into public/assets for static gallery serving."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS_ROOT = ROOT / "public" / "assets" / "people"


def main() -> None:
    if len(sys.argv) < 4:
        print(
            "Usage: python3 scripts/place_family_photo.py SOURCE.jpg PERSON_ID FILENAME.jpg"
        )
        print(
            "Example: python3 scripts/place_family_photo.py ~/Downloads/wedding.jpg "
            "wixted-104-31 daniel-kevin-wedding.jpg"
        )
        sys.exit(1)

    source = Path(sys.argv[1]).expanduser().resolve()
    person_id = sys.argv[2]
    filename = sys.argv[3]

    if not source.is_file():
        print(f"Source not found: {source}")
        sys.exit(1)

    dest_dir = ASSETS_ROOT / person_id
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / filename

    shutil.copy2(source, dest)
    print(f"Saved {dest} ({dest.stat().st_size:,} bytes)")
    print(f"Gallery URL: /assets/people/{person_id}/{filename}")


if __name__ == "__main__":
    main()
