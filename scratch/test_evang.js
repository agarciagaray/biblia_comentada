const https = require('https');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const candidates = [
  'evang_mateo_00-09.htm',
  'evang_mateo_10-18.htm',
  'evang_mateo_19-fin.htm',
  'evang_mateo_19-28.htm',
  'evang_mateo_19_fin.htm',
  'evang_mateo_19-28.htm',
  'evang_marcos.htm',
  'evangelio_de_san_marcos.htm',
  'evang_de_san_marcos.htm',
  'evang_lucas.htm',
  'evang_juan.htm',
  'introduccion_epistolas_paulinas.htm',
  'introduccion_epist_paulinas.htm',
  'epistolas_catolicas.htm',
  'epistolas_catol_introduccion.htm'
];

function check(file) {
  return new Promise((resolve) => {
    const url = 'https://www.mercaba.org/Biblia/Comentada/' + file;
    https.request(url, { method: 'HEAD', headers: { 'User-Agent': UA } }, (res) => {
      resolve({ file, status: res.statusCode, size: res.headers['content-length'] });
    }).on('error', e => resolve({ file, error: e.message })).end();
  });
}

async function run() {
  for (const c of candidates) {
    const r = await check(c);
    console.log(r.file, '--> Status:', r.status, 'Size:', r.size);
  }
}
run();
