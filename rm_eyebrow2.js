const fs = require('fs');
let txt = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /\{\/\* Small eyebrow text \*\/\}[\s\S]*?<\/div>\s+/;
txt = txt.replace(regex, '');
fs.writeFileSync('app/page.tsx', txt, 'utf8');
console.log('Done');
