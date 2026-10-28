# kabukiflux.com

Source of [kabukiflux.com](https://kabukiflux.com): a React hub for KabukiFlux (retro electronics, arcade, FPGA and soldering) with the latest YouTube video/stream, the Twitch channel player, GitHub projects, posts on X and Instagram.

Built with Vite + React + TypeScript + Tailwind CSS and hosted on GitHub Pages.

## How it works

GitHub Pages only serves static files, so dynamic content is fetched by a **scheduled GitHub Action** (`.github/workflows/deploy.yml`, every 30 min):

1. `scripts/fetch-data.ts` fetches:
   - YouTube: public RSS feeds of the Spanish and English channels (no key), minus the videos listed in `excludeVideos`
   - GitHub: public repos of `KabukiFlux` (excluding this one, forks and archived) and their social preview images, mirrored as small WebP files
2. It writes `public/data/feed.json`. If a source fails, the last published value is kept.
3. The site is built and the page is prerendered with that data (content, JSON-LD and sitemap), so it shows without waiting for JavaScript and search engines see everything. Scheduled runs skip the deploy when nothing changed.

Done in the browser:
- **Twitch**: the channel player (live stream or offline screen) and the on-air lamp. Past broadcasts aren't shown; they're subscriber-only.
- **X**: the official timeline embed (a fallback card shows if X doesn't render it, e.g. for logged-out visitors or when X rate-limits).
- **Instagram**: the public profile embed (iframe).

## Configuration

| What | Where |
|---|---|
| Social links, channel IDs, excluded videos and repos | `src/content/links.json` |
| Texts (Spanish / English) | `src/i18n/es.json`, `src/i18n/en.json` |
| Colors and fonts | `src/index.css` (`@theme`) |

No secrets are needed. *Settings → Pages → Source* must be **GitHub Actions**.

## Development

Requires Node 22+.

```sh
npm install
npm run fetch-data
npm run dev
```

`npm run build && npm run preview` serves the production build.

## License

[MIT](LICENSE)
