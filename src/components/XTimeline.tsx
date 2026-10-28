import { useEffect, useRef, useState } from 'react'
import links from '../content/links.json'
import { loadScript } from '../hooks/loadScript.ts'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon } from './BrandIcon.tsx'

// Minimal typing for https://platform.twitter.com/widgets.js
declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTimeline(
          source: { sourceType: 'profile'; screenName: string },
          target: HTMLElement,
          options: Record<string, unknown>,
        ): Promise<HTMLElement | undefined>
      }
    }
  }
}

const FAIL_AFTER_MS = 10000

/**
 * The official X profile timeline (an iframe built by widgets.js). It has to load in the visitor's browser:
 * X rate-limits the timeline per IP, so a check from the build server says nothing about the visitor.
 */
export function XTimeline({ load, height }: { load: boolean; height: number }) {
  const { t, lang } = useI18n()
  const box = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!load || !box.current) return
    const el = box.current
    let cancelled = false
    let settled = false
    setFailed(false)
    // a blocked widgets.js or a rate-limited timeline can leave the promise pending forever
    const timeout = window.setTimeout(() => !settled && !cancelled && setFailed(true), FAIL_AFTER_MS)
    loadScript('https://platform.twitter.com/widgets.js')
      .then(() =>
        window.twttr?.widgets.createTimeline({ sourceType: 'profile', screenName: links.x.handle }, el, {
          height,
          lang,
          dnt: true,
          theme: 'light',
          chrome: 'noheader nofooter noborders transparent',
        }),
      )
      // createTimeline resolves without an element when X refuses to render the timeline
      .then((frame) => {
        settled = true
        if (!cancelled && !frame) setFailed(true)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      el.replaceChildren()
    }
  }, [load, lang, height])

  return (
    <>
      <div ref={box} className={failed ? 'hidden' : 'px-2'} />
      {failed && (
        <div className="grid h-full place-items-center p-8 text-center">
          <div className="max-w-xs">
            <BrandIcon brand="x" className="mx-auto size-10 text-ink/25" />
            <p className="mt-4 text-sm text-muted">{t('x.unavailable')}</p>
            <a className="btn btn-ink mt-6" href={links.x.url} target="_blank" rel="noopener noreferrer">
              @{links.x.handle}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
