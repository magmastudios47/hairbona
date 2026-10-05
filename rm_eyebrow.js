const fs = require('fs');

let txt = fs.readFileSync('app/page.tsx', 'utf8');

// Find the eyebrow block
const eyebrowStart = txt.indexOf('{/* Small eyebrow text */}');
if (eyebrowStart !== -1) {
  const eyebrowEnd = txt.indexOf('</div>', eyebrowStart) + 6;
  const blockToRemove = txt.substring(eyebrowStart, eyebrowEnd);
  
  txt = txt.replace(blockToRemove + '\\n            ', ''); // Also remove trailing spaces
  fs.writeFileSync('app/page.tsx', txt, 'utf8');
  console.log('Removed eyebrow text');
} else {
  console.log('Could not find eyebrow text');
}
