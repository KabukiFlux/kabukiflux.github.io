import { useI18n } from '../i18n/I18nProvider.tsx'
import { SocialLinks } from './SocialLinks.tsx'

export function Footer({ generatedAt }: { generatedAt?: string }) {
  const { t, formatRelative } = useI18n()
  return (
    <footer>
      <div aria-hidden="true" className="bands" />
      <div className="bg-mist">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-12 text-center">
          <p aria-hidden="true" className="outline-text text-4xl leading-none text-red">
            {t('footer.follow')}
          </p>
          <SocialLinks />
        </div>
      </div>
      <div className="bg-ink text-xs tracking-wide text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row">
          <p suppressHydrationWarning>© {new Date().getFullYear()} KabukiFlux</p>
          {generatedAt && (
            <p>
              {t('feed.updated')}{' '}
              <time dateTime={generatedAt} suppressHydrationWarning>
                {formatRelative(generatedAt)}
              </time>
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
