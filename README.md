# Personal Portfolio Website

This is a personal portfolio website built with React to showcase projects and professional information. The website is live and deployed via GitHub Pages.

## How to Update the Website

The website content is managed through a local TSV file. To update the site with the latest projects, follow these steps.

### 1. Installation (Only needs to be done once)
Before you can run any commands, you need to install the project's dependencies.
```bash
npm install
```

### 2. Update Content
Make all your changes, additions, or removals to the projects in the `projects/projects.tsv` file.

### 3. Update and Deploy
To publish your changes to the live website, run the following single command in your terminal:
```bash
npm run update-and-deploy
```
This command automatically performs two actions in sequence:
1.  **Updates Data**: It reads the `projects/projects.tsv` file and rebuilds the local `src/data/projects.json` file.
2.  **Deploys Website**: It then builds a production version of the website and deploys it to GitHub Pages.

It can take a few minutes for the changes to become visible on the live URL.

---

## Advanced Scripts

The following scripts are also available for more specific tasks.

**`npm start`**

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it locally.

**`npm run update-projects`**

Only updates the project list from `projects/projects.tsv` without deploying. Useful for checking the data locally before publishing.

**`npm run deploy`**

Only deploys the website with the current local data. Use this if you have already updated the project data and just want to re-deploy.

**`npm test`**

Launches the test runner.
