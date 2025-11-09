const https = require('https');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Take the last argument as the URL to be robust against extra params from pnpm/shell.
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Error: Please provide a URL as a command-line argument.');
  process.exit(1);
}
const initialUrl = args[args.length - 1];

const PROJECTS_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'projects.json');

const fetchData = (url, redirectCount = 0) => {
  if (redirectCount > 10) {
    console.error('Error: Too many redirects.');
    process.exit(1);
  }

  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      // Handle redirect
      console.log(`Redirecting to ${res.headers.location}`);
      fetchData(res.headers.location, redirectCount + 1);
      return; // Stop processing the current response
    }

    if (res.statusCode !== 200) {
      console.error(`Error: Failed to get '${url}' (${res.statusCode})`);
      process.exit(1);
    }

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const records = parse(data, {
          delimiter: '\t',
          columns: true,
          skip_empty_lines: true
        });

        const projectsData = {
          chromeExtensions: records.filter(p => p.type === 'chromeExtension'),
          githubProjects: records.filter(p => p.type === 'githubProject'),
          websites: records.filter(p => p.type === 'website'),
        };

        fs.writeFileSync(PROJECTS_JSON_PATH, JSON.stringify(projectsData, null, 2));
        console.log(`Successfully updated ${PROJECTS_JSON_PATH} from ${initialUrl}`);
      } catch (err) {
        console.error('Error parsing TSV data:', err.message);
        // Log a snippet of the received data to help debug content issues (e.g., HTML instead of TSV)
        console.error('Received data snippet:', data.substring(0, 200));
        process.exit(1);
      }
    });

  }).on('error', (err) => {
    console.error('Error fetching data from URL:', err.message);
    process.exit(1);
  });
};

fetchData(initialUrl);
