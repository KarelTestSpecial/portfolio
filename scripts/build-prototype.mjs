import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, "prototype"), dist, { recursive: true });

// Enkel de JSON-content meenemen; geen losse .tsx/.ts die de site niet nodig heeft.
for (const dir of ["data", "i18n"]) {
  const dest = path.join(dist, dir);
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(path.join(root, "src", dir))) {
    if (file.endsWith(".json")) {
      fs.copyFileSync(path.join(root, "src", dir, file), path.join(dest, file));
    }
  }
}

fs.copyFileSync(path.join(root, "projects", "projects.tsv"), path.join(dist, "projects.tsv"));

const appPath = path.join(dist, "app.js");
let app = fs.readFileSync(appPath, "utf8");
app = app
  .replaceAll("../src/i18n/", "./i18n/")
  .replaceAll("../src/data/", "./data/")
  .replaceAll("../projects/projects.tsv", "./projects.tsv");
fs.writeFileSync(appPath, app);

console.log("Prototype build ready in dist/");