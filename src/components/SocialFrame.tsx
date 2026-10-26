import { useInView } from '../hooks/useInView.ts'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon, type Brand } from './BrandIcon.tsx'

interface SocialFrameProps {
  brand: Brand
  title: string
  /** Embeddable page of the network (loaded only when the block nears the viewport). */
  src: string
  profileUrl: string
  followLabel: string
  height: number
  /** False hides the iframe and its note, leaving only the title and the follow button. */
  embed?: boolean
}

/** Full-width iframe of a network's public embed, with a link to the profile in case the embed is blocked. */
export function SocialFrame({ brand, title, src, profileUrl, followLabel, height, embed = true }: SocialFrameProps) {
  const { t } = useI18n()
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className="bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <h3 className="flex items-center gap-3 font-display text-lg tracking-wide">
          <BrandIcon brand={brand} className="size-5" /> {title}
        </h3>
        <a className="btn btn-outline" href={profileUrl} target="_blank" rel="noopener noreferrer">
          {followLabel}
        </a>
      </div>
      {embed && (
        <>
          <div style={{ height }} className="border-t border-line bg-mist/50">
            {inView && (
              <iframe
                src={src}
                title={title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                className="size-full border-0"
              />
            )}
          </div>
          <p className="px-5 py-3 text-xs text-muted">{t('community.note')}</p>
        </>
      )}
    </div>
  )
}
