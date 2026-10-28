// Shape of public/data/feed.json, shared by scripts/fetch-data.ts and the React app.

/** Light version of a video for the sliders (no description). */
export interface VideoSummary {
  id: string
  title: string
  url: string
  published: string
  thumbnail: string
  views: number | null
}

export interface YouTubeVideo extends VideoSummary {
  description: string
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
  /** Site-relative path of the repo's social preview (a small WebP named after its content), mirrored at build time; null when it couldn't be fetched. */
  image?: string | null
}

/** A Bluesky post by the channel itself (no reposts or replies). */
export interface BlueskyPost {
  url: string
  /** The text split at its links, mentions and hashtags, which carry their target. */
  text: { text: string; href?: string }[]
  createdAt: string
  /** First attached image, or the link card's thumbnail. */
  image: { src: string; alt: string } | null
  /** Link card attached to the post. */
  link: { url: string; title: string } | null
  likes: number
  reposts: number
  replies: number
}

export interface Feed {
  generatedAt: string
  youtube: YouTubeVideo | null
  youtubeEnglish: YouTubeVideo | null
  /** Recent videos per channel; absent in feeds published before the sliders existed. */
  youtubeVideos?: VideoSummary[]
  youtubeEnglishVideos?: VideoSummary[]
  repos: Repo[]
  /** Absent in feeds published before the Bluesky column existed. */
  bluesky?: BlueskyPost[]
}
