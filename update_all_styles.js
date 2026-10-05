const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Backgrounds
    content = content.replace(/bg-primary-950/g, 'bg-[var(--color-bg-main)] text-[var(--color-text-main)]');
    content = content.replace(/bg-primary-900/g, 'bg-[var(--color-surface)]');
    content = content.replace(/bg-primary-800/g, 'bg-[var(--color-surface)] hover:bg-[var(--color-bg-main)]');
    content = content.replace(/bg-dark-950/g, 'bg-[var(--color-bg-main)] text-[var(--color-text-main)]');
    content = content.replace(/bg-dark-900/g, 'bg-[var(--color-surface)]');
    content = content.replace(/bg-dark-800\/50/g, 'border-[var(--color-border-subtle)]');
    content = content.replace(/bg-dark-800/g, 'bg-[var(--color-surface)]');
    content = content.replace(/bg-dark-700/g, 'bg-[var(--color-border-subtle)]');
    
    // Texts
    content = content.replace(/text-neutral-50/g, 'text-[var(--color-text-main)]');
    content = content.replace(/text-primary-300/g, 'text-[var(--color-text-main)]');
    content = content.replace(/text-primary-400/g, 'text-[var(--color-text-muted)]');
    content = content.replace(/text-primary-500/g, 'text-[var(--color-text-muted)]');
    content = content.replace(/text-dark-300/g, 'text-[var(--color-text-main)]');
    content = content.replace(/text-dark-400/g, 'text-[var(--color-text-muted)]');
    content = content.replace(/text-dark-500/g, 'text-[var(--color-text-muted)]');
    content = content.replace(/text-dark-600/g, 'text-[var(--color-text-muted)]');
    content = content.replace(/text-dark-950/g, 'text-[var(--color-ivory-200)]');
    
    // Placeholders
    content = content.replace(/placeholder-dark-500/g, 'placeholder-[var(--color-text-muted)]');
    
    // Borders
    content = content.replace(/border-dark-800\/50/g, 'border-[var(--color-border-subtle)]');
    content = content.replace(/border-dark-800/g, 'border-[var(--color-border-subtle)]');
    content = content.replace(/border-dark-700/g, 'border-[var(--color-border-subtle)]');
    content = content.replace(/border-primary-800/g, 'border-[var(--color-border-subtle)]');
    content = content.replace(/border-gold-500/g, 'border-accent-400');
    
    // Accents
    content = content.replace(/bg-gold-500\/10/g, 'bg-accent-400/10');
    content = content.replace(/bg-gold-500\/3/g, 'bg-accent-400/5');
    content = content.replace(/bg-gold-700\/3/g, 'bg-accent-400/5');
    content = content.replace(/bg-gold-500/g, 'bg-accent-400');
    content = content.replace(/text-gold-500/g, 'text-accent-400');
    content = content.replace(/text-gold-400/g, 'text-accent-400');
    content = content.replace(/border-t-gold-500/g, 'border-t-accent-400');
    content = content.replace(/ring-gold-500\/30/g, 'ring-accent-400/30');
    
    // Rounding & cards
    content = content.replace(/rounded-sm/g, 'rounded-lg');
    content = content.replace(/rounded-md/g, 'rounded-xl');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fullPath.includes('app\\page.tsx') || fullPath.includes('app\\globals.css') || fullPath.includes('app\\layout.tsx') || fullPath.includes('app/page.tsx') || fullPath.includes('app/globals.css') || fullPath.includes('app/layout.tsx')) {
            continue;
        }
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

traverse('app');
console.log("All legacy styles updated successfully.");
