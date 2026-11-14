#!/usr/bin/env node
/**
 * sheet-sync.js — Google Sheet (tabblad 1) → projects/projects.tsv
 *
 * De sheet is de bron van waarheid voor de projectenlijst. Dit script haalt ze
 * op via de Sheets API (service account) en schrijft het TSV dat de site en de
 * GitHub Actions gebruiken. Zo blijven sheet en repo exact gelijk, zonder
 * publiceren-naar-web-omweg.
 *
 * Gebruik:
 *   node scripts/sheet-sync.js            # TSV herschrijven uit de sheet
 *   node scripts/sheet-sync.js --dry-run  # alleen tonen wat er zou veranderen
 *   node scripts/sheet-sync.js --check    # header/data valideren, niets schrijven
 *
 * Weergave: 8 kolommen, 1 tab (Sheet1). Wijkt de header af, dan stopt het
 * script — een verschoven kolom mag nooit stil een lege site opleveren.
 */

const fs = require('fs');
const path = require('path');
const { SHEET_ID, TAB, HEADER, getSheets, readTab } = require('./sheet-lib');

const OUT = path.join(__dirname, '..', 'projects', 'projects.tsv');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const checkOnly = args.includes('--check');

function toTsv(rows) {
  return (
    rows
      .map((row) =>
        row
          .map((cell) => String(cell ?? '').replace(/\t/g, ' ').replace(/\r?\n/g, ' '))
          .join('\t')
      )
      .join('\n') + '\n'
  );
}

(async () => {
  const sheets = await getSheets('read');
  const rows = await readTab(sheets);

  if (rows.length < 2) {
    console.error(`Leeg tabblad '${TAB}' in ${SHEET_ID}.`);
    process.exit(1);
  }

  const header = rows[0].map((h) => String(h).trim());
  const mismatch = header.filter((h, i) => h !== HEADER[i]);
  if (mismatch.length) {
    console.error('Header wijkt af van de verwachte kolommen:');
    console.error('  verwacht: ' + HEADER.join(' | '));
    console.error('  gevonden: ' + header.join(' | '));
    console.error(`  afwijkend: ${mismatch.join(', ')}`);
    console.error('Niets geschreven. Herstel de sheet of werk HEADER in sheet-lib.js bij.');
    process.exit(1);
  }

  const dataRows = rows.slice(1);
  const zonderEn = dataRows.filter((r) => !r[6] || !r[7]).map((r) => r[1]);
  const teKort = dataRows.filter((r) => r.length < HEADER.length).map((r) => r[1]);

  console.log(`Sheet: ${SHEET_ID} · tabblad '${TAB}'`);
  console.log(`Rijen: ${dataRows.length} projecten, ${header.length} kolommen`);
  if (zonderEn.length) console.warn(`⚠️  ${zonderEn.length} zonder description_en of name_en: ${zonderEn.join(' · ')}`);
  if (teKort.length) console.warn(`⚠️  ${teKort.length} rij/rijen met te weinig cellen: ${teKort.join(' · ')}`);

  const tsv = toTsv(rows);
  const huidig = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : null;

  if (huidig === tsv) {
    console.log('projects.tsv is al identiek — niets te doen.');
    return;
  }
  if (dryRun || checkOnly) {
    console.log(`${dryRun ? '[dry-run]' : '[check]'}: projects.tsv zou ${huidig === null ? 'aangemaakt' : 'bijgewerkt'} worden (${tsv.split('\n').length - 1} regels).`);
    return;
  }

  fs.writeFileSync(OUT, tsv);
  console.log(`Geschreven: ${path.relative(process.cwd(), OUT)}`);
})().catch((err) => {
  console.error('Fout:', err.message);
  process.exit(1);
});