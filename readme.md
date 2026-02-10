# Lukas's Writings — loreley.one

Personal blog built with [Hexo](https://hexo.io/), deployed to GitHub Pages.

## Local Development

```bash
npm install
hexo clean
hexo serve        # http://localhost:4000
hexo generate     # Build to /public
```

## Creating Posts

```bash
hexo new post "My Post Title"
```

This creates `source/_posts/my-post-title.md` with front-matter:

```yaml
---
title: My Post Title
date: 2024-01-15 12:00:00
tags: []
subtitle: ""
description: ""
author: Lukas
---
```

**Front-matter fields:**
- `title` — Post title
- `date` — Publication date
- `tags` — Array of tags, e.g. `["python", "statistics"]`
- `subtitle` — Shown below the title on the post page and in the homepage list
- `description` — Used for SEO meta description. Falls back to first 150 chars of content.
- `author` — Author name

## Creating Pages

```bash
hexo new page "about"
```

Creates `source/about/index.md`. Add the page to the nav menu in `themes/clean-blog/_config.yml`.

## Code Blocks

Use fenced markdown with a language annotation. Never use GitHub gist embeds.

````markdown
```python
def hello():
    print("Hello, world!")
```
````

Code blocks automatically get a language label and copy button via `main.js`.

## Math

Uses `hexo-math` plugin with KaTeX (build-time rendering).

**Inline math:**
```
{% katex %}
E = mc^2
{% endkatex %}
```

**Display/block math:**
```
{% katex '{ "displayMode": true }' %}
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
{% endkatex %}
```

## Images

Place images in the post asset folder (created automatically with `post_asset_folder: true`).

```markdown
![Description of image](my-image.png)
```

## Callout Boxes

```html
<div class="callout callout-note">
    <div class="callout-title">Note</div>
    <p>This is a note callout.</p>
</div>

<div class="callout callout-insight">
    <div class="callout-title">Insight</div>
    <p>This is an insight callout.</p>
</div>

<div class="callout callout-warning">
    <div class="callout-title">Warning</div>
    <p>This is a warning callout.</p>
</div>
```

## Collapsible Sections

```html
<details>
    <summary>Click to expand</summary>
    <p>Hidden content here.</p>
</details>
```

## Deployment

```bash
hexo deploy
```

Pushes the generated site to `gh-pages` branch of `BasedLukas.github.io`.
