## Project Overview

This is a personal portfolio website: static HTML, CSS and vanilla JavaScript. There is no framework and no runtime build step — `scripts/build-prototype.mjs` only assembles `dist/` from the sources below. The site is deployed to GitHub Pages by GitHub Actions.

> **Bestandsnaam.** Dit is `AGENTS.md` — de naam die OpenCode en Claude Code lezen. `GEMINI.md` is een symlink hiernaartoe, geen tweede kopie: Antigravity leest die naam, en één feit hoort in één bestand (regel 1.b). Wijzig hier, niet in de symlink.

| Path | Role |
|---|---|
| `prototype/` | The site: `index.html`, `styles.css`, `app.js`, `assets/` |
| `src/data/cv.json`, `src/data/cv-eng.json` | CV content (NL, EN) |
| `src/i18n/nl.json`, `src/i18n/en.json` | UI labels and accessibility texts |
| `projects/projects.tsv` | Projects (generated from the Google Sheet, which is the real source of truth) |
| `CV/cv.md` | Dutch CV as Markdown; `src/data/cv.json` is generated from it |
| `scripts/` | Build, CV conversion and sheet-sync helpers |

## Build and Deploy

Build and deploy run **only in GitHub Actions**. `node_modules/` is not installed locally — the repository is ~13 MB.

```bash
node scripts/build-prototype.mjs   # assemble dist/ — no dependencies needed
```

The three workflows under `.github/workflows/` all do `pnpm install → build:prototype → deploy:prototype`, and share the `gh-pages-deploy` concurrency group so only one deploy runs at a time:

- `deploy.yml` — push to `main`, except `CV/**`
- `update-cv.yml` — push to `main` on `CV/**`; regenerates `cv.json`, commits it with `GITHUB_TOKEN`, then deploys itself (a token commit triggers no workflow, so it cannot rely on `deploy.yml`)
- `deploy-from-url.yml` — manual dispatch; fetches the TSV from the Google Sheet

There is no `pnpm start`, `pnpm build`, `pnpm test` or `pnpm run deploy`. A previous CRA/React implementation was removed on 2026-11-14; it was never deployed, and it duplicated the content pipeline.

## Development Conventions

*   **Styling:** hand-written CSS in `prototype/styles.css`, responsive through four media queries (down to 520px). No CSS framework.
*   **Data management:** content lives in JSON and TSV, not in the markup. `app.js` fetches them at runtime, so a text change never requires touching layout code.
*   **No framework:** `app.js` renders by building DOM nodes directly. Keep it dependency-free — `build-prototype.mjs` uses only `node:fs` and `node:path`, and that is what keeps CI fast.
*   **Content sources are the contract.** `CONTENT_BASELINE.md` records which files are the source of truth and their SHA-256 hashes. Text changes require explicit approval; do not regenerate content files blindly.