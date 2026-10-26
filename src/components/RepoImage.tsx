import { useState } from 'react'
import { BrandIcon } from './BrandIcon.tsx'

/** The repo's social preview, mirrored into the site by fetch-data. A plain tile replaces it if it's missing or fails. */
export function RepoImage({ src }: { src?: string | null }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-night text-white/15">
        <BrandIcon brand="github" className="size-20" />
      </span>
    )
  }
  return (
    <img
      src={`/${src}?v=${__BUILD_TIME__}`}
      alt=""
      width={1200}
      height={600}
      loading="lazy"
      onError={() => setFailed(true)}
      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  )
}
