# AGENTS.md

Guide for AI coding agents working on this repository.

## Project
Source of **kabukiflux.com**: a single-page React hub for KabukiFlux (retro electronics, arcade, custom hardware). It shows:
- the latest Spanish YouTube video/stream with its description
- the Twitch channel player with an on-air indicator (never past broadcasts: they're subscriber-only)
- the public GitHub repos as a grid with preview images
- the X timeline (official widgets.js embed, with a fallback card)
- the Instagram profile embed (iframe)
- recent videos of both YouTube channels (RSS)

Hosted on **GitHub Pages** (static only, custom domain via `public/CNAME`).

More detail lives locally in `docs/` (`spec.md`, `architecture.md`, `operations.md`, `design.md`). The folder is git-ignored and may be missing in a fresh clone.

## Commands
Node ≥ 22.
```sh
npm install
npm run fetch-data   # generate public/data/feed.json (needed before dev/build to see data)
npm run dev          # http://localhost:5173
npm run typecheck    # tsc -b (app + node configs)
npm run build        # typecheck + vite build + prerender → dist/
npm run preview
```
There is no test suite. Verify changes with `npm run build` and by checking the page in a browser at desktop and ~390 px widths, with no horizontal scroll.

## How data flows
GitHub Pages has no backend. `.github/workflows/deploy.yml` runs on push, every 30 min, and on manual dispatch:
1. `scripts/fetch-data.ts` fetches the YouTube RSS feeds (ES + EN, minus `youtube.excludeVideos` in `links.json`) and the GitHub REST API (`GITHUB_TOKEN`), then writes `public/data/feed.json`. Each repo's social preview (its page's `og:image`, so custom previews win) is resized with `sharp` to a 640×320 WebP under `public/data/og/`, named with a content hash. No third-party secrets.
2. A failing source keeps the previous value from the live `https://kabukiflux.com/data/feed.json`.
3. Scheduled runs deploy only when the content changed (`changed` step output).

`npm run build` ends with an SSR build of `src/entry-server.tsx` and `scripts/prerender.ts`, which renders the page in Spanish into `dist/index.html`, embeds the feed (`#feed-data`) and the JSON-LD graph (`src/seo.ts`), and writes `dist/sitemap.xml`. `main.tsx` hydrates that markup when the visitor's language is Spanish and renders afresh otherwise; `useFeed` reads the embedded feed and only fetches `/data/feed.json` on the dev server. Components must render without `window` (browser-only work goes in effects), and time-dependent text gets `suppressHydrationWarning`.

The Twitch channel player uses the official embed, started after load when the browser is idle. Instagram is a plain iframe; X uses `widgets.js` `createTimeline` in the browser (X rate-limits per IP, so a server-side check is meaningless) and shows a fallback card if it doesn't render. All of them load lazily through `useInView` + `loadScript`.

## Layout
```
scripts/fetch-data.ts      data fetcher (Node, tsx)
shared/feed.ts             Feed types shared by script and app
src/content/links.json     ALL external URLs, channel IDs, handles, excluded repos (single source of truth)
src/i18n/                  I18nProvider + es.json / en.json (identical keys; keys typed from es.json)
src/hooks/                 useFeed, useInView, loadScript
src/components/            Header, Hero, Section, Slider, VideoPlayer, VideoCard, VideoSlider, TwitchMonitor, ProjectGrid, RepoImage, SocialFrame, XTimeline, SocialLinks, Footer + helpers
src/entry-server.tsx       prerender entry (render + jsonLd)
src/seo.ts                 schema.org JSON-LD graph built from the feed
scripts/prerender.ts       writes the prerendered index.html and sitemap.xml
src/index.css              Tailwind v4 @theme design tokens + component classes
src/App.tsx                page layout
public/                    CNAME, favicons, fonts/, og-banner.jpg, robots.txt, site.webmanifest (copied as-is)
```

## Design: airy editorial layout, colorful like a component drawer
The channel is electronics, arcade, FPGA and soldering, so the page is colorful on calm neutral bands: square buttons, centered headings, alternating bands, LED dots and resistor color bands (`.bands`) as the recurring motifs, and a PCB trace pattern (`.pcb`) on the dark band. Sticky header (logo, small-caps section links, ES/EN), hero (logo, tagline, about text, topic chips with colored LEDs, CTAs, social icons, Twitch monitor over the PCB banner photo), then Latest (mist band), Videos (dark band; Spanish channel in two rows, English in one), Projects (GitHub repo cards with preview images and colored language chips), Community (Instagram and X side by side), and a footer with a follow strip. Sliders are `Slider.tsx`: native scroll-snap plus prev/next buttons. `Section.tsx` sets the band (`tone`), the accent color (`accent`) and the centered heading with its outlined eyebrow word.
- Tokens (`src/index.css` `@theme`): paper white, mist `#f1f0ec` (light band), night `#38454f` (dark band, the logo's slate), ink `#1c2227`, slate `#546a79`; red `#d7261e` (primary accent) and gold `#ecd361` (accent on dark); component colors orange `#f08a24`, green `#2f9e6e`, cyan `#1fb5c9`, violet `#7b5cd6`, magenta `#d6336c` for LEDs, chips, eyebrows and dividers (fills and decoration, not body text on light backgrounds).
- Fonts: self-hosted **Syncopate Bold** (`font-display`, headings, uppercase only) and **Oswald** (`font-condensed`, stroked by `.outline-text` for eyebrow words), stand-ins for the brand fonts ADAM.CG PRO and Frontage Outline, which aren't licensed for commercial use. Long text such as video titles uses the system sans stack in bold.
- Logo: `src/assets/kabukiflux_logo.svg`, with its letters already converted to paths (no font needed).
- Rules: square corners, buttons and nav in small spaced caps, generous whitespace, sentence-case copy elsewhere, motion is deliberate and arcade/CRT-themed (scroll reveal, CRT monitor, ticker, glitch), always disabled under `prefers-reduced-motion`; no bouncy hover lifts.

## Conventions
- TypeScript strict mode, function components and hooks, no class components. Imports include the `.ts`/`.tsx` extension.
- Styling uses Tailwind utility classes. Colors and fonts come only from `@theme` tokens in `src/index.css`; don't hardcode new colors in components (brand colors for third-party icons are the exception).
- Every user-visible string goes through `t('key')`. Add each new key to **both** `es.json` and `en.json`.
- URLs and handles live in `src/content/links.json`, never inline.
- Third-party embeds must lazy-load and degrade to a link/fallback card when blocked.
- Respect `prefers-reduced-motion`. Keep it accessible: labels on icon buttons, visible focus states, decorative `alt=""`.
- Keep the bundle small. Ask before adding runtime dependencies.
- Write code that matches the surrounding style: 2-space indent, single quotes, no semicolons, sparse comments that explain *why*.

## Rules
- **Never `git commit` or `git push` without the owner's explicit approval.** The history is going to be reset (orphan branch + force push) under the owner's control.
- Never put secrets in the client bundle. Anything that needs a token belongs in `scripts/fetch-data.ts` and reads from environment variables.
- Don't commit `public/data/feed.json` (generated) or anything in `docs/` (local only).
- The Twitch embed `parent` must be the page hostname; don't hardcode it.
