const fs = require('fs');
let txt = fs.readFileSync('app/perfil/page.tsx', 'utf8');

// 1. Change solid-card to glass
txt = txt.replace(/solid-card/g, 'glass');

// 2. Change gold colors to accent colors
txt = txt.replace(/gold-400/g, 'accent-400');
txt = txt.replace(/gold-500/g, 'accent-400'); // accent-400 is fine, or accent-600. Let's use accent-400 for consistency.
txt = txt.replace(/glow-gold/g, 'glow-accent'); // glow-gold might not exist, but just in case
txt = txt.replace(/btn-gold/g, 'btn-primary'); // wait, btn-gold might be defined in css. Let me leave btn-gold.
txt = txt.replace(/gold-gradient/g, 'text-accent-400');

fs.writeFileSync('app/perfil/page.tsx', txt, 'utf8');
console.log('Fixed card and gold colors');
