# Content Baseline — Portfolio V2

**Live site:** https://kareltestspecial.github.io/portfolio/
**Baseline date:** 2026-11-14
**Branch:** `feat/portfolio-redesign-v2`
**Rule:** The redesign may change layout, styling and components. Text changes require explicit approval. The files below are the content source of truth for V2. Do not rewrite them and do not regenerate them blindly.

## Content sources

| File | Role |
|---|---|
| `src/data/cv.json` | Dutch CV content for V2 |
| `src/data/cv-eng.json` | English CV content for V2 |
| `projects/projects.tsv` | Project names, descriptions and links |
| `src/i18n/nl.json` | Dutch UI labels |
| `src/i18n/en.json` | English UI labels |
| `CV/cv.md` | Dutch CV source document (visible Dutch text matches `cv.json`) |

## Baseline hashes (SHA-256)

```text
94cd10d1649889447b3f5b8c613ca8f02aba8e4a7ec8ca48a9195f704e6c2cdd  src/data/cv.json
76dd9dd5b1fbe36081512437e373c834fa4fa90e7cc384d24763e5ab18105dd3  src/data/cv-eng.json
819debeaeea6ae910ea931caec4d4a76296e969793af848a52d96f48f906c4df  projects/projects.tsv
5c8d69a03017e59d9c7f732d582d3596e9f6d9a233de3b45ac4c2d5c5b79ac93  src/i18n/en.json
032e02fdb04c21249eb70b109d77deaaa7548fd66658c3cdd9bb90b6e2bccd58  src/i18n/nl.json
0ef42c1dfa06c0e24ddedc131aecbcc1edbf4cd842af4901b54868b9c3a199d7  CV/cv.md
```

## Content status

- The profile in `src/data/cv.json`, `src/data/cv-eng.json` and `CV/cv.md` was rewritten on 2026-11-14 with Karel's approval: the inactivity remark was removed and modern AI skills were added.
- On 2026-11-14 (later, same day) Karel rewrote the AI sentence of the profile in all three files: "moderne ontwikkelingen rond AI-agents: context engineering, harness engineering en agentic architecture" (EN equivalent). "Generative engineering" and the separate "AI-architectuur" were dropped — "agentic architecture" covers the latter, and Karel explicitly wants to keep the sentence short so a tired reader keeps reading. The em-dash before "van retrieval" became a comma in both languages.
- The skills section was refreshed on 2026-11-14 with Karel's supplied list, with a few corrections: FastAPI is grouped under Python, `LibreOffice` is spelled correctly, and outdated/duplicated tool entries were removed.
- The live links for Vegan BioTech Report and Longevity Food Health were corrected to their lowercase GitHub Pages URLs on 2026-11-14; GitHub Pages paths are case-sensitive.
- The live site still serves the old profile and skills until V2 is merged. That difference is intentional.
- Projects still match the live site verbatim; the remaining CV fields are unchanged apart from the approved profile and skills updates.
- The English CV is maintained as `src/data/cv-eng.json`; it is not a literal translation of `CV/cv.md` and must not be regenerated from it.