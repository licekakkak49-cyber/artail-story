const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');
const supabaseUrlMatch = content.match(/const supabaseUrl = '([^']+)';/);
const supabaseKeyMatch = content.match(/const supabaseKey = '([^']+)';/);

if (supabaseUrlMatch && supabaseKeyMatch) {
  const supabase = createClient(supabaseUrlMatch[1], supabaseKeyMatch[1]);
  
  async function test() {
    const { data, error } = await supabase.from('news').select('*').limit(1);
    console.log("SELECT error:", error);
    
    const newItem = { 
      title: "Test", subtitle: "Test", category: "Test", 
      date: "Test", content: "Test", image: "Test" 
    };
    const { data: iData, error: iError } = await supabase.from('news').insert([newItem]).select();
    console.log("INSERT error:", iError);
  }
  
  test();
} else {
  console.log("Could not find keys");
}
