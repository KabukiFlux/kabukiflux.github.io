import { useEffect, useRef, useState } from 'react'
import links from '../content/links.json'
import { loadScript } from '../hooks/loadScript.ts'
import { useInView } from '../hooks/useInView.ts'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon } from './BrandIcon.tsx'

// Minimal typing for https://player.twitch.tv/js/embed/v1.js
interface TwitchPlayer {
  addEventListener(event: string, cb: () => void): void
}
declare global {
  interface Window {
    Twitch?: {
      Player: (new (el: HTMLElement | string, options: Record<string, unknown>) => TwitchPlayer) & {
        ONLINE: string
        OFFLINE: string
      }
    }
  }
}

type LiveState = 'checking' | 'live' | 'offline'

/** How long to wait for the player to report ONLINE/OFFLINE before assuming off air. */
const CHECK_TIMEOUT_MS = 8000

/**
 * Twitch channel player (live stream, or Twitch's offline screen). The lamp shows the on-air state.
 * Past broadcasts are not shown on purpose: they are subscriber-only.
 */
export function TwitchMonitor() {
  const { t } = useI18n()
  const [ref, inView] = useInView<HTMLDivElement>()
  const playerEl = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState<LiveState>('checking')
  const parent = window.location.hostname

  useEffect(() => {
    if (!inView || !playerEl.current) return
    const el = playerEl.current
    let cancelled = false
    const timeout = window.setTimeout(() => setLive((s) => (s === 'checking' ? 'offline' : s)), CHECK_TIMEOUT_MS)

    loadScript('https://player.twitch.tv/js/embed/v1.js')
      .then(() => {
        if (cancelled || !window.Twitch) return
        el.replaceChildren()
        const player = new window.Twitch.Player(el, {
          channel: links.twitch.login,
          parent: [parent],
          width: '100%',
          height: '100%',
          autoplay: false,
          muted: true,
        })
        player.addEventListener(window.Twitch.Player.ONLINE, () => !cancelled && setLive('live'))
        player.addEventListener(window.Twitch.Player.OFFLINE, () => !cancelled && setLive('offline'))
      })
      .catch(() => !cancelled && setLive('offline'))

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      el.replaceChildren()
    }
  }, [inView, parent])

  const isLive = live === 'live'

  return (
    <section ref={ref} className="flex h-full flex-col p-2 sm:p-4">
      <header className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <h3 className="font-display text-xl tracking-wide">{isLive ? t('twitch.live') : t('twitch.channel')}</h3>
        <span className="flex items-center gap-2 text-sm font-semibold text-muted">
          <span aria-hidden="true" className={`size-3 rounded-full ${isLive ? 'animate-pulse bg-red' : 'bg-line'}`} />
          {live === 'checking' ? t('twitch.checking') : isLive ? t('twitch.onAir') : t('twitch.offAir')}
        </span>
      </header>

      <div className={`crt aspect-video ${isLive ? 'crt-live' : ''}`}>
        <div ref={playerEl} className="absolute inset-0" />
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
