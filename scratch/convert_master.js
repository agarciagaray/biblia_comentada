const fs = require('fs');
const path = require('path');

const NEW_BOOKS = [
  {
    local: 'evang_mateo_10-18.htm.html',
    title: 'Evangelio según San Mateo (Capítulos 10 al 18)',
    nextFile: 'evang_mateo_19-fin.htm.html',
    nextLabel: 'CONTINÚA (SAN MATEO 19-28)',
    anchorId: '_TocMateo1018',
  },
  {
    local: 'evang_mateo_19-fin.htm.html',
    title: 'Evangelio según San Mateo (Capítulos 19 al 28)',
    nextFile: 'evangelio_de_san_marcos.htm.html',
    nextLabel: 'CONTINÚA (SAN MARCOS)',
    anchorId: '_TocMateo19fin',
  },
  {
    local: 'evangelio_de_san_marcos.htm.html',
    title: 'Evangelio según San Marcos',
    nextFile: 'evang_lucas.htm.html',
    nextLabel: 'CONTINÚA (SAN LUCAS)',
    anchorId: '_TocMarcos',
  },
  {
    local: 'evang_lucas.htm.html',
    title: 'Evangelio según San Lucas',
    nextFile: 'evang_juan.htm.html',
    nextLabel: 'CONTINÚA (SAN JUAN)',
    anchorId: '_TocLucas',
  },
  {
    local: 'evang_juan.htm.html',
    title: 'Evangelio según San Juan',
    nextFile: 'Hechos-apostoles.htm.html',
    nextLabel: 'CONTINÚA (HECHOS DE LOS APÓSTOLES)',
    anchorId: '_TocJuan',
  },
  {
    local: 'introduccion_epistolas_paulinas.htm.html',
    title: 'Introducción a las Epístolas Paulinas',
    nextFile: 'Romanos.htm.html',
    nextLabel: 'CONTINÚA (ROMANOS)',
    anchorId: '_TocIntroPaulinas',
  },
  {
    local: 'epistolas_catolicas.htm.html',
    title: 'Las Epístolas Católicas (Introducción)',
    nextFile: 'Santiago.htm.html',
    nextLabel: 'CONTINÚA (SANTIAGO)',
    anchorId: '_TocIntroEpistolasCatolicas',
  }
];

function convertBook(book) {
  const rawPath = path.join('pages', `${book.local}.raw`);
  if (!fs.existsSync(rawPath)) {
    console.error(`ERROR: raw file not found: ${rawPath}`);
    return false;
  }

  const buf = fs.readFileSync(rawPath);
  let text = new TextDecoder('windows-1252').decode(buf);

  // Extract body
  const bodyStart = text.indexOf('<body');
  const bodyContentStart = text.indexOf('>', bodyStart) + 1;
  const bodyEnd = text.lastIndexOf('</body>');
  let body = text.slice(bodyContentStart, bodyEnd < 0 ? undefined : bodyEnd).trim();

  // Normalize entities
  body = body.replace(/&nbsp;/g, '&#160;');

  const header = `<font face="Arial" color="#800000" size="6"><b>
<p align="center">&#160;</p>
<p align="center"><a name="${book.anchorId}">${book.title}</a></p>
</b></font>
<p align="justify" style="margin-left: 40; margin-right: 40">&#160;</p>
`;

  const footer = book.nextFile ? `
    <p align="justify" style="margin-left: 40; margin-right: 40">
    <font face="Arial Black" size="5"><a href="../pages/${book.nextFile}">${book.nextLabel}</a></font></p>
    <p align="justify" style="margin-left: 40; margin-right: 40">&#160;</p>
` : '';

  const html = `<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${book.title} - Biblia Comentada BAC</title>
  <meta name="description" content="Comentario exegético católico de ${book.title} en la Biblia Comentada (BAC).">
  <link rel="stylesheet" href="../css/theme.css">
  <link rel="stylesheet" href="../css/reader.css">
</head>
<body class="biblia-reader">
  <main class="reader-wrapper">
    <div class="biblia-content">
${header}
${body}
${footer}
    </div>
  </main>
  <script src="../js/books-data.js"></script>
  <script src="../js/reader.js"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join('pages', book.local), html, 'utf8');
  console.log(`OK: Converted ${book.local} (${html.length} chars)`);
  return true;
}

// 1. Convert new books
console.log('--- Converting 7 new books ---');
for (const b of NEW_BOOKS) {
  convertBook(b);
}

// 2. Update evang_mateo_00-09.htm.html to link to evang_mateo_10-18.htm.html
console.log('\n--- Updating evang_mateo_00-09.htm.html ---');
const mateo09Path = path.join('pages', 'evang_mateo_00-09.htm.html');
let mateo09 = fs.readFileSync(mateo09Path, 'utf8');
if (!mateo09.includes('evang_mateo_10-18.htm.html')) {
  const insertPos = mateo09.lastIndexOf('</div>');
  const mateo09Footer = `
    <p align="justify" style="margin-left: 40; margin-right: 40">
    <font face="Arial Black" size="5"><a href="../pages/evang_mateo_10-18.htm.html">CONTINÚA (SAN MATEO 10-18)</a></font></p>
    <p align="justify" style="margin-left: 40; margin-right: 40">&#160;</p>
`;
  mateo09 = mateo09.slice(0, insertPos) + mateo09Footer + mateo09.slice(insertPos);
  fs.writeFileSync(mateo09Path, mateo09, 'utf8');
  console.log('Added CONTINÚA (SAN MATEO 10-18) to evang_mateo_00-09.htm.html');
} else {
  console.log('evang_mateo_00-09.htm.html already references evang_mateo_10-18');
}

// 3. Update hebreos.htm.html to link to epistolas_catolicas.htm.html instead of Santiago
console.log('\n--- Updating hebreos.htm.html ---');
const hebreosPath = path.join('pages', 'hebreos.htm.html');
let hebreos = fs.readFileSync(hebreosPath, 'utf8');
if (hebreos.includes('Santiago.htm.html')) {
  hebreos = hebreos.replace(
    /<a href="\.\.\/pages\/Santiago\.htm\.html">CONTINÚA \(SANTIAGO\)<\/a>/g,
    '<a href="../pages/epistolas_catolicas.htm.html">CONTINÚA (INTRO. EPÍSTOLAS CATÓLICAS)</a>'
  );
  fs.writeFileSync(hebreosPath, hebreos, 'utf8');
  console.log('Updated hebreos.htm.html to link to epistolas_catolicas.htm.html');
}

// 4. Update books-data.js available flags
console.log('\n--- Updating js/books-data.js ---');
const booksDataPath = path.join('js', 'books-data.js');
let booksData = fs.readFileSync(booksDataPath, 'utf8');

// Parse catalog using node require
const { BIBLIA_CATALOG } = require(path.resolve('js/books-data.js'));
let updatedCount = 0;
for (const book of BIBLIA_CATALOG) {
  const pageFile = path.join('pages', book.file);
  const exists = fs.existsSync(pageFile);
  if (exists && !book.available) {
    console.log(`Setting available: true for ${book.id} (${book.file})`);
    // Find the book block in booksData and change available: false to available: true
    const idRegex = new RegExp(`(id:\\s*["']${book.id}["'][\\s\\S]*?available:\\s*)false`, 'm');
    if (idRegex.test(booksData)) {
      booksData = booksData.replace(idRegex, '$1true');
      updatedCount++;
    } else {
      console.warn(`Could not find id: "${book.id}" block to update available flag.`);
    }
  }
}
fs.writeFileSync(booksDataPath, booksData, 'utf8');
console.log(`Updated ${updatedCount} books to available: true in js/books-data.js`);

console.log('\nALL STEPS COMPLETED SUCCESSFULLY!');
