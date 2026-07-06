const fs = require('fs');
const file = '/Users/aliceer/wayd-gallery-2/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace D.svg logo in navbars
// Pattern: <img src=".../D.svg" alt="logo" className="h-9 sm:h-11 md:h-12 object-contain brightness-0" />
// Pattern: <img src=".../D.svg" alt="logo" className="h-9 sm:h-11 md:h-12 object-contain brightness-0 invert" />

content = content.replace(
  /<img src="[^"]*D\.svg" alt="logo" className="h-9 sm:h-11 md:h-12 object-contain brightness-0 invert" \/>/g,
  '<img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-12 sm:h-14 md:h-16 object-contain brightness-0 invert" />'
);

content = content.replace(
  /<img src="[^"]*D\.svg" alt="logo" className="h-9 sm:h-11 md:h-12 object-contain brightness-0" \/>/g,
  '<img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-12 sm:h-14 md:h-16 object-contain brightness-0" />'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Logo updated');
