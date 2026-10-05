const fs = require('fs');
let txt = fs.readFileSync('app/page.tsx', 'utf8');
txt = txt.replace(/<p className="text-\[var\(--color-ivory-300\)\] font-medium mb-8\">\s*📍.*?<\/p>/, '');
fs.writeFileSync('app/page.tsx', txt, 'utf8');
console.log('Removed map pin');
