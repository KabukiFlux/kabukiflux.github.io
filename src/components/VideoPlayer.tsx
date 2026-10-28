import { useState } from 'react'
import type { YouTubeVideo } from '../../shared/feed.ts'
import links from '../content/links.json'
import { useI18n } from '../i18n/I18nProvider.tsx'

/** 16:9 YouTube player; the heavy iframe is only created on click. */
export function VideoPlayer({ video }: { video: YouTubeVideo | null }) {
  const { t } = useI18n()
  const [playing, setPlaying] = useState(false)
  const frame = 'relative aspect-video overflow-hidden bg-night shadow-[0_30px_60px_-30px_rgb(28_34_39/0.6)]'

  if (!video) {
    return (
      <div className={`${frame} grid place-items-center p-6 text-center`}>
        <a href={links.youtube.spanish.url} target="_blank" rel="noopener noreferrer" className="max-w-sm text-white/80 underline hover:text-white">
          {t('youtube.missing')}
        </a>
      </div>
    )
  }

  return (
    <div className={frame}>
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`${t('youtube.play')}: ${video.title}`} className="group absolute inset-0 block size-full">
          {video.thumbnail && <img src={video.thumbnail} alt="" width={480} height={360} loading="lazy" decoding="async" className="size-full object-cover" />}
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center bg-red text-white shadow-lg transition-colors group-hover:bg-red-dark sm:size-20">
              <svg viewBox="0 0 24 24" className="ml-1 size-8 fill-current" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
