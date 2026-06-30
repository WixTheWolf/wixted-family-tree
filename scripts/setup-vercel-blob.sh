#!/usr/bin/env bash
# Setup guide for Vercel Blob + family upload auth on wixted-family-tree
set -euo pipefail

echo "=== Wixted Family Tree — Cloud Upload Setup ==="
echo ""
echo "1. Open https://vercel.com/dashboard → your wixted-family-tree project"
echo "2. Storage tab → Create Database → Blob"
echo "3. Link the Blob store to this project (BLOB_READ_WRITE_TOKEN is auto-added)"
echo ""
echo "4. Settings → Environment Variables → add:"
echo "   FAMILY_UPLOAD_KEY = <choose a strong family password>"
echo "   (Apply to Production, Preview, Development)"
echo ""
echo "5. Redeploy: git push or Vercel → Deployments → Redeploy"
echo ""
echo "6. On the live site → Contribute tab → enter FAMILY_UPLOAD_KEY to unlock"
echo ""
echo "Local dev with Vercel functions:"
echo "  vercel env pull .env.local"
echo "  vercel dev"
echo ""
