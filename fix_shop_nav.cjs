const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Update ProductDetail signature to accept onBack
content = content.replace(
  'const ProductDetail = ({ item, onNavigate, onAcquire }) => {',
  'const ProductDetail = ({ item, onNavigate, onAcquire, onBack }) => {'
);

// 2. Add Breadcrumb and Back Button UI to ProductDetail
const oldProductDetailStart = `  return (
    <div className="w-full flex flex-col-reverse md:flex-row mt-4 md:mt-12 pb-24 gap-12 md:gap-8 items-start">
      <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 md:gap-x-12 relative h-full">`;

const newProductDetailStart = `  return (
    <div className="w-full flex flex-col mt-4 md:mt-8 pb-24 gap-8 items-start">
      
      {/* Breadcrumb & Mobile Back Navigation */}
      <div className="w-full flex flex-col gap-4">
        {/* Mobile Back Button */}
        <div className="md:hidden flex items-center">
          <button onClick={onBack} className="font-helvetica text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-black hover:text-zinc-500 transition-colors">
            <span>&larr;</span> Back to Shop
          </button>
        </div>
        
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 font-helvetica text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">
          <span onClick={onBack} className="cursor-pointer hover:text-black transition-colors">SHOP</span>
          <span>/</span>
          <span onClick={onBack} className="cursor-pointer hover:text-black transition-colors">CATALOGUE</span>
          <span>/</span>
          <span className="text-black">"{item.name}"</span>
        </div>
      </div>

      <div className="w-full flex flex-col-reverse md:flex-row gap-12 md:gap-8 items-start">
        <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 md:gap-x-12 relative h-full">`;

content = content.replace(oldProductDetailStart, newProductDetailStart);
// Wait, the ProductDetail has `w-full flex flex-col-reverse md:flex-row mt-4 md:mt-12 pb-24 gap-12 md:gap-8 items-start`.
// Because we changed the wrapper, we need to close the new wrapper at the end.
const oldProductDetailEnd = `        )}
      </div>
    </div>
  );
};`;

const newProductDetailEnd = `        )}
      </div>
      </div>
    </div>
  );
};`;
content = content.replace(oldProductDetailEnd, newProductDetailEnd);

// 3. Pass openGrid to ProductDetail in CatalogueOverlay
content = content.replace(
  '<ProductDetail item={selectedItem} onNavigate={openDetail} onAcquire={handleAcquire} />',
  '<ProductDetail item={selectedItem} onNavigate={openDetail} onAcquire={handleAcquire} onBack={openGrid} />'
);

fs.writeFileSync('src/App.jsx', content);
console.log('Successfully added Shop Navigation!');
