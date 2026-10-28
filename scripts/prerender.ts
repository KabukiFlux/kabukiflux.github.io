// Runs after `vite build` and the SSR build of src/entry-server.tsx: renders the page (Spanish) with the
// current feed into dist/index.html, embeds the feed and the JSON-LD, and writes the sitemap.
// Crawlers get the full content and visitors see it before any JavaScript runs.

import { readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import links from '../src/content/links.json' with { type: 'json' }
import type { Feed } from '../shared/feed.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')
const SSR_DIR = resolve(ROOT, 'dist-ssr')

interface ServerEntry {
  render(feed: Feed | null): string
  jsonLd(feed: Feed | null): object
}

/** JSON that is safe inside a <script> element. */
function scriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

async function loadFeed(): Promise<Feed | null> {
  try {
    return JSON.parse(await readFile(resolve(DIST, 'data/feed.json'), 'utf8')) as Feed
  } catch {
    console.warn('No dist/data/feed.json: prerendering without data (run npm run fetch-data first)')
    return null
  }
}

const { render, jsonLd } = (await import(pathToFileURL(resolve(SSR_DIR, 'entry-server.js')).href)) as ServerEntry
const feed = await loadFeed()

const template = await readFile(resolve(DIST, 'index.html'), 'utf8')
const head = [
  `<script type="application/ld+json">${scriptJson(jsonLd(feed))}</script>`,
  feed ? `<script type="application/json" id="feed-data">${scriptJson(feed)}</script>` : '',
].join('\n    ')
const html = template.replace('<!--app-head-->', head).replace('<!--app-html-->', render(feed))
await writeFile(resolve(DIST, 'index.html'), html)

const lastmod = feed?.generatedAt ?? new Date().toISOString()
await writeFile(
  resolve(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${links.site.url}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
  </url>
</urlset>
`,
)

await rm(SSR_DIR, { recursive: true, force: true })
console.log(`Prerendered dist/index.html (${(html.length / 1024).toFixed(0)} kB) and dist/sitemap.xml`)
