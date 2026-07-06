const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Modify handleSaveItem function definition
const oldHandleSaveItem = `  const handleSaveItem = async () => {
    if (!editingItem) return;
    
    const newNews = [...news];
    const idx = newNews.findIndex(i => i.id === editingItem.id);
    if (idx !== -1) {
      newNews[idx] = editingItem;
      setNews(newNews);
    }

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      if (typeof editingItem.id === 'string' && editingItem.id.startsWith('mock_')) return;
      setSyncStatus('Saving...');
      try {
        const payload = {
          title: editingItem.title,
          subtitle: editingItem.subtitle,
          category: editingItem.category,
          date: editingItem.date,
          content: editingItem.content,
          image: editingItem.image,
          hashtag: editingItem.hashtag
        };
        const { error } = await supabase.from('news').update(payload).eq('id', editingItem.id);`;

const newHandleSaveItem = `  const handleSaveItem = async (field, value) => {
    if (!editingItem) return;
    
    const updatedItem = field ? { ...editingItem, [field]: value } : editingItem;
    
    const newNews = [...news];
    const idx = newNews.findIndex(i => i.id === updatedItem.id);
    if (idx !== -1) {
      newNews[idx] = updatedItem;
      setNews(newNews);
    }

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      if (typeof updatedItem.id === 'string' && updatedItem.id.startsWith('mock_')) return;
      setSyncStatus('Saving...');
      try {
        const payload = {
          title: updatedItem.title,
          subtitle: updatedItem.subtitle,
          category: updatedItem.category,
          date: updatedItem.date,
          content: updatedItem.content,
          image: updatedItem.image,
          hashtag: updatedItem.hashtag
        };
        const { error } = await supabase.from('news').update(payload).eq('id', updatedItem.id);`;

content = content.replace(oldHandleSaveItem, newHandleSaveItem);

// 2. Modify the onSave callbacks
content = content.replace(
  /handleSaveItem\(\)/g,
  "handleSaveItem(field, value)"
);

// We need to specifically replace the ones in AdminStudioNews without breaking others.
// The easiest way is to use regex targeting the EditableText fields in AdminStudioNews.
content = content.replace(
  /onSave={v => \{ handleUpdate\('category', v\); handleSaveItem\(field, value\); \}}/g,
  "onSave={v => { handleUpdate('category', v); handleSaveItem('category', v); }}"
);
content = content.replace(
  /onSave={v => \{ handleUpdate\('date', v\); handleSaveItem\(field, value\); \}}/g,
  "onSave={v => { handleUpdate('date', v); handleSaveItem('date', v); }}"
);
content = content.replace(
  /onSave={v => \{ handleUpdate\('title', v\); handleSaveItem\(field, value\); \}}/g,
  "onSave={v => { handleUpdate('title', v); handleSaveItem('title', v); }}"
);
content = content.replace(
  /onSave={v => \{ handleUpdate\('subtitle', v\); handleSaveItem\(field, value\); \}}/g,
  "onSave={v => { handleUpdate('subtitle', v); handleSaveItem('subtitle', v); }}"
);
content = content.replace(
  /onSave={v => \{ handleUpdate\('hashtag', v\); handleSaveItem\(field, value\); \}}/g,
  "onSave={v => { handleUpdate('hashtag', v); handleSaveItem('hashtag', v); }}"
);
content = content.replace(
  /onSave={v => \{ handleUpdate\('content', v\); handleSaveItem\(field, value\); \}}/g,
  "onSave={v => { handleUpdate('content', v); handleSaveItem('content', v); }}"
);
content = content.replace(
  /if \(isFinal\) handleSaveItem\(field, value\);/g,
  "if (isFinal) handleSaveItem('image', url);"
);

// Make sure we didn't accidentally mess up anything outside AdminStudioNews
// Since other components don't use `handleSaveItem()` exactly the same way, but just in case:
content = content.replace(
  /handleSaveItem\(field, value\)/g,
  "handleSaveItem()"
);

fs.writeFileSync('src/App.jsx', content);
console.log('Successfully fixed stale state bug!');
