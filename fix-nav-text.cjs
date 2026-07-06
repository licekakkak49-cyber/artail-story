const fs = require('fs');
const file = '/Users/aliceer/wayd-gallery-2/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// The classes currently applied to these nav links usually include:
// uppercase, font-bold, tracking-widest.
// We want to remove `uppercase` and `font-bold`, maybe keep `tracking-widest` or change it.
// Let's replace the common class string first:
content = content.replace(/font-helvetica font-bold uppercase/g, 'font-helvetica font-normal capitalize');
content = content.replace(/font-inter-tight font-bold uppercase/g, 'font-helvetica font-normal capitalize');
// Also some places might just have `uppercase font-bold` or similar. Let's just do targeted text replacements first to be safe, or just do the classes for the nav sections.

// Replacing exact text words in the UI
content = content.replace(/>CATALOGUE</g, '>Catalogue<');
content = content.replace(/>ABOUT</g, '>About<');
content = content.replace(/>VISIT</g, '>Visit<');
content = content.replace(/>\[ MENU \]</g, '>[ Menu ]<');
content = content.replace(/>HOME</g, '>Home<');
content = content.replace(/>CLOSE</g, '>Close<');

// Bag
content = content.replace(/>BAG \(/g, '>Bag (');

// Login / Account
content = content.replace(/'ACCOUNT' : 'LOGIN'/g, "'Account' : 'Login'");

// Previoius / Next
content = content.replace(/>PREVIOUS</g, '>Previous<');
content = content.replace(/>NEXT</g, '>Next<');

fs.writeFileSync(file, content, 'utf8');
console.log('Text cases updated');
