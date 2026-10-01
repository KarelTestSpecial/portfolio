## Project Overview

This is a personal portfolio website built with React and TypeScript. It showcases projects and professional information. The website is designed to be easily updatable by editing a local TSV file. The site is deployed via GitHub Pages.

The project data is stored in `projects/projects.tsv`. A Node.js script (`scripts/update-projects.js`) reads this file, categorizes the projects, and generates a JSON file at `src/data/projects.json`. The React components then use this JSON file to dynamically render the project listings on the website.

## Building and Running

### Installation

To install the project's dependencies, run:

```bash
pnpm install
```

### Development

To run the app in development mode, use:

```bash
pnpm start
```

This will open the website at [http://localhost:3000](http://localhost:3000).

### Updating Content

To update the projects displayed on the website:

1.  Edit the `projects/projects.tsv` file.
2.  Run the following command to update the local data:

    ```bash
    pnpm run update-projects
    ```

### Deployment

To deploy the website to GitHub Pages, run:

```bash
pnpm run deploy
```

To update the content and deploy in one step, use:

```bash
pnpm run update-and-deploy
```

### Testing

To run the tests, use:

```bash
pnpm test
```

## Development Conventions

*   **Styling:** Bootstrap 5 provides the layout grid and a few utilities (`bootstrap.min.css` is imported in
    `src/index.tsx`), while all visual design lives in `src/App.css`. That stylesheet is built on design tokens
    declared on `:root` (`--brand-*`, `--accent-*`, `--ink-*`, `--radius-*`, `--shadow-*`, `--grad-brand`);
    prefer reusing/extending those tokens and existing component classes (`section[id]`, `.project-card`,
    `.showcase-card`, `.info-card`, `.panel`, `.chip`, `.timeline`, `.badge-soft`, `.btn-brand`,
    `.btn-outline-ink`, `.btn-github`, `.btn-glass`) over adding inline `style={{}}` or new one-off rules.
*   **Icons:** Inline stroke SVGs are defined in `src/components/Icons.tsx`. Add new icons there instead of
    pulling in an icon package.
*   **Header controls:** sizing and vertical alignment of the top bar rely on shared tokens
    (`--nav-control-h: 40px`, `--nav-font`, `--nav-font-sm`, `--nav-font-brand`, `--nav-gap`). Brand mark,
    navigation links, hamburger, language switcher and theme toggle all declare `height: var(--nav-control-h)`
    (the mobile menu uses `height: auto; min-height: var(--nav-control-h)`), which is what keeps them on one
    line. Never hard-code a height or font size for a header control.
*   **Theming:** `src/theme/ThemeContext.tsx` (provider, `useTheme()`) applies light/dark to `<html>` via
    `data-theme`, `data-bs-theme` and `color-scheme`, persists the choice and follows the system preference
    until the visitor chooses. `applyStoredTheme()` runs in `src/index.tsx` before the first paint. Dark mode is
    only a second set of tokens in `:root[data-theme='dark']`, so new colours must be added to **both** token
    blocks (plus a rule in the dark section at the end of `App.css` when the element is not a plain surface).
*   **Motion:** Elements marked with `data-reveal` (optionally `data-reveal-delay="1".."3"`) fade/slide in via
    `src/hooks/useScrollReveal.ts`, called once in `src/App.tsx`. Two rules keep this safe, and both matter:
    the hidden state only applies while `<html>` carries `reveal-ready` (set in `src/index.tsx`, so content is
    visible whenever JS does not run), and the revealed state is stored in the **`data-reveal-state`
    attribute** — never in a CSS class, because React rewrites `class` on re-render and would silently drop it
    (that bug once blanked the entire CV section). The hook also re-scans the DOM through a MutationObserver,
    so elements mounted later (hot reload, new data) are picked up.
*   **Equal-height cards:** Bootstrap columns are flex items that stretch, so a short column inherits the
    height of the tallest one. Fill a card with the `d-flex flex-column` + `flex-fill` pattern on the column
    instead of `height: 100%` on the card: inside a stretched column `height: 100%` resolves against the whole
    row and leaves very large empty blocks (this previously stretched the education card and the work
    experience column). Keep tall content — such as the skills list — out of a two-column row, or lay it out
    with `.skills-columns` (CSS multi-column, balanced).
*   **Internationalisation:** All user-facing copy goes through `useLanguage()` / `t('key')`. Every new key must
    be added to **both** `src/i18n/nl.json` and `src/i18n/en.json`, otherwise the raw key is rendered.
*   **Data:** Skills, project counts and showcase entries have single sources of truth —
    `projects/projects.tsv` (project list; a published Google Sheet can be used instead, see
    `scripts/update-projects-from-url.js`) and `src/data/showcase.ts`. Both scripts share
    `scripts/lib/projects.js`, so the generated `src/data/projects.json` always has the same shape. The hero
    statistics are derived from that data, so numbers never drift out of sync.
*   **Bilingual project descriptions:** each project carries a Dutch `description` and an optional English
    `descriptionEn`. `Projects.tsx` picks the one matching the active language and falls back to Dutch when the
    English text is missing, so translations can be added incrementally.
*   **Data Management:** Project data is managed in a structured TSV file (`projects/projects.tsv`), which is then processed into a JSON file for the application to consume. This separation of data and presentation is a key architectural feature.
*   **Component Structure:** The application is structured into reusable React components located in the `src/components` directory.
