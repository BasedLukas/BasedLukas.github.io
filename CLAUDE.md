# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Static personal website for Lukas Bogacz at `https://loreley.one`. Zero build tools, zero frameworks, no package manager. Plain HTML, CSS, and vanilla JavaScript.

## Development

Serve locally with any static server from the project root:
```bash
cd "/Users/lukas/website redesign"
python3 -m http.server 8765
```
Then visit `http://localhost:8765/`. There is no build step.

## Architecture

### CSS (three files, never mixed across page types)

| File | Loads On | Purpose |
|------|----------|---------|
| `home.css` | `index.html` only | Self-contained homepage styles (hero, carousel, modals, etc.) |
| `base.css` | All inner pages | Reset, CSS variables, nav, page-header, footer, responsive |
| `article.css` | Blog posts only | Article typography, code blocks, syntax highlighting, figures, KaTeX |

`home.css` and `base.css` both define the core CSS variables independently (they never load together). `article.css` layers on top of `base.css`.

### components.js

An IIFE loaded on every page via `<script defer>`. It:
1. Detects homepage vs inner page from its own `src` path
2. Injects nav HTML into the empty `<nav></nav>` placeholder (different layout for homepage vs inner pages)
3. Injects footer HTML into the empty `<footer></footer>` placeholder
4. Injects Umami analytics script into `<head>`

Every page has empty `<nav></nav>` and `<footer></footer>` tags — content is always runtime-injected. To change nav links or footer content, edit `components.js` only.

**Important:** OG meta tags, favicon, and canonical URLs are in each HTML file's `<head>` (not in components.js) because social media crawlers don't execute JavaScript.

### Blog post structure

Posts live in date-prefixed directories: `YYYY-MM-slug/index.html` with images alongside. Each post loads `../base.css` + `../article.css` + `../components.js`.

Standard article HTML structure:
- `<header class="article-header">` → `.article-header-inner` → `.post-meta`, `<h1>`, `.post-subtitle`, `.post-tags`
- `<main class="article-body">` → content + `<a class="back-link">`

Code syntax highlighting is manual using span classes: `.kw`, `.fn`, `.st`, `.cm`, `.nu`, `.op`, `.bi`. Math uses KaTeX from CDN with `$$...$$` (display) and `$...$` (inline).

### Homepage modals

Project cards on the homepage have `data-modal="id"` attributes. Clicking opens a `.modal-overlay` with matching `id="modal-{id}"`. Modal/lightbox logic is in an inline `<script>` at the bottom of `index.html`.

## Adding a New Blog Post

1. Create `YYYY-MM-slug/` directory
2. Copy `template/index.html`, edit content and all meta tags (title, description, OG, canonical URL, twitter)
3. Add images to the same directory (prefer `.webp`)
4. Add a new `<a class="blog-post">` entry at the top of `blog/index.html`
5. Commit — the pre-commit hook auto-regenerates `sitemap.xml`

## Sitemap

`generate-sitemap.sh` scans for `index.html` files, skips `template/`, and writes `sitemap.xml`. It runs automatically via `.git/hooks/pre-commit` on every commit.

## Key Conventions

- Single responsive breakpoint at `768px`
- Images in blog posts use `width` and `height` attributes to prevent layout shift
- Fonts: Playfair Display (serif headings), Inter (sans body), JetBrains Mono (code)
- Color palette: cream (`#f8f5f0`), charcoal (`#1a1a1a`), sepia (`#8b7355`) — defined as CSS custom properties
- All shared assets (images, logos, screenshots, favicon) live in `assets/`
- Blog post images live in their own post directory, not in `assets/`
