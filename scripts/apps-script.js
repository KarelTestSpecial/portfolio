/**
 * Google Apps Script for triggering GitHub Actions workflow.
 * 
 * Instructions:
 * 1. In your Google Sheet, go to Extensions -> Apps Script.
 * 2. Delete any existing code and paste this code.
 * 3. Go to Project Settings (gear icon).
 * 4. Scroll down to "Script Properties" and click "Edit script properties".
 * 5. Add a property named "GITHUB_PAT" and paste your GitHub Personal Access Token.
 * 6. Save properties.
 * 7. Refresh your Google Sheet.
 */

const CONFIG = {
  GITHUB_OWNER: 'KarelTestSpecial',
  GITHUB_REPO: 'portfolio',
  WORKFLOW_ID: 'deploy-from-url.yml',
  BRANCH: 'main'
};

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Portfolio')
      .addItem('🚀 Update Website', 'triggerWorkflow')
      .addToUi();
}

function triggerWorkflow() {
  const props = PropertiesService.getScriptProperties();
  const pat = props.getProperty('GITHUB_PAT');
  
  if (!pat) {
    SpreadsheetApp.getUi().alert('Error: GITHUB_PAT not found in Script Properties. Please check the instructions in the script.');
    return;
  }
  
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/actions/workflows/${CONFIG.WORKFLOW_ID}/dispatches`;
  
  const payload = {
    ref: CONFIG.BRANCH
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    
    if (code === 204) {
      SpreadsheetApp.getUi().alert('✅ Successfully triggered website update! Check GitHub Actions for progress.');
    } else {
      const errorMsg = response.getContentText();
      SpreadsheetApp.getUi().alert(`❌ Failed to trigger update (Status: ${code}).\n\nError: ${errorMsg}`);
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert(`❌ Error: ${e.toString()}`);
  }
}
