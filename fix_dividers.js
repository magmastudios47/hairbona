const fs = require('fs');

const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace all gradients dividers with solid lines
content = content.replace(/<div className="mt-4 mx-auto w-20 h-0\.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"><\/div>/g, '<div className="mt-6 mx-auto w-16 h-1 bg-accent-500"></div>');

// The original target was already partially replaced, so it might have 'via-gold-500' 
fs.writeFileSync(file, content, 'utf8');
console.log(`Updated page dividers`);
