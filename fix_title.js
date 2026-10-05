const fs = require('fs');

const files = ['app/perfil/page.tsx', 'app/privacidad/page.tsx', 'app/terminos/page.tsx'];

files.forEach(file => {
  let txt = fs.readFileSync(file, 'utf8');
  txt = txt.replace(/text-text-accent-400/g, 'text-[var(--color-ivory-200)]');
  txt = txt.replace(/text-gold-gradient/g, 'text-[var(--color-ivory-200)]'); // Just in case some didn't get replaced
  fs.writeFileSync(file, txt, 'utf8');
});

console.log('Fixed VASCOCO title colors');
