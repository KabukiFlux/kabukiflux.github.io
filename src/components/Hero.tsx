import banner from '../assets/banner.jpg'
import logo from '../assets/kabukiflux_logo.svg'
import links from '../content/links.json'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon, type Brand } from './BrandIcon.tsx'
import { TwitchMonitor } from './TwitchMonitor.tsx'

const socials: { brand: Brand; label: 'links.youtube' | 'links.twitch' | 'links.github' | 'links.x' | 'links.instagram'; url: string }[] = [
  { brand: 'youtube', label: 'links.youtube', url: links.youtube.spanish.url },
  { brand: 'twitch', label: 'links.twitch', url: links.twitch.url },
  { brand: 'github', label: 'links.github', url: links.github.url },
  { brand: 'x', label: 'links.x', url: links.x.url },
  { brand: 'instagram', label: 'links.instagram', url: links.instagram.url },
]

export function Hero() {
  const { t } = useI18n()
  return (
    <div id="top" className="relative overflow-hidden ">
      <img src={banner} alt="" className="drift absolute inset-0 size-full object-cover opacity-50 grayscale" />
      <div className="absolute inset-0 bg-gradient-to-r from-mist via-mist/85 to-mist/30" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 sm:px-4 py-14 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:py-24">
        <div>
          <h1>
            <img src={logo} alt="KabukiFlux" className="glitch w-full max-w-md" width={2088} height={704} />
          </h1>
          <p className="mt-6 max-w-md font-display text-lg leading-relaxed tracking-wide text-ink sm:text-xl">{t('tagline')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-ink" href="#latest">{t('hero.cta.latest')}</a>
            <a className="btn btn-outline" href="#projects">{t('hero.cta.projects')}</a>
          </div>
          <ul aria-label={t('links.label')} className="mt-8 flex gap-2">
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
        <TwitchMonitor />
      </div>
    </div>
  )
}
