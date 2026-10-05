const fs = require('fs');

const pageContent = fs.readFileSync('app/page.tsx', 'utf8');
const lostFunc = fs.readFileSync('lost_functions.tsx', 'utf8');

// The file has:
//     window.addEventListener('scroll', handleScroll);
//     <div className="min-h-screen
const targetStr = "    window.addEventListener('scroll', handleScroll);\n    <div className=\"min-h-screen";
if (pageContent.includes(targetStr)) {
  const newContent = pageContent.replace(targetStr, "    window.addEventListener('scroll', handleScroll);\n" + lostFunc + "    <div className=\"min-h-screen");
  fs.writeFileSync('app/page.tsx', newContent, 'utf8');
  console.log('Fixed successfully');
} else {
  console.log('Target string not found');
}
