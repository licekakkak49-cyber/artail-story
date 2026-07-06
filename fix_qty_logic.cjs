const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Update ProductDetail State
content = content.replace(
  '  const [isAdded, setIsAdded] = useState(false);',
  '  const [isAdded, setIsAdded] = useState(false);\n  const [quantity, setQuantity] = useState(1);'
);

content = content.replace(
  '    onAcquire(item);',
  '    onAcquire(item, quantity);'
);

// 2. Update ProductDetail QTY UI
const oldProductQtyUi = `            <div className="flex flex-col gap-1.5 shrink-0 cursor-pointer group">
              <div className="flex items-baseline gap-2">
                <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">QTY</span>
                <span className="font-helvetica text-[#a0a0a0] text-[8px] uppercase tracking-widest">({item.stock} AVAILABLE)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-helvetica text-black text-[14px] font-bold tracking-tight">01</span>
                <span className="text-[8px] transition-transform group-hover:translate-y-[2px]">▼</span>
              </div>
            </div>`;

const newProductQtyUi = `            <div className="flex flex-col gap-1.5 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">QTY</span>
                <span className="font-helvetica text-[#a0a0a0] text-[8px] uppercase tracking-widest">({item.stock || 10} AVAILABLE)</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center border border-black/20 hover:border-black rounded-full text-[10px] transition-colors"
                >-</button>
                <span className="font-helvetica text-black text-[14px] font-bold tracking-tight w-4 text-center">{quantity < 10 ? \`0\${quantity}\` : quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(item.stock || 10, q + 1))}
                  className="w-6 h-6 flex items-center justify-center border border-black/20 hover:border-black rounded-full text-[10px] transition-colors"
                >+</button>
              </div>
            </div>`;

content = content.replace(oldProductQtyUi, newProductQtyUi);

// 3. Update CatalogueOverlay handleAcquire and add handleUpdateQty
const oldHandleAcquire = `  const handleAcquire = (itemToAdd) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.name === itemToAdd.name);
      if (exists) {
        return prev.map(i => i.name === itemToAdd.name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...itemToAdd, qty: 1 }];
    });
  };`;

const newHandleAcquire = `  const handleAcquire = (itemToAdd, qty = 1) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.name === itemToAdd.name);
      if (exists) {
        return prev.map(i => i.name === itemToAdd.name ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...itemToAdd, qty }];
    });
  };

  const handleUpdateQty = (indexToUpdate, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map((item, i) => i === indexToUpdate ? { ...item, qty: newQty } : item));
  };`;

content = content.replace(oldHandleAcquire, newHandleAcquire);

// 4. Update BagView Component definition to receive onUpdateQty
content = content.replace(
  'const BagView = ({ cartItems, onRemove, onCheckout, onBack }) => {',
  'const BagView = ({ cartItems, onRemove, onCheckout, onBack, onUpdateQty }) => {'
);

// 5. Update BagView UI
const oldBagQtyUi = `                <div className="w-1/3 md:w-[33%] flex flex-col md:flex-row md:justify-center items-start md:items-center gap-1.5 md:gap-0">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest md:hidden">QTY</span>
                  <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">0{item.qty}</span>
                </div>`;

const newBagQtyUi = `                <div className="w-1/3 md:w-[33%] flex flex-col md:flex-row md:justify-center items-start md:items-center gap-1.5 md:gap-0">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest md:hidden">QTY</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQty(idx, item.qty - 1)} className="w-5 h-5 flex items-center justify-center border border-black/20 hover:border-black rounded-full text-[10px] transition-colors" disabled={item.qty <= 1}>-</button>
                    <span className="font-helvetica text-black text-[12px] font-bold tracking-tight w-4 text-center">{item.qty < 10 ? \`0\${item.qty}\` : item.qty}</span>
                    <button onClick={() => onUpdateQty(idx, item.qty + 1)} className="w-5 h-5 flex items-center justify-center border border-black/20 hover:border-black rounded-full text-[10px] transition-colors" disabled={item.qty >= (item.stock || 10)}>+</button>
                  </div>
                </div>`;

content = content.replace(oldBagQtyUi, newBagQtyUi);

// 6. Update CatalogueOverlay rendering of BagView to pass onUpdateQty
content = content.replace(
  '<BagView cartItems={cartItems} onRemove={handleRemoveFromBag} onCheckout={onCheckout} onBack={openGrid} />',
  '<BagView cartItems={cartItems} onRemove={handleRemoveFromBag} onCheckout={onCheckout} onBack={openGrid} onUpdateQty={handleUpdateQty} />'
);

fs.writeFileSync('src/App.jsx', content);
console.log('Successfully updated QTY logic!');
