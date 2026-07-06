const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Remove HOURS block
const hoursBlockStart = '               <div className="flex flex-col gap-2">\n                 <span className="font-helvetica font-black text-xl text-black uppercase">HOURS</span>';
const hoursBlockEnd = '               </div>\n\n               <div className="flex flex-col gap-2">\n                 <span className="font-helvetica font-black text-xl text-black uppercase">CONTACT</span>';
const hoursRegex = new RegExp('               <div className="flex flex-col gap-2">\\s*<span className="font-helvetica font-black text-xl text-black uppercase">HOURS</span>[\\s\\S]*?</div>\\s*</div>\\s*<div className="flex flex-col gap-2">\\s*<span className="font-helvetica font-black text-xl text-black uppercase">CONTACT</span>');
content = content.replace(hoursRegex, '               <div className="flex flex-col gap-2">\n                 <span className="font-helvetica font-black text-xl text-black uppercase">CONTACT</span>');

// 2. Remove COORDINATES block
const coordsRegex = new RegExp('            <div className="flex flex-col gap-2">\\s*<span className="font-helvetica font-black text-xl text-black uppercase">COORDINATES \\(LAT, LONG\\)</span>[\\s\\S]*?</div>\\s*<div className="flex flex-col gap-2">\\s*<span className="font-helvetica font-black text-xl text-black uppercase">GOOGLE MAP EMBED URL \\(IFRAME SRC\\)</span>');
content = content.replace(coordsRegex, '            <div className="flex flex-col gap-2">\n               <span className="font-helvetica font-black text-xl text-black uppercase">GOOGLE MAP EMBED URL (IFRAME SRC)</span>');

// 3. Rename BAR SPACE PHOTO
content = content.replace(
  '<span className="font-helvetica font-black text-xl text-black uppercase mb-4">BAR SPACE PHOTO</span>',
  '<span className="font-helvetica font-black text-xl text-black uppercase mb-4">VISIT BANNER IMAGE</span>'
);

fs.writeFileSync('src/App.jsx', content);
console.log('AdminStudioSettings updated successfully!');
