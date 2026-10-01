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

*   **Styling:** The project uses Bootstrap for styling, as indicated by the `bootstrap` dependency in `package.json` and the use of Bootstrap classes in the components.
*   **Data Management:** Project data is managed in a structured TSV file (`projects/projects.tsv`), which is then processed into a JSON file for the application to consume. This separation of data and presentation is a key architectural feature.
*   **Component Structure:** The application is structured into reusable React components located in the `src/components` directory.
