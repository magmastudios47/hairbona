const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Container & Typography
content = content.replace(/bg-ivory-200 text-green-950/g, 'bg-[var(--color-bg-main)] text-[var(--color-text-main)]');
content = content.replace(/text-green-800/g, 'text-[var(--color-text-muted)]');
content = content.replace(/text-green-950/g, 'text-[var(--color-text-main)]');
content = content.replace(/bg-ivory-[0-9]+/g, 'bg-[var(--color-surface)]');

// Nav adjustments
// Make nav text cream when transparent or green
content = content.replace(/bg-transparent py-4/g, 'bg-transparent py-4');
content = content.replace(/bg-ivory-100 shadow-md border-b-2 border-green-900/g, 'nav-bar');
content = content.replace(/text-green-950/g, 'text-green-900');

// Hero adjustments
content = content.replace(/btn-solid px-10 py-4 text-lg sm:text-xl shadow-\[4px_4px_0px_var\(--color-green-900\)\] hover:shadow-\[6px_6px_0px_var\(--color-green-900\)\]/g, 'btn-cta px-10 py-4 text-lg sm:text-xl');

// Section Backgrounds
content = content.replace(/bg-green-900 border-b-4 border-accent-400 text-ivory-200/g, 'bg-green-900 text-ivory-200 py-20');
content = content.replace(/bg-ivory-200 border-b-4 border-green-900/g, 'bg-[var(--color-bg-main)] py-20');
content = content.replace(/border-b-4 border-green-900/g, ''); // remove brutalist borders
content = content.replace(/border-b-2 border-green-900/g, 'border-b border-gray-200');
content = content.replace(/border-2 border-green-900/g, ''); // remove brutalist borders
content = content.replace(/border-4 border-green-800/g, ''); 

// Fix shadows and borders for specific things
content = content.replace(/shadow-\[6px_6px_0px_var\(--color-green-900\)\]/g, 'shadow-lg');
content = content.replace(/shadow-\[4px_4px_0px_var\(--color-green-900\)\]/g, 'shadow-md');
content = content.replace(/shadow-\[6px_6px_0px_rgba\(212,175,55,1\)\]/g, 'shadow-lg');

// Text Colors on dark
content = content.replace(/text-ivory-100/g, 'text-[var(--color-ivory-200)]');
content = content.replace(/text-ivory-200/g, 'text-[var(--color-ivory-200)]');

// Fonts
content = content.replace(/font-heading/g, 'font-heading font-medium');

// Gallery
content = content.replace(/aspect-square border-4 hover:border-accent-400 transition-colors cursor-pointer relative overflow-hidden group/g, 'gallery-solid aspect-square cursor-pointer relative overflow-hidden group');

// Button specific CTA classes
content = content.replace(/btn-solid px-6 py-2 ml-4/g, 'btn-cta px-6 py-2 ml-4');
content = content.replace(/btn-solid px-4 py-3 mt-2 text-center/g, 'btn-cta px-4 py-3 mt-2 text-center');

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('Page styles updated to soft modern theme');
