import type { BlueskyPost } from '../../shared/feed.ts'
import links from '../content/links.json'
import { useI18n } from '../i18n/I18nProvider.tsx'
import { BrandIcon } from './BrandIcon.tsx'

/**
 * Recent Bluesky posts, rendered from feed.json: Bluesky has no profile timeline embed,
 * and its public API lets the build fetch them without a script or cookies in the page.
 */
export function BlueskyFeed({ posts }: { posts: BlueskyPost[] }) {
  const { t, lang, formatDate } = useI18n()
  const count = new Intl.NumberFormat(lang, { notation: 'compact' })

  if (posts.length === 0) {
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div className="max-w-xs">
          <BrandIcon brand="bluesky" className="mx-auto size-10 text-ink/25" />
          <p className="mt-4 text-sm text-muted">{t('bluesky.empty')}</p>
          <a className="btn btn-ink mt-6" href={links.bluesky.url} target="_blank" rel="noopener noreferrer">
            @{links.bluesky.handle}
          </a>
        </div>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-line">
      {posts.map((post) => (
        <li key={post.url} className="bg-paper/60 px-5 py-4">
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-[0.14em] text-muted uppercase hover:text-ink hover:underline">
            <time dateTime={post.createdAt} suppressHydrationWarning>{formatDate(post.createdAt)}</time>
          </a>
          <p className="mt-2 whitespace-pre-line break-words">
            {post.text.map((part, i) =>
              part.href ? (
                <a key={i} href={part.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                  {part.text}
                </a>
              ) : (
                part.text
              ),
            )}
          </p>
          {post.image && (
            <a href={post.link?.url ?? post.url} target="_blank" rel="noopener noreferrer" className="mt-3 block overflow-hidden border border-line bg-mist">
              <img src={post.image.src} alt={post.image.alt} width={640} height={360} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
              {post.link?.title && <span className="block px-3 py-2 text-sm font-semibold">{post.link.title}</span>}
            </a>
          )}
          <p className="mt-3 flex gap-5 text-xs text-muted">
            <span>
              {count.format(post.replies)} {t('bluesky.replies')}
            </span>
            <span>
              {count.format(post.reposts)} {t('bluesky.reposts')}
            </span>
            <span>
              {count.format(post.likes)} {t('bluesky.likes')}
            </span>
          </p>
        </li>
      ))}
    </ul>
  )
}
