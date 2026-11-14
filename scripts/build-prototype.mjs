import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, "prototype"), dist, { recursive: true });
fs.cpSync(path.join(root, "src", "data"), path.join(dist, "data"), { recursive: true });
fs.cpSync(path.join(root, "src", "i18n"), path.join(dist, "i18n"), { recursive: true });
fs.copyFileSync(path.join(root, "projects", "projects.tsv"), path.join(dist, "projects.tsv"));

const appPath = path.join(dist, "app.js");
let app = fs.readFileSync(appPath, "utf8");
app = app
  .replaceAll("../src/i18n/", "./i18n/")
  .replaceAll("../src/data/", "./data/")
  .replaceAll("../projects/projects.tsv", "./projects.tsv");
fs.writeFileSync(appPath, app);

console.log("Prototype build ready in dist/");