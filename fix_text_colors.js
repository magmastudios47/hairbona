const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Fix title colors to be Forest Green
content = content.replace(/text-\[var\(--color-text-main\)\] mb-6/g, 'text-[var(--color-green-900)] mb-6');
content = content.replace(/text-\[var\(--color-text-main\)\]">Servicios/g, 'text-[var(--color-green-900)]">Servicios');
content = content.replace(/text-\[var\(--color-ivory-200\)\]">Tienda/g, 'text-[var(--color-ivory-200)]">Tienda');
content = content.replace(/text-\[var\(--color-text-main\)\]">El Equipo/g, 'text-[var(--color-green-900)]">El Equipo');
content = content.replace(/text-\[var\(--color-text-main\)\]">Reseñas/g, 'text-[var(--color-green-900)]">Reseñas');
content = content.replace(/text-\[var\(--color-text-main\)\] mb-6">Dejanos tu opinión/g, 'text-[var(--color-green-900)] mb-6">Dejanos tu opinión');
content = content.replace(/text-\[var\(--color-text-main\)\]">Tu Carrito/g, 'text-[var(--color-green-900)]">Tu Carrito');

// Fix conflicting font weights
content = content.replace(/font-heading font-medium font-black/g, 'font-heading font-bold');
content = content.replace(/font-heading font-medium/g, 'font-heading font-bold');

// Fix the empty strings that were left by the previous replace
content = content.replace(/  shadow-md/g, ' shadow-md');

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('Fixed headings to forest green and cleaned up font weights');
