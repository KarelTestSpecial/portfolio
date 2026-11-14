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
f184af19d2b8768bfee33a9d97607da31e7fc9d969c003108cd5cf1b09faf80d  src/data/cv.json
4f8fb919e7fddde6ab7ec73890e3231299e5d4562c79340cf21a517d4359f24e  src/data/cv-eng.json
0dac7a3b8890a9f179a631173e2b8981fa71c83b15cadedbf17f094724061d36  projects/projects.tsv
1011e7c6d5a64bb99548a37a0ae2afb28e9de6b9d361cbfe9f4df730822bcd3a  src/i18n/en.json
150a117642522498b122829af982a7ebcd401d47a60b3c351eaa63eb6a9ad0bc  src/i18n/nl.json
fa84dccabf4b220c925748fce5ce820578d4a006f39aa5c57085862ebd9d0943  CV/cv.md
```

## Content status

- The profile in `src/data/cv.json`, `src/data/cv-eng.json` and `CV/cv.md` was rewritten on 2026-11-14 with Karel's approval: the inactivity remark was removed and modern AI skills were added.
- The skills section was refreshed on 2026-11-14 with Karel's supplied list, with a few corrections: FastAPI is grouped under Python, `LibreOffice` is spelled correctly, and outdated/duplicated tool entries were removed.
- The live links for Vegan BioTech Report and Longevity Food Health were corrected to their lowercase GitHub Pages URLs on 2026-11-14; GitHub Pages paths are case-sensitive.
- The live site still serves the old profile and skills until V2 is merged. That difference is intentional.
- Projects still match the live site verbatim; the remaining CV fields are unchanged apart from the approved profile and skills updates.
- The English CV is maintained as `src/data/cv-eng.json`; it is not a literal translation of `CV/cv.md` and must not be regenerated from it.