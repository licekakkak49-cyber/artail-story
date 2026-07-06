const fs = require('fs');
let text = fs.readFileSync('src/App.jsx', 'utf-8');
// MenuDetailOverlay
text = text.replace('const overlayRef = useRef(null);\n  const { settings } = useData();', 'const overlayRef = useRef(null);');
// Are there any other duplicate settings?
// Look for "settings" multiple times in the same function.
fs.writeFileSync('src/App.jsx', text);
