import { useState } from 'react'
import type { Repo } from '../../shared/feed.ts'
import links from '../content/links.json'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon } from './BrandIcon.tsx'
import { RepoImage } from './RepoImage.tsx'
import { Section } from './Section.tsx'

const INITIAL_COUNT = 9

/** Language chip colors, loosely after GitHub's: one LED color per family. */
const LANGUAGE_COLORS: Record<string, string> = {
  'KiCad Layout': 'bg-green text-white',
  'KiCad Schematic': 'bg-cyan text-ink',
  C: 'bg-slate text-white',
  'C++': 'bg-magenta text-white',
  Python: 'bg-gold text-ink',
  JavaScript: 'bg-gold text-ink',
  TypeScript: 'bg-cyan text-ink',
  Verilog: 'bg-green text-white',
  SystemVerilog: 'bg-green text-white',
  VHDL: 'bg-green text-white',
  PowerShell: 'bg-violet text-white',
  'C#': 'bg-violet text-white',
  HTML: 'bg-orange text-ink',
}

export function ProjectGrid({ repos }: { repos: Repo[] }) {
  const { t, formatRelative } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? repos : repos.slice(0, INITIAL_COUNT)
  const hidden = repos.length - visible.length

  return (
    <Section
      id="projects"
      accent="green"
      eyebrow={t('projects.eyebrow')}
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
      action={
        <div className="flex flex-wrap justify-center gap-3">
          {hidden > 0 && (
            <button type="button" className="btn btn-outline" onClick={() => setExpanded(true)}>
              {t('projects.more')} ({hidden})
            </button>
          )}
          <a className="btn btn-ink" href={links.github.url} target="_blank" rel="noopener noreferrer">
            <BrandIcon brand="github" className="size-4" /> {t('projects.all')}
          </a>
        </div>
      }
    >
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((repo) => (
          <li key={repo.name}>
            <article className="group flex h-full flex-col border border-line bg-paper transition-colors hover:border-green">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${repo.name}: ${t('projects.open')}`}
                className="sweep relative block aspect-[2/1] overflow-hidden bg-night"
              >
                <RepoImage src={repo.image} />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
                {repo.language && (
                  <span className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase ${LANGUAGE_COLORS[repo.language] ?? 'bg-orange text-ink'}`}>
                    {repo.language}
                  </span>
                )}
                <span className="absolute inset-x-4 bottom-3 text-lg leading-tight font-bold break-words text-white">{repo.name}</span>
              </a>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-3 text-muted">{repo.description || t('projects.noDescription')}</p>
                <p className="mt-auto pt-4 text-xs text-muted">
                  ★ {repo.stars} · {t('projects.updated')} <time dateTime={repo.pushedAt} suppressHydrationWarning>{formatRelative(repo.pushedAt)}</time>
                  {repo.homepage && (
                    <>
                      {' · '}
                      <a className="font-semibold text-red hover:underline" href={repo.homepage} target="_blank" rel="noopener noreferrer">
                        {t('projects.website')}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  )
}
