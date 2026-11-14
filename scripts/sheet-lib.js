/**
 * sheet-lib.js — gedeelde basis voor de maintainer-scripts rond de Google Sheet.
 *
 * OPMERKELING: dit is maintainer-gereedschap, geen onderdeel van de site-build.
 * De site zelf heeft de sheet niet nodig (die leest projects.tsv). Deze scripts
 * zijn er om de sheet als bron van waarheid te kunnen lezen/bijwerken zonder
 * in de browser te hoeven klikken.
 *
 * Auth: service account (`~/.config/maccha/service-account.json`, override
 *       GOOGLE_SA_PATH). Die heeft Bewerker-rechten op de sheet; hij is noch in
 *       de repo noch in de site opgenomen — alleen het e-mailadres staat hier.
 * Dependency: `googleapis` uit ~/INFRA (de centrale tooling-map), niet als
 *       devDependency van deze repo (te zwaar voor een statische site).
 */

const os = require('os');
const path = require('path');
const { createRequire } = require('module');

const SHEET_ID =
  process.env.PORTFOLIO_SHEET_ID || '1yHslg3EvzO2YA6i_5gC14k_QX4o94uB-0y8stUe3b8E';
const TAB = process.env.PORTFOLIO_SHEET_TAB || 'Sheet1';

/** Exacte kolomvolgorde van tabblad 1. `description`/`name` = NL, `*_en` = EN. */
const HEADER = [
  'type',
  'name',
  'githubLink',
  'liveLink',
  'status',
  'description',
  'description_en',
  'name_en',
];

/** Kolommen die de Nederlandse bron vormen — nooit overschrijven zonder --force. */
const PROTECTED_COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];

const SA_PATH =
  process.env.GOOGLE_SA_PATH || path.join(os.homedir(), '.config', 'maccha', 'service-account.json');

function loadGoogle() {
  try {
    const infraRequire = createRequire(path.join(os.homedir(), 'INFRA', 'package.json'));
    return infraRequire('googleapis');
  } catch (err) {
    console.error(
      'Kon googleapis niet laden uit ~/INFRA.\n' +
        'Dit is maintainer-gereedschap: het verwacht ~/INFRA/node_modules/googleapis.\n' +
        'Categorie: ' + err.code
    );
    process.exit(1);
  }
}

/** @param {'read'|'write'} mode */
async function getSheets(mode) {
  const googleapis = loadGoogle();
  const auth = new googleapis.google.auth.GoogleAuth({
    keyFile: SA_PATH,
    scopes: [
      mode === 'write'
        ? 'https://www.googleapis.com/auth/spreadsheets'
        : 'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });
  return googleapis.google.sheets({ version: 'v4', auth: await auth.getClient() });
}

/** Leest het hele tabblad als array van rijen (celwaarden als string). */
async function readTab(sheets, range = `${TAB}!A1:ZZ`) {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range });
  return res.data.values || [];
}

module.exports = { SHEET_ID, TAB, HEADER, PROTECTED_COLUMNS, SA_PATH, getSheets, readTab };