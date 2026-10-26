import { useI18n, type Lang } from '../i18n/I18nProvider.tsx'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
]

export function LangToggle() {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t('language')} className="flex gap-1 text-[11px] tracking-[0.18em]">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          aria-pressed={lang === l.code}
          onClick={() => setLang(l.code)}
          className={`px-2 py-1 font-semibold transition-colors ${lang === l.code ? 'border-b-2 border-red text-ink' : 'border-b-2 border-transparent text-muted hover:text-ink'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
