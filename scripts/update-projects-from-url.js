const https = require('https');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const url = process.argv[2];
if (!url) {
  console.error('Error: Please provide a URL as a command-line argument.');
  process.exit(1);
}

const PROJECTS_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'projects.json');

https.get(url, (res) => {
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
      console.log(`Successfully updated ${PROJECTS_JSON_PATH} from ${url}`);
    } catch (err) {
      console.error('Error parsing TSV data:', err.message);
      process.exit(1);
    }
  });

}).on('error', (err) => {
  console.error('Error fetching data from URL:', err.message);
  process.exit(1);
});
