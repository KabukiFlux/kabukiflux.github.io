import links from '../content/links.json'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon, type Brand } from './BrandIcon.tsx'

const socials: { brand: Brand; label: 'links.youtube' | 'links.twitch' | 'links.github' | 'links.x' | 'links.instagram'; url: string }[] = [
  { brand: 'youtube', label: 'links.youtube', url: links.youtube.spanish.url },
  { brand: 'twitch', label: 'links.twitch', url: links.twitch.url },
  { brand: 'github', label: 'links.github', url: links.github.url },
  { brand: 'x', label: 'links.x', url: links.x.url },
  { brand: 'instagram', label: 'links.instagram', url: links.instagram.url },
]

export function Footer({ generatedAt }: { generatedAt?: string }) {
  const { t, formatRelative } = useI18n()
  return (
    <footer>
      <div className="bg-mist">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-12 text-center">
          <p aria-hidden="true" className="font-outline text-3xl leading-none text-red">
            {t('footer.follow')}
          </p>
          <ul aria-label={t('links.label')} className="flex gap-2">
            {socials.map((s) => (
              <li key={s.brand}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(s.label)}
                  className="grid size-11 place-items-center border border-ink/20 text-ink transition-colors hover:border-red hover:bg-red hover:text-white"
                >
                  <BrandIcon brand={s.brand} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-ink text-xs tracking-wide text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row">
          <p>© {new Date().getFullYear()} KabukiFlux</p>
          {generatedAt && (
            <p>
              {t('feed.updated')} <time dateTime={generatedAt}>{formatRelative(generatedAt)}</time>
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
