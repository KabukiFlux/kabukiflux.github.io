import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import es from './es.json'
import en from './en.json'

export type Lang = 'es' | 'en'
export type MessageKey = keyof typeof es

const messages: Record<Lang, Record<MessageKey, string>> = { es, en }
const STORAGE_KEY = 'kf-lang'

/** The visitor's language: saved choice first, then the browser's. The prerendered page is Spanish. */
export function detectLang(): Lang {
  if (typeof window === 'undefined') return 'es'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
  } catch {
    // storage unavailable (private mode, blocked site data)
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: MessageKey) => string
  formatDate: (iso: string) => string
  formatRelative: (iso: string) => string
}

const I18nContext = createContext<I18n | null>(null)

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

export function I18nProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo<I18n>(() => {
    const dateFmt = new Intl.DateTimeFormat(lang, { dateStyle: 'long' })
    const relFmt = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
    return {
      lang,
      setLang,
      t: (key) => messages[lang][key] ?? key,
      formatDate: (iso) => dateFmt.format(new Date(iso)),
      formatRelative: (iso) => {
        const seconds = (new Date(iso).getTime() - Date.now()) / 1000
        for (const [unit, size] of RELATIVE_UNITS) {
          if (Math.abs(seconds) >= size) return relFmt.format(Math.round(seconds / size), unit)
        }
        return relFmt.format(0, 'minute')
      },
    }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
