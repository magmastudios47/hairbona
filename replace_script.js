const fs = require('fs');
const path = require('path');

const directory = '.';
const extensions = ['.tsx', '.ts', '.js', '.json', '.md', '.css'];
const excludeDirs = ['node_modules', '.next', '.git'];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        processDirectory(fullPath);
      }
    } else {
      if (extensions.some(ext => fullPath.endsWith(ext))) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        const regex1 = /Vascoco/g;
        if (regex1.test(content)) {
          content = content.replace(regex1, 'Vascoco');
          modified = true;
        }

        const regex2 = /vascoco/g;
        if (regex2.test(content)) {
          content = content.replace(regex2, 'vascoco');
          modified = true;
        }

        const regex3 = /VASCOCO/g;
        if (regex3.test(content)) {
          content = content.replace(regex3, 'VASCOCO');
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  }
}

processDirectory(directory);
console.log('Done replacing.');
