# Deploying the Portfolio Website from a Google Sheet URL

This document outlines the process for updating the portfolio website with new project data from a Google Sheet. This allows for content updates without directly modifying the code in the repository.

## How it Works

A special GitHub Actions workflow named "Deploy Portfolio Website from URL" is set up to automate this process. It can be triggered manually from the GitHub repository's "Actions" tab.

The workflow fetches project data from a public Tab-Separated Values (TSV) file, rebuilds the website with this new data, and deploys the updated version to GitHub Pages.

## Steps to Update the Website

1.  **Modify the Google Sheet**:
    *   Open the master Google Sheet that contains your project data.
    *   Make any desired changes (add, remove, or edit projects).

2.  **Publish the Google Sheet to the Web**:
    *   In the Google Sheet, go to `File > Share > Publish to web`.
    *   In the dialog box:
        *   Under "Link", ensure the correct sheet (e.g., "projects") is selected.
        *   Under "Web page", select **"Tab-separated values (.tsv)"**.
    *   Click the **"Publish"** button.
    *   Copy the generated URL. This is the public URL for your TSV data.

3.  **Run the GitHub Actions Workflow**:
    *   Navigate to your GitHub repository: [https://github.com/KarelTestSpecial/portfolio](https://github.com/KarelTestSpecial/portfolio)
    *   Click on the **"Actions"** tab.
    *   In the left sidebar, click on the **"Deploy Portfolio Website from URL"** workflow.
    *   You will see a message saying "This workflow has a workflow_dispatch event trigger." Click the **"Run workflow"** button on the right.
    *   A dropdown menu will appear with an input field for "URL of the TSV file".

4.  **Provide the URL (Optional but Recommended)**:
    *   Paste the public TSV URL you copied from the Google Sheet into the input field.
    *   Click the green **"Run workflow"** button.

## Using the Default URL

The workflow has a fallback mechanism for convenience. If you run the workflow *without* providing a URL in the input field, it will automatically use a default URL stored in a file named `tsv-url` in the root of the repository.

### When to Update the Default URL

You should update the `tsv-url` file if the public URL of your Google Sheet changes permanently. You can do this by editing the file directly in the GitHub interface or by cloning the repository and pushing the change.
