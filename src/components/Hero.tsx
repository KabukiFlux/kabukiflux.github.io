import banner800 from '../assets/banner-800.webp'
import banner1600 from '../assets/banner-1600.webp'
import logo from '../assets/kabukiflux_logo.svg'
import { useI18n, type MessageKey } from '../i18n/I18nProvider.tsx'
import { SocialLinks } from './SocialLinks.tsx'
import { TwitchMonitor } from './TwitchMonitor.tsx'

/** What the channel is about, each with the color of an LED. */
const TOPICS: { key: MessageKey; color: string }[] = [
  { key: 'topic.arcade', color: 'text-red' },
  { key: 'topic.fpga', color: 'text-cyan' },
  { key: 'topic.soldering', color: 'text-orange' },
  { key: 'topic.retro', color: 'text-violet' },
  { key: 'topic.pcb', color: 'text-green' },
]

export function Hero() {
  const { t } = useI18n()
  return (
    <div id="top" className="relative overflow-hidden">
      <img
        src={banner1600}
        srcSet={`${banner800} 800w, ${banner1600} 1600w`}
        sizes="100vw"
        alt=""
        width={1600}
        height={751}
        fetchPriority="high"
        className="drift absolute inset-0 size-full object-cover opacity-60 saturate-150"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-mist via-mist/90 to-mist/40" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:py-24">
        <div>
          <h1>
            <img src={logo} alt="KabukiFlux" className="glitch w-full max-w-md" width={2088} height={704} />
          </h1>
          <p className="mt-6 max-w-md font-display text-base leading-relaxed tracking-wide text-ink uppercase sm:text-lg">{t('tagline')}</p>
          <p className="mt-4 max-w-md leading-relaxed text-muted">{t('hero.about')}</p>
          <ul aria-label={t('topics.label')} className="mt-6 flex max-w-md flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <li key={topic.key} className="flex items-center gap-2 border border-ink/15 bg-paper/80 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase">
                <span aria-hidden="true" className={`led ${topic.color}`} />
                {t(topic.key)}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-ink" href="#latest">{t('hero.cta.latest')}</a>
            <a className="btn btn-outline" href="#projects">{t('hero.cta.projects')}</a>
          </div>
          <SocialLinks className="mt-8" />
        </div>
        <TwitchMonitor />
      </div>
      <div aria-hidden="true" className="bands relative" />
    </div>
  )
}
