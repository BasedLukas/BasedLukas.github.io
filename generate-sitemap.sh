#!/bin/bash
# Generates sitemap.xml by scanning for index.html files.
# Run manually or automatically via git pre-commit hook.

SITE="https://loreley.one"
DIR="$(cd "$(dirname "$0")" && pwd)"
TODAY=$(date +%Y-%m-%d)
OUT="$DIR/sitemap.xml"

cat > "$OUT" <<'HEADER'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
HEADER

# Homepage
cat >> "$OUT" <<EOF
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>1.0</priority>
  </url>
EOF

# Find all index.html files in subdirectories, skip template/
find "$DIR" -mindepth 2 -name "index.html" -not -path "*/template/*" -not -path "*/.git/*" | sort | while read -r file; do
  # Get path relative to site root
  rel="${file#$DIR/}"
  # Directory path (e.g. blog/index.html -> blog/)
  slug="${rel%index.html}"

  # Determine priority: section pages higher than posts
  case "$slug" in
    blog/|links/) priority="0.8" ;;
    *)            priority="0.6" ;;
  esac

  cat >> "$OUT" <<EOF
  <url>
    <loc>${SITE}/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${priority}</priority>
  </url>
EOF
done

echo "</urlset>" >> "$OUT"
