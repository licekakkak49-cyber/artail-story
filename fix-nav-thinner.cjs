const fs = require('fs');
const file = '/Users/aliceer/wayd-gallery-2/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace font-normal with font-light for nav links
content = content.replace(/font-normal capitalize tracking-widest/g, 'font-light capitalize tracking-widest');

// Replace font-light with font-thin for mobile menus if they exist
content = content.replace(/font-light capitalize tracking-widest/g, 'font-thin capitalize tracking-widest');

fs.writeFileSync(file, content, 'utf8');
console.log('Nav fonts made thinner');
