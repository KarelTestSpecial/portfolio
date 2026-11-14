# Content Baseline — Portfolio V2

**Live site:** https://kareltestspecial.github.io/portfolio/
**Baseline date:** 2026-11-14
**Branch:** `feat/portfolio-redesign-v2`
**Rule:** The redesign may change layout, styling and components, but **not** the visible text. The files below are the content source of truth for V2. Do not rewrite them and do not regenerate them blindly.

## Content sources

| File | Role |
|---|---|
| `src/data/cv.json` | Dutch CV content used by the live site |
| `src/data/cv-eng.json` | English CV content used by the live site |
| `projects/projects.tsv` | Project names, descriptions and links |
| `src/i18n/nl.json` | Dutch UI labels |
| `src/i18n/en.json` | English UI labels |
| `CV/cv.md` | Dutch CV source document (visible Dutch text matches `cv.json`) |

## Baseline hashes (SHA-256)

```text
d8a37a6c513b4d989ce7ab2a8779dc289d416823c83b799bd018f37ba9bc6554  src/data/cv.json
c3424c960ac7c275fc3b6295f69633b33cae4f96c8e18ccf30b39d09b41e0b76  src/data/cv-eng.json
6d0e7c7faf717a41c07e13a4c5cccbb89d0f4331fe52f0ea4a361af0ce43dba3  projects/projects.tsv
77e5ce9d08d83acd7e71d424c4a987557e21802ec064f4b5876c124f0d90cd9f  src/i18n/en.json
3eea4a95d32dfa2c802a077171dcafdf6b6c910ed2f6ed95cc3f6241513dae91  src/i18n/nl.json
9d5e8e8ec43964ea4494e4a285acc8a5f998ba2d97f56749a85c69d77bf0e016  CV/cv.md
```

## Verified against the live page on 2026-11-14

- English CV: all visible fields from `src/data/cv-eng.json` are present verbatim on the live page (0 mismatches).
- Dutch CV: `src/data/cv.json` matches the visible Dutch CV text; `CV/cv.md` matches the visible Dutch text after Markdown cleanup.
- Projects: all 24 project names and descriptions from `projects/projects.tsv` are present verbatim on the live page (0 mismatches).

## Known trap

`scripts/update-cv.js` currently regenerates `src/data/cv.json` with the contact address filled with raw Markdown link syntax. That value is not rendered by the current About component, but it is a data regression. Do not run `update-cv.js` in V2 without fixing the parser first.

`CV/cv-eng.md` does not exist on `main`. The English CV is maintained as `src/data/cv-eng.json`; it is not a literal translation of `CV/cv.md` and must not be regenerated from it.