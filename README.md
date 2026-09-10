# Website

sujandeswal.com — live at **https://sujandeswal.com**.

## Before

The site was static HTML, hand-edited directly through cPanel's File Manager on the hosting provider. There was no version control, no local development setup, and no way to preview a change before it went live — every edit was made straight to the production files.

## Now

The site is built with [Astro](https://astro.build), with all content and code tracked in this git repo. Blog posts live as markdown files in an Astro content collection instead of hand-written HTML pages. Deploys go through the `wrangler` CLI to Cloudflare Workers, served on the custom domain `sujandeswal.com` rather than a shared hosting URL. Changes are made locally, reviewed, committed, and deployed deliberately instead of edited live.

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
