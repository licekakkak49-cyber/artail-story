const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');
content = content.replace(
  "await supabase.from('timeline').update(payload).eq('id', editingEvent.id);",
  "const { error } = await supabase.from('timeline').update(payload).eq('id', editingEvent.id);\n          if (error) throw error;"
);
fs.writeFileSync('src/App.jsx', content);
