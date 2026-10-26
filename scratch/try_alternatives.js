/**
 * Intenta variantes de URL para los archivos que dieron 404
 */
const https = require('https');
const fs = require('fs');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const MISSING = [
  // Mateo 10-18 y 19-fin: el archivo de mercaba se llama diferente
  { local: 'evang_mateo_10-18.htm.html',       candidates: ['Mateo_10-18.htm', 'Mateo10-18.htm', 'Mateo_010-018.htm', 'Mateo10.htm'] },
  { local: 'evang_mateo_19-fin.htm.html',      candidates: ['Mateo_19-fin.htm', 'Mateo19-fin.htm', 'Mateo19.htm', 'Mateo_19.htm'] },
  { local: 'evangelio_de_san_marcos.htm.html', candidates: ['Marcos.htm', 'San_Marcos.htm', 'Evangelio_Marcos.htm', 'evangelio_san_marcos.htm'] },
  { local: 'evang_lucas.htm.html',             candidates: ['Lucas.htm', 'San_Lucas.htm', 'Evangelio_Lucas.htm'] },
  { local: 'evang_juan.htm.html',              candidates: ['Juan.htm', 'San_Juan.htm', 'Evangelio_Juan.htm', 'Juan_evangelio.htm'] },
  { local: 'Hechos-apostoles.htm.html',        candidates: ['Hechos.htm', 'Hechos_apostoles.htm', 'Hechos-apostoles.htm'] },
  { local: 'las_cartas_pastorales.htm.html',   candidates: ['Cartas_pastorales.htm', 'Introduccion_cartas_pastorales.htm', 'las_cartas_pastorales.htm'] },
  { local: 'epistolas_catolicas.htm.html',     candidates: ['Epistolas_catol_introduccion.htm', 'Epistolas_catolicas.htm', 'Introduccion_epistolas_catol.htm', 'Epistolas_cat_intro.htm'] },
];

const BASE = 'https://www.mercaba.org/Biblia/Comentada/';

function fetchHead(url) {
  return new Promise((resolve) => {
    const options = { method: 'HEAD', headers: { 'User-Agent': UA } };
    const req = https.request(url, options, (res) => {
      resolve({ url, status: res.statusCode, size: res.headers['content-length'] });
    });
    req.on('error', () => resolve({ url, status: 0, size: 0 }));
    req.end();
  });
}

function fetchFull(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': UA } };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchFull(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks) }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  for (const item of MISSING) {
    console.log(`\n--- ${item.local} ---`);
    let found = false;
    for (const cand of item.candidates) {
      const url = BASE + cand;
      const { status, size } = await fetchHead(url);
      console.log(`  HEAD ${cand}: ${status} (${size || '?'} bytes)`);
      if (status === 200) {
        const { buf } = await fetchFull(url);
        if (buf.length > 10000) {
          fs.writeFileSync(`pages/${item.local}.raw`, buf);
          console.log(`  --> SAVED (${buf.length} bytes)`);
          found = true;
          break;
        }
      }
    }
    if (!found) console.log(`  --> NOT FOUND on mercaba`);
  }
  console.log('\nDone.');
}

main().catch(console.error);
