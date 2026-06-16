const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf8');

const componentsToFix = ['CatalogueOverlay', 'EditorialOverlay', 'VisitOverlay', 'MenuDetailOverlay'];

componentsToFix.forEach(comp => {
  // Add state
  const stateRegex = new RegExp(`(const ${comp} = [^{]+\\{\\s*(?:.*\\n){0,3}?.*use[A-Z].*\\n)`);
  file = file.replace(stateRegex, `$1  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n`);

  // Replace Desktop Links with Mobile Menu
  const navRegex = new RegExp(`(<div className="flex justify-between items-center w-full relative">\\s*<div className="flex gap-[^"]+"[^>]+>\\s*(?:<span [^>]+>[A-Z]+</span>\\s*)+</div>)`, 'g');
  
  // Actually, we just need to target the specific block inside that component.
  // We can do it by finding the first match after component declaration.
  const compIndex = file.indexOf(`const ${comp} =`);
  if (compIndex !== -1) {
    const nextNavIndex = file.indexOf('<div className="flex justify-between items-center w-full relative">', compIndex);
    if (nextNavIndex !== -1) {
      const endOfLinks = file.indexOf('</div>', nextNavIndex + 67);
      const linksBlock = file.substring(nextNavIndex, endOfLinks + 6);
      
      const newLinksBlock = linksBlock
        .replace('<div className="flex gap', '<div className="hidden md:flex gap')
        + `\n            {/* Mobile Menu Button */}\n            <div className="md:hidden flex">\n              <span onClick={() => setIsMobileMenuOpen(true)} className="text-[10px] font-inter-tight font-bold uppercase tracking-widest cursor-pointer text-[#111111]">\n                [ MENU ]\n              </span>\n            </div>`;
      
      file = file.substring(0, nextNavIndex) + newLinksBlock + file.substring(endOfLinks + 6);
    }
  }
});

fs.writeFileSync('src/App.jsx', file);
