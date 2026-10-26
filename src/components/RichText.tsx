import { Fragment } from 'react'

const URL_PATTERN = /(https?:\/\/[^\s<>"]+)/g

/** Plain text with line breaks preserved and URLs turned into links. */
export function RichText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`whitespace-pre-line break-words ${className}`}>
      {text.split(URL_PATTERN).map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </p>
  )
}
