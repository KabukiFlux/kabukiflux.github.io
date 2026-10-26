# AGENTS.md

Guide for AI coding agents working on this repository.

## Project
Source of **kabukiflux.com**: a single-page React hub for KabukiFlux (retro electronics, arcade, custom hardware). It shows:
- the latest Spanish YouTube video/stream with its description
- the Twitch channel player with an on-air indicator (never past broadcasts: they're subscriber-only)
- the public GitHub repos as a grid with preview images
- the X timeline (iframe)
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
npm run build        # typecheck + vite build → dist/
npm run preview
```
There is no test suite. Verify changes with `npm run build` and by checking the page in a browser at desktop and ~390 px widths, with no horizontal scroll.

## How data flows
GitHub Pages has no backend. `.github/workflows/deploy.yml` runs on push, every 30 min, and on manual dispatch:
1. `scripts/fetch-data.ts` fetches the YouTube RSS feeds (ES + EN) and the GitHub REST API (`GITHUB_TOKEN`), then writes `public/data/feed.json`. No third-party secrets.
2. A failing source keeps the previous value from the live `https://kabukiflux.com/data/feed.json`.
3. Scheduled runs deploy only when the content changed (`changed` step output).

The browser loads `/data/feed.json?v=__BUILD_TIME__`. The Twitch channel player uses the official embed; Instagram and X are plain iframes of their public embed pages loaded in the browser, lazily through `useInView` + `loadScript`.

## Layout
```
scripts/fetch-data.ts      data fetcher (Node, tsx)
shared/feed.ts             Feed types shared by script and app
src/content/links.json     ALL external URLs, channel IDs, handles, excluded repos (single source of truth)
src/i18n/                  I18nProvider + es.json / en.json (identical keys; keys typed from es.json)
src/hooks/                 useFeed, useInView, loadScript
src/components/            Header, Hero, Section, Slider, VideoPlayer, VideoCard, VideoSlider, TwitchMonitor, ProjectGrid, RepoImage, SocialFrame, Footer + helpers
src/index.css              Tailwind v4 @theme design tokens + component classes
src/App.tsx                page layout
public/                    CNAME, favicons, fonts/, og-banner.jpg (copied as-is)
```

## Design: airy editorial layout in the logo colors
Inspired by a soft editorial theme: washed photo hero, square buttons, centered headings, alternating bands. Sticky header (logo, small-caps section links, ES/EN), hero (logo, tagline, CTAs, social icons, latest video over a faded banner photo), then Latest (mist band), Videos (dark band, one slider per YouTube channel), Projects (GitHub repos slider with preview images), Community (X and Instagram), and a footer with a follow strip. Sliders are `Slider.tsx`: native scroll-snap plus prev/next buttons. `Section.tsx` sets the band (`tone`) and the centered heading with its decorative eyebrow word.
- Tokens (`src/index.css` `@theme`): paper white, mist `#f1f0ec` (light band), night `#38454f` (dark band, the logo's slate), ink `#1c2227`, red `#d7261e` (accent), gold `#ecd361` (accent on dark), slate `#546a79`.
- Fonts: **ADAM.CG PRO** (headings) and **Frontage Outline** (eyebrow words), loaded from `public/fonts/` (see the README there); body uses the system sans stack.
- Logo: `src/assets/kabukiflux_logo.svg`.
- Rules: square corners, buttons and nav in small spaced caps, generous whitespace, red/gold as the only accents, sentence-case copy elsewhere, motion is deliberate and arcade/CRT-themed (scroll reveal, CRT monitor, ticker, glitch), always disabled under `prefers-reduced-motion`; no bouncy hover lifts.

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
