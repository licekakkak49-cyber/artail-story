const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Update BagView signature
content = content.replace(
  'const BagView = ({ cartItems, onRemove, onCheckout }) => {',
  'const BagView = ({ cartItems, onRemove, onCheckout, onBack }) => {'
);

// 2 & 3. Update BagView layout (Empty and Filled States + Back link)
const oldBagStart = `  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  return (
    <div className="w-full flex flex-col md:flex-row mt-4 md:mt-12 pb-24 gap-12 md:gap-8 items-start px-1 md:px-2">
      <div className="w-full md:w-2/3 flex flex-col">
        <div className="hidden md:flex justify-between border-b border-black/10 pb-4 mb-6">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[55%]">OBJECT</span>
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[15%] text-center">QTY</span>
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[15%] text-right">PRICE</span>
          <span className="w-[15%]"></span>
        </div>
        {cartItems.length === 0 ? (
          <div className="py-12 flex justify-center border-b border-black/10">
            <span className="font-helvetica text-[#a0a0a0] text-[11px] font-bold uppercase tracking-widest">YOUR BAG IS EMPTY</span>
          </div>
        ) : (`;

const newBagStart = `  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  return (
    <div className="w-full flex flex-col mt-4 md:mt-8 pb-24 gap-8 items-start px-1 md:px-2">
      
      {/* Navigation / Back to Shop */}
      <div className="w-full flex items-center mb-2 md:mb-6">
        <button onClick={onBack} className="font-helvetica text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-black hover:text-zinc-500 transition-colors">
          <span>&larr;</span> Continue Shopping
        </button>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-12 md:gap-8 items-start">
      <div className="w-full md:w-2/3 flex flex-col">
        <div className="hidden md:flex justify-between border-b border-black/10 pb-4 mb-6">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[55%]">OBJECT</span>
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[15%] text-center">QTY</span>
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[15%] text-right">PRICE</span>
          <span className="w-[15%]"></span>
        </div>
        {cartItems.length === 0 ? (
          <div className="py-16 md:py-24 flex flex-col items-center justify-center border-b border-black/10 gap-6">
            <span className="font-helvetica text-[#a0a0a0] text-[11px] font-bold uppercase tracking-widest">YOUR BAG IS EMPTY</span>
            <button onClick={onBack} className="bg-black text-[#F5F5F5] px-8 py-3 font-helvetica text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (`;

content = content.replace(oldBagStart, newBagStart);

// We need to close the extra div wrapper for BagView
const oldBagEnd = `        </button>
      </div>
    </div>
  );
};`;

const newBagEnd = `        </button>
      </div>
      </div>
    </div>
  );
};`;
content = content.replace(oldBagEnd, newBagEnd);


// 4. Pass openGrid to BagView in CatalogueOverlay
content = content.replace(
  '<BagView cartItems={cartItems} onRemove={handleRemoveFromBag} onCheckout={onCheckout} />',
  '<BagView cartItems={cartItems} onRemove={handleRemoveFromBag} onCheckout={onCheckout} onBack={openGrid} />'
);

// 5. Update Navbar in CatalogueOverlay (Move bag to top right on mobile)
// Current right side of navbar:
const oldDesktopNavRight = `        <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-black/80">
          <span onClick={openBag} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {`;

const newDesktopNavRight = `        <div className="flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-black/80">
          <span onClick={openBag} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {`;

content = content.replace(oldDesktopNavRight, newDesktopNavRight);

// Current left side (Hamburger):
// We need to ensure that the flex container for the hamburger has exactly 3 children balancing it, or that we use flex-1
// Let's see how the nav is styled: flex justify-between items-center.
// Wait, the Hamburger is currently taking space on the left, but we need it to have flex-1 to push logo to center?
// Actually it has `absolute left-1/2` for the logo. So the flex-between will place Hamburger on the left, and the Bag/Account on the right!
// But wait, the Account button is also inside that div. Do we want "Account" on mobile top right too?
// Yes, or we can hide "Account" on mobile and keep it in hamburger, and only show "Bag" on mobile.
// To do this: `Bag (1)` is visible on all, `Account` is `hidden md:block`.

const oldAccountSpan = `          <span onClick={() => {
            if (currentUser) {
              onClose();
              setEcommerceView('profile');
            } else {
              onClose();
              setEcommerceView('auth');
            }
          }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-black/20 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300">`;

const newAccountSpan = `          <span onClick={() => {
            if (currentUser) {
              onClose();
              setEcommerceView('profile');
            } else {
              onClose();
              setEcommerceView('auth');
            }
          }} className="hidden md:inline-block cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-black/20 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300">`;

content = content.replace(oldAccountSpan, newAccountSpan);


// Remove the bag button from the mobile hamburger menu to avoid duplication
const oldHamburgerBag = `              <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); openBag(); }} 
                  className="border border-black/20 text-black hover:bg-black hover:text-white rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
                >
                  Bag ({cartCount})
                </button>
                <button 
                  onClick={() => {`;

const newHamburgerBag = `              <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
                <button 
                  onClick={() => {`;

content = content.replace(oldHamburgerBag, newHamburgerBag);


fs.writeFileSync('src/App.jsx', content);
console.log('Successfully updated Bag UX!');
