const fs = require('fs');
let txt = fs.readFileSync('app/page.tsx', 'utf8');

// Remove the map pin block correctly
txt = txt.replace(/<p className="text-\[var\(--color-ivory-300\)\] font-medium mb-8\">[\s\S]*?<\/p>/, '');

// Fix corrupted characters
txt = txt.replace(/Términos/g, 'Términos');
txt = txt.replace(/Trminos/g, 'Términos');
txt = txt.replace(/TǸrminos/g, 'Términos');
txt = txt.replace(/Poltica/g, 'Política');
txt = txt.replace(/NeuquǸn/g, 'Neuquén');
txt = txt.replace(/Junn/g, 'Junín');
txt = txt.replace(/Junn/g, 'Junín');
txt = txt.replace(/Galera/g, 'Galería');
txt = txt.replace(/Reseas/g, 'Reseñas');
txt = txt.replace(/Poltica/g, 'Política');
txt = txt.replace(/Y"/g, '📍');

fs.writeFileSync('app/page.tsx', txt, 'utf8');
console.log('Fixed page.tsx map pin and chars');
