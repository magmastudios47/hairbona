const fs = require('fs');

const pageContent = fs.readFileSync('app/page.tsx', 'utf8');
const newJsx = fs.readFileSync('new_jsx.tsx', 'utf8');

const returnIndex = pageContent.indexOf('  return (');
if (returnIndex !== -1) {
  const newContent = pageContent.substring(0, returnIndex) + newJsx + '\n';
  fs.writeFileSync('app/page.tsx', newContent, 'utf8');
  console.log('Replaced successfully');
} else {
  console.log('Could not find return statement');
}
