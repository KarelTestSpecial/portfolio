# Personal Portfolio Website

Static, dependency-free portfolio site. HTML, CSS and vanilla JS in `prototype/`, with content read straight from `src/data/`, `src/i18n/` and `projects/projects.tsv`. No build step in the browser sense — `scripts/build-prototype.mjs` only assembles `dist/` from those sources. Deployed on GitHub Pages by GitHub Actions.

**Live Site:** [https://kareltestspecial.github.io/portfolio/](https://kareltestspecial.github.io/portfolio/)

---

## Architecture in one paragraph

`prototype/` is the site: `index.html`, `styles.css`, `app.js` (vanilla, no framework) and `assets/`. Content lives in JSON and TSV outside it, so text changes never require touching layout code:

| Source | Role |
|---|---|
| `src/data/cv.json` | Dutch CV |
| `src/data/cv-eng.json` | English CV (maintained separately, not a literal translation) |
| `src/i18n/nl.json`, `src/i18n/en.json` | UI labels and accessibility texts |
| `projects/projects.tsv` | Projects (the Google Sheet is the real source of truth) |
| `CV/cv.md` | Dutch CV as Markdown; `cv.json` is generated from it |

`build:prototype` copies `prototype/` into `dist/`, adds the JSON content plus `projects.tsv`, and rewrites the `../src/...` paths in `app.js` to `./...`. That is the whole build.

---

## Deploying

Build and deploy run **only in GitHub Actions**. There is no local deploy path, and `node_modules/` is not installed locally — the repo is ~13 MB.

| Workflow | Trigger | What it does |
|---|---|---|
| `deploy.yml` | push to `main` (except `CV/**`) | `build:prototype` → `deploy:prototype` |
| `update-cv.yml` | push to `main` on `CV/**` | regenerate `cv.json` → commit → build → deploy |
| `deploy-from-url.yml` | manual dispatch | fetch TSV from the sheet → commit → build → deploy |

All three share the `gh-pages-deploy` concurrency group, so only one deploy runs at a time. Without that they overwrite each other on `gh-pages`, and the last one wins with whichever build finished last — not necessarily the newest content.

`update-cv.yml` deliberately deploys itself rather than letting `deploy.yml` pick it up. It commits `cv.json` with `GITHUB_TOKEN`, and a token commit does not trigger a new workflow — so if `deploy.yml` were the only deployer, a CV change would sit un-published. That is also why `deploy.yml` ignores `CV/**`: otherwise it would build with the old `cv.json` and publish stale content.

To publish: commit and push. To publish from the sheet side: the Apps Script menu item, or `pnpm run sheet:write` followed by `sheet:sync` and a push.

---

## Content management

### From the Google Sheet (easiest)

> **Kolommen in de sheet:** tabblad 1 heeft naast `type`, `name`, `githubLink`, `liveLink`, `status` en `description` (Nederlands) ook de kolommen **`description_en`** (Engelse beschrijving) en **`name_en`** (Engelse naam). Ontbreeft een van die twee of is een cel leeg, dan toont de site gewoon de Nederlandse tekst — de site breekt dus niet, maar de taalomschakeling levert dan geen Engels op.

#### Setup Instructions:

1.  **Generate a GitHub Personal Access Token (PAT):**
    *   Go to [GitHub Settings -> Developer settings -> Personal access tokens -> Tokens (classic)](https://github.com/settings/tokens).
    *   Click "Generate new token (classic)".
    *   Give it a name (e.g., "Portfolio Google Sheets Update").
    *   Select the **`repo`** and **`workflow`** scopes.
    *   Generate the token and **copy it** (you won't see it again).

2.  **Add the Script to your Google Sheet:**
    *   Open your Google Sheet where you manage the projects.
    *   Go to **Extensions -> Apps Script**.
    *   Copy the content of the [`scripts/apps-script.js`](scripts/apps-script.js) file from this repository and paste it into the script editor (replace any existing code).
    *   Save the script (click the floppy disk icon).

3.  **Add your GitHub Token to the Script Properties:**
    *   In the Apps Script editor, click on the **Project Settings** (gear icon) in the left sidebar.
    *   Scroll down to **Script Properties** and click **Edit script properties**.
    *   Click **Add script property**.
    *   Property name: `GITHUB_PAT`
    *   Value: (Paste your GitHub token here)
    *   Click **Save script properties**.

4.  **Refresh your Google Sheet:**
    *   Reload the Google Sheet in your browser.
    *   You should now see a new menu item called **"Portfolio"**.
    *   Click **"Portfolio" -> "🚀 Update Website"**.
    *   The first time you run it, you will need to grant permissions. Follow the prompts.

Once set up, whenever you change your project list in the Google Sheet, just click the button to trigger a fresh deployment!

### Updating the CV

`CV/cv.md` is the Dutch source. `update-cv.yml` converts it to `src/data/cv.json` and commits that back to `main`. English CV is `src/data/cv-eng.json`, maintained by hand — it is not a literal translation and must not be regenerated from `cv.md`.

### Testing a branch live

You can deploy from a feature branch without merging, by running the **Deploy Portfolio Website** workflow from the Actions tab and selecting that branch under "Use workflow from". Fine for a visual check; the branch is what gets published, so only do it with content you would accept going public.

---

## Column definitions

The **first row** of `projects.tsv` contains the column headers. The order and exact spelling are **very important**.

`type` | `name` | `githubLink` | `liveLink` | `status` | `description` | `description_en` | `name_en`
--- | --- | --- | --- | --- | --- | --- | ---

### Explanation:

*   **type**: The type of project. Must be **exactly** one of the following three values:
    *   `chrome` (for a Chrome Extension)
    *   `github` (for a GitHub Project)
    *   `website` (for another website)
*   **name**: The name of your project (e.g., "My Cool App"), in **Dutch**.
*   **githubLink**: The link to the GitHub repository.
*   **liveLink**: The main link for the project.
    *   For `chrome`, this is the link to the Chrome Web Store.
    *   For `website`, this is the link to the website.
    *   For `github`, this is an optional live demo.
*   **status**: (Optional) Determines if the "Live Demo" button is shown. Set to `active` to show the button. Any other value (or an empty cell) hides the button.
*   **description**: The **Dutch** description (this is the original column — it is *not* renamed, so older sheets keep working).
*   **description_en**: The **English** description.
*   **name_en**: The **English** project name.

`description` and `name` are the Dutch values; `description_en` and `name_en` are optional. If an English cell is empty, the site falls back to the Dutch text instead of showing a blank, so an incomplete sheet never breaks the page. Both descriptions and names follow the language toggle: `NL` shows the Dutch columns, `EN` the English ones. `sheet-sync.js` warns about projects that still lack either English column.

Accessibility texts (`aria-label`, image `alt`) live in `src/i18n/nl.json` / `en.json` under the `a11y.*` keys and are applied at runtime via `data-i18n-aria` / `data-i18n-alt`.

---

## Scripts

**`pnpm run build:prototype`** — assembles `dist/`. Pure Node built-ins, no `node_modules` needed. This is what CI runs before deploying.

**`pnpm run update-cv`** — regenerates `src/data/cv.json` from `CV/cv.md`. Pure Node built-ins. Idempotent: a second run produces no diff.

**`pnpm run update-projects-from-url`** — fetches a TSV over HTTPS and writes `projects/projects.tsv`. Needs `csv-parse`.

**`pnpm run deploy:prototype`** — `gh-pages -d dist`. Only meaningful in CI; locally there is no deploy path.

**`pnpm run sheet:sync`** / **`pnpm run sheet:write`** — see below.

There is no `start`, `build`, `test`, or `deploy` script, and no React toolchain. A previous CRA/React implementation was removed on 2026-11-14: it was never deployed, and the deployed site had already moved to `prototype/`.

## Agent instructions

`AGENTS.md` is the context file for coding agents (OpenCode, Claude Code). `GEMINI.md` is a symlink to it, because Antigravity reads that filename — one file, one name, no second copy. Edit `AGENTS.md`; never edit through the symlink.

---

## 🛠️ Maintainer: the sheet as source of truth

The project list lives in a Google Sheet, not in the repo. Two scripts talk to that sheet through a service account, so the list can be edited without clicking through the browser:

**`pnpm run sheet:sync`** — reads tab `Sheet1` and writes `projects/projects.tsv`. The header must match exactly, otherwise the script stops instead of writing a broken file. `--check` and `--dry-run` validate without writing.

**`pnpm run sheet:write`** — writes cell values (values only: no formatting, no `values.clear`, no sheet operations). Dry-run by default:

```bash
node scripts/sheet-write.js --range "Sheet1!H20" --set "The Free Reality"            # preview
node scripts/sheet-write.js --range "Sheet1!H20" --set "The Free Reality" --write    # apply
node scripts/sheet-write.js --range "Sheet1!G2:H21" --file /tmp/values.tsv --write   # block
```

Notes for maintainers:

- **A1 row ≠ data row.** Row 1 is the header, so data row *n* lives on sheet row *n+1*. The dry-run prints the project name next to every row for exactly that reason; after writing, every cell is read back and compared.
- Columns **A–F** (`type`, `name`, `githubLink`, `liveLink`, `status`, `description`) hold the Dutch source data and are refused unless `--force`.
- Auth is a service account (`~/.config/maccha/service-account.json`, override `GOOGLE_SA_PATH`) with edit rights on the sheet, and `googleapis` resolved from `~/INFRA`. Neither is part of the site build, so a fresh checkout without them simply cannot run these two scripts — the site itself does not need them.
- After editing the sheet, run `pnpm run sheet:sync`, commit `projects/projects.tsv`, and push: that is what triggers the live deploy.