const fs = require('fs');
const file = '/Users/aliceer/wayd-gallery-2/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Increase logo size
content = content.replace(
  /className="h-12 sm:h-14 md:h-16 object-contain brightness-0 invert"/g,
  'className="h-14 sm:h-16 md:h-20 object-contain brightness-0 invert"'
);
content = content.replace(
  /className="h-12 sm:h-14 md:h-16 object-contain brightness-0"/g,
  'className="h-14 sm:h-16 md:h-20 object-contain brightness-0"'
);

// Increase top/bottom padding for the global nav
content = content.replace(
  /pt-\[20px\] pb-\[20px\]/g,
  'pt-[32px] pb-[32px]'
);

// Increase top/bottom padding for CatalogueOverlay nav, VisitOverlay nav, EditorialOverlay nav, MenuDetailOverlay nav
// Overlays currently have navs with flex items-center justify-between p-6 md:p-12
content = content.replace(
  /p-6 md:p-12/g,
  'px-6 py-8 md:px-12 md:py-12'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Navs updated');
