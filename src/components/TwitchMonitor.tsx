import { useEffect, useState } from 'react'
import links from '../content/links.json'
import { useInView } from '../hooks/useInView.ts'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon } from './BrandIcon.tsx'

type LiveState = 'checking' | 'live' | 'offline'

/**
 * Twitch's preview image answers 200 while the channel is live and redirects to a "404_preview"
 * placeholder otherwise. It's served with CORS, so a ~40 KB request replaces the ~1 MB player.
 */
async function isLive(): Promise<boolean> {
  const res = await fetch(links.twitch.preview, { cache: 'no-cache' })
  return res.ok && !res.redirected && !res.url.includes('404_preview')
}

/**
 * Twitch channel player (live stream, or Twitch's offline screen). The lamp shows the on-air state.
 * The player itself only loads on click: it costs seconds of main-thread time and sets third-party cookies.
 * Past broadcasts are not shown on purpose: they are subscriber-only.
 */
export function TwitchMonitor() {
  const { t } = useI18n()
  const [ref, inView] = useInView<HTMLElement>()
  const [live, setLive] = useState<LiveState>('checking')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    isLive()
      .then((on) => !cancelled && setLive(on ? 'live' : 'offline'))
      .catch(() => !cancelled && setLive('offline'))
    return () => {
      cancelled = true
    }
  }, [inView])

  const on = live === 'live'
  const playerSrc = () =>
    `${links.twitch.player}?${new URLSearchParams({ channel: links.twitch.login, parent: window.location.hostname, autoplay: 'true', muted: 'false' })}`

  return (
    <section ref={ref} className="flex h-full flex-col p-2 sm:p-4">
      <header className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <h2 className="font-display text-lg tracking-wide uppercase">{on ? t('twitch.live') : t('twitch.channel')}</h2>
        <span className="flex items-center gap-2 text-sm font-semibold text-muted">
          <span aria-hidden="true" className={`led ${on ? 'led-blink text-red' : live === 'checking' ? 'text-gold' : 'text-slate/50'}`} />
          {live === 'checking' ? t('twitch.checking') : on ? t('twitch.onAir') : t('twitch.offAir')}
        </span>
      </header>

      <div className={`crt aspect-video ${on ? 'crt-live' : ''}`}>
        {playing ? (
          <iframe src={playerSrc()} title={t('twitch.channel')} allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 size-full" />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold"
          >
            {on && <img src={links.twitch.preview} alt="" width={640} height={360} decoding="async" className="absolute inset-0 size-full object-cover" />}
            {!on && <BrandIcon brand="twitch" className="absolute size-24 text-white/10" />}
            <span className="btn relative bg-[#7b4fe0] text-white group-hover:bg-[#6a3fd0]">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              {on ? t('twitch.watch') : t('twitch.open')}
            </span>
          </button>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        <p className="text-sm text-muted">twitch.tv/{links.twitch.login}</p>
        <a className="btn bg-[#7b4fe0] text-white hover:bg-[#6a3fd0]" href={links.twitch.url} target="_blank" rel="noopener noreferrer">
          <BrandIcon brand="twitch" className="size-4" /> {t('twitch.follow')}
        </a>
      </div>
    </section>
  )
}
