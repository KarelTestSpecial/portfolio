# Portfolio V2 — Prototype

Static, dependency-free design prototype. It reads the existing content directly from the repository, so visible text only changes when explicitly approved.

## Run locally

From the repository root:

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173/prototype/
```

Use the NL/EN toggle in the header. The prototype defaults to the language stored in `localStorage` (`portfolio-lang`), or Dutch on a fresh browser.

## Content sources

- `src/data/cv.json` — Dutch CV
- `src/data/cv-eng.json` — English CV
- `projects/projects.tsv` — projects
- `src/i18n/nl.json` / `src/i18n/en.json` — interface labels

The content baseline and hashes are in `../CONTENT_BASELINE.md`.

## Notes

- No build step and no dependencies.
- The prototype is not deployed to GitHub Pages. The live site remains unchanged.
- The current `main` app is still the React/CRA implementation; this prototype is the visual direction for V2.
- Dark mode is available from the header toggle and persists in `localStorage` (`portfolio-theme`).
- The hero uses a full-viewport-width editorial visual: the generated hero image with an overlaid agent/system diagram in CSS.
- Generated editorial visuals live in `assets/` and are served as optimized JPGs.
- The Athena showcase uses 800×600 screenshots of the live generated sites in `assets/athena/`. Recapture them with headless Chrome if a site changes.
- Project rows are fully clickable. The primary action is the first link on the right: website, Chrome Web Store extension page or GitHub repository.