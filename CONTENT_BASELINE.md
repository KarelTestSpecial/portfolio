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
c2354e4b3742eb686a11e2ef4913bfa13df26264e22ffaefd6caf2667e7dd2bc  src/data/cv.json
19ef0207ca89779d0969c04a6c30969eba8d228d0c1480e35a115b7ddb10b211  src/data/cv-eng.json
6d0e7c7faf717a41c07e13a4c5cccbb89d0f4331fe52f0ea4a361af0ce43dba3  projects/projects.tsv
77e5ce9d08d83acd7e71d424c4a987557e21802ec064f4b5876c124f0d90cd9f  src/i18n/en.json
3eea4a95d32dfa2c802a077171dcafdf6b6c910ed2f6ed95cc3f6241513dae91  src/i18n/nl.json
4f7715e0e5ee2285ff09af2925b690ec4ae82c1ddf22d950e89e313a85b638aa  CV/cv.md
```

## Content status

- The profile in `src/data/cv.json`, `src/data/cv-eng.json` and `CV/cv.md` was rewritten on 2026-11-14 with Karel's approval: the inactivity remark was removed and modern AI skills were added.
- The live site still serves the old profile until V2 is merged. That difference is intentional.
- Projects and the remaining CV fields still match the live site verbatim.
- The English CV is maintained as `src/data/cv-eng.json`; it is not a literal translation of `CV/cv.md` and must not be regenerated from it.