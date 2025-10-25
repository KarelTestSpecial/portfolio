# Personal Portfolio Website

This is a personal portfolio website built with React to showcase projects and professional information. The website is live and deployed via GitHub Pages.

**Live Site:** [https://kareltestspecial.github.io/portfolio/](https://kareltestspecial.github.io/portfolio/)

## Content Management

The website has two main types of content that can be updated: the **Project List** and the **CV**. Both are managed through files in the repository and have automated update processes.

### Updating the Project List

The website's project list is managed through the `projects/projects.tsv` file. The deployment process is automated.

#### Automated Deployment (Recommended)

The website is automatically updated and deployed whenever changes are made to the `projects/projects.tsv` file on the `main` branch. This is the recommended way to update the project list.

You can trigger the automation in two ways:
1.  **Edit the file locally**, commit the change, and push it to the `main` branch on GitHub.
2.  **Edit the `projects/projects.tsv` file directly on GitHub** using its web interface.

Once the changes are pushed or saved on GitHub, a GitHub Actions workflow will automatically run. It will:
1.  Rebuild the project data from `projects/projects.tsv`.
2.  Build the production version of the website.
3.  Deploy the new version to GitHub Pages.

It can take a few minutes for the changes to become visible on the live URL. You can monitor the progress of the deployment in the "Actions" tab of the GitHub repository.

### Updating the CV

The CV data displayed on the website is managed by the `CV/cv.md` Markdown file. This file is automatically converted to the `src/data/cv.json` file that the website uses.

This process is automated and runs whenever changes are made to `CV/cv.md` on the `main` branch. The workflow will:
1.  Run a script to convert the Markdown file to JSON.
2.  Commit and push the updated `src/data/cv.json` file back to the `main` branch.

As with the project list, you can update the `CV/cv.md` file either locally (and then push to `main`) or directly on the GitHub website.

After the `cv.json` file has been automatically updated, you will need to manually deploy the website to make the changes live.

### Publishing Manual Changes (e.g., CV Updates)

To publish changes that are not automatically deployed (like an update to your CV), you can manually trigger a deployment:

1.  Go to the **Actions** tab in your GitHub repository.
2.  In the left sidebar, click on the **"Deploy Portfolio Website"** workflow.
3.  Above the list of runs, you will see a message: *"This workflow has a `workflow_dispatch` event trigger."* Click the **"Run workflow"** button.
4.  A dropdown will appear. You can leave the branch as `main` and just click the green **"Run workflow"** button.

This will start a new deployment using the latest version of all files in your repository, including the updated `cv.json`.

### Manual Local Updates

If you want to test changes locally before deploying, you can still use the manual process.

#### 1. Installation (Only needs to be done once)
Before you can run any commands, you need to install the project's dependencies.
```bash
pnpm install
```

#### 2. Update Content
Project management is done by directly editing the `projects/projects.tsv` file.

1.  **Open the file `projects/projects.tsv`** in the root of this project.
2.  **Add a new row** for a new project, or **edit an existing row** to modify a project. Make sure to maintain the tab-separated structure.
3.  **Save the file.**

#### 3. Update and Deploy Manually
To publish your changes to the live website from your local machine, run the following single command in your terminal:
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

**`pnpm run update-cv`**

Only updates the `cv.json` data from `CV/cv.md` without committing the changes. Useful for checking the generated data locally.

**`pnpm run deploy`**

Only deploys the website with the current local data. Use this if you have already updated the project data and just want to re-deploy.

**`pnpm test`**

Launches the test runner.
