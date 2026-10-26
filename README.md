# kabukiflux.com

Source of [kabukiflux.com](https://kabukiflux.com): a React hub, styled as an arcade cabinet, with the latest KabukiFlux YouTube video/stream, the Twitch channel player, GitHub projects, posts on X and Instagram.

Built with Vite + React + TypeScript + Tailwind CSS and hosted on GitHub Pages.

## How it works

GitHub Pages only serves static files, so dynamic content is fetched by a **scheduled GitHub Action** (`.github/workflows/deploy.yml`, every 30 min):

1. `scripts/fetch-data.ts` fetches:
   - YouTube: public RSS feeds of the Spanish and English channels (no key)
   - GitHub: public repos of `KabukiFlux` (excluding this one, forks and archived)
2. It writes `public/data/feed.json`. If a source fails, the last published value is kept.
3. The site is built and deployed. Scheduled runs skip the deploy when nothing changed.

Done in the browser:
- **Twitch**: the channel player (live stream or offline screen) and the on-air lamp. Past broadcasts aren't shown; they're subscriber-only.
- **X**: the timeline embed (a fallback card shows if X doesn't render it).
- **Instagram**: the public profile embed (iframe).

## Configuration

| What | Where |
|---|---|
| Social links, channel IDs, excluded repos | `src/content/links.json` |
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
