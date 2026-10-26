const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('pages').filter(f => f.endsWith('.htm.html'));
console.log('Total HTML pages:', files.length);

let broken = 0;
let checked = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join('pages', file), 'utf8');
  const regex = /href=["']\.\.\/pages\/([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    checked++;
    const fullTarget = match[1];
    const targetFile = fullTarget.split('#')[0];
    if (!fs.existsSync(path.join('pages', targetFile))) {
      console.error(`Broken link in ${file} -> ${targetFile}`);
      broken++;
    }
  }
}

console.log(`Checked ${checked} inter-page links.`);
if (broken === 0) {
  console.log('PERFECT: All inter-page links point to valid existing files on disk!');
} else {
  console.log(`Found ${broken} broken links.`);
}
