const fs = require('fs');

async function checkTables() {
  const content = fs.readFileSync('src/App.jsx', 'utf-8');
  const urlMatch = content.match(/const supabaseUrl = '([^']+)';/);
  const keyMatch = content.match(/const supabaseKey = '([^']+)';/);

  if (!urlMatch || !keyMatch) {
    console.log("Could not find Supabase credentials in App.jsx");
    return;
  }

  const url = urlMatch[1];
  const key = keyMatch[1];
  
  const tables = ['site_settings', 'cocktails', 'timeline', 'catalogue', 'editorials'];
  
  console.log("Checking Supabase tables...\n");
  
  for (const table of tables) {
    const fetchUrl = `${url}/rest/v1/${table}?select=*&limit=1`;
    try {
      const response = await fetch(fetchUrl, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === 'PGRST205') {
          console.log(`❌ Table '${table}' DOES NOT EXIST.`);
        } else if (data.code === '42501') {
          console.log(`🔒 Table '${table}' exists but is LOCKED by RLS (Missing SELECT policy).`);
        } else {
          console.log(`⚠️ Table '${table}' Error: ${data.message || JSON.stringify(data)}`);
        }
      } else {
        console.log(`✅ Table '${table}' is connected and readable! (${data.length} rows found)`);
      }
    } catch (e) {
      console.log(`Error checking ${table}:`, e.message);
    }
  }
}

checkTables();
