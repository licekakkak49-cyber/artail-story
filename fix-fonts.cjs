const fs = require('fs');
const file = '/Users/aliceer/wayd-gallery-2/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard fonts
content = content.replace(/font-inter-tight/g, 'font-helvetica');
content = content.replace(/font-inter/g, 'font-helvetica');

// Replace heading fonts and ensure they are bold
content = content.replace(/font-bebas/g, 'font-helvetica font-bold');
content = content.replace(/font-aura/g, 'font-helvetica font-bold');

// Remove redundant font-helvetica duplicates just in case
content = content.replace(/font-helvetica font-helvetica/g, 'font-helvetica');

// Also remove the @import for Inter, Inter Tight, Bebas Neue from the style tag
// The style tag contains:
// @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap');
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
// @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
content = content.replace(/@import url\('https:\/\/fonts.googleapis.com\/css2\?family=Inter\+Tight[^']*'\);\n\s*/g, '');
content = content.replace(/@import url\('https:\/\/fonts.googleapis.com\/css2\?family=Inter[^']*'\);\n\s*/g, '');
content = content.replace(/@import url\('https:\/\/fonts.googleapis.com\/css2\?family=Bebas\+Neue[^']*'\);\n\s*/g, '');

content = content.replace(/\.font-bebas \{ [^\}]+\} \n\s*/g, '');
content = content.replace(/\.font-inter \{ [^\}]+\} \n\s*/g, '');
content = content.replace(/\.font-inter-tight \{ [^\}]+\} \n\s*/g, '');

fs.writeFileSync(file, content, 'utf8');
console.log('Fonts updated');
