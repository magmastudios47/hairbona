const fs = require('fs');
let txt = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /<div className="flex items-center justify-center gap-4 text-xs font-medium text-\[var\(--color-ivory-300\)\] opacity-60 mb-6\">[\s\S]*?<\/div>/;

const newBlock = `<div className="flex items-center justify-center gap-4 text-xs font-medium text-[var(--color-ivory-300)] opacity-60 mb-6">
            <a href="/terminos" className="hover:text-accent-400 underline">Términos y Condiciones</a>
            <span>|</span>
            <a href="/privacidad" className="hover:text-accent-400 underline">Política de Privacidad</a>
          </div>`;

txt = txt.replace(regex, newBlock);
fs.writeFileSync('app/page.tsx', txt, 'utf8');
console.log('Fixed footer links in page.tsx');
