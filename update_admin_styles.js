const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Backgrounds
    content = content.replace(/bg-primary-950/g, 'bg-[var(--color-bg-main)] text-[var(--color-text-main)]');
    content = content.replace(/bg-primary-900/g, 'bg-[var(--color-surface)]');
    content = content.replace(/bg-primary-800/g, 'bg-[var(--color-surface)] hover:bg-[var(--color-bg-main)]');
    content = content.replace(/bg-dark-900/g, 'bg-[var(--color-bg-main)]');
    content = content.replace(/bg-dark-800/g, 'bg-[var(--color-surface)]');
    content = content.replace(/bg-dark-700/g, 'bg-[var(--color-border-subtle)]');
    
    // Texts
    content = content.replace(/text-neutral-50/g, 'text-[var(--color-text-main)]');
    content = content.replace(/text-primary-400/g, 'text-[var(--color-text-muted)]');
    content = content.replace(/text-primary-500/g, 'text-[var(--color-text-muted)]');
    content = content.replace(/text-dark-400/g, 'text-[var(--color-text-muted)]');
    content = content.replace(/text-dark-600/g, 'text-[var(--color-text-muted)]');
    
    // Borders
    content = content.replace(/border-dark-800\/50/g, 'border-[var(--color-border-subtle)]');
    content = content.replace(/border-dark-800/g, 'border-[var(--color-border-subtle)]');
    content = content.replace(/border-primary-800/g, 'border-[var(--color-border-subtle)]');
    
    // Accents
    content = content.replace(/bg-gold-500\/10 text-accent-400/g, 'bg-accent-400/10 text-accent-400');
    content = content.replace(/text-gold-500/g, 'text-accent-400');
    content = content.replace(/text-gold-400/g, 'text-accent-400');
    content = content.replace(/bg-gold-500\/10/g, 'bg-accent-400/10');
    content = content.replace(/border-t-gold-500/g, 'border-t-accent-400');
    
    // Rounding & cards
    content = content.replace(/rounded-sm/g, 'rounded-lg');
    content = content.replace(/rounded-md/g, 'rounded-xl');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

traverse('app/admin');
console.log("Admin styles updated successfully.");
