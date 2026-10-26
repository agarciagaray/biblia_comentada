/**
 * Convierte todos los archivos .raw descargados al formato HTML estándar del proyecto.
 * Ejecutar: node scratch/convert_all.js
 */
const fs = require('fs');

const BOOKS = [
  // Tomo VI: Hechos
  {
    local: 'Hechos-apostoles.htm.html',
    title: 'Hechos de los Apóstoles',
    nextFile: 'introduccion_epistolas_paulinas.htm.html',
    nextLabel: 'CONTINÚA (INTRO. EPÍSTOLAS PAULINAS)',
    anchorId: '_TocHechos',
  },
  // Intro Paulinas (pequeña, está disponible como Cartas Pastorales - en realidad es intro de pablo)
  // Nota: las_cartas_pastorales.htm.html.raw ES la introducción a las epístolas pastorales
  {
    local: 'las_cartas_pastorales.htm.html',
    title: 'Las Cartas Pastorales (Introducción)',
    nextFile: 'Timoteo_1.htm.html',
    nextLabel: 'CONTINÚA (1 TIMOTEO)',
    anchorId: '_TocCartasPastorales',
  },
  // Epístolas Paulinas
  {
    local: 'Romanos.htm.html',
    title: 'Epístola a los Romanos',
    nextFile: 'Corintios_1.htm.html',
    nextLabel: 'CONTINÚA (1 CORINTIOS)',
    anchorId: '_TocRomanos',
  },
  {
    local: 'Corintios_1.htm.html',
    title: '1ª Epístola a los Corintios',
    nextFile: 'Corintios_2.htm.html',
    nextLabel: 'CONTINÚA (2 CORINTIOS)',
    anchorId: '_TocCorintios1',
  },
  {
    local: 'Corintios_2.htm.html',
    title: '2ª Epístola a los Corintios',
    nextFile: 'Galatas.htm.html',
    nextLabel: 'CONTINÚA (GÁLATAS)',
    anchorId: '_TocCorintios2',
  },
  {
    local: 'Galatas.htm.html',
    title: 'Epístola a los Gálatas',
    nextFile: 'Efesios.htm.html',
    nextLabel: 'CONTINÚA (EFESIOS)',
    anchorId: '_TocGalatas',
  },
  {
    local: 'Efesios.htm.html',
    title: 'Epístola a los Efesios',
    nextFile: 'Filipenses.htm.html',
    nextLabel: 'CONTINÚA (FILIPENSES)',
    anchorId: '_TocEfesios',
  },
  {
    local: 'Filipenses.htm.html',
    title: 'Epístola a los Filipenses',
    nextFile: 'Colosenses.htm.html',
    nextLabel: 'CONTINÚA (COLOSENSES)',
    anchorId: '_TocFilipenses',
  },
  {
    local: 'Colosenses.htm.html',
    title: 'Epístola a los Colosenses',
    nextFile: 'Tesalonicenses_1.htm.html',
    nextLabel: 'CONTINÚA (1 TESALONICENSES)',
    anchorId: '_TocColosenses',
  },
  {
    local: 'Tesalonicenses_1.htm.html',
    title: '1ª Epístola a los Tesalonicenses',
    nextFile: 'Tesalonicenses_2.htm.html',
    nextLabel: 'CONTINÚA (2 TESALONICENSES)',
    anchorId: '_TocTesalonicenses1',
  },
  {
    local: 'Tesalonicenses_2.htm.html',
    title: '2ª Epístola a los Tesalonicenses',
    nextFile: 'las_cartas_pastorales.htm.html',
    nextLabel: 'CONTINÚA (INTRO. CARTAS PASTORALES)',
    anchorId: '_TocTesalonicenses2',
  },
  {
    local: 'Timoteo_1.htm.html',
    title: '1ª Epístola a Timoteo',
    nextFile: 'Timoteo_2.htm.html',
    nextLabel: 'CONTINÚA (2 TIMOTEO)',
    anchorId: '_TocTimoteo1',
  },
  {
    local: 'Timoteo_2.htm.html',
    title: '2ª Epístola a Timoteo',
    nextFile: 'Tito.htm.html',
    nextLabel: 'CONTINÚA (TITO)',
    anchorId: '_TocTimoteo2',
  },
  {
    local: 'Tito.htm.html',
    title: 'Epístola a Tito',
    nextFile: 'Filemon.htm.html',
    nextLabel: 'CONTINÚA (FILEMÓN)',
    anchorId: '_TocTito',
  },
  {
    local: 'Filemon.htm.html',
    title: 'Epístola a Filemón',
    nextFile: 'hebreos.htm.html',
    nextLabel: 'CONTINÚA (HEBREOS)',
    anchorId: '_TocFilemon',
  },
  {
    local: 'hebreos.htm.html',
    title: 'Epístola a los Hebreos',
    nextFile: 'Santiago.htm.html',
    nextLabel: 'CONTINÚA (SANTIAGO)',
    anchorId: '_TocHebreos',
  },
  // Epístolas Católicas
  {
    local: 'Santiago.htm.html',
    title: 'Epístola de Santiago',
    nextFile: 'Pedro_1.htm.html',
    nextLabel: 'CONTINÚA (1 PEDRO)',
    anchorId: '_TocSantiago',
  },
  {
    local: 'Pedro_1.htm.html',
    title: '1ª Epístola de San Pedro',
    nextFile: 'Pedro_2.htm.html',
    nextLabel: 'CONTINÚA (2 PEDRO)',
    anchorId: '_TocPedro1',
  },
  {
    local: 'Pedro_2.htm.html',
    title: '2ª Epístola de San Pedro',
    nextFile: 'Juan_1.htm.html',
    nextLabel: 'CONTINÚA (1 JUAN)',
    anchorId: '_TocPedro2',
  },
  {
    local: 'Juan_1.htm.html',
    title: '1ª Epístola de San Juan',
    nextFile: 'Juan_2_y_3.htm.html',
    nextLabel: 'CONTINÚA (2 Y 3 JUAN)',
    anchorId: '_TocJuan1',
  },
  {
    local: 'Juan_2_y_3.htm.html',
    title: '2ª y 3ª Epístolas de San Juan',
    nextFile: 'San_Judas.htm.html',
    nextLabel: 'CONTINÚA (SAN JUDAS)',
    anchorId: '_TocJuan23',
  },
  {
    local: 'San_Judas.htm.html',
    title: 'Epístola de San Judas',
    nextFile: 'apocalipsis.htm.html',
    nextLabel: 'CONTINÚA (APOCALIPSIS)',
    anchorId: '_TocSanJudas',
  },
  {
    local: 'apocalipsis.htm.html',
    title: 'Apocalipsis de San Juan',
    nextFile: null,
    nextLabel: null,
    anchorId: '_TocApocalipsis',
  },
];

function convertBook(book) {
  const rawPath = `pages/${book.local}.raw`;
  if (!fs.existsSync(rawPath)) {
    console.log(`SKIP (no raw): ${book.local}`);
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

  fs.writeFileSync(`pages/${book.local}`, html, 'utf8');
  console.log(`OK: ${book.local} (${html.length} bytes)`);
  return true;
}

let count = 0;
for (const book of BOOKS) {
  if (convertBook(book)) count++;
}
console.log(`\nConverted ${count} / ${BOOKS.length} books.`);
