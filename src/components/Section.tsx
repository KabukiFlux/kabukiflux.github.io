import type { ReactNode } from 'react'

type Tone = 'light' | 'mist' | 'dark'

interface SectionProps {
  id: string
  /** Short decorative word above the heading (set in the outline font). */
  eyebrow: string
  title: string
  subtitle?: string
  tone?: Tone
  /** Centered call to action below the content. */
  action?: ReactNode
  children: ReactNode
}

const TONES: Record<Tone, string> = {
  light: 'bg-paper text-ink',
  mist: 'bg-mist text-ink',
  dark: 'bg-night text-white',
}

export function Section({ id, eyebrow, title, subtitle, tone = 'light', action, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={TONES[tone]}>
      <div className="reveal mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <header className="mb-12 text-center">
          <p aria-hidden="true" className={`font-outline text-3xl leading-none sm:text-4xl ${tone === 'dark' ? 'text-gold' : 'text-red'}`}>
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="mt-2 font-display text-2xl tracking-wide sm:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mx-auto mt-3 max-w-xl opacity-70">{subtitle}</p>}
        </header>
        {children}
        {action && <div className="mt-12 flex justify-center">{action}</div>}
      </div>
    </section>
  )
}
