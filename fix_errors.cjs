const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// Fix handleSaveSetting in AdminStudioTimeline
content = content.replace(
  "await supabase.from('site_settings').update({ [field]: value }).eq('id', 1);",
  "const { error } = await supabase.from('site_settings').update({ [field]: value }).eq('id', 1);\n        if (error) throw error;"
);

// We already fixed handleSaveEvent above. Let's make sure.
content = content.replace(
  "const { error } = await supabase.from('timeline').update(payload).eq('id', editingEvent.id);\n          if (error) throw error;\n          if (error) throw error;",
  "const { error } = await supabase.from('timeline').update(payload).eq('id', editingEvent.id);\n          if (error) throw error;"
);

fs.writeFileSync('src/App.jsx', content);
