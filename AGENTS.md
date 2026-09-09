## Working agreement

- Before running any command, explain in one plain-English line what it does and why.
- Never put API keys or secrets in code or tracked files. Secrets live in `.env` locally. Confirm `.env` is in `.gitignore` before every commit.
- Prefer boring, standard Astro conventions. No extra frameworks or libraries unless asked.
- Before every push, list the files being pushed and confirm none contain secrets.
- Start every session by reading `PLAN.md`, then run `git log --oneline -10` for recent history.
- Put a short plain-English comment at the top of every new page or component file saying what it does.
- Write clear, specific commit messages (what changed, not "update" or "fixes").

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
