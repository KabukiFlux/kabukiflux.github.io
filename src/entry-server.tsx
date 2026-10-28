import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import type { Feed } from '../shared/feed.ts'
import App from './App.tsx'
import { primeFeed } from './hooks/useFeed.ts'
import { I18nProvider } from './i18n/I18nProvider.tsx'

export { jsonLd } from './seo.ts'

/** Renders the page in Spanish with the given feed (used by scripts/prerender.ts at build time). */
export function render(feed: Feed | null): string {
  primeFeed(feed)
  return renderToString(
    <StrictMode>
      <I18nProvider initialLang="es">
        <App />
      </I18nProvider>
    </StrictMode>,
  )
}
