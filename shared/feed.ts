// Shape of public/data/feed.json, shared by scripts/fetch-data.ts and the React app.

export interface YouTubeVideo {
  id: string
  title: string
  url: string
  published: string
  description: string
  thumbnail: string
}

/** Light version of a video for the sliders (no description). */
export interface VideoSummary {
  id: string
  title: string
  url: string
  published: string
  thumbnail: string
  views: number | null
}

export interface Repo {
  name: string
  description: string | null
  url: string
  homepage: string | null
  language: string | null
  stars: number
  topics: string[]
  pushedAt: string
  /** Site-relative path of the repo's social preview, mirrored at build time; null when it couldn't be fetched. */
  image?: string | null
}

export interface Feed {
  generatedAt: string
  youtube: YouTubeVideo | null
  youtubeEnglish: YouTubeVideo | null
  /** Recent videos per channel; absent in feeds published before the sliders existed. */
  youtubeVideos?: VideoSummary[]
  youtubeEnglishVideos?: VideoSummary[]
  repos: Repo[]
  /** False when X's timeline embed was rate-limited or unavailable at build time; the page then shows only the follow button. */
  xEmbedOk?: boolean
}
