const fs = require('fs');
let perfil = fs.readFileSync('app/perfil/page.tsx', 'utf8');

// Replace HAIRBONA
perfil = perfil.replace(/HAIRBONA/g, 'VASCOCO');
perfil = perfil.replace(/alt="Hairbona"/g, 'alt="Vascoco"');

// Fix text colors in perfil
// The user said text is illegible, which implies dark text on dark green background.
// Common dark text classes: text-dark-500, text-dark-400, text-dark-800, text-[var(--color-text-main)], text-[var(--color-text-muted)], text-black
perfil = perfil.replace(/text-dark-500/g, 'text-[var(--color-ivory-300)] opacity-80');
perfil = perfil.replace(/text-dark-400/g, 'text-[var(--color-ivory-300)] opacity-80');
perfil = perfil.replace(/text-dark-600/g, 'text-[var(--color-ivory-300)] opacity-80');
perfil = perfil.replace(/text-dark-800/g, 'text-[var(--color-ivory-300)] opacity-80');
perfil = perfil.replace(/text-\[var\(--color-text-muted\)\]/g, 'text-[var(--color-ivory-300)] opacity-80');
perfil = perfil.replace(/text-\[var\(--color-text-main\)\]/g, 'text-[var(--color-ivory-200)]');
perfil = perfil.replace(/text-dark-900/g, 'text-[var(--color-ivory-200)]');
perfil = perfil.replace(/text-black/g, 'text-[var(--color-ivory-200)]');

fs.writeFileSync('app/perfil/page.tsx', perfil, 'utf8');

['app/terminos/page.tsx', 'app/privacidad/page.tsx'].forEach(file => {
  let txt = fs.readFileSync(file, 'utf8');
  txt = txt.replace(/HAIRBONA/g, 'VASCOCO');
  fs.writeFileSync(file, txt, 'utf8');
});

console.log('Fixed everything');
