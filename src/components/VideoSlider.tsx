import type { VideoSummary } from '../../shared/feed.ts'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { Slider } from './Slider.tsx'

interface VideoSliderProps {
  title: string
  channelUrl: string
  videos: VideoSummary[]
  rows?: 1 | 2
}

/** One channel's recent videos: thumbnail cards that open the video on YouTube. */
export function VideoSlider({ title, channelUrl, videos, rows = 1 }: VideoSliderProps) {
  const { t, lang, formatDate } = useI18n()
  const views = new Intl.NumberFormat(lang, { notation: 'compact' })
  if (videos.length === 0) return null

  return (
    <div className="mt-14 first:mt-0">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3">
        <h3 className="font-display text-sm tracking-wide uppercase sm:text-base">{title}</h3>
        <a className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase hover:underline" href={channelUrl} target="_blank" rel="noopener noreferrer">
          {t('videos.channel')}
        </a>
      </div>
      <Slider label={title} rows={rows}>
        {videos.map((v) => (
          <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className={`group block ${rows === 1 ? 'w-[78%] sm:w-72' : ''}`}>
            <span className="sweep relative block overflow-hidden border-b-2 border-transparent bg-night-deep transition-colors group-hover:border-gold">
              {/* mqdefault is 16:9 without letterboxing; hqdefault covers 2x screens */}
              <img
                src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                srcSet={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg 320w, https://i.ytimg.com/vi/${v.id}/hqdefault.jpg 480w`}
                sizes="(min-width: 640px) 18rem, 78vw"
                alt=""
                width={320}
                height={180}
                loading="lazy"
                decoding="async"
                className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </span>
            <p className="mt-3 line-clamp-2 font-semibold group-hover:text-gold">{v.title}</p>
            <p className="mt-1 text-sm text-white/65">
              <time dateTime={v.published} suppressHydrationWarning>{formatDate(v.published)}</time>
              {v.views !== null && ` · ${views.format(v.views)} ${t('videos.views')}`}
            </p>
          </a>
        ))}
      </Slider>
    </div>
  )
}
