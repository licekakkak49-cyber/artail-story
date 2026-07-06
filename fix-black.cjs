const fs = require('fs');
const file = '/Users/aliceer/wayd-gallery-2/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-\[#111111\]/g, 'bg-black');
content = content.replace(/text-\[#111111\]/g, 'text-black');
content = content.replace(/border-\[#111111\]/g, 'border-black');
content = content.replace(/bg-\[#111111\]\/85/g, 'bg-black/85');

fs.writeFileSync(file, content, 'utf8');
console.log('Colors updated to pure black');
