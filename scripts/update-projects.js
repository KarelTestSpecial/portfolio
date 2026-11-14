const fs = require('fs');
const path = require('path');

// Kolommen in projects.tsv (SPC: de Google Sheet is de bron, zie README):
//   type, name, githubLink, liveLink, status, description (= NL), description_en (= EN), name_en (= EN)
// `description` en `name` blijven de Nederlandse waarden (bestaande kolommen, niet hernoemd);
// `*_en` is optioneel: ontbreekt ze, dan valt de site terug op het Nederlands.

const inputPath = path.join(__dirname, '..', 'projects', 'projects.tsv');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'projects.json');

try {
    const tsvData = fs.readFileSync(inputPath, 'utf8');
    const projects = parseTsv(tsvData);
    const categorizedProjects = categorizeProjects(projects);
    fs.writeFileSync(outputPath, JSON.stringify(categorizedProjects, null, 2));
    console.log(`Successfully updated projects.json with ${projects.length} projects.`);
    const zonderEngels = projects.filter(p => !p.description_en || !p.name_en).map(p => p.name);
    if (zonderEngels.length) {
        console.warn(`⚠️  ${zonderEngels.length} project(en) zonder description_en of name_en: ${zonderEngels.join(' · ')}`);
    }
} catch (e) {
    console.error('Error processing data:', e.message);
}

function parseTsv(tsvData) {
    if (tsvData.charCodeAt(0) === 0xFEFF) {
        tsvData = tsvData.slice(1);
    }

    const rows = tsvData.trim().split(/\r?\n/);
    const headers = rows.shift().split('\t').map(h => h.trim());

    return rows.map(row => {
        const values = row.split('\t');
        const project = {};
        headers.forEach((header, i) => {
            project[header] = values[i] ? values[i].trim() : '';
        });
        return project;
    }).filter(p => p && p.name);
}

function categorizeProjects(projects) {
    const categorized = {
        chromeExtensions: [],
        githubProjects: [],
        websites: []
    };

    projects.forEach(p => {
        const project = {
            name: p.name,
            nameEn: p.name_en || '',
            description: p.description,
            descriptionEn: p.description_en || '',
            githubLink: p.githubLink,
            liveLink: p.liveLink,
            status: p.status
        };

        const typeLower = p.type.toLowerCase();
        if (typeLower === 'chrome') {
            categorized.chromeExtensions.push(project);
        } else if (typeLower === 'website') {
            categorized.websites.push(project);
        } else if (typeLower === 'github') {
            categorized.githubProjects.push(project);
        }
    });

    return categorized;
}
