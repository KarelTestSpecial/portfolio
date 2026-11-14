const state = {
  lang: localStorage.getItem("portfolio-lang") || "nl",
  theme: localStorage.getItem("portfolio-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  translations: { nl: null, en: null },
  cv: { nl: null, en: null },
  projects: [],
  filter: "all",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const esc = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const t = (key) => state.translations[state.lang]?.[key] || key;

function parseTsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim() !== "");
  if (!lines.length) return [];
  const headers = lines[0].split("\t").map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(headers.map((header, index) => [header, (cells[index] || "").trim()]));
  });
}

function typeLabel(type) {
  return { website: "Website", chrome: "Chrome", github: "GitHub" }[type] || type;
}

// Projectbeschrijving per taal: `description` = Nederlands, `description_en` = Engels.
// Ontbreekt de Engelse kolom (of is ze leeg), dan blijft de Nederlandse tekst staan.
function projectDescription(project) {
  const english = (project.description_en || "").trim();
  return state.lang === "en" && english ? english : project.description;
}

function projectLinks(project) {
  const links = [];
  const live = project.liveLink;
  const github = project.githubLink;
  const active = project.status === "active";

  if (project.type === "chrome") {
    if (live && active) links.push({ href: live, label: t("projects.viewExtension") });
    if (github) links.push({ href: github, label: t("projects.github") });
  } else if (project.type === "github") {
    if (github) links.push({ href: github, label: t("projects.github") });
    if (live && active) links.push({ href: live, label: t("projects.liveDemo") });
  } else if (project.type === "website") {
    if (live && active) links.push({ href: live, label: t("projects.visitWebsite") });
    if (github) links.push({ href: github, label: t("projects.github") });
  }

  return links;
}

function renderLanguage() {
  document.documentElement.lang = state.lang;
  $$("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $$("[data-lang-label]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.langLabel === state.lang);
  });
  $("#footer-copy").textContent = t("footer.copyright");
  document.title = state.lang === "nl" ? "Karel Decherf — Portfolio" : "Karel Decherf — Portfolio";
}

function renderProjectFilters() {
  const counts = state.projects.reduce(
    (acc, project) => {
      acc[project.type] = (acc[project.type] || 0) + 1;
      return acc;
    },
    { website: 0, chrome: 0, github: 0 }
  );

  $$(".filter").forEach((button) => {
    const filter = button.dataset.filter;
    const count = filter === "all" ? state.projects.length : counts[filter] || 0;
    const countNode = $("span", button);
    if (countNode) countNode.textContent = String(count).padStart(2, "0");
    button.classList.toggle("is-active", filter === state.filter);
  });

  const projectCount = state.lang === "nl"
    ? `${state.projects.length} projecten`
    : `${state.projects.length} projects`;
  $("#project-count").textContent = projectCount;

  const capabilityLabels = {
    website: t("projects.websites"),
    chrome: t("projects.chromeExtensions"),
    github: t("projects.githubProjects"),
  };

  $$(".capability-card").forEach((card) => {
    const filter = card.dataset.filter;
    const label = $("[data-capability-label]", card);
    const count = $("[data-capability-count]", card);
    if (label) label.textContent = capabilityLabels[filter] || filter;
    if (count) count.textContent = String(counts[filter] || 0).padStart(2, "0");
    card.classList.toggle("is-active", filter === state.filter);
    card.setAttribute("aria-pressed", String(filter === state.filter));
  });
}

function renderProjects() {
  const groups = [
    { key: "website", label: t("projects.websites") },
    { key: "chrome", label: t("projects.chromeExtensions") },
    { key: "github", label: t("projects.githubProjects") },
  ];

  const list = $("#project-list");
  list.innerHTML = "";
  let projectNumber = 0;

  groups.forEach((group) => {
    const projects = state.projects.filter((project) => project.type === group.key);
    if (!projects.length) return;

    const groupTitle = document.createElement("div");
    groupTitle.className = "project-group-title";
    groupTitle.innerHTML = `<span>${esc(group.label)}</span><strong>${String(projects.length).padStart(2, "0")}</strong>`;
    list.appendChild(groupTitle);

    projects.forEach((project) => {
      projectNumber += 1;
      const links = projectLinks(project);
      const primaryLink = links[0];
      const row = document.createElement("article");
      row.className = "project-row";
      row.dataset.type = project.type;
      if (state.filter !== "all" && state.filter !== project.type) {
        row.classList.add("is-hidden");
      }

      row.innerHTML = `
        ${primaryLink
          ? `<a class="project-row-link" href="${esc(primaryLink.href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(project.name)} — ${esc(primaryLink.label)}"></a>`
          : ""}
        <span class="project-num">${String(projectNumber).padStart(2, "0")}</span>
        <div class="project-main">
          <h3 class="project-title">${esc(project.name)}</h3>
          <p class="project-description">${esc(projectDescription(project))}</p>
        </div>
        <div class="project-meta">
          <span class="project-tag">${esc(typeLabel(project.type))}</span>
        </div>
        <div class="project-links">
          ${links
            .map(
              (link) =>
                `<a href="${esc(link.href)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} <span>↗</span></a>`
            )
            .join("")}
        </div>
      `;
      list.appendChild(row);
    });
  });

  renderProjectFilters();
}

function renderAbout() {
  const cv = state.cv[state.lang];
  if (!cv) return;

  $("#profile").textContent = cv.profile;
  $("#notice").textContent = cv.notice;

  const contactList = $("#contact-list");
  contactList.innerHTML = `
    <li><span>${esc(t("about.name"))}:</span> ${esc(cv.name)}</li>
    <li><span>Email:</span> <a href="mailto:${esc(cv.contact.email)}">${esc(cv.contact.email)}</a></li>
    <li><span>LinkedIn:</span> <a href="https://${esc(cv.contact.linkedin)}" target="_blank" rel="noopener noreferrer">${esc(cv.contact.linkedin)}</a></li>
    <li><span>GitHub:</span> <a href="https://${esc(cv.contact.github)}" target="_blank" rel="noopener noreferrer">${esc(cv.contact.github)}</a></li>
  `;

  const languageList = $("#language-list");
  languageList.innerHTML = cv.languages
    .map(
      (language) =>
        `<li><span>${esc(language.language)}</span><span>${esc(language.proficiency)}</span></li>`
    )
    .join("");

  $("#transport").textContent = cv.transport;

  const experience = $("#experience");
  experience.innerHTML = `<div class="experience-list">${cv.workExperience
    .map(
      (job) => `
        <div class="experience-item">
          <div>
            <p class="experience-role">${esc(job.role)}</p>
            <p class="experience-meta">${esc(job.company)} · ${esc(job.period)}</p>
          </div>
          <ul class="experience-desc">
            ${job.description.map((item) => `<li>${esc(item)}</li>`).join("")}
          </ul>
        </div>
      `
    )
    .join("")}</div>`;

  const education = $("#education");
  education.innerHTML = cv.education
    .map(
      (item) => `
        <li>
          <span class="education-year">${esc(item.year)}</span>
          <span class="education-degree">${esc(item.degree)}</span>
          <span class="education-institution">${esc(item.institution)}</span>
        </li>
      `
    )
    .join("");

  const skills = $("#skills");
  const skillLabels = {
    ai_tools_automation: t("skills.aiTools"),
    "full-stack_development": t("skills.fullStack"),
    "devops,_cloud_infrastructure": t("skills.devops"),
    testing_qa: t("skills.testing"),
    development_tools_software: t("skills.devTools"),
    web_design_graphics: t("skills.webDesign"),
    operating_systems_networking: t("skills.osNetwork"),
  };
  skills.innerHTML = Object.entries(cv.skills)
    .map(([category, value]) => {
      const label = skillLabels[category] || category
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
      return `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`;
    })
    .join("");
}

function renderAthena() {
  const intro = $("#athena-intro");
  intro.innerHTML = `${esc(t("athena.description"))} <a href="https://athena-cms-factory.github.io/athena-hub/" target="_blank" rel="noopener noreferrer">Athena CMS Factory</a>${esc(t("athena.descriptionSuffix"))}`;

  const sites = [
    { name: "Urban Brew & Bite", category: "Hospitality", url: "https://athena-cms-factory.github.io/urban-brew-bite", image: "./assets/athena/urban-brew-bite.jpg" },
    { name: "Urban Soles", category: "E-commerce", url: "https://athena-cms-factory.github.io/urban-soles", image: "./assets/athena/urban-soles.jpg" },
    { name: "Belgian Chocolate Shop", category: "E-commerce", url: "https://athena-cms-factory.github.io/chocolade-shop", image: "./assets/athena/chocolade-shop.jpg" },
    { name: "Academy-1", category: "Education", url: "https://athena-cms-factory.github.io/academy-1", image: "./assets/athena/academy-1.jpg" },
    { name: "De Schaar", category: "Beauty & Wellness", url: "https://athena-cms-factory.github.io/de-schaar", image: "./assets/athena/de-schaar.jpg" },
    { name: "Athena Pro", category: "B2B / SaaS", url: "https://athena-cms-factory.github.io/athena-pro", image: "./assets/athena/athena-pro.jpg" },
    { name: "Gentse Dakwerken", category: "Construction", url: "https://athena-cms-factory.github.io/gentse-dakwerken-v10", image: "./assets/athena/gentse-dakwerken-v10.jpg" },
    { name: "Lex & Justitia Advocaten", category: "Legal Services", url: "https://athena-cms-factory.github.io/lex-justitia", image: "./assets/athena/lex-justitia.jpg" },
  ];

  $("#showcase-grid").innerHTML = sites
    .map(
      (site, index) => `
        <a class="showcase-card" href="${esc(site.url)}" target="_blank" rel="noopener noreferrer" aria-label="Bezoek ${esc(site.name)}">
          <img class="showcase-image" src="${esc(site.image)}" alt="Screenshot van ${esc(site.name)}" loading="lazy">
          <span class="showcase-overlay"></span>
          <span class="showcase-card-top"><span>${String(index + 1).padStart(2, "0")}</span><span>${esc(site.category)}</span></span>
          <span class="showcase-card-body">
            <span class="showcase-title">${esc(site.name)}</span><span class="showcase-arrow">↗</span>
          </span>
        </a>
      `
    )
    .join("");
}

function renderContact() {
  $("#contact-text").textContent = t("contact.text");
  const textNode = $("#contact-text");
  const link = document.createElement("a");
  link.href = "mailto:karel.decherf@gmail.com";
  link.textContent = "karel.decherf@gmail.com";
  textNode.append(" ", link);
}

function render() {
  renderLanguage();
  renderTheme();
  renderProjects();
  renderAbout();
  renderAthena();
  renderContact();
}

function setLanguage(lang) {
  if (lang !== "nl" && lang !== "en") return;
  state.lang = lang;
  localStorage.setItem("portfolio-lang", lang);
  render();
}

function renderTheme() {
  const isDark = state.theme === "dark";
  document.documentElement.dataset.theme = state.theme;
  const toggle = $(".theme-toggle");
  const label = $("[data-theme-label]");
  if (toggle) toggle.setAttribute("aria-pressed", String(isDark));
  if (label) {
    label.textContent = isDark
      ? (state.lang === "nl" ? "Licht" : "Light")
      : (state.lang === "nl" ? "Donker" : "Dark");
  }
}

function setTheme(theme) {
  if (theme !== "light" && theme !== "dark") return;
  state.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  renderTheme();
}

async function loadData() {
  const [nl, en, cvNl, cvEn, projectsTsv] = await Promise.all([
    fetch("../src/i18n/nl.json").then((response) => response.json()),
    fetch("../src/i18n/en.json").then((response) => response.json()),
    fetch("../src/data/cv.json").then((response) => response.json()),
    fetch("../src/data/cv-eng.json").then((response) => response.json()),
    fetch("../projects/projects.tsv").then((response) => response.text()),
  ]);

  state.translations = { nl, en };
  state.cv = { nl: cvNl, en: cvEn };
  state.projects = parseTsv(projectsTsv);
  render();
}

$(".lang-toggle").addEventListener("click", () => {
  setLanguage(state.lang === "nl" ? "en" : "nl");
});

$(".theme-toggle").addEventListener("click", () => {
  setTheme(state.theme === "dark" ? "light" : "dark");
});

$("#filters").addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;
  state.filter = button.dataset.filter;
  renderProjects();
});

$("#capability-band").addEventListener("click", (event) => {
  const button = event.target.closest(".capability-card");
  if (!button) return;
  state.filter = button.dataset.filter;
  renderProjects();
});

renderTheme();

loadData().catch((error) => {
  console.error(error);
  $("#project-list").innerHTML = `<p class="project-description">Kon de content niet laden. Start de prototype-server vanuit de repository-root.</p>`;
});