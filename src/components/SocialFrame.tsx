import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView.ts'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon, type Brand } from './BrandIcon.tsx'

interface SocialBarProps {
  brand: Brand
  title: string
  profileUrl: string
  followLabel: string
  /** Short line under the title. */
  subtitle?: string
  className?: string
}

/** A network's name and a follow button: the head of a SocialFrame, or a block of its own. */
export function SocialBar({ brand, title, profileUrl, followLabel, subtitle, className = '' }: SocialBarProps) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${className}`}>
      <div>
        <h3 className="flex items-center gap-3 text-lg font-bold">
          <BrandIcon brand={brand} className="size-5" /> {title}
        </h3>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      <a className="btn btn-outline" href={profileUrl} target="_blank" rel="noopener noreferrer">
        {followLabel}
      </a>
    </div>
  )
}

interface SocialFrameProps extends Omit<SocialBarProps, 'subtitle' | 'className'> {
  height: number
  /** Embeddable page of the network, as a plain iframe. */
  src?: string
  /** Own content instead of `src`; it receives whether the block is near the viewport. */
  children?: (inView: boolean) => ReactNode
}

/** A network's public embed, loaded only near the viewport, with a link to the profile in case the embed is blocked. */
export function SocialFrame({ height, src, children, ...bar }: SocialFrameProps) {
  const { t } = useI18n()
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className="flex flex-col bg-paper">
      <SocialBar {...bar} />
      <div style={{ height }} className="overflow-y-auto border-t border-line bg-mist/50">
        {children
          ? children(inView)
          : inView && (
              <iframe
                src={src}
                title={bar.title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                className="size-full border-0"
              />
            )}
      </div>
      {/* only third-party embeds can be blocked */}
      {src && <p className="px-5 py-3 text-xs text-muted">{t('community.note')}</p>}
    </div>
  )
}
