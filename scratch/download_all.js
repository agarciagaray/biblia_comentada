/**
 * Script para descargar todos los libros pendientes desde mercaba.org
 * Ejecutar: node scratch/download_all.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.mercaba.org/Biblia/Comentada/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// Mapeo: {localFile, remoteFile}
const PENDING = [
  // Tomo V - Evangelios (Mateo ya tiene 00-09)
  { local: 'evang_mateo_10-18.htm.html',           remote: 'Mateo_10-18.htm' },
  { local: 'evang_mateo_19-fin.htm.html',          remote: 'Mateo_19-fin.htm' },
  { local: 'evangelio_de_san_marcos.htm.html',     remote: 'Marcos.htm' },
  { local: 'evang_lucas.htm.html',                 remote: 'Lucas.htm' },
  { local: 'evang_juan.htm.html',                  remote: 'Juan.htm' },
  // Tomo VI
  { local: 'Hechos-apostoles.htm.html',            remote: 'Hechos.htm' },
  { local: 'introduccion_epistolas_paulinas.htm.html', remote: 'Introduccion_epist_paulinas.htm' },
  { local: 'Romanos.htm.html',                     remote: 'Romanos.htm' },
  { local: 'Corintios_1.htm.html',                 remote: 'Corintios_1.htm' },
  { local: 'Corintios_2.htm.html',                 remote: 'Corintios_2.htm' },
  { local: 'Galatas.htm.html',                     remote: 'Galatas.htm' },
  { local: 'Efesios.htm.html',                     remote: 'Efesios.htm' },
  { local: 'Filipenses.htm.html',                  remote: 'Filipenses.htm' },
  { local: 'Colosenses.htm.html',                  remote: 'Colosenses.htm' },
  { local: 'Tesalonicenses_1.htm.html',            remote: 'Tesalonicenses_1.htm' },
  { local: 'Tesalonicenses_2.htm.html',            remote: 'Tesalonicenses_2.htm' },
  { local: 'las_cartas_pastorales.htm.html',       remote: 'Cartas_pastorales.htm' },
  { local: 'Timoteo_1.htm.html',                   remote: 'Timoteo_1.htm' },
  { local: 'Timoteo_2.htm.html',                   remote: 'Timoteo_2.htm' },
  { local: 'Tito.htm.html',                        remote: 'Tito.htm' },
  { local: 'Filemon.htm.html',                     remote: 'Filemon.htm' },
  { local: 'hebreos.htm.html',                     remote: 'Hebreos.htm' },
  { local: 'epistolas_catolicas.htm.html',         remote: 'Epistolas_catol_introduccion.htm' },
  { local: 'Santiago.htm.html',                    remote: 'Santiago.htm' },
  { local: 'Pedro_1.htm.html',                     remote: 'Pedro_1.htm' },
  { local: 'Pedro_2.htm.html',                     remote: 'Pedro_2.htm' },
  { local: 'Juan_1.htm.html',                      remote: 'Juan_1.htm' },
  { local: 'Juan_2_y_3.htm.html',                  remote: 'Juan_2_y_3.htm' },
  { local: 'San_Judas.htm.html',                   remote: 'San_Judas.htm' },
  { local: 'apocalipsis.htm.html',                 remote: 'Apocalipsis.htm' },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': UA } };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks) }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  const results = [];
  for (const item of PENDING) {
    const url = BASE_URL + item.remote;
    process.stdout.write(`Trying ${item.remote}... `);
    try {
      const { status, buf } = await fetchUrl(url);
      if (status === 200 && buf.length > 10000) {
        const rawPath = `pages/${item.local}.raw`;
        fs.writeFileSync(rawPath, buf);
        console.log(`OK (${buf.length} bytes)`);
        results.push({ ...item, status: 'ok', size: buf.length });
      } else {
        console.log(`SKIP (status=${status}, size=${buf.length})`);
        results.push({ ...item, status: 'missing', size: buf.length });
      }
    } catch(e) {
      console.log(`ERROR: ${e.message}`);
      results.push({ ...item, status: 'error', error: e.message });
    }
  }

  console.log('\n=== SUMMARY ===');
  results.forEach(r => console.log(`[${r.status.toUpperCase()}] ${r.remote} -> ${r.local}`));
  fs.writeFileSync('scratch/download_results.json', JSON.stringify(results, null, 2));
}

main().catch(console.error);
