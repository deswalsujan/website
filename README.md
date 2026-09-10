# Website

sujandeswal.com — live at **https://sujandeswal.com**.

## Before

The homepage was static HTML, hand-edited through cPanel's File Manager. The blog ran separately on WordPress. Neither had version control or a way to preview changes before they went live.

## Now

The site is built with Astro. Blog posts, previously on WordPress, are now markdown files stored directly in this repo alongside the rest of the code. Changes are made locally, previewed, and deployed with the wrangler CLI to Cloudflare Workers, running live at sujandeswal.com.

This migration was done with [Claude Code](https://claude.com/claude-code).

## Running locally

```sh
npm install
npm run dev
```

The site will be available at `localhost:4321`.

## Deployment

```sh
npm run build
npx wrangler deploy
```

See `PLAN.md` for the migration checklist and key decisions, and `AGENTS.md` (aliased as `CLAUDE.md`) for the working agreement used in every session.
