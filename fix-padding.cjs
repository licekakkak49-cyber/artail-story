const fs = require('fs');
const file = '/Users/aliceer/wayd-gallery-2/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Global nav padding
content = content.replace(
  /pt-\[32px\] pb-\[32px\]/g,
  'pt-[48px] pb-[48px]'
);

// Overlay navs padding
content = content.replace(
  /px-6 py-8 md:px-12 md:py-12/g,
  'px-6 py-10 md:px-12 md:py-16'
);

content = content.replace(
  /className=\{`sticky top-0 w-full z-50 py-4/g,
  'className={`sticky top-0 w-full z-50 py-6 md:py-8'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Padding updated');
