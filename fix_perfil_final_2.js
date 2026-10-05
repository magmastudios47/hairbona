const fs = require('fs');
let txt = fs.readFileSync('app/perfil/page.tsx', 'utf8');

// Replace all remaining bad color variables
txt = txt.replace(/var\(--color-text-main\)/g, 'var(--color-ivory-200)');
txt = txt.replace(/var\(--color-text-muted\)/g, 'var(--color-ivory-300)');
txt = txt.replace(/var\(--color-bg-main\)/g, 'var(--color-green-900)');
txt = txt.replace(/text-black/g, 'text-white');
txt = txt.replace(/btn-primary/g, 'bg-accent-400 text-[var(--color-green-950)] hover:bg-accent-600 transition-colors');

fs.writeFileSync('app/perfil/page.tsx', txt, 'utf8');
console.log('Fixed all bad variables in perfil');
