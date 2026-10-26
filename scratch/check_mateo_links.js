const fs = require('fs');
const html = fs.readFileSync('pages/evang_mateo_00-09.htm.html', 'utf8');
const links = [];
const regex = /href=["']([^"']+)["']/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  links.push(match[1]);
}
console.log('Total links:', links.length);
console.log('Sample links:', [...new Set(links)].filter(l => !l.startsWith('#')).slice(0, 30));
