import type { VideoSummary } from '../../shared/feed.ts'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { Slider } from './Slider.tsx'

interface VideoSliderProps {
  title: string
  channelUrl: string
  videos: VideoSummary[]
}

/** One channel's recent videos: thumbnail cards that open the video on YouTube. */
export function VideoSlider({ title, channelUrl, videos }: VideoSliderProps) {
  const { t, lang, formatDate } = useI18n()
  const views = new Intl.NumberFormat(lang, { notation: 'compact' })
  if (videos.length === 0) return null

  return (
    <div className="mt-10 first:mt-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg tracking-wide">{title}</h3>
        <a className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase hover:underline" href={channelUrl} target="_blank" rel="noopener noreferrer">
          {t('videos.channel')}
        </a>
      </div>
      <Slider label={title}>
        {videos.map((v) => (
          <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className="group w-[78%] sm:w-72">
            <img src={v.thumbnail} alt="" loading="lazy" className="aspect-video w-full bg-black/20 object-cover" />
            <p className="mt-3 line-clamp-2 font-semibold group-hover:text-gold">{v.title}</p>
            <p className="mt-1 text-sm text-white/60">
              <time dateTime={v.published}>{formatDate(v.published)}</time>
              {v.views !== null && ` · ${views.format(v.views)} ${t('videos.views')}`}
            </p>
          </a>
        ))}
      </Slider>
    </div>
  )
}
