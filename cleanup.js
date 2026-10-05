const fs = require('fs');

const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Cleanup stray classes from script replacement
content = content.replace(/ hover: transition-all duration-500  cursor-pointer/g, ' cursor-pointer');
content = content.replace(/hover: transition-all duration-500 /g, '');
content = content.replace(/ hover:-translate-y-2 transition-transform duration-500 /g, ' ');
content = content.replace(/ transition-transform duration-700 /g, ' transition-all duration-300 ');
content = content.replace(/ border-accent-500\/30 /g, ' border-primary-700 ');

fs.writeFileSync(file, content, 'utf8');
console.log(`Cleaned up page.tsx`);
