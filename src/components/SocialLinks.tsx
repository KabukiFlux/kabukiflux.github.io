import links from '../content/links.json'
import { useI18n, type MessageKey } from '../i18n/I18nProvider.tsx'
import { BrandIcon, type Brand } from './BrandIcon.tsx'

const socials: { brand: Brand; label: MessageKey; url: string; hover: string }[] = [
  { brand: 'youtube', label: 'links.youtube', url: links.youtube.spanish.url, hover: 'hover:border-red hover:bg-red' },
  { brand: 'twitch', label: 'links.twitch', url: links.twitch.url, hover: 'hover:border-violet hover:bg-violet' },
  { brand: 'github', label: 'links.github', url: links.github.url, hover: 'hover:border-ink hover:bg-ink' },
  { brand: 'x', label: 'links.x', url: links.x.url, hover: 'hover:border-ink hover:bg-ink' },
  { brand: 'instagram', label: 'links.instagram', url: links.instagram.url, hover: 'hover:border-magenta hover:bg-magenta' },
]

/** Square icon links to every profile, used in the hero and the footer. */
export function SocialLinks({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  return (
    <ul aria-label={t('links.label')} className={`flex gap-2 ${className}`}>
      {socials.map((s) => (
        <li key={s.brand}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(s.label)}
            className={`grid size-11 place-items-center border border-ink/20 text-ink transition-colors hover:text-white ${s.hover}`}
          >
            <BrandIcon brand={s.brand} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}
