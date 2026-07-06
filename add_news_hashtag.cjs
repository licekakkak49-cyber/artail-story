const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Update newItem template in AdminStudioNews
content = content.replace(
  '      category: "NEWS", \n      date: new Date().toLocaleDateString(\'en-US\', { month: \'long\', day: \'2-digit\', year: \'numeric\' }), \n      content: "Article content goes here...", ',
  '      category: "NEWS", \n      date: new Date().toLocaleDateString(\'en-US\', { month: \'long\', day: \'2-digit\', year: \'numeric\' }), \n      content: "Article content goes here...", \n      hashtag: "#waydgallery #artailstory", '
);

// 2. Update payload in handleSaveItem
content = content.replace(
  '          content: editingItem.content,\n          image: editingItem.image',
  '          content: editingItem.content,\n          image: editingItem.image,\n          hashtag: editingItem.hashtag'
);

// 3. Add EditableText to AdminStudioNews UI
const newField = `
              <div className="flex flex-col gap-1.5 mt-2">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Hashtags</span>
                 <EditableText value={editingItem.hashtag} onSave={v => { handleUpdate('hashtag', v); handleSaveItem(); }} className="font-helvetica text-sm text-black border-b border-dashed border-zinc-300" />
                 <span className="text-[9px] text-zinc-400 uppercase">Separate with spaces (e.g. #waydgallery #artailstory)</span>
              </div>
`;

content = content.replace(
  '              <div className="flex flex-col gap-1.5 mt-2">\n                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Article Content</span>',
  newField + '\n              <div className="flex flex-col gap-1.5 mt-2">\n                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Article Content</span>'
);

// 4. Update NewsOverlay
const newHashtagCode = `
                    <div className="text-[#F5F5F5]/80 text-[15px] font-helvetica font-light flex gap-3 flex-wrap">
                      {(selectedItem.hashtag || '#waydgallery #artailstory').split(' ').map((tag, i) => (
                        <span key={i}>{tag}</span>
                      ))}
                    </div>
`;

content = content.replace(
  '<div className="text-[#F5F5F5]/80 text-[15px] font-helvetica font-light flex gap-3 flex-wrap">\n                      <span>#waydgallery</span>\n                      <span>#artailstory</span>\n                    </div>',
  newHashtagCode.trim()
);

fs.writeFileSync('src/App.jsx', content);
console.log('Successfully added hashtag feature!');
