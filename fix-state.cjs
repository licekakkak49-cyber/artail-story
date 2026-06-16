const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf8');

// Remove from App
file = file.replace('export default function App() {\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n', 'export default function App() {\n');

// Add to FrontendApp
const frontendRegex = /const FrontendApp = \([^)]+\) => {\n/;
file = file.replace(frontendRegex, `$&  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n`);

fs.writeFileSync('src/App.jsx', file);
