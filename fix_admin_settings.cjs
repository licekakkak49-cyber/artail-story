const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Rename tab in AdminLayout menuItems
content = content.replace(
  "{ id: 'settings', label: 'Site Settings'",
  "{ id: 'settings', label: 'Visit'"
);

// 2. Rename heading inside AdminStudioSettings
content = content.replace(
  '<h3 className="font-helvetica font-bold text-4xl tracking-wide uppercase text-black">Site Settings & Identity</h3>',
  '<h3 className="font-helvetica font-bold text-4xl tracking-wide uppercase text-black">Visit</h3>'
);

// 3. Fix EditableText and EditableTextArea in AdminStudioSettings to combine onChange into onSave
// We will look for: onChange={v => handleUpdate('X', v)} onSave={v => handleSave('X', v)}
// and replace it with: onSave={v => { handleUpdate('X', v); handleSave('X', v); }}
content = content.replace(
  /onChange=\{v => handleUpdate\('([^']+)', v\)\} onSave=\{v => handleSave\('([^']+)', v\)\}/g,
  "onSave={v => { handleUpdate('$1', v); handleSave('$1', v); }}"
);

fs.writeFileSync('src/App.jsx', content);
console.log('Admin settings updated successfully!');
