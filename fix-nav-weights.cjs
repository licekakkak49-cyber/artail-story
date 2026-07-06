const fs = require('fs');
const file = '/Users/aliceer/wayd-gallery-2/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// The nav text containers have these classes:
// font-helvetica font-bold uppercase tracking-widest
content = content.replace(/font-helvetica font-bold uppercase tracking-widest/g, 'font-helvetica font-normal capitalize tracking-widest');
content = content.replace(/font-bold uppercase tracking-widest text-black/g, 'font-normal capitalize tracking-widest text-black');
content = content.replace(/font-bold uppercase tracking-widest text-\[#F5F5F5\]/g, 'font-normal capitalize tracking-widest text-[#F5F5F5]');
content = content.replace(/font-bold uppercase tracking-widest text-\[#111111\]/g, 'font-normal capitalize tracking-widest text-black');

// For mobile menu items (they were text-3xl font-bold)
content = content.replace(/text-3xl font-bold tracking-widest/g, 'text-2xl font-light capitalize tracking-widest');

fs.writeFileSync(file, content, 'utf8');
console.log('Nav weights updated');
