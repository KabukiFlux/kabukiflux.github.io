import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { ProjectGrid } from './components/ProjectGrid.tsx'
import { Section } from './components/Section.tsx'
import { SocialFrame } from './components/SocialFrame.tsx'
import { VideoPlayer } from './components/VideoPlayer.tsx'
import { VideoSlider } from './components/VideoSlider.tsx'
import { VideoCard } from './components/VideoCard.tsx'
import links from './content/links.json'
import { useFeed } from './hooks/useFeed.ts'
import { useI18n } from './i18n/I18nProvider.tsx'

export default function App() {
  const state = useFeed()
  const { t, lang } = useI18n()
  const feed = state.status === 'ready' ? state.feed : null

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

        <Section id="latest" tone="mist" eyebrow={t('latest.eyebrow')} title={t('latest.title')} subtitle={t('latest.subtitle')}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {feed?.youtube ? <VideoCard video={feed.youtube} /> : <div className="hidden lg:block" />}
            <div className="lg:[&>div]:aspect-auto lg:[&>div]:h-full lg:[&>div]:min-h-72">
              {state.status === 'loading' ? <div className="aspect-video animate-pulse bg-line" /> : <VideoPlayer video={feed?.youtube ?? null} />}
            </div>
          </div>
        </Section>

        {feed && (feed.youtubeVideos?.length || feed.youtubeEnglishVideos?.length) ? (
          <Section id="videos" tone="dark" eyebrow={t('videos.eyebrow')} title={t('videos.title')} subtitle={t('videos.subtitle')}>
            {/* the newest Spanish video already has the hero and the Latest section */}
            <VideoSlider title={t('videos.spanish')} channelUrl={links.youtube.spanish.url} videos={(feed.youtubeVideos ?? []).slice(1)} />
            <VideoSlider title={t('videos.english')} channelUrl={links.youtube.english.url} videos={feed.youtubeEnglishVideos ?? []} />
          </Section>
        ) : null}

        {feed && feed.repos.length > 0 && (
          <ProjectGrid repos={feed.repos} />
        )}

        <Section id="community" tone="mist" eyebrow={t('community.eyebrow')} title={t('community.title')} subtitle={t('community.subtitle')}>
          <div className="grid gap-8">
            <SocialFrame
              brand="instagram"
              title={t('instagram.title')}
              src={`https://www.instagram.com/${links.instagram.handle}/embed`}
              profileUrl={links.instagram.url}
              followLabel={t('instagram.follow')}
              height={680}
            />
            <SocialFrame
              brand="x"
              title={t('x.title')}
              src={`https://syndication.twitter.com/srv/timeline-profile/screen-name/${links.x.handle}?dnt=true&lang=${lang}&theme=light&showReplies=false`}
              profileUrl={links.x.url}
              followLabel={t('x.follow')}
              height={680}
              embed={feed ? feed.xEmbedOk !== false : state.status === 'error'}
            />
          </div>
        </Section>
      </main>
      <Footer generatedAt={feed?.generatedAt} />
    </>
  )
}
