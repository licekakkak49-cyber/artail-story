const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf8');

const componentsToFix = ['CatalogueOverlay', 'EditorialOverlay', 'VisitOverlay', 'MenuDetailOverlay'];

componentsToFix.forEach(comp => {
  // Add state
  const stateRegex = new RegExp(`(const ${comp} = [^{]+\\{\\s*(?:.*\\n){0,3}?.*use[A-Z].*\\n)`);
  file = file.replace(stateRegex, `$1  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n`);

  const compIndex = file.indexOf(`const ${comp} =`);
  if (compIndex !== -1) {
    // 1. Replace the Desktop links to be hidden on mobile, and add [ MENU ] button
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

// Now we need to add the mobile menu overlay to these components.
// We'll append the <AnimatePresence> block right after the sticky nav ends
componentsToFix.forEach(comp => {
  const compIndex = file.indexOf(`const ${comp} =`);
  if (compIndex !== -1) {
    const stickyNavEndIndex = file.indexOf('</div>\n        </div>', compIndex);
    if (stickyNavEndIndex !== -1) {
      const insertionPoint = stickyNavEndIndex + 20; // past the closing divs
      
      // Determine what functions to call on close
      let onCloseLogic = 'onClose();';
      if (comp === 'CatalogueOverlay') onCloseLogic = "onClose();";
      
      const menuOverlay = `\n        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#ffffff] z-[100] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
              style={{ pointerEvents: 'auto' }}
            >
              <span onClick={() => setIsMobileMenuOpen(false)} className="absolute top-[8%] md:top-[12%] right-[8vw] text-[#a0a0a0] text-[10px] tracking-widest font-bold cursor-pointer underline underline-offset-4 decoration-1">CLOSE</span>
              <span onClick={() => { setIsMobileMenuOpen(false); ${comp === 'CatalogueOverlay' ? 'onClose();' : 'onClose();'} }} className="text-[#111111] text-3xl font-bold tracking-widest cursor-pointer">HOME</span>
              <span onClick={() => { setIsMobileMenuOpen(false); ${comp === 'CatalogueOverlay' ? 'openGrid();' : "onClose(); setView('catalogue'); setOverlayView('grid');"} }} className="text-[#111111] text-3xl font-bold tracking-widest cursor-pointer">CATALOGUE</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('editorial'); }} className="text-[#111111] text-3xl font-bold tracking-widest cursor-pointer">ABOUT</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('visit'); }} className="text-[#111111] text-3xl font-bold tracking-widest cursor-pointer">VISIT</span>
            </motion.div>
          )}
        </AnimatePresence>\n`;
        
      file = file.substring(0, insertionPoint) + menuOverlay + file.substring(insertionPoint);
    }
  }
});

// Finally, the global sticky nav in the main App
const globalNavIndex = file.indexOf('className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center');
if (globalNavIndex !== -1) {
  // First, add state to App
  const appIndex = file.indexOf('export default function App() {');
  if (appIndex !== -1) {
    file = file.replace('export default function App() {\n', 'export default function App() {\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n');
  }

  // Find the exact global nav start
  const globalNavStart = file.lastIndexOf('<motion.nav ', globalNavIndex);
  const endOfLinks = file.indexOf('</div>', globalNavStart + 150);
  const linksBlock = file.substring(globalNavStart, endOfLinks + 6);
  
  const newLinksBlock = linksBlock
    .replace('<div className="flex gap', '<div className="hidden md:flex gap')
    + `\n          {/* Mobile Menu Button */}\n          <div className="md:hidden flex">\n            <span onClick={() => setIsMobileMenuOpen(true)} className="text-[10px] font-inter-tight font-bold uppercase tracking-widest cursor-pointer text-[#F5F5F5]">\n              [ MENU ]\n            </span>\n          </div>`;
    
  file = file.substring(0, globalNavStart) + newLinksBlock + file.substring(endOfLinks + 6);
  
  // Add mobile menu overlay for App global nav just before </AnimatePresence> that wraps the nav
  const endOfNavAnimatePresence = file.indexOf('</AnimatePresence>', globalNavStart);
  
  const menuOverlayGlobal = `\n        {/* Mobile Menu Overlay for Global Nav */}\n        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111111] z-[1000] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
            style={{ pointerEvents: 'auto' }}
          >
            <span onClick={() => setIsMobileMenuOpen(false)} className="absolute top-[8%] md:top-[12%] right-[8vw] text-[#a0a0a0] text-[10px] tracking-widest font-bold cursor-pointer underline underline-offset-4 decoration-1">CLOSE</span>
            <span onClick={() => { setIsMobileMenuOpen(false); setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5] text-3xl font-bold tracking-widest cursor-pointer">CATALOGUE</span>
            <span onClick={() => { setIsMobileMenuOpen(false); setView('editorial'); }} className="text-[#F5F5F5] text-3xl font-bold tracking-widest cursor-pointer">ABOUT</span>
            <span onClick={() => { setIsMobileMenuOpen(false); setView('visit'); }} className="text-[#F5F5F5] text-3xl font-bold tracking-widest cursor-pointer">VISIT</span>
          </motion.div>
        )}\n      `;
        
  file = file.substring(0, endOfNavAnimatePresence) + menuOverlayGlobal + file.substring(endOfNavAnimatePresence);
}

fs.writeFileSync('src/App.jsx', file);
