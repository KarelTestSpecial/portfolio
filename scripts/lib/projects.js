/**
 * Shared project-data helpers.
 *
 * Both `update-projects.js` (local `projects/projects.tsv`) and
 * `update-projects-from-url.js` (a published Google Sheet URL) use these, so the
 * generated `src/data/projects.json` always has the same shape.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const TSV_PATH = path.join(ROOT, 'projects', 'projects.tsv');
const JSON_PATH = path.join(ROOT, 'src', 'data', 'projects.json');

/** Splits TSV text into header-keyed row objects. */
function parseTsv(tsvData) {
  if (tsvData.charCodeAt(0) === 0xfeff) {
    tsvData = tsvData.slice(1); // strip BOM
  }

  const rows = tsvData.trim().split(/\r?\n/);
  if (rows.length === 0) return [];

  const headers = rows.shift().split('\t').map((h) => h.trim());

  return rows
    .map((row) => {
      const values = row.split('\t');
      const project = {};
      headers.forEach((header, i) => {
        project[header] = values[i] ? values[i].trim() : '';
      });
      return project;
    })
    .filter((p) => p && p.name);
}

/**
 * Maps a raw TSV/Sheet row onto the shape the site consumes.
 * `descriptionEn` is optional: when it is missing or empty the site falls back
 * to the Dutch `description`, so existing sheets keep working unchanged.
 */
function toProject(row) {
  const project = {
    name: (row.name || '').trim(),
    description: (row.description || '').trim(),
  };

  const descriptionEn = (row.descriptionEn || '').trim();
  if (descriptionEn) {
    project.descriptionEn = descriptionEn;
  }

  project.githubLink = (row.githubLink || '').trim();
  project.liveLink = (row.liveLink || '').trim();
  project.status = (row.status || '').trim();

  return project;
}

/** Groups projects into the three sections used by the website. */
function categorizeProjects(rows) {
  const categorized = {
    chromeExtensions: [],
    githubProjects: [],
    websites: [],
  };

  rows.forEach((row) => {
    const type = (row.type || '').trim().toLowerCase();
    const project = toProject(row);

    if (type === 'chrome') categorized.chromeExtensions.push(project);
    else if (type === 'website') categorized.websites.push(project);
    else if (type === 'github') categorized.githubProjects.push(project);
  });

  return categorized;
}

function readTsv(file = TSV_PATH) {
  return fs.readFileSync(file, 'utf8');
}

function countProjects(categorized) {
  return (
    categorized.chromeExtensions.length +
    categorized.githubProjects.length +
    categorized.websites.length
  );
}

function writeProjectsJson(categorized, file = JSON_PATH) {
  fs.writeFileSync(file, JSON.stringify(categorized, null, 2));
  return file;
}

module.exports = {
  TSV_PATH,
  JSON_PATH,
  parseTsv,
  toProject,
  categorizeProjects,
  readTsv,
  countProjects,
  writeProjectsJson,
};
