import { BlueskyFeed } from './components/BlueskyFeed.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { ProjectGrid } from './components/ProjectGrid.tsx'
import { Section } from './components/Section.tsx'
import { SocialBar, SocialFrame } from './components/SocialFrame.tsx'
import { VideoPlayer } from './components/VideoPlayer.tsx'
import { VideoSlider } from './components/VideoSlider.tsx'
import { VideoCard } from './components/VideoCard.tsx'
import links from './content/links.json'
import { useFeed } from './hooks/useFeed.ts'
import { useI18n } from './i18n/I18nProvider.tsx'
import type { VideoSummary } from '../shared/feed.ts'

const EMBED_HEIGHT = 680

// fetch-data already drops these; this also covers an older feed kept when YouTube's RSS failed
const excluded = new Set(links.youtube.excludeVideos)
const visible = (videos: VideoSummary[] | undefined) => (videos ?? []).filter((v) => !excluded.has(v.id))

export default function App() {
  const state = useFeed()
  const { t } = useI18n()
  const feed = state.status === 'ready' ? state.feed : null
  // the newest Spanish video already has the Latest section
  const spanish = visible(feed?.youtubeVideos).filter((v) => v.id !== feed?.youtube?.id)
  const english = visible(feed?.youtubeEnglishVideos)

  return (
    <>
      <Header />
      <main>
        <Hero />

        {state.status === 'error' && (
          <p role="alert" className="mx-auto mt-8 max-w-6xl bg-red/10 p-4 text-red-dark">
            {t('feed.error')}
          </p>
        )}

        <Section id="latest" tone="mist" accent="red" eyebrow={t('latest.eyebrow')} title={t('latest.title')} subtitle={t('latest.subtitle')}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {feed?.youtube ? <VideoCard video={feed.youtube} /> : <div className="hidden lg:block" />}
            <div className="lg:[&>div]:aspect-auto lg:[&>div]:h-full lg:[&>div]:min-h-72">
              {state.status === 'loading' ? <div className="aspect-video animate-pulse bg-line" /> : <VideoPlayer video={feed?.youtube ?? null} />}
            </div>
          </div>
        </Section>

        {spanish.length || english.length ? (
          <Section id="videos" tone="dark" accent="gold" eyebrow={t('videos.eyebrow')} title={t('videos.title')} subtitle={t('videos.subtitle')}>
            <VideoSlider title={t('videos.spanish')} channelUrl={links.youtube.spanish.url} videos={spanish} rows={spanish.length > 4 ? 2 : 1} />
            <VideoSlider title={t('videos.english')} channelUrl={links.youtube.english.url} videos={english} />
          </Section>
        ) : null}

        {feed && feed.repos.length > 0 && <ProjectGrid repos={feed.repos} />}

        <Section id="community" tone="mist" accent="violet" eyebrow={t('community.eyebrow')} title={t('community.title')} subtitle={t('community.subtitle')}>
          <div className="grid gap-8 lg:grid-cols-2">
            <SocialFrame
              brand="instagram"
              title={t('instagram.title')}
              src={`https://www.instagram.com/${links.instagram.handle}/embed`}
              profileUrl={links.instagram.url}
              followLabel={t('instagram.follow')}
              height={EMBED_HEIGHT}
            />
            <SocialFrame brand="bluesky" title={t('bluesky.title')} profileUrl={links.bluesky.url} followLabel={t('bluesky.follow')} height={EMBED_HEIGHT}>
              {() => (state.status === 'loading' ? <div className="h-full animate-pulse bg-line" /> : <BlueskyFeed posts={feed?.bluesky ?? []} />)}
            </SocialFrame>
          </div>
          {/* X's timeline embed is heavy and often refuses to render, so X gets just a follow bar */}
          <SocialBar brand="x" title={t('x.title')} subtitle={t('x.handle')} profileUrl={links.x.url} followLabel={t('x.follow')} className="mt-8 bg-paper" />
        </Section>
      </main>
      <Footer generatedAt={feed?.generatedAt} />
    </>
  )
}
