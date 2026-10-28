import type { Feed, Repo, VideoSummary } from '../shared/feed.ts'
import links from './content/links.json'
import es from './i18n/es.json'

const SITE = links.site.url
const ORG_ID = `${SITE}/#organization`

function video(v: VideoSummary, description: string) {
  return {
    '@type': 'VideoObject',
    '@id': `${v.url}#video`,
    name: v.title,
    description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`],
    uploadDate: v.published,
    url: v.url,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    inLanguage: 'es',
    publisher: { '@id': ORG_ID },
    ...(v.views !== null && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'WatchAction' },
        userInteractionCount: v.views,
      },
    }),
  }
}

function repo(r: Repo) {
  return {
    '@type': 'SoftwareSourceCode',
    name: r.name,
    ...(r.description && { description: r.description }),
    codeRepository: r.url,
    url: r.homepage || r.url,
    ...(r.language && { programmingLanguage: r.language }),
    ...(r.topics.length > 0 && { keywords: r.topics.join(', ') }),
    dateModified: r.pushedAt,
    ...(r.image && { image: `${SITE}/${r.image}` }),
    author: { '@id': ORG_ID },
  }
}

function itemList(name: string, items: object[]) {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })),
  }
}

/** schema.org graph for the page: the channel, the site, its videos and its repos. Built from the same feed the page shows. */
export function jsonLd(feed: Feed | null) {
  const latest = feed?.youtube
  const spanish = (feed?.youtubeVideos ?? []).filter((v) => v.id !== latest?.id)
  const english = feed?.youtubeEnglishVideos ?? []

  const graph: object[] = [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: links.site.name,
      url: `${SITE}/`,
      logo: { '@type': 'ImageObject', url: `${SITE}/favicons/android-chrome-512x512.png`, width: 512, height: 512 },
      image: `${SITE}/og-banner.jpg`,
      description: es['hero.about'],
      knowsAbout: ['Arcade', 'FPGA', 'MiSTer', 'Soldering', 'Retro computing', 'PCB design', 'CRT monitors'],
      sameAs: [
        links.youtube.spanish.url,
        links.youtube.english.url,
        links.twitch.url,
        links.github.url,
        links.x.url,
        links.instagram.url,
        links.kofi.url,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: links.site.name,
      description: es.tagline,
      inLanguage: ['es', 'en'],
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: `${links.site.name} · ${es.tagline}`,
      description: es['hero.about'],
      inLanguage: 'es',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': ORG_ID },
      primaryImageOfPage: `${SITE}/og-banner.jpg`,
      ...(feed && { dateModified: feed.generatedAt }),
      ...(latest && { mainEntity: { '@id': `${latest.url}#video` } }),
    },
  ]

  if (latest) graph.push(video(latest, latest.description || latest.title))
  if (spanish.length) graph.push(itemList(es['videos.spanish'], spanish.map((v) => video(v, v.title))))
  if (english.length) graph.push(itemList(es['videos.english'], english.map((v) => ({ ...video(v, v.title), inLanguage: 'en' }))))
  if (feed?.repos.length) graph.push(itemList(es['projects.title'], feed.repos.map(repo)))

  return { '@context': 'https://schema.org', '@graph': graph }
}
