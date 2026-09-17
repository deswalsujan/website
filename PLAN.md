# Plan

## Checklist

- [x] Port `index.html` into an Astro component/page
- [x] Set up a blog content collection
- [x] Migrate 2-3 existing blog posts into the content collection
- [x] Deploy to Cloudflare Workers

## Decisions

- **Astro instead of plain HTML** — gives us components, layouts, and content collections instead of hand-copied HTML files.
- **Blog posts as markdown files in a content collection instead of a CMS** — no external service to manage; posts live in the repo as `.md` files.
- **Deploying to Cloudflare Workers** — chosen hosting target for the migrated site.
- Cloudflare adapter installed and configured, wrangler CLI confirmed working via npx. Logged in via `npx wrangler login` and deployed via `npx wrangler deploy`.
- Worker is named `sujandeswal-website` (the default name `website` was unavailable on the `workers.dev` subdomain). Deployed via a `sujandeswal.com` custom domain route, with `workers_dev` disabled.
- **Typefaces are Geist and Geist Mono, served from Google Fonts rather than self-hosted.** Reverses the earlier decision to stay on the system font stack, because system-ui renders as a different face on every OS and cannot be designed against. Around 38KB for both faces.
- **Body copy is sans rather than serif.** Nearly every paragraph contains inline code, and a serif body fights the mono chips. Also avoids the warm-cream-plus-serif look that reads as generated.
- **No colour accent anywhere.** `--accent` removed, links are `color: inherit` with an underline. Syntax highlighting inside code blocks is the only colour on the site, because the site's job is to show shipped work and the evidence should be the only thing that draws the eye. The keyboard focus ring is the single deliberate exemption.
- **Measure is 38rem, about 66 characters.** 34rem and 36rem were both tested; 34rem came out near 56 characters with Geist, which read too tight. 38rem is the ceiling before line length passes the comfortable 45-75 band.
- **Palette is cool neutral near-white rather than warm cream.** A deliberate move away from the cream-and-serif default.
- **Content column is anchored left of centre above 1200px rather than centred.** The column has a stable left edge and the empty space reads as margin.
- The reasoning behind the six typography/palette decisions above came from a separate design conversation, not from a Claude Code session, which is why it isn't in any commit message.
