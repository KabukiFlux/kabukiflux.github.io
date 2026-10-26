import { siGithub, siInstagram, siTwitch, siX, siYoutube } from 'simple-icons'

const icons = { youtube: siYoutube, twitch: siTwitch, github: siGithub, x: siX, instagram: siInstagram }

export type Brand = keyof typeof icons

export function BrandIcon({ brand, className = 'size-5' }: { brand: Brand; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={icons[brand].path} />
    </svg>
  )
}
