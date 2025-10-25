# Personal Portfolio Website

This is a personal portfolio website built with React to showcase projects and professional information. The website is live and deployed via GitHub Pages.

**Live Site:** [https://kareltestspecial.github.io/portfolio/](https://kareltestspecial.github.io/portfolio/)

## How to Update the Website

The website content is managed through a local `projects.tsv` file. To update the site with the latest projects and deploy it, follow these steps.

### 1. Installation (Only needs to be done once)
Before you can run any commands, you need to install the project's dependencies.
```bash
pnpm install
```

### 2. Update Content
Project management is done by directly editing the `projects/projects.tsv` file.

1.  **Open the file `projects/projects.tsv`** in the root of this project.
2.  **Add a new row** for a new project, or **edit an existing row** to modify a project. Make sure to maintain the tab-separated structure.
3.  **Save the file.**

### 3. Update and Deploy
To publish your changes to the live website, run the following single command in your terminal:
```bash
pnpm run update-and-deploy
```
This command automatically performs two actions in sequence:
1.  **Updates Data**: It reads the latest project list from `projects/projects.tsv` and rebuilds the local `src/data/projects.json` file.
2.  **Deploys Website**: It then builds a production version of the website and deploys it to GitHub Pages.

It can take a few minutes for the changes to become visible on the live URL.

---

## Column Definitions

The **first row** of `projects.tsv` contains the column headers. The order and exact spelling are **very important**.

`type` | `name` | `description` | `link` | `githubLink` | `liveLink` | `status`
--- | --- | --- | --- | --- | --- | ---

### Explanation:

*   **type**: The type of project. Must be **exactly** one of the following three values:
    *   `chrome` (for a Chrome Extension)
    *   `github` (for a GitHub Project)
    *   `website` (for another website)
*   **name**: The name of your project (e.g., "My Cool App").
*   **description**: A short description of the project.
*   **link**: The main link for the project.
    *   For `chrome`, this is the link to the Chrome Web Store.
    *   For `website`, this is the link to the website.
    *   For `github`, this field is not required.
*   **githubLink**: **Only** for `github` projects. The link to the GitHub repository.
*   **liveLink**: **Only** for `github` projects. The link to a live demo of the project.
*   **status**: (Optional) Determines if the "Live Demo" button is shown. Set to `active` to show the button. Any other value (or an empty cell) hides the button.

---

## Advanced Scripts

The following scripts are also available for more specific tasks.

**`pnpm start`**

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it locally.

**`pnpm run update-projects`**

Only updates the project list from `projects.tsv` without deploying. Useful for checking the data locally before publishing.

**`pnpm run deploy`**

Only deploys the website with the current local data. Use this if you have already updated the project data and just want to re-deploy.

**`pnpm test`**

Launches the test runner.
