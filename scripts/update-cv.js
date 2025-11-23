const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'CV', 'cv.md');
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'cv.json');

// Helper function to extract a section from the markdown
function getSection(text, startHeading) {
    const start = text.indexOf(startHeading);
    if (start === -1) return '';
    const nextHeadingIndex = text.indexOf('\n###', start + startHeading.length);
    const nextRuleIndex = text.indexOf('\n---', start + startHeading.length);
    let end = text.length;
    if (nextHeadingIndex !== -1 && nextRuleIndex !== -1) {
        end = Math.min(nextHeadingIndex, nextRuleIndex);
    } else if (nextHeadingIndex !== -1) {
        end = nextHeadingIndex;
    } else if (nextRuleIndex !== -1) {
        end = nextRuleIndex;
    }
    return text.substring(start + startHeading.length, end).trim();
}

// Helper to clean up markdown formatting from a line
const cleanLine = (line) => {
    if (!line) return "";
    return line
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Convert [text](url) to text
        .replace(/\*\*(.*?)\*\*/g, '$1')    // remove bold
        .replace(/[#*_>]/g, '')            // remove markdown characters #, *, _, >
        .replace(/\s\s+/g, ' ')            // collapse multiple spaces
        .trim();
};

// Main parsing function
function parseCvMarkdown(md) {
    const cv = {};

    // --- Contact Info ---
    const contactSection = md.split('---')[1].trim();
    const contactLines = contactSection.split('\n').filter(line => line.trim() !== '');
    cv.name = cleanLine(contactLines[0]);
    const detailsLine = contactLines[1];
    const addressMatch = detailsLine.match(/^([^|]+)/);
    const emailMatch = detailsLine.match(/\[(.*?@.*?)\]/);
    const linkedinMatch = detailsLine.match(/\[(linkedin.com.*?)\]/);
    const githubMatch = detailsLine.match(/\[(github.com.*?)\]/);
    cv.contact = {
        address: addressMatch ? addressMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : '',
        linkedin: linkedinMatch ? linkedinMatch[1].trim() : '',
        github: githubMatch ? githubMatch[1].trim() : '',
    };

    // --- Profile & Notice ---
    const profileSection = getSection(md, '### **Profiel**');
    const profileParts = profileSection.split('Komt in aanmerking');
    cv.profile = cleanLine(profileParts[0]);
    cv.notice = profileParts[1] ? cleanLine('Komt in aanmerking' + profileParts[1]) : '';

    // --- Recent Projects ---
    const projectsSection = getSection(md, '### **Recente Projecten**');
    const projectLines = projectsSection.split('\n').filter(line => line.trim());
    cv.recentProjects = {
        introduction: cleanLine(projectLines.shift().replace('portfolio website bezoeken:', 'portfolio website bezoeken:')),
        chromeExtensions: [],
        webApplications: [],
    };
    let currentCategory = null;
    projectLines.forEach(line => {
        if (cleanLine(line).includes('Chrome Web Store Extensies')) {
            currentCategory = 'chromeExtensions';
        } else if (cleanLine(line).includes('Webapplicaties & GitHub Repositories')) {
            currentCategory = 'webApplications';
        } else if (currentCategory && line.startsWith('*')) {
            const description = cleanLine(line.split(':').slice(1).join(':'));
            const title = cleanLine(line.split(':')[0]);
            cv.recentProjects[currentCategory].push(`${title}: ${description}`);
        }
    });

    // --- Work Experience ---
    const expSection = getSection(md, '### **Werkervaring**');
    cv.workExperience = [];
    const expEntries = expSection.split(/\n\n(?=\*\*|Andere Functies)/);
    expEntries.forEach(entry => {
        const lines = entry.trim().split('\n');
        const titleLine = lines.shift().trim();
        if (titleLine.includes('|')) {
            const [role, company, period] = titleLine.split('|').map(cleanLine);
            const description = lines.map(l => cleanLine(l)).join(' ');
            cv.workExperience.push({ role, company, period, description });
        } else if (cleanLine(titleLine) === 'Andere Functies') {
            lines.forEach(line => {
                const cleanedLine = cleanLine(line);
                if (cleanedLine.includes('Diverse rollen')) {
                    const periodMatch = cleanedLine.match(/(\d{2}\/\d{4}\s*–\s*\d{2}\/\d{4})/);
                    cv.workExperience.push({
                        role: "Diverse rollen (o.a. Koerier, Uitzendkracht, Keukenhulp, Tele-enquêteur)",
                        company: "Verschillende werkgevers (o.a. Randstad, Restaura)",
                        period: periodMatch ? periodMatch[0] : "",
                        description: "Deze diverse rollen tonen een sterke werkethiek en aanpassingsvermogen."
                    });
                } else if (cleanedLine.includes('Fabrieksarbeider')) {
                    const periodMatch = cleanedLine.match(/(\d{4}\s*\\?-\s*\d{4})/);
                    cv.workExperience.push({
                        role: "Andere Functies",
                        company: "Fabrieksarbeider (Pasec), Keukenhulp (Paviljoen C), Klerenhersteller (De Haven), Kok (FPC)",
                        period: periodMatch ? periodMatch[0].replace('\\', '') : "",
                        description: ""
                    });
                }
            });
        }
    });

    // --- Skills ---
    const skillsSection = getSection(md, '### **Vaardigheden**');
    cv.skills = {};
    const skillLines = skillsSection.split('\n').filter(line => line.includes(':'));
    skillLines.forEach(line => {
        const parts = line.split(':');
        const key = cleanLine(parts[0]).toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
        const values = cleanLine(parts.slice(1).join(':'));
        cv.skills[key] = values;
    });

    // --- Education ---
    const eduSection = getSection(md, '### **Opleidingen en Cursussen**');
    cv.education = [];
    const eduLines = eduSection.split('\n').filter(line => line.trim());
    eduLines.forEach(line => {
        const parts = cleanLine(line).split('|').map(s => s.trim());
        if (parts.length === 3) {
            cv.education.push({ degree: parts[0], institution: parts[1], year: parts[2] });
        } else if (parts.length === 2) {
            cv.education.push({ degree: parts[0], institution: "", year: parts[1] });
        } else if (parts.length === 1) {
            cv.education.push({ degree: parts[0], institution: "", year: "" });
        }
    });

    // --- Languages & Transport ---
    const langSection = getSection(md, '### **Talen & Vervoer**');
    cv.languages = [];
    const langLines = langSection.split('\n').filter(line => line.trim());
    langLines.forEach(line => {
        if (line.includes('Rijbewijs')) {
            const parts = line.split(':');
            cv.transport = parts.length > 1 ? cleanLine(parts[1]) : '';
        } else if (line.includes(':')) {
            const parts = line.split(':');
            const language = cleanLine(parts[0]);
            const proficiency = parts.length > 1 ? cleanLine(parts[1]) : '';
            cv.languages.push({ language, proficiency });
        }
    });

    return cv;
}

try {
    console.log('Reading CV.md...');
    const markdownContent = fs.readFileSync(mdPath, 'utf8');
    console.log('Parsing markdown and converting to JSON...');
    const cvData = parseCvMarkdown(markdownContent);
    console.log(`Writing to ${jsonPath}...`);
    fs.writeFileSync(jsonPath, JSON.stringify(cvData, null, 2));
    console.log('Successfully updated cv.json!');
} catch (error) {
    console.error('Failed to update cv.json:', error);
    process.exit(1);
}