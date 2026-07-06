const fs = require('fs');

async function test() {
  let content = fs.readFileSync('src/App.jsx', 'utf-8');
  const supabaseUrlMatch = content.match(/const supabaseUrl = '([^']+)';/);
  const supabaseKeyMatch = content.match(/const supabaseKey = '([^']+)';/);
  
  if (supabaseUrlMatch && supabaseKeyMatch) {
    const url = supabaseUrlMatch[1];
    const key = supabaseKeyMatch[1];
    
    const headers = {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json'
    };
    
    // Test Insert
    const newItem = { 
      title: "Test", subtitle: "Test", category: "Test", 
      date: "Test", content: "Test", image: "Test" 
    };
    
    const res = await fetch(`${url}/rest/v1/news`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newItem)
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  }
}
test();
