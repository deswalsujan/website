# Plan

## Checklist

- [ ] Port `index.html` into an Astro component/page
- [ ] Port the about page into an Astro component/page
- [ ] Set up a blog content collection
- [ ] Migrate 2-3 existing blog posts into the content collection
- [ ] Deploy to Cloudflare Workers

## Decisions

- **Astro instead of plain HTML** — gives us components, layouts, and content collections instead of hand-copied HTML files.
- **Blog posts as markdown files in a content collection instead of a CMS** — no external service to manage; posts live in the repo as `.md` files.
- **Deploying to Cloudflare Workers** — chosen hosting target for the migrated site.
