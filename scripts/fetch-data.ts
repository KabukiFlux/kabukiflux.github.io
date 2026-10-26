// Fetches the latest content from YouTube and GitHub and writes public/data/feed.json.
// Runs in GitHub Actions on a schedule; GITHUB_TOKEN comes from the environment.
// Each source is independent: if one fails, its last published value is kept.

import { appendFile, mkdir, writeFile } from 'node:fs/promises'
import { isDeepStrictEqual } from 'node:util'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'
import links from '../src/content/links.json' with { type: 'json' }
import type { Feed, Repo, VideoSummary, YouTubeVideo } from '../shared/feed.ts'

const OUT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../public/data/feed.json')
const OG_DIR = resolve(dirname(OUT_FILE), 'og')
const SITE_URL = 'https://kabukiflux.com'
const PREVIOUS_FEED_URL = process.env.PREVIOUS_FEED_URL ?? 'https://kabukiflux.com/data/feed.json'
const USER_AGENT = 'kabukiflux.com feed builder'

async function getJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, headers: { 'User-Agent': USER_AGENT, ...init.headers } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return (await res.json()) as T
}

// ---------- YouTube (public RSS feed, no key needed) ----------

interface YouTubeEntry {
  'yt:videoId': string
  title: unknown
  published: string
  'media:group'?: {
    'media:description'?: unknown
    'media:community'?: { 'media:statistics'?: { views?: string } }
  }
}

async function fetchYouTube(channelId: string): Promise<{ latest: YouTubeVideo | null; videos: VideoSummary[] }> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseTagValue: false }).parse(await res.text())
  const raw = xml.feed?.entry
  const entries: YouTubeEntry[] = Array.isArray(raw) ? raw : raw ? [raw] : []
  const videos = entries.map((entry) => {
    const id = entry['yt:videoId']
    const views = Number(entry['media:group']?.['media:community']?.['media:statistics']?.views)
    return {
      id,
      title: String(entry.title),
      url: `https://www.youtube.com/watch?v=${id}`,
      published: entry.published,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      views: Number.isFinite(views) ? views : null,
    }
  })
  const first = entries[0]
  const latest = first
    ? { ...videos[0], description: String(first['media:group']?.['media:description'] ?? '') }
    : null
  return { latest, videos }
}

// ---------- GitHub (REST API) ----------

interface GitHubApiRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  topics?: string[]
  pushed_at: string
  fork: boolean
  archived: boolean
  private: boolean
}

async function fetchRepos(user: string, exclude: string[]): Promise<Repo[]> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const repos = await getJson<GitHubApiRepo[]>(
    `https://api.github.com/users/${user}/repos?type=owner&sort=pushed&per_page=100`,
    { headers },
  )
  const excluded = new Set(exclude.map((name) => name.toLowerCase()))
  return repos
    .filter((r) => !r.fork && !r.archived && !r.private && !excluded.has(r.name.toLowerCase()))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      stars: r.stargazers_count,
      topics: r.topics ?? [],
      pushedAt: r.pushed_at,
    }))
}

// ---------- Repo social previews ----------

/**
 * GitHub's generated preview is rate-limited for visitors' browsers, so mirror it into the site.
 * If the download fails, reuse the copy from the live site so the card keeps its image.
 */
async function mirrorRepoImage(user: string, name: string): Promise<string | null> {
  const rel = `data/og/${name}.png`
  const sources = [`https://opengraph.githubassets.com/${Date.now()}/${user}/${name}`, `${SITE_URL}/${rel}`]
  for (const url of sources) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
      if (!res.ok || !res.headers.get('content-type')?.startsWith('image/')) continue
      await mkdir(OG_DIR, { recursive: true })
      await writeFile(resolve(OG_DIR, `${name}.png`), Buffer.from(await res.arrayBuffer()))
      return rel
    } catch {
      // try the next source
    }
  }
  return null
}

// ---------- X timeline embed health ----------

/** The timeline iframe can't be inspected from the browser (no CORS), so check here whether X serves it right now. */
async function checkXEmbed(handle: string): Promise<boolean> {
  const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${handle}?dnt=true`
  for (let tryNo = 0; tryNo < 3; tryNo++) {
    if (tryNo > 0) await new Promise((r) => setTimeout(r, 3000))
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      const body = await res.text()
      if (res.ok && body.length > 2000 && !/rate limit exceeded/i.test(body)) return true
    } catch {
      // network error: try again
    }
  }
  return false
}

// ---------- main ----------

async function loadPreviousFeed(): Promise<Partial<Feed>> {
  try {
    return await getJson<Partial<Feed>>(PREVIOUS_FEED_URL)
  } catch (err) {
    console.warn(`No previous feed available (${(err as Error).message})`)
    return {}
  }
}

async function main() {
  const previous = await loadPreviousFeed()

  async function attempt<T>(label: string, fn: () => Promise<T>, previousValue: T): Promise<T> {
    try {
      const value = await fn()
      console.log(`✔ ${label}`)
      return value
    } catch (err) {
      console.warn(`✘ ${label}: ${(err as Error).message} — keeping previous value`)
      return previousValue
    }
  }

  const [spanish, english, repos, xEmbedOk] = await Promise.all([
    attempt('youtube', () => fetchYouTube(links.youtube.spanish.channelId), { latest: previous.youtube ?? null, videos: previous.youtubeVideos ?? [] }),
    attempt('youtubeEnglish', () => fetchYouTube(links.youtube.english.channelId), { latest: previous.youtubeEnglish ?? null, videos: previous.youtubeEnglishVideos ?? [] }),
    attempt('repos', async () => {
      const list = await fetchRepos(links.github.user, links.github.excludeRepos)
      return Promise.all(list.map(async (repo) => ({ ...repo, image: await mirrorRepoImage(links.github.user, repo.name) })))
    }, previous.repos ?? []),
    checkXEmbed(links.x.handle),
  ])

  const feed: Feed = {
    generatedAt: new Date().toISOString(),
    youtube: spanish.latest,
    youtubeEnglish: english.latest,
    youtubeVideos: spanish.videos,
    youtubeEnglishVideos: english.videos,
    repos,
    xEmbedOk,
  }
  await mkdir(dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, JSON.stringify(feed, null, 2) + '\n')
  console.log(`Wrote ${OUT_FILE}`)

  // Lets the scheduled workflow skip the deploy when nothing changed since the live version.
  const { generatedAt: _prevAt, ...prevContent } = previous
  const { generatedAt: _newAt, ...newContent } = feed
  const changed = !isDeepStrictEqual(JSON.parse(JSON.stringify(prevContent)), JSON.parse(JSON.stringify(newContent)))
  console.log(changed ? 'Content changed since the live version' : 'Content unchanged since the live version')
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
