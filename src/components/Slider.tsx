import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n/I18nProvider.tsx'

interface SliderProps {
  label: string
  /** Two rows fill columns top to bottom; children then take their width from the track. */
  rows?: 1 | 2
  children: ReactNode
}

/** Scroll-snap slider with previous/next buttons. Swipe, wheel and keyboard scrolling keep working natively. */
export function Slider({ label, rows = 1, children }: SliderProps) {
  const { t } = useI18n()
  const track = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    update()
    // embeds grow after loading, so watch the content size too
    const observer = new ResizeObserver(update)
    if (track.current) {
      observer.observe(track.current)
      Array.from(track.current.children).forEach((c) => observer.observe(c))
    }
    return () => observer.disconnect()
  }, [update, children])

  function go(dir: 1 | -1) {
    const el = track.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85 })
  }

  const arrow = 'grid size-11 place-items-center border border-current/30 transition-colors hover:border-current disabled:pointer-events-none disabled:opacity-25'

  return (
    <div role="group" aria-roledescription="carousel" aria-label={label}>
      <div ref={track} onScroll={update} className={`slider-track ${rows === 2 ? 'rows-2' : ''}`} tabIndex={0}>
        {children}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <button type="button" className={arrow} onClick={() => go(-1)} disabled={edge.start} aria-label={t('slider.prev')}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" className={arrow} onClick={() => go(1)} disabled={edge.end} aria-label={t('slider.next')}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
