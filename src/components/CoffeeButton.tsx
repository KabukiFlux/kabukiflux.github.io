import links from '../content/links.json'
import { useI18n } from '../i18n/I18nProvider.tsx'

/** Ko-fi donation link. Icon only on narrow screens (the label stays for screen readers). */
export function CoffeeButton({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  return (
    <a className={`btn btn-red ${className}`} href={links.kofi.url} target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8zM16 9h1.5a2.5 2.5 0 0 1 0 5H16M7 2v2M11 2v2" />
      </svg>
      <span className="max-sm:sr-only">{t('kofi.cta')}</span>
    </a>
  )
}
