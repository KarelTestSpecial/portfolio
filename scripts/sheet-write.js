#!/usr/bin/env node
/**
 * sheet-write.js — celwaarden in de Google Sheet schrijven (waarden-only, met teruglezing)
 *
 * Valt NIET onder de site-build: maintainer-gereedschap om de sheet als bron van
 * waarheid bij te werken zonder de browser. Houdt zich aan de regels van de
 * sheet-schrijver:
 *   - alleen waarden (`valueInputOption: RAW`), nooit opmaak
 *   - nooit `values.clear`, nooit tabbladen toevoegen/verwijderen
 *   - kolommen A–F (type, name, githubLink, liveLink, status, description) zijn
 *     beschermd: overschrijven kan enkel met --force
 *   - standaard dry-run: toont oud → nieuw per rij, mét de projectnaam ernaast
 *     (A1-ris N hoort bij datarij N-1; een verkeerde rij valt zo direct op)
 *   - na het schrijven leest het script alles terug en vergelijkt
 *
 * Gebruik:
 *   node scripts/sheet-write.js --range "Sheet1!H20" --set "The Free Reality"
 *   node scripts/sheet-write.js --range "Sheet1!G2:H21" --file /tmp/values.tsv --write
 *   ... met --force om een beschermde kolom te raken
 */

const fs = require('fs');
const { SHEET_ID, TAB, HEADER, PROTECTED_COLUMNS, getSheets, readTab } = require('./sheet-lib');

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const range = flag('--range');
const set = flag('--set');
const file = flag('--file');
const write = args.includes('--write');
const force = args.includes('--force');

if (!range) {
  console.error('Gebruik: node scripts/sheet-write.js --range "Sheet1!H20" --set "tekst" [--write]');
  process.exit(1);
}
if (!set && !file) {
  console.error('Geef --set "waarde(n)" of --file <tsv> mee.');
  process.exit(1);
}

/** "Sheet1!H20:H21" of "H20" → { tab, cols, r1, r2, c1, c2 } */
function parseRange(input) {
  const m = input.match(/^(?:'([^']+)'|([A-Za-z0-9_ ]+))?!?\$?([A-Z]+)\$?(\d+)(?::\$?([A-Z]+)\$?(\d+))?$/);
  if (!m) throw new Error(`Kon range niet lezen: ${input}`);
  const tab = m[1] || m[2] || TAB;
  const c1 = m[3];
  const r1 = Number(m[4]);
  const c2 = m[5] || c1;
  const r2 = m[6] ? Number(m[6]) : r1;
  return { tab, c1, r1, c2, r2, cols: c1 === c2 ? 1 : colIndex(c2) - colIndex(c1) + 1 };
}

function colIndex(letters) {
  return [...letters].reduce((acc, ch) => acc * 26 + (ch.charCodeAt(0) - 64), 0);
}

function colLetters(index) {
  let n = index;
  let out = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

function quoteTab(tab) {
  return `'${tab.replace(/'/g, "''")}'`;
}

(async () => {
  const parsed = parseRange(range);
  if (parsed.cols !== 1 && set) {
    console.error('Bij --set hoort één kolom; gebruik --file voor een blok.');
    process.exit(1);
  }

  // Waarden inladen
  let values;
  if (file) {
    const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    values = raw
      .replace(/\n$/, '')
      .split(/\r?\n/)
      .map((line) => line.split('\t'));
  } else {
    values = [[set]];
  }

  const rowsNeeded = parsed.r2 - parsed.r1 + 1;
  const colsNeeded = parsed.cols;
  const kolomOk = values.every((r) => r.length === colsNeeded);
  const rijOk = values.length === rowsNeeded;
  if (!kolomOk || !rijOk) {
    console.error(
      `Vorm mismatch: range ${rowsNeeded} rij(en) × ${colsNeeded} kolom/kolommen, data ${values.length} × ${values[0].length}.`
    );
    process.exit(1);
  }

  // Beschermde kolommen
  const geraakteKolommen = new Set();
  for (let c = colIndex(parsed.c1); c <= colIndex(parsed.c2); c += 1) geraakteKolommen.add(colLetters(c));
  const beschermd = [...geraakteKolommen].filter((c) => PROTECTED_COLUMNS.includes(c));
  if (beschermd.length && !force) {
    console.error(
      `Weigering: ${beschermd.join(', ')} is/zijn beschermd (NL-bronkolommen A–F). Gebruik --force als dit echt de bedoeling is.`
    );
    process.exit(1);
  }

  const sheets = await getSheets('write');
  const fullRange = `${quoteTab(parsed.tab)}!${parsed.c1}${parsed.r1}:${parsed.c2}${parsed.r2}`;
  const before = await readTab(sheets, fullRange);
  // Namen (kolom B) horen niet bij het bereik, dus apart ophalen voor het overzicht.
  const namen = await readTab(sheets, `${quoteTab(parsed.tab)}!B${parsed.r1}:B${parsed.r2}`);

  // Voorbeeld per rij: A1-ris + projectnaam (kolom B) + oud → nieuw
  console.log(`${write ? 'SCHRIJVEN' : 'DRY-RUN'} · ${SHEET_ID} · ${fullRange}`);
  values.forEach((row, i) => {
    const a1Row = parsed.r1 + i;
    const huidige = before[i] || [];
    const naam = namen[i]?.[0] || '(geen naam op deze rij)';
    const diff = row
      .map((cell, j) => {
        const oude = huidige[j] ?? '';
        return oude === cell ? null : `${colLetters(colIndex(parsed.c1) + j)}${a1Row}: "${oude}" → "${cell}"`;
      })
      .filter(Boolean);
    console.log(`  rij ${a1Row} · ${naam}`);
    if (!diff.length) console.log('    (geen wijziging)');
    diff.forEach((d) => console.log(`    ${d}`));
  });

  if (!write) {
    console.log('\nDry-run: niets geschreven. Voeg --write toe om toe te passen.');
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: fullRange,
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  // Teruglezen en vergelijken — de write "slaagt" ook als de rij naast de data ligt.
  const after = await readTab(sheets, fullRange);
  const nu = await readTab(sheets, `${quoteTab(parsed.tab)}!B${parsed.r1}:B${parsed.r2}`);
  const fouten = [];
  values.forEach((row, i) => {
    row.forEach((cell, j) => {
      const terug = after[i]?.[j] ?? '';
      if (terug !== cell) fouten.push(`rij ${parsed.r1 + i} kolom ${colLetters(colIndex(parsed.c1) + j)}: stond "${terug}" verwacht "${cell}"`);
    });
    const naam = nu[i]?.[0] ?? '(leeg)';
    console.log(`  ✓ rij ${parsed.r1 + i} · ${naam}`);
  });

  if (fouten.length) {
    console.error('Teruglezing wijkt af:');
    fouten.forEach((f) => console.error('  ' + f));
    process.exit(1);
  }
  console.log('Alle waarden bevestigd door teruglezing.');
})().catch((err) => {
  console.error('Fout:', err.message);
  process.exit(1);
});