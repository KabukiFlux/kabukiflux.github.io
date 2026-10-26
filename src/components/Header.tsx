import logo from '../assets/kabukiflux_logo.svg'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { CoffeeButton } from './CoffeeButton.tsx'
import { LangToggle } from './LangToggle.tsx'

export function Header() {
  const { t } = useI18n()
  const link = 'py-1 text-sm font-semibold tracking-[0.16em] text-muted uppercase transition-colors hover:text-red'
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4">
        <a href="#top" aria-label="KabukiFlux">
          <img src={logo} alt="" className="h-9 w-auto" width={107} height={36} />
        </a>
        <nav aria-label={t('nav.label')} className="hidden items-center gap-6 md:gap-10 sm:flex">
          <a className={link} href="#latest">{t('nav.latest')}</a>
          <a className={link} href="#videos">{t('nav.videos')}</a>
          <a className={link} href="#projects">{t('nav.projects')}</a>
          <a className={link} href="#community">{t('nav.community')}</a>
        </nav>
        <div className="flex items-center gap-3">
          <CoffeeButton className="max-sm:px-3 max-sm:py-3 sm:py-2" />
          <LangToggle />
        </div>
      </div>
      <div aria-hidden="true" className="scroll-progress" />
    </header>
  )
}
