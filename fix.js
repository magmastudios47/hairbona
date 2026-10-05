const fs = require('fs');
function updateFile(file, replacements) {
  let txt = fs.readFileSync(file, 'utf8');
  replacements.forEach(([from, to]) => {
    txt = txt.split(from).join(to);
  });
  fs.writeFileSync(file, txt, 'utf8');
}

updateFile('app/privacidad/page.tsx', [
  ['text-dark-500', 'text-[var(--color-ivory-300)] opacity-80'],
  ['text-dark-400', 'text-[var(--color-ivory-300)] opacity-80'],
  ['<p>', '<p className=\"text-[var(--color-ivory-200)] opacity-90\">'],
  ['text-gold-500', 'text-accent-400'],
  ['text-gold-400', 'text-accent-400'],
  ['Hairbona', 'Vascoco'],
  ['hairbona_fr', 'vascoco.be'],
  ['https://www.instagram.com/hairbona_fr', 'https://www.instagram.com/vascoco.be'],
  ['border-dark-800', 'border-[var(--color-border-subtle)]']
]);

updateFile('app/terminos/page.tsx', [
  ['text-dark-500', 'text-[var(--color-ivory-300)] opacity-80'],
  ['text-dark-400', 'text-[var(--color-ivory-300)] opacity-80'],
  ['<p>', '<p className=\"text-[var(--color-ivory-200)] opacity-90\">'],
  ['text-gold-500', 'text-accent-400'],
  ['text-gold-400', 'text-accent-400'],
  ['Hairbona', 'Vascoco'],
  ['hairbona_fr', 'vascoco.be'],
  ['https://www.instagram.com/hairbona_fr', 'https://www.instagram.com/vascoco.be'],
  ['border-dark-800', 'border-[var(--color-border-subtle)]']
]);
console.log('Fixed terminos and privacidad');
