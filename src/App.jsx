import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// --- Configuration & Data ---
const cocktailMenuData = [
  { name: "Abstract Illusion", artist: "Teddy", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu1.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu1ct.webp" },
  { name: "Golden Hour", artist: "Mimi", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_2.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_2ct.webp" },
  { name: "Velvet Night", artist: "Teddy", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_3.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_3ct.webp" },
  { name: "Crimson Tide", artist: "Mimi", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_4.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_4ct.webp" },
  { name: "Emerald Dream", artist: "Teddy", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_5.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_5ct.webp" },
  { name: "Sapphire Soul", artist: "Mimi", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_6.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_6ct.webp" },
  { name: "Amber Glow", artist: "Teddy", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_7.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_7ct.webp" },
  { name: "Obsidian Whisper", artist: "Mimi", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_8.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_8ct.webp" }
];

const catalogueItems = [
  { name: "Whispered Whirlwind", price: "129", src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80", designer: "Daniel Kim", year: "2026", colour: "Ebony Black", size: "2.7\" x 2.7\" x 5.0\"", material: "STONEWARE", info: "Tray with matte finish. Candle included in your order may differ in color.", stock: "03", images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1610701596027-14c0a524bcda?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1610701596013-14902b37bd14?auto=format&fit=crop&w=800&q=80"] },
  { name: "Enchanted Canvas", price: "375", src: "https://images.unsplash.com/photo-1597330768910-c081e7d23588?auto=format&fit=crop&w=800&q=80", designer: "Elena Rostova", year: "2025", colour: "Cerulean Blue", size: "12.0\" x 8.5\" x 4.0\"", material: "CERAMIC & CLAY", info: "Hand-sculpted centerpiece. Each piece is unique and may feature slight variations.", stock: "01", images: ["https://images.unsplash.com/photo-1597330768910-c081e7d23588?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1597330768875-14f09d84f93b?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1597330768900-349c258d4a66?auto=format&fit=crop&w=800&q=80"] },
  { name: "Ethereal Serenade", price: "89", src: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80", designer: "Studio Narkara", year: "2026", colour: "Midnight & Coral", size: "5.5\" x 4.0\" x 8.0\"", material: "MIXED MEDIA", info: "Abstract floral interpretation. Keep away from direct sunlight to preserve colors.", stock: "05", images: ["https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1602928321855-3a7c6f091c78?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1602928321590-b1935c181fcd?auto=format&fit=crop&w=800&q=80"] },
  { name: "Signature Glassware", price: "150", src: "https://images.unsplash.com/photo-1571597314545-2384a51eb85c?auto=format&fit=crop&w=800&q=80", designer: "Teddy", year: "2024", colour: "Clear Crystal", size: "3.5\" x 3.5\" x 4.2\"", material: "HAND-BLOWN GLASS", info: "Set of two. Crafted for optimal aroma release. Hand wash recommended.", stock: "12", images: ["https://images.unsplash.com/photo-1571597314545-2384a51eb85c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1582269438706-e7e0e7a2b0e6?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1571597314717-380ff95574c8?auto=format&fit=crop&w=800&q=80"] },
  { name: "Gallery Art Print 01", price: "45", src: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80", designer: "Mimi", year: "2025", colour: "Vivid Palette", size: "18.0\" x 24.0\"", material: "ARCHIVAL PAPER", info: "Limited edition print. Signed and numbered by the artist.", stock: "50", images: ["https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=800&q=80"] },
  { name: "Sculptural Vase Set", price: "210", src: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80", designer: "Daniel Kim", year: "2026", colour: "Sand & Charcoal", size: "Various", material: "UNGLAZED CLAY", info: "Trio of interconnected vases. Water-tight interior.", stock: "02", images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1612196808253-15705a6f23d4?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1612196808298-0c6a51270e5b?auto=format&fit=crop&w=800&q=80"] },
  { name: "The Artail Story Book", price: "75", src: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80", designer: "Artail Story", year: "2026", colour: "Monochrome Cover", size: "9.5\" x 12.0\"", material: "HARDCOVER, 240 PAGES", info: "The complete visual journey of our gallery bar, recipes, and artist interviews.", stock: "120", images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1544947950-13654e9518db?auto=format&fit=crop&w=800&q=80"] },
  { name: "Ceramic Coaster Edition", price: "55", src: "https://images.unsplash.com/photo-1563821041920-d3aeb1d810a9?auto=format&fit=crop&w=800&q=80", designer: "Studio Narkara", year: "2025", colour: "Terracotta", size: "4.0\" diameter", material: "PORCELAIN & CORK", info: "Set of four coasters featuring abstract impressions of our signature cocktails.", stock: "08", images: ["https://images.unsplash.com/photo-1563821041920-d3aeb1d810a9?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1563821041865-fb80a6be2595?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1563821041951-248c8b4bc594?auto=format&fit=crop&w=800&q=80"] }
];

// --- คอมโพเนนต์ย่อย: หน้าตะกร้าสินค้า ---
const BagView = ({ cartItems, onRemove }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  return (
    <div className="w-full flex flex-col md:flex-row mt-4 md:mt-12 pb-24 gap-12 md:gap-8 items-start px-1 md:px-2">
      <div className="w-full md:w-2/3 flex flex-col">
        <div className="hidden md:flex justify-between border-b border-[#111111]/10 pb-4 mb-6">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[55%]">OBJECT</span>
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[15%] text-center">QTY</span>
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest w-[15%] text-right">PRICE</span>
          <span className="w-[15%]"></span>
        </div>
        {cartItems.length === 0 ? (
          <div className="py-12 flex justify-center border-b border-[#111111]/10">
            <span className="font-helvetica text-[#a0a0a0] text-[11px] font-bold uppercase tracking-widest">YOUR BAG IS EMPTY</span>
          </div>
        ) : (
          cartItems.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 border-b border-[#111111]/10 py-6 group">
              <div className="w-full md:w-[55%] flex items-center gap-6">
                <div className="w-16 md:w-20 aspect-[4/5] bg-[#F5F5F5] overflow-hidden shrink-0">
                  <img src={item.src} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" draggable="false" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-[#111111] text-[12px] md:text-[14px] font-bold tracking-tight">"{item.name}"</span>
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">{item.designer}</span>
                </div>
              </div>
              <div className="w-full md:w-[45%] flex justify-between items-center md:items-center mt-2 md:mt-0">
                <div className="w-1/3 md:w-[33%] flex flex-col md:flex-row md:justify-center items-start md:items-center gap-1.5 md:gap-0">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest md:hidden">QTY</span>
                  <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">0{item.qty}</span>
                </div>
                <div className="w-1/3 md:w-[33%] flex flex-col md:flex-row md:justify-end items-start md:items-center gap-1.5 md:gap-0">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest md:hidden">PRICE</span>
                  <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">${Number(item.price) * item.qty}</span>
                </div>
                <div className="w-1/3 md:w-[33%] flex justify-end items-center">
                  <span onClick={() => onRemove(idx)} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-[#111111] underline underline-offset-4 decoration-1 transition-colors">REMOVE</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="w-full md:w-1/3 flex flex-col mt-8 md:mt-0 md:pl-8 lg:pl-16">
        <div className="flex flex-col gap-6 border-b border-[#111111]/10 pb-8 mb-8">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">ORDER SUMMARY</span>
          <div className="flex justify-between items-center">
            <span className="font-helvetica text-[#111111] text-[10px] font-bold uppercase tracking-widest">SUBTOTAL</span>
            <span className="font-helvetica text-[#111111] text-[14px] font-bold tracking-tight">${subtotal}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-helvetica text-[#a0a0a0] text-[10px] font-bold uppercase tracking-widest">SHIPPING</span>
            <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold tracking-tight text-right uppercase">CALCULATED AT<br/>CHECKOUT</span>
          </div>
        </div>
        <button className={`w-full font-inter-tight font-semibold text-[11px] uppercase tracking-widest py-4 transition-colors flex justify-center items-center ${cartItems.length > 0 ? 'bg-[#111111] text-[#F5F5F5] hover:bg-zinc-800' : 'bg-[#EAEAEA] text-[#a0a0a0] pointer-events-none'}`}>
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

// --- คอมโพเนนต์ย่อย: รายละเอียดสินค้า ---
const ProductDetail = ({ item, onNavigate, onAcquire }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const handleDragEnd = (e, { offset }) => {
    const swipe = offset.x;
    if (swipe < -50 && imageIndex < item.images.length - 1) {
      setImageIndex(prev => prev + 1);
    } else if (swipe > 50 && imageIndex > 0) {
      setImageIndex(prev => prev - 1);
    }
  };

  const currentIndex = catalogueItems.findIndex(i => i.name === item.name);
  const handlePrev = () => { if (currentIndex > 0) onNavigate(catalogueItems[currentIndex - 1]); };
  const handleNext = () => { if (currentIndex < catalogueItems.length - 1) onNavigate(catalogueItems[currentIndex + 1]); };

  return (
    <div className="w-full flex flex-col-reverse md:flex-row mt-4 md:mt-12 pb-24 gap-12 md:gap-8 items-start">
      <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 md:gap-x-12 relative h-full">
        <div className="flex flex-col gap-1.5">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">OBJECT</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">"{item.name}"</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">DESIGNER</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">{item.designer}</span>
        </div>
        <div className="flex flex-col gap-1.5 hidden md:flex">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">YEAR</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">{item.year}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">COLOUR</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">{item.colour}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SIZE</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">{item.size}</span>
        </div>
        <div className="flex flex-col gap-1.5 hidden md:flex">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">MATERIAL</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">{item.material}</span>
        </div>
        <div className="flex flex-col gap-1.5 md:hidden">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">YEAR</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">{item.year}</span>
        </div>
        <div className="flex flex-col gap-1.5 md:hidden">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">MATERIAL</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight">{item.material}</span>
        </div>
        <div className="flex flex-col gap-1.5 col-span-2 md:col-span-3 lg:col-span-2">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">INFO</span>
          <span className="font-helvetica text-[#111111] text-[12px] font-bold tracking-tight leading-snug max-w-md">{item.info}</span>
        </div>
        <div className="col-span-2 md:col-span-3 flex flex-col w-full mt-8 md:mt-16 gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-end w-full gap-4 md:gap-8 max-w-lg border-t border-[#111111]/10 pt-6">
            <div className="flex flex-col gap-1.5 shrink-0 cursor-pointer group">
              <div className="flex items-baseline gap-2">
                <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">QTY</span>
                <span className="font-helvetica text-[#a0a0a0] text-[8px] uppercase tracking-widest">({item.stock} AVAILABLE)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-helvetica text-[#111111] text-[14px] font-bold tracking-tight">01</span>
                <span className="text-[8px] transition-transform group-hover:translate-y-[2px]">▼</span>
              </div>
            </div>
            <button onClick={() => onAcquire(item)} className="w-full bg-[#111111] text-[#F5F5F5] font-inter-tight font-semibold text-[11px] uppercase tracking-widest py-4 hover:bg-zinc-800 transition-colors flex justify-center items-center gap-3">
              <span>ACQUIRE</span>
              <span className="w-1 h-1 bg-[#F5F5F5] rounded-full opacity-30"></span>
              <span>${item.price}</span>
            </button>
          </div>
          <div className="flex justify-between w-full max-w-lg mt-8 md:mt-12 pt-4 border-t border-[#111111]/10">
             <span onClick={handlePrev} className={`font-helvetica text-[10px] font-bold uppercase tracking-widest transition-colors ${currentIndex > 0 ? 'text-[#111111] cursor-pointer hover:text-zinc-500' : 'text-zinc-300 pointer-events-none'}`}>PREVIOUS</span>
            <span onClick={handleNext} className={`font-helvetica text-[10px] font-bold uppercase tracking-widest transition-colors ${currentIndex < catalogueItems.length - 1 ? 'text-[#111111] cursor-pointer hover:text-zinc-500' : 'text-zinc-300 pointer-events-none'}`}>NEXT</span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3 flex flex-col items-center md:items-end">
        <div className="relative w-full max-w-[280px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px] aspect-[4/5] bg-[#F5F5F5] overflow-hidden group cursor-grab active:cursor-grabbing">
          <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} className="flex w-full h-full" animate={{ x: `-${imageIndex * 100}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            {item.images.map((imgUrl, i) => (
              <div key={i} className="min-w-full h-full">
                <img src={imgUrl} alt={`${item.name} view ${i+1}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" className="w-full h-full object-cover pointer-events-none" />
              </div>
            ))}
          </motion.div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {item.images.map((_, i) => (
              <button key={i} onClick={() => setImageIndex(i)} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${imageIndex === i ? 'bg-[#111111]' : 'bg-[#111111]/30 hover:bg-[#111111]/50'}`} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ฉากแทรก: หน้า Catalogue ขายของที่ระลึก ---
const CatalogueOverlay = ({ onClose, cartItems, setCartItems, overlayView, setOverlayView, nyTime }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const headerRef = useRef(null);

  const handleScroll = (e) => {
    if (headerRef.current) {
      setIsSticky(e.target.scrollTop > headerRef.current.offsetHeight - 20);
    }
  };

  const openGrid = () => { setOverlayView('grid'); setSelectedItem(null); };
  const openBag = () => setOverlayView('bag');
  const openDetail = (item) => { setSelectedItem(item); setOverlayView('detail'); };

  const handleAcquire = (itemToAdd) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.name === itemToAdd.name);
      if (exists) {
        return prev.map(i => i.name === itemToAdd.name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...itemToAdd, qty: 1 }];
    });
    setOverlayView('bag');
  };

  const handleRemoveFromBag = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="fixed inset-0 bg-[#ffffff] z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <div className="w-full flex flex-col pt-8 md:pt-12 px-2 md:px-4">
        <div ref={headerRef}>
          <h1 className="font-helvetica font-black text-[13vw] md:text-[11vw] leading-[0.8] tracking-tighter uppercase text-[#111111] mb-6 md:mb-10">
            ART & OBJECTS
          </h1>
        </div>
        <div className={`sticky top-0 w-full z-50 px-2 md:px-4 py-4 transition-all duration-300 ${isSticky ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
          <div className="grid grid-cols-3 items-center w-full gap-4">
            <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111] justify-start">
              <span onClick={onClose} className="cursor-pointer hover:text-zinc-500 transition-colors">HOME</span>
              <span onClick={openGrid} className={`cursor-pointer transition-colors ${overlayView === 'grid' || overlayView === 'detail' ? 'underline underline-offset-4 decoration-2' : 'hover:text-zinc-500'}`}>CATALOGUE</span>
              <span className="cursor-pointer hover:text-zinc-500 transition-colors hidden md:block">INFO</span>
              <span className="cursor-pointer hover:text-zinc-500 transition-colors hidden md:block">ARCHIVE</span>
              <span className="cursor-pointer hover:text-zinc-500 transition-colors hidden md:block">EDITORIAL</span>
            </div>
            <div className="flex justify-center text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
              <span onClick={openBag} className={`cursor-pointer transition-colors ${overlayView === 'bag' ? 'underline underline-offset-4 decoration-2' : 'hover:text-zinc-500'}`}>BAG ({cartCount})</span>
            </div>
            <div className="flex justify-end items-center gap-6 text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
              <span>NEW YORK, NY {nyTime}</span>
            </div>
          </div>
        </div>

        {overlayView === 'bag' ? (
          <BagView cartItems={cartItems} onRemove={handleRemoveFromBag} />
        ) : overlayView === 'detail' && selectedItem ? (
          <ProductDetail item={selectedItem} onNavigate={openDetail} onAcquire={handleAcquire} />
        ) : (
          <div className="w-full mt-8 md:mt-12">
            <div className="flex justify-between items-center w-full mb-4 md:mb-6 text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111] px-1 md:px-2">
              <span>OBJECTS ({catalogueItems.length})</span>
              <span>SHOW ALL</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-20 w-full">
              {catalogueItems.map((item, idx) => (
                <div key={idx} onClick={() => openDetail(item)} className="flex flex-col group cursor-pointer">
                  <div className="w-full aspect-[4/5] bg-[#F5F5F5] overflow-hidden mb-2 md:mb-3">
                    <img src={item.src} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]" draggable="false" />
                  </div>
                  <div className="flex justify-between items-start w-full text-[11px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-1 md:px-2">
                    <span className="font-helvetica font-bold text-[#111111] pr-4">"{item.name}"</span>
                    <span className="font-helvetica font-bold text-zinc-400">${item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ฉาก 1: นิทรรศการเมนู (Exhibition Marquee) รวมกับคำคม ---
const ContentStage = ({ rawProgress }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // จับจังหวะการเลื่อน ถ้าม่านเปิดไปเกิน 75% ให้แสดงข้อความและค้างไว้ตลอดไป
  useMotionValueEvent(rawProgress, "change", (latest) => {
    if (latest > 0.75 && !isRevealed) {
      setIsRevealed(true);
    }
  });

  return (
    <div className="w-full h-screen bg-[#F5F5F5] flex flex-col justify-center items-center relative overflow-hidden select-none py-20">
      
      <div className="w-full flex flex-col items-center justify-center mt-2 md:mt-4 mb-6 md:mb-8 px-4 relative z-10">
        <div className="relative inline-block text-center">
          {/* จุดสีแดงหลังตัว T */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isRevealed ? 1 : 0, opacity: isRevealed ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -left-2 md:-left-4 top-0 md:-top-1 w-8 h-8 md:w-12 md:h-12 bg-[#d92323] rounded-full -z-10 transform-gpu will-change-transform"
          ></motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-inter font-normal text-[6vw] sm:text-[5vw] md:text-[3vw] lg:text-[2.5vw] text-[#111111] leading-[1.1] tracking-tight uppercase transform-gpu will-change-[opacity,transform]"
          >
            The bar becomes a<br />
            (canvas)<br />
            The drinks are<br />
            the work
          </motion.h3>
        </div>
      </div>

      <div className="flex-1 flex items-center w-full overflow-hidden z-10">
        <div className="flex w-max animate-marquee">
          <div className="flex items-start gap-3 pr-3">
            {cocktailMenuData.map((item, i) => (
              <div key={`set1-${i}`} className="w-[28vw] sm:w-[20vw] md:w-[16vw] lg:w-[12vw] flex flex-col flex-shrink-0 cursor-pointer group">
                <div className="relative w-full aspect-[3/4] bg-[#EAEAEA] overflow-hidden mb-3 transform-gpu">
                  <img src={item.src} alt={item.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0 transform-gpu will-change-[opacity]" draggable="false" />
                  <img src={item.hoverSrc} alt={`${item.name} cocktail`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 transform-gpu will-change-[opacity]" draggable="false" />
                </div>
                <div className="flex justify-between items-baseline w-full text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-1">
                  <span className="font-inter-tight font-bold text-[#111111]">“{item.name}”</span>
                  <span className="font-inter-tight font-normal text-zinc-400">{item.artist}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3 pr-3">
            {cocktailMenuData.map((item, i) => (
              <div key={`set2-${i}`} className="w-[28vw] sm:w-[20vw] md:w-[16vw] lg:w-[12vw] flex flex-col flex-shrink-0 cursor-pointer group" style={{ contain: 'layout paint' }}>
                <div className="relative w-full aspect-[3/4] bg-[#EAEAEA] overflow-hidden mb-3 transform-gpu">
                  <img src={item.src} alt={item.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0 transform-gpu will-change-[opacity]" draggable="false" />
                  <img src={item.hoverSrc} alt={`${item.name} cocktail`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 transform-gpu will-change-[opacity]" draggable="false" />
                </div>
                <div className="flex justify-between items-baseline w-full text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-1">
                  <span className="font-inter-tight font-bold text-[#111111]">“{item.name}”</span>
                  <span className="font-inter-tight font-normal text-zinc-400">{item.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ปุ่ม Previous / Next ด้านล่าง */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 font-inter-tight font-bold text-[10px] md:text-xs uppercase tracking-widest text-[#111111] cursor-pointer z-20 hover:text-zinc-500 transition-colors">
        Previous
      </div>
      <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 font-inter-tight font-bold text-[10px] md:text-xs uppercase tracking-widest text-[#111111] cursor-pointer z-20 hover:text-zinc-500 transition-colors">
        Next
      </div>
    </div>
  );
};

// --- ฉาก 2: Artists พร้อมข้อมูลจริง ---
const ArtistStage = () => {
  return (
    <div className="w-full h-[100vh] md:h-[120vh] bg-[#1c1c1e] relative overflow-hidden">
      
      {/* Top Right Text (Aligned left with Teddy) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="absolute top-12 md:top-16 right-6 md:right-12 lg:right-48 w-[35vw] md:w-[22vw] lg:w-[16vw] text-left z-20"
      >
        <p className="text-[#f5f5f5] font-inter-tight text-[11px] md:text-[13px] tracking-[0.05em] font-normal uppercase mb-1">WINNER "BARSTAR AWARDS"</p>
        <p className="text-zinc-400 font-inter-tight text-[11px] md:text-[13px] tracking-[0.05em] uppercase font-normal">by NEW YORK BARTENDER WEEK 2025</p>
      </motion.div>

      {/* Mimi (Left - เว้นบนนิดเดียว) */}
      <div className="absolute top-4 md:top-6 left-6 md:left-12 lg:left-48 w-[35vw] md:w-[22vw] lg:w-[16vw] flex flex-col group z-20">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full aspect-[2/3] bg-[#2a2a2c] overflow-hidden mb-3"
        >
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" alt="Mimi" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 will-change-transform" draggable="false" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          className="flex justify-between items-baseline w-full"
        >
          <span className="text-[#f5f5f5] font-inter-tight text-sm md:text-base font-normal">Mimi</span>
          <span className="text-[#f5f5f5] font-inter-tight text-sm md:text-base font-normal">7 Signature</span>
        </motion.div>
      </div>

      {/* Teddy (Right - เยื้องล่าง แต่พ้นตัวอักษร) */}
      <div className="absolute top-[20%] md:top-[25%] right-6 md:right-12 lg:right-48 w-[35vw] md:w-[22vw] lg:w-[16vw] flex flex-col group z-20">
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full aspect-[2/3] bg-[#2a2a2c] overflow-hidden mb-3"
        >
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" alt="Teddy" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 will-change-transform" draggable="false" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          className="flex justify-between items-baseline w-full"
        >
          <span className="text-[#f5f5f5] font-inter-tight text-sm md:text-base font-normal">Teddy</span>
          <span className="text-[#f5f5f5] font-inter-tight text-sm md:text-base font-normal">7 Signature</span>
        </motion.div>
      </div>

      {/* Bottom Huge Text */}
      <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 lg:left-48 right-6 md:right-12 lg:right-48 flex flex-col md:flex-row justify-between items-start md:items-end z-10 pointer-events-none">
        <div className="flex items-baseline gap-4 md:gap-6">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[#f5f5f5] font-bebas text-[28vw] md:text-[14vw] lg:text-[8.5vw] leading-[0.75] tracking-normal m-0 p-0"
          >
            MEET
          </motion.h2>
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-inter-tight text-xs md:text-sm tracking-widest uppercase mb-[1vw] md:mb-[0.5vw]"
          >
            <span className="text-[#d92323]">ABOUT</span> <span className="text-[#f5f5f5]">/ SEE ALL</span>
          </motion.span>
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-[#f5f5f5] font-bebas text-[28vw] md:text-[14vw] lg:text-[8.5vw] leading-[0.75] tracking-normal m-0 p-0"
        >
          ARTISTS(OUR)
        </motion.h2>
      </div>

    </div>
  );
};

// --- ฉาก 3: ไทม์ไลน์ร้าน (Our Journey Stage) ---
const JourneyStage = () => {
  const journeyTimeline = [
    { name: "The First Shared Belief", desc: "Concept formulation", year: "2023" },
    { name: "WAYD? at Narkara", desc: "A one-day bartender session", year: "2024" },
    { name: "The Artail Movement", desc: "Collaborative pop-ups around the city", year: "2024" },
    { name: "The Permanent Canvas", desc: "Opening our own gallery bar", year: "2025" },
    { name: "The First Exhibition", desc: "Debuting our signature seasonal menu", year: "2026" }
  ];

  return (
    <div className="w-full bg-[#F5F5F5] pt-12 pb-24 md:pt-20 md:pb-32 lg:pt-24 lg:pb-40 flex justify-center items-start px-6 md:px-12 lg:px-48">
      <div className="w-full max-w-none grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start pt-4 md:pt-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="md:col-span-4 flex flex-col items-start pr-0 md:pr-12"
        >
          <h2 className="text-[#111111] font-helvetica text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.1] tracking-tight uppercase">
            Our<br />Journey
          </h2>
          <p className="text-[#111111] font-inter-tight text-xs md:text-sm font-normal tracking-normal mt-3 md:mt-4 max-w-[280px]">
            From a shared belief to a permanent canvas
          </p>
        </motion.div>
        <div className="md:col-span-8 flex flex-col w-full mt-8 md:mt-0">
          {journeyTimeline.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, delay: i * 0.25, ease: "easeOut" }}
              className="w-full border-b border-[#111111]/30 flex flex-col lg:flex-row justify-between items-start lg:items-baseline py-3 md:py-4 lg:py-5 gap-2 lg:gap-4 hover:bg-zinc-100/50 transition-colors duration-300 px-2 lg:px-0"
            >
              <span className="font-inter-tight text-xl md:text-2xl lg:text-[1.8vw] font-normal text-[#111111] tracking-[-0.03em] leading-tight">{item.name}</span>
              <span className="font-inter-tight text-sm md:text-base font-normal text-[#111111] lg:text-right whitespace-normal lg:whitespace-nowrap tracking-normal">– {item.desc}, {item.year}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- ฉาก 4: Footer ---
const FooterStage = () => {
  return (
    <div className="w-full bg-[#F5F5F5] pt-0 pb-20 md:pt-0 md:pb-32 lg:pt-0 lg:pb-40 flex justify-center items-start px-6 md:px-12">
      <div className="w-full max-w-[950px] grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-start">
        <div className="md:col-span-7 flex flex-col items-start pr-0 md:pr-12">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="text-[#111111] font-helvetica text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.1] tracking-tight uppercase mb-12 md:mb-20"
          >
            Artail Story<br />New York
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-[#111111] font-inter-tight text-sm md:text-base leading-relaxed tracking-wide"
          >
            254 10th Avenue<br />Chelsea – New York<br />NY 10001
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 mt-2 md:mt-2"
        >
          <div className="flex flex-col gap-3 md:gap-4">
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Home</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Artists</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Collections</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Menus</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Pop-ups</a>
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">News</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Videos</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">About</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Contact</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Reservations</a>
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Insta</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">X (Twitter)</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">YouTube</a>
            <a href="#" className="text-[#111111] hover:text-zinc-500 font-inter-tight text-xs md:text-sm tracking-wide transition-colors">Spotify</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  const scrollSequenceRef = useRef(null);
  const { scrollYProgress: rawProgress, scrollY } = useScroll({
    target: scrollSequenceRef,
    offset: ["start start", "end end"]
  });
  
  // แปลงค่า Progress จาก 0-0.5 (ของความสูง 300vh) ให้เป็น 0-0.222 เพื่อให้ตรงกับ Timeline เดิมเป๊ะๆ
  const scrollYProgress = useTransform(rawProgress, [0, 0.5], [0, 0.222]);
  
  // แอนิเมชันเปิดม่าน: ให้ฉาก Hero สไลด์ขึ้น (เริ่มเร็วขึ้นตอนที่หมึกแดงกระจายได้ประมาณครึ่งนึง)
  const curtainY = useTransform(rawProgress, [0.42, 0.85], ["0vh", "-100vh"]);

  // --- 1. Cinematic Exit (ซูมทะลุแก้ว และ แหวกข้อความออกด้านข้าง) ---
  const wineScale = useTransform(scrollYProgress, [0.03, 0.08], [1, 4]);
  const wineBlur = useTransform(scrollYProgress, [0.03, 0.08], ["blur(0px)", "blur(15px)"]);
  const wineOpacity = useTransform(scrollYProgress, [0.03, 0.08], [0.85, 0]);

  const cornerOpacity = useTransform(scrollYProgress, [0.03, 0.07], [1, 0]);
  const cornerLeftX = useTransform(scrollYProgress, [0.03, 0.07], ["0vw", "-10vw"]); // แหวกซ้าย
  const cornerRightX = useTransform(scrollYProgress, [0.03, 0.07], ["0vw", "10vw"]); // แหวกขวา
  const coordY = useTransform(scrollYProgress, [0.03, 0.07], ["0vh", "-15vh"]); // พุ่งขึ้นบน

  // --- 2. The Text Fold (WHAT ARE YOU -> WAYD?) ---
  // NEW: แอนิเมชันสไลด์ข้อความจากใต้ Nav ลงมาอยู่กลางจอ 
  const mainTextY = useTransform(scrollYProgress, [0.04, 0.09], ["0vh", "22vh"]); 

  const mw1 = useTransform(scrollYProgress, [0.04, 0.09], ["25vw", "0vw"]);
  const mw2 = useTransform(scrollYProgress, [0.04, 0.09], ["20vw", "0vw"]);
  const mw3 = useTransform(scrollYProgress, [0.04, 0.09], ["15vw", "0vw"]);
  const mw4 = useTransform(scrollYProgress, [0.04, 0.09], ["45vw", "0vw"]);
  
  const smallOpacity = useTransform(scrollYProgress, [0.04, 0.07], [1, 0]);
  const smallTextHideY = useTransform(scrollYProgress, (v) => v > 0.075 ? -9999 : 0);

  // ปรับระยะห่างบรรทัดให้แคบลง หาจุดสมดุลระหว่าง 0.34 (ทับ) และ 0.38 (ห่างไป 10px) จะได้เส้นบางๆ พอดี
  const line1Y = useTransform(scrollYProgress, [0.04, 0.09], ["-0.36em", "0em"]);
  const line1X = useTransform(scrollYProgress, [0.04, 0.09], ["0em", "-0.45em"]); 
  const line2Y = useTransform(scrollYProgress, [0.04, 0.09], ["0.36em", "0em"]);
  const line2X = useTransform(scrollYProgress, [0.04, 0.09], ["0em", "0.65em"]); 

  // --- 3. The Melt (ละลาย WAYD? เป็นหยดน้ำ) ---
  const gooeyFilter = useTransform(scrollYProgress, (v) => v >= 0.08 ? "url(#goo)" : "none");
  const logoBlur = useTransform(scrollYProgress, [0.10, 0.13], ["blur(0px)", "blur(5px)"]);
  
  const meltScaleY = useTransform(scrollYProgress, [0.10, 0.14], [1, 1.6]); 
  const logoOpacity = useTransform(scrollYProgress, [0.12, 0.15], [1, 0]); 
  const logoHideY = useTransform(scrollYProgress, (v) => v > 0.16 ? -9999 : 0);

  const dropOpacity = useTransform(scrollYProgress, [0.09, 0.11, 0.17, 0.19], [0, 1, 1, 0]); 
  const dropY = useTransform(scrollYProgress, [0.11, 0.17], ["0vh", "60vh"]);
  const dropScaleY = useTransform(scrollYProgress, [0.11, 0.14, 0.17], [1, 3.5, 1]); 
  const dropHideX = useTransform(scrollYProgress, (v) => v > 0.20 ? -9999 : 0);

  // เปลี่ยนเฉพาะสีหยดน้ำเป็นสีไวน์แดง โดยเริ่มเปลี่ยนตอนที่หลุดออกจากตัวอักษร
  const dropColor = useTransform(scrollYProgress, [0.13, 0.16], ["#000000", "#8B0000"]); 

  // ยกเลิกการ fade out เพื่อให้ฉากหมึกแคนวาสเลื่อนขึ้นด้านบนตามธรรมชาติเมื่อ Scroll (เหมือนเปิดม่าน)
  const textLayerMasterOpacity = useTransform(scrollYProgress, [0.21, 0.22], [1, 1]); 

  // --- 4. The Ink Bleed (หมึกกระจายลง Canvas) ---
  // จำกัดขนาดการกระจายของหมึกไว้ที่ 70vmax เพื่อไม่ให้แดงเต็มจอตอนเปิดม่าน
  const bleedMaskSize = useTransform(scrollYProgress, [0.17, 0.21], ["0vmax 0vmax", "70vmax 70vmax"]);
  const bleedOpacity = useTransform(scrollYProgress, [0.17, 0.18], [0, 1]);

  // --- States หลัก ---
  const [view, setView] = useState('home');
  const [overlayView, setOverlayView] = useState('grid');
  const [cartItems, setCartItems] = useState([]);
  const [isMainScrolled, setIsMainScrolled] = useState(false);
  const [nyTime, setNyTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' };
      setNyTime(now.toLocaleTimeString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const scrollToMenu = () => {
    if (scrollSequenceRef.current) {
      // เลื่อนไปที่ระยะ 1.8 เท่าของหน้าจอ (rawProgress ~0.9) ซึ่งเป็นจุดที่ม่านเปิดสุดและเห็นเมนูพอดี
      const targetY = scrollSequenceRef.current.offsetTop + (window.innerHeight * 1.8);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (view === 'catalogue') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [view]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // คำนวณตำแหน่งของหน้าเมนู (จุดที่ปุ่ม COCKTAILS เลื่อนไป)
    const menuTarget = scrollSequenceRef.current ? scrollSequenceRef.current.offsetTop + (window.innerHeight * 1.8) : 0;
    
    // เช็คว่าอยู่บนสุดของเว็บ หรือ อยู่ตรงจุดเริ่มต้นของหน้าเมนูพอดี (เผื่อระยะ +- 50px)
    const isAtTop = latest < 50;
    const isAtMenu = menuTarget > 0 && Math.abs(latest - menuTarget) < 50;
    
    // ถ้าไม่ได้อยู่จุดเริ่มต้นของทั้งสองหน้า ให้ Nav เป็นกระจก
    setIsMainScrolled(!(isAtTop || isAtMenu));
  });

  return (
    <div className="bg-[#F5F5F5] text-[#111111] selection:bg-[#111111] selection:text-[#F5F5F5] relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        
        .font-bebas { font-family: "Bebas Neue", sans-serif; }
        .font-inter { font-family: "Inter", sans-serif; }
        .font-helvetica { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
        .font-inter-tight { font-family: "Inter Tight", "Inter Tight Placeholder", sans-serif; }
        
        ::-webkit-scrollbar { display: none; }

        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee-scroll 90s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
      `}} />

      {view === 'catalogue' && (
        <CatalogueOverlay 
          onClose={() => setView('home')} 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
          overlayView={overlayView}
          setOverlayView={setOverlayView}
          nyTime={nyTime}
        />
      )}

      {view !== 'catalogue' && (
        <nav className={`fixed top-0 left-0 w-full z-[999] px-6 py-5 grid grid-cols-3 items-center transition-all duration-300 pointer-events-auto ${isMainScrolled ? 'bg-[#F5F5F5]/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
          <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111] justify-start">
            <span onClick={scrollToMenu} className="cursor-pointer hover:text-zinc-500 transition-colors">COCKTAILS</span>
            <span onClick={() => { setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">CATALOGUE</span>
            <span className="cursor-pointer hover:text-zinc-500 transition-colors hidden md:block">INFO</span>
            <span className="cursor-pointer hover:text-zinc-500 transition-colors hidden md:block">ARCHIVE</span>
            <span className="cursor-pointer hover:text-zinc-500 transition-colors hidden md:block">EDITORIAL</span>
          </div>
          <div className="flex justify-center text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
            <span onClick={() => { setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">
              BAG ({cartCount})
            </span>
          </div>
          <div className="flex justify-end items-center text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
            <span>NEW YORK, NY {nyTime}</span>
          </div>
        </nav>
      )}

      {/* SVG สำหรับทำเอฟเฟกต์หยดน้ำ (Gooey Melt) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="goo" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Cinematic Sticky Section (300vh) */}
      <div ref={scrollSequenceRef} className="h-[300vh] w-full relative z-30">
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          
          {/* หน้าเมนู (ContentStage) ซ่อนอยู่หลังม่าน ใช้ Sticky ล็อกไว้เลยไม่กระตุก 100% */}
          <div className="absolute inset-0 w-full h-screen z-10 pointer-events-auto bg-[#F5F5F5]">
            <ContentStage rawProgress={rawProgress} />
          </div>

          {/* 🌟 NEW EDITORIAL HERO SECTION 🌟 */}
          <motion.div style={{ opacity: textLayerMasterOpacity, y: curtainY }} className="absolute inset-0 w-full h-screen z-50 pointer-events-none bg-[#F5F5F5]">
                
                {/* 1. ตัวอักษรใหญ่สุด - เพิ่ม pt ให้มากขึ้นเพื่อชดเชยแอนิเมชันที่ดันข้อความพุ่งขึ้นไป ให้มาหยุดพอดีใต้ Nav (ประมาณ 110px - 130px) */}
                <motion.div style={{ filter: logoBlur, WebkitFilter: logoBlur, y: mainTextY }} className="absolute top-0 left-0 w-full flex flex-col items-center justify-start pt-[110px] md:pt-[130px] z-10">
                  <motion.div style={{ filter: gooeyFilter, WebkitFilter: gooeyFilter }} className="relative w-full mx-auto flex items-center justify-center">
                    
                    {/* ลูกปัดหยดน้ำ (ขยับซ้ายให้อยู่ระหว่าง A กับ Y) */}
                    <motion.div className="absolute rounded-full z-0" style={{ backgroundColor: dropColor, width: '40px', height: '40px', top: '50%', marginTop: '-20px', left: '49%', marginLeft: '-20px', y: dropY, x: dropHideX, scaleY: dropScaleY, opacity: dropOpacity, originY: 0.5 }} />
                    
                    {/* อัปเดตระยะ mt-[0.36em] ให้ตรงกับค่า line1Y/line2Y ด้านบน เพื่อรักษาสมดุล */}
                    <motion.div style={{ opacity: logoOpacity, y: logoHideY, WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }} className="relative flex items-center justify-center w-full z-10 text-[22vw] md:text-[18vw] lg:text-[16vw] font-bebas leading-[0.75] tracking-normal text-black whitespace-nowrap h-0 mt-[0.36em]">
                      
                      {/* --- บรรทัดที่ 1 (WHAT ARE YOU) --- */}
                      <motion.div style={{ y: line1Y, x: line1X }} className="absolute flex justify-center items-baseline w-full">
                        <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">W</motion.span>
                        {/* ใช้ overflow-hidden แต่เสริมหลังคากล่องด้วย pt-[0.2em] หัวตัวอักษร HAT, RE, OU จะปลอดภัยไม่โดนขลิบ */}
                        <motion.div style={{ maxWidth: mw1, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline pt-[0.2em]">
                          <span className="font-bebas pr-[3vw]">HAT</span>
                        </motion.div>
                        
                        <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">A</motion.span>
                        <motion.div style={{ maxWidth: mw2, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline pt-[0.2em]">
                          <span className="font-bebas pr-[4vw]">RE</span>
                        </motion.div>
                        
                        <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">Y</motion.span>
                        <motion.div style={{ maxWidth: mw3, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline pt-[0.2em]">
                          <span className="font-bebas pr-[0vw]">OU</span>
                        </motion.div>
                      </motion.div>

                      {/* --- บรรทัดที่ 2 (DRINKING?) --- */}
                      <motion.div style={{ y: line2Y, x: line2X }} className="absolute flex justify-center items-baseline w-full">
                        <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">D</motion.span>
                        {/* เสริมหลังคากล่องด้วย pt-[0.2em] สำหรับ RINKING ด้วย */}
                        <motion.div style={{ maxWidth: mw4, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline pt-[0.2em]">
                          <span className="font-bebas pr-[0vw]">RINKING</span>
                        </motion.div>
                        
                        <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">?</motion.span>
                      </motion.div>

                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* 2. รูปแก้วไวน์ (Zoom & Blur Out) */}
                <motion.div className="absolute inset-0 flex justify-center items-center pointer-events-none z-20 overflow-hidden">
                  <motion.img
                      src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/hero.webp"
                      alt="Wine Splashing"
                      className="h-[100vh] w-auto object-cover"
                      style={{ 
                        opacity: wineOpacity, 
                        scale: wineScale, 
                        filter: wineBlur, 
                        WebkitFilter: wineBlur,
                        mixBlendMode: 'multiply' 
                      }}
                  />
                </motion.div>

                {/* 3. รายละเอียดมุมจอ (จัดพิกัดให้เป๊ะระดับ Pixel กับเส้นขอบตัวอักษร) */}
                
                {/* ที่อยู่ -> ขอบซ้ายตรงกับตัว "D" พอดี | เปลี่ยนจาก bottom เป็น top-[55vh] md:top-[60vh] และเพิ่มขนาดฟอนต์ */}
                <motion.div style={{ x: cornerLeftX, opacity: cornerOpacity }} className="absolute top-[55vh] md:top-[60vh] z-30 font-inter font-medium text-[13px] md:text-[15px] text-[#111111] leading-[1.4] left-[15vw] md:left-[18vw] lg:left-[25vw]">
                    <span>254 10th Avenue</span><br/>
                    <span>Chelsea – New York<br/>NY 10001</span>
                </motion.div>

                {/* คำคม -> ขอบขวาตรงกับจุดของ "?" พอดี | ใช้ top-[55vh] md:top-[60vh] ตัวเลขเดียวกับฝั่งซ้ายเป๊ะ เพื่อให้ Top-Align ตรงกัน */}
                <motion.div style={{ x: cornerRightX, opacity: cornerOpacity }} className="absolute top-[55vh] md:top-[60vh] z-30 font-inter font-medium text-[9px] md:text-[11px] text-[#111111] leading-[1.4] text-right max-w-[200px] md:max-w-[260px] right-[15vw] md:right-[18vw] lg:right-[25vw]">
                    We began with a shared belief:<br/>
                    that cocktails can be more than recipes.<br/>
                    They can be stories, memories,<br/>
                    emotions, moments held briefly in a glass.
                </motion.div>

                {/* พิกัดแนวตั้ง -> ขอบบนตรงกับบรรทัด DRINKING และชิดขวาสุดของตัวอักษร U (ขยับซ้ายนิดนึง) */}
                <div className="absolute top-[24vh] md:top-[28vh] z-30 flex items-start justify-end right-[9vw] md:right-[13vw] lg:right-[15vw]">
                  <motion.div style={{ y: coordY, opacity: cornerOpacity, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} className="font-inter-tight font-bold text-[8px] md:text-[9px] uppercase tracking-widest text-[#111111]">
                      40.7128° N, 74.0060° W
                  </motion.div>
                </div>

                {/* ฉากหมึกกระจาย (Ink Bleed) */}
                <motion.div className="absolute inset-0 bg-[#8B0000] z-40 ink-bleed-mask pointer-events-none" style={{ WebkitMaskSize: bleedMaskSize, maskSize: bleedMaskSize, opacity: bleedOpacity }}>
                  {/* ลบข้อความออกตามที่ต้องการ เหลือแค่พื้นสีแดงกระจาย */}
                </motion.div>

              </motion.div>
            </div>
          </div>

          {/* Natural Scroll Content (ส่วนที่เหลือเลื่อนตามธรรมชาติ) */}
          <div className="w-full flex flex-col relative z-20 bg-[#F5F5F5] pointer-events-auto">
            <ArtistStage />
            <JourneyStage />
            <FooterStage />
          </div>

        </div>
  );
}
