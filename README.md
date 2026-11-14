# Portfolio — site

The live site. Static, dependency-free: HTML, CSS and vanilla JS. It reads the content directly from the repository, so visible text only changes when explicitly approved.

## Run locally

From the repository root:

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173/prototype/
```

Use the NL/EN toggle in the header. The page defaults to the language stored in `localStorage` (`portfolio-lang`), or Dutch on a fresh browser.

## Content sources

- `src/data/cv.json` — Dutch CV
- `src/data/cv-eng.json` — English CV
- `projects/projects.tsv` — projects
- `src/i18n/nl.json` / `src/i18n/en.json` — interface labels

The content baseline and hashes are in `../CONTENT_BASELINE.md`.

## Notes

- No build step and no dependencies.
- This directory is what GitHub Pages serves: `deploy.yml` runs `build:prototype`, which copies `prototype/` into `dist/` and adds the JSON content.
- Dark mode is available from the header toggle and persists in `localStorage` (`portfolio-theme`).
- The hero uses a full-viewport-width editorial visual: the generated hero image with an overlaid agent/system diagram in CSS.
- Generated editorial visuals live in `assets/` and are served as optimized JPGs.
- The Athena showcase uses 800×600 screenshots of the live generated sites in `assets/athena/`. Recapture them with headless Chrome if a site changes.
- Project rows are fully clickable. The primary action is the first link on the right: website, Chrome Web Store extension page or GitHub repository.
- Responsive down to 520px through the media queries in `styles.css`.