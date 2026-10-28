import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { detectLang, I18nProvider } from './i18n/I18nProvider.tsx'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')!
const lang = detectLang()
const app = (
  <StrictMode>
    <I18nProvider initialLang={lang}>
      <App />
    </I18nProvider>
  </StrictMode>
)

// The build prerenders the page in Spanish: hydrate it when it matches, otherwise render afresh.
if (root.hasChildNodes() && lang === 'es') hydrateRoot(root, app)
else createRoot(root).render(app)
