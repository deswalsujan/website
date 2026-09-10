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
