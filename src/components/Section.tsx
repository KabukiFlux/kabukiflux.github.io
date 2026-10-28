import type { ReactNode } from 'react'

type Tone = 'light' | 'mist' | 'dark'
type Accent = 'red' | 'gold' | 'cyan' | 'green' | 'violet' | 'magenta'

interface SectionProps {
  id: string
  /** Short decorative word above the heading (drawn as an outline). */
  eyebrow: string
  title: string
  subtitle?: string
  tone?: Tone
  /** Color of the eyebrow word and the LED next to the heading. */
  accent?: Accent
  /** Centered call to action below the content. */
  action?: ReactNode
  children: ReactNode
}

const TONES: Record<Tone, string> = {
  light: 'bg-paper text-ink',
  mist: 'bg-mist text-ink',
  dark: 'pcb bg-night text-white',
}

const ACCENTS: Record<Accent, string> = {
  red: 'text-red',
  gold: 'text-gold',
  cyan: 'text-cyan',
  green: 'text-green',
  violet: 'text-violet',
  magenta: 'text-magenta',
}

export function Section({ id, eyebrow, title, subtitle, tone = 'light', accent = 'red', action, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={TONES[tone]}>
      <div className="reveal mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <header className="mb-12 text-center">
          <p aria-hidden="true" className={`outline-text text-4xl leading-none sm:text-5xl ${ACCENTS[accent]}`}>
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="mt-3 flex items-center justify-center gap-3 font-display text-xl tracking-wide uppercase sm:text-2xl">
            <span aria-hidden="true" className={`led ${ACCENTS[accent]}`} />
            {title}
          </h2>
          {subtitle && <p className="mx-auto mt-3 max-w-xl opacity-75">{subtitle}</p>}
        </header>
        {children}
        {action && <div className="mt-12 flex justify-center">{action}</div>}
      </div>
    </section>
  )
}
