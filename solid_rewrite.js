const fs = require('fs');

const filesToUpdate = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/reservar/page.tsx',
  'app/perfil/page.tsx',
  'app/admin/page.tsx',
  'app/admin/layout.tsx',
  'app/login/page.tsx',
  'components/WelcomeModal.tsx'
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace glass with solid-card
  content = content.replace(/\bglass\b/g, 'solid-card');
  content = content.replace(/\bglass-light\b/g, 'solid-card bg-primary-800');
  
  // Replace buttons
  content = content.replace(/\bbtn-gold\b/g, 'btn-solid');
  
  // Replace rounded borders with sharp or small rounding
  content = content.replace(/\brounded-3xl\b/g, 'rounded-sm');
  content = content.replace(/\brounded-2xl\b/g, 'rounded-sm');
  content = content.replace(/\brounded-xl\b/g, 'rounded-sm');
  content = content.replace(/\brounded-lg\b/g, 'rounded-sm');
  content = content.replace(/\brounded-full\b/g, 'rounded-sm'); // For standard things
  
  // Wait, logo might need to be rounded or not. Let's fix logo specifically later.

  // Colors
  content = content.replace(/\bbg-dark-950\b/g, 'bg-primary-950');
  content = content.replace(/\bbg-dark-900\b/g, 'bg-primary-900');
  content = content.replace(/\bbg-dark-800\b/g, 'bg-primary-800');
  content = content.replace(/\btext-dark-100\b/g, 'text-neutral-100');
  content = content.replace(/\btext-dark-300\b/g, 'text-primary-300');
  content = content.replace(/\btext-dark-400\b/g, 'text-primary-400');
  content = content.replace(/\btext-dark-500\b/g, 'text-primary-500');
  content = content.replace(/\btext-white\b/g, 'text-neutral-50');
  
  // Text gold
  content = content.replace(/\btext-gold-gradient\b/g, 'heading-solid');
  content = content.replace(/\btext-gold-500\b/g, 'text-accent-500');
  content = content.replace(/\btext-gold-400\b/g, 'text-accent-400');
  content = content.replace(/\btext-gold-300\b/g, 'text-accent-300');
  content = content.replace(/\bborder-gold-500\b/g, 'border-accent-500');
  content = content.replace(/\bborder-gold-400\b/g, 'border-accent-400');

  // Drop glows and animations that are too soft
  content = content.replace(/\bhxrightarrow-y-1\b/g, '');
  content = content.replace(/\bglow-gold\b/g, '');
  content = content.replace(/\banimate-pulse-gold\b/g, '');
  content = content.replace(/\banimate-pulse\b/g, '');
  
  // Photos
  content = content.replace(/\bgallery-photo\b/g, 'gallery-solid');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
