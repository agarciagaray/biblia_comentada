const https = require('https');
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const BASE = 'https://www.mercaba.org/Biblia/Comentada/';

const FILES = [
  { remote: 'evang_mateo_10-18.htm', local: 'evang_mateo_10-18.htm.html.raw' },
  { remote: 'evang_mateo_19-fin.htm', local: 'evang_mateo_19-fin.htm.html.raw' },
  { remote: 'evangelio_de_san_marcos.htm', local: 'evangelio_de_san_marcos.htm.html.raw' },
  { remote: 'evang_lucas.htm', local: 'evang_lucas.htm.html.raw' },
  { remote: 'evang_juan.htm', local: 'evang_juan.htm.html.raw' },
  { remote: 'introduccion_epistolas_paulinas.htm', local: 'introduccion_epistolas_paulinas.htm.html.raw' },
  { remote: 'epistolas_catolicas.htm', local: 'epistolas_catolicas.htm.html.raw' }
];

function download(item) {
  return new Promise((resolve, reject) => {
    const url = BASE + item.remote;
    console.log(`Downloading: ${url} -> ${item.local}...`);
    https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return https.get(res.headers.location, { headers: { 'User-Agent': UA } }, (res2) => {
          saveStream(res2, item, resolve, reject);
        });
      }
      saveStream(res, item, resolve, reject);
    }).on('error', reject);
  });
}

function saveStream(res, item, resolve, reject) {
  const dest = path.join('pages', item.local);
  const fileStream = fs.createWriteStream(dest);
  let totalBytes = 0;
  res.on('data', chunk => {
    totalBytes += chunk.length;
  });
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    fileStream.close(() => {
      console.log(`Saved ${item.local} (${totalBytes} bytes)`);
      resolve({ file: item.local, bytes: totalBytes });
    });
  });
  fileStream.on('error', reject);
}

async function run() {
  for (const item of FILES) {
    try {
      await download(item);
    } catch (err) {
      console.error(`Error downloading ${item.remote}:`, err.message);
    }
  }
  console.log('All downloads finished!');
}

run();
