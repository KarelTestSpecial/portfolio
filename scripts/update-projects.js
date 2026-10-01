const {
  TSV_PATH,
  JSON_PATH,
  parseTsv,
  categorizeProjects,
  readTsv,
  countProjects,
  writeProjectsJson,
} = require('./lib/projects');

try {
  const projects = parseTsv(readTsv(TSV_PATH));
  const categorized = categorizeProjects(projects);
  const total = countProjects(categorized);

  const translated = [
    ...categorized.chromeExtensions,
    ...categorized.githubProjects,
    ...categorized.websites,
  ].filter((project) => project.descriptionEn).length;

  writeProjectsJson(categorized);
  console.log(`Successfully updated projects.json with ${total} projects.`);
  console.log(`English descriptions: ${translated}/${total}.`);
} catch (e) {
  console.error('Error processing data:', e.message);
  process.exitCode = 1;
}
