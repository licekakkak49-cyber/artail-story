const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// We need the supabase URL and KEY from the code.
const content = fs.readFileSync('src/App.jsx', 'utf-8');
const urlMatch = content.match(/const supabaseUrl = '([^']+)';/);
const keyMatch = content.match(/const supabaseAnonKey = '([^']+)';/);

if (urlMatch && keyMatch && urlMatch[1] !== 'YOUR_SUPABASE_URL') {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  
  async function testDB() {
    console.log('Fetching timeline...');
    const { data, error } = await supabase.from('timeline').select('*');
    if (error) {
       console.error('Error fetching:', error);
    } else {
       console.log('Timeline count:', data.length);
       if (data.length > 0) {
         console.log('Sample node:', data[0]);
       }
    }
  }
  
  testDB();
} else {
  console.log('No valid Supabase credentials found.');
}
