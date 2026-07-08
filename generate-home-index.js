#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = __dirname;
const indexPath = path.join(root, 'index.html');
const startMarker = '    <!-- BLOG_POSTS_START -->';
const endMarker = '    <!-- BLOG_POSTS_END -->';

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&middot;/g, '·')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function textFrom(html, pattern, label, file) {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(`Missing ${label} in ${file}`);
  }
  return decodeHtml(match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
}

function tagsFrom(html) {
  const match = html.match(/<div class="post-tags">([\s\S]*?)<\/div>/);
  if (!match) {
    return [];
  }
  return [...match[1].matchAll(/<span>([\s\S]*?)<\/span>/g)].map((tag) =>
    decodeHtml(tag[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim())
  );
}

function displayDate(meta) {
  const date = meta.split('·')[0].trim();
  return date.replace(/^([A-Za-z]+)\s+\d{1,2},\s+(\d{4})$/, '$1 $2');
}

function sortTime(meta) {
  const months = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };
  const date = meta.split('·')[0].trim();
  let match = date.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (match) {
    return Date.UTC(Number(match[3]), months[match[1]], Number(match[2]));
  }

  match = date.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    return Date.UTC(Number(match[2]), months[match[1]], 1);
  }

  throw new Error(`Unsupported post date format: ${date}`);
}

function postFromArticle(href) {
  const file = path.join(root, href, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const meta = textFrom(html, /<div class="post-meta">([\s\S]*?)<\/div>/, 'post date', file);

  return {
    href,
    date: displayDate(meta),
    sortTime: sortTime(meta),
    title: textFrom(html, /<h1[^>]*>([\s\S]*?)<\/h1>/, 'title', file),
    excerpt: textFrom(html, /<p class="post-subtitle">([\s\S]*?)<\/p>/, 'subtitle', file),
    tags: tagsFrom(html),
  };
}

function discoverArticleHrefs() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !['.git', '.agents', '.codex', 'assets', 'blog', 'links', 'projects', 'template'].includes(name))
    .filter((name) => fs.existsSync(path.join(root, name, 'index.html')))
    .map((name) => `${name}/`);
}

function renderPost(post) {
  const tags = post.tags.map((tag) => `        <span>${escapeHtml(tag)}</span>`).join('\n');
  const tagsBlock = tags
    ? `\n      <div class="post-tags">\n${tags}\n      </div>`
    : '';

  return `    <a class="blog-post" href="${escapeHtml(post.href)}">
      <div class="post-date">${escapeHtml(post.date)}</div>
      <h2>${escapeHtml(post.title)}</h2>
      <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>${tagsBlock}
    </a>`;
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const posts = discoverArticleHrefs()
  .map(postFromArticle)
  .sort((a, b) => b.sortTime - a.sortTime || b.href.localeCompare(a.href));

if (posts.length === 0) {
  throw new Error('No article pages found.');
}

const generated = [
  startMarker,
  '',
  posts.map(renderPost).join('\n\n'),
  '',
  endMarker,
].join('\n');

let nextIndex;
if (indexHtml.includes(startMarker) && indexHtml.includes(endMarker)) {
  nextIndex = indexHtml.replace(
    new RegExp(`${startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
    generated
  );
} else {
  nextIndex = indexHtml.replace(
    /(\s*<main class="blog-list">\n)[\s\S]*?(\n\s*<\/main>)/,
    `$1\n${generated}\n$2`
  );
}

fs.writeFileSync(indexPath, nextIndex);
