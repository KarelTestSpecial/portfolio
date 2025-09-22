const fs = require('fs');
const path = require('path');

const tsvPath = path.join(__dirname, '..', 'projects', 'projects.tsv');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'projects.json');

try {
    const rawData = fs.readFileSync(tsvPath, 'utf8');
    const projects = parseTsv(rawData);
    const categorizedProjects = categorizeProjects(projects);
    fs.writeFileSync(outputPath, JSON.stringify(categorizedProjects, null, 2));
    console.log(`Successfully updated projects.json with ${projects.length} projects.`);
} catch (e) {
    console.error('Error processing data:', e.message);
    if (e.code === 'ENOENT') {
        console.error(`Error: The file was not found at ${tsvPath}`);
        console.error("Please make sure the file 'projects.tsv' exists in the 'projects' directory.");
    }
}

function parseTsv(tsvData) {
  if (tsvData.charCodeAt(0) === 0xFEFF) {
    tsvData = tsvData.slice(1);
  }

  const rows = tsvData.trim().split(/\r?\n/);
  const headers = rows.shift().split('\t').map(h => h.trim());

  const nameIndex = headers.indexOf('Product/Project Naam');
  const typeIndex = headers.indexOf('Type Product');
  const sourceIndex = headers.indexOf('Source Code Locatie');
  const liveUrlIndex = headers.indexOf('Live URL');
  const liveStatusIndex = headers.indexOf('Live');
  const useCaseIndex = headers.indexOf('Use-Case');

  if (nameIndex === -1 || typeIndex === -1 || liveStatusIndex === -1) {
      throw new Error('Required headers "Product/Project Naam", "Type Product", or "Live" not found.');
  }

  return rows.map(row => {
    const values = row.split('\t').map(v => v.trim());
    const fullValues = [...values, ...Array(headers.length - values.length).fill('')];

    return {
      name: fullValues[nameIndex],
      type: fullValues[typeIndex] || 'Project',
      githubLink: fullValues[sourceIndex],
      liveLink: fullValues[liveStatusIndex].toUpperCase() === 'TRUE' ? fullValues[liveUrlIndex] : '',
      description: fullValues[useCaseIndex] || `A project by ${fullValues[headers.indexOf('GitHub Account')] || 'Karel'}.`
    };
  }).filter(p => p && p.name);
}

function categorizeProjects(projects) {
  const categorized = {
    chromeExtensions: [],
    githubProjects: [],
    websites: []
  };

  projects.forEach(p => {
    const project = { ...p };
    delete project.type;

    const typeLower = p.type.toLowerCase();
    if (typeLower.includes('chrome extension')) {
      categorized.chromeExtensions.push(project);
    } else if (typeLower.includes('website') || typeLower.includes('webapp')) {
      categorized.websites.push(project);
    } else {
      categorized.githubProjects.push(project);
    }
  });

  return categorized;
}
