const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf8');
file = file.replace(/<\/AnimatePresence>\n>/g, '</AnimatePresence>\n');
fs.writeFileSync('src/App.jsx', file);
