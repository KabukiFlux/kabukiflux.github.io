import { useState } from 'react'
import type { YouTubeVideo } from '../../shared/feed.ts'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon } from './BrandIcon.tsx'
import { RichText } from './RichText.tsx'

const COLLAPSED_LENGTH = 280

/** Title and description of the latest video, shown next to its player. */
export function VideoCard({ video }: { video: YouTubeVideo }) {
  const { t, formatDate } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const long = video.description.length > COLLAPSED_LENGTH

  return (
    <article className="card flex h-full flex-col p-0 sm:p-4">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-red uppercase">
        {t('youtube.title')} · <time dateTime={video.published}>{formatDate(video.published)}</time>
      </p>
      <h3 className="mt-2 font-display text-2xl leading-snug tracking-wide text-balance">{video.title}</h3>
      {video.description && (
        <>
          <RichText
            text={expanded || !long ? video.description : video.description.slice(0, COLLAPSED_LENGTH).trimEnd() + '…'}
            className="mt-4 max-w-prose leading-relaxed text-muted [&_a]:text-red"
          />
          {long && (
            <button type="button" className="mt-2 text-[11px] font-semibold tracking-[0.18em] text-red uppercase hover:underline" onClick={() => setExpanded((e) => !e)}>
              {expanded ? t('youtube.less') : t('youtube.more')}
            </button>
          )}
        </>
      )}
      <div className="mt-auto pt-6">
        <a className="btn btn-red" href={video.url} target="_blank" rel="noopener noreferrer">
          <BrandIcon brand="youtube" className="size-4" /> {t('youtube.watch')}
        </a>
      </div>
    </article>
  )
}
