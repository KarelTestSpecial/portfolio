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
*   **Motion:** Elements marked with `data-reveal` (optionally `data-reveal-delay="1".."3"`) fade/slide in via
    `src/hooks/useScrollReveal.ts`, which is called once in `src/App.tsx` and respects
    `prefers-reduced-motion`. Heavy animation should keep this pattern.
*   **Internationalisation:** All user-facing copy goes through `useLanguage()` / `t('key')`. Every new key must
    be added to **both** `src/i18n/nl.json` and `src/i18n/en.json`, otherwise the raw key is rendered.
*   **Data:** Skills, project counts and showcase entries have single sources of truth —
    `src/data/projects.json` (generated from `projects/projects.tsv`) and `src/data/showcase.ts`. The hero
    statistics are derived from those, so numbers never drift out of sync.
*   **Data Management:** Project data is managed in a structured TSV file (`projects/projects.tsv`), which is then processed into a JSON file for the application to consume. This separation of data and presentation is a key architectural feature.
*   **Component Structure:** The application is structured into reusable React components located in the `src/components` directory.
