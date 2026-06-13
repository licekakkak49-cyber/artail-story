import React, { useRef, useState, useEffect, createContext, useContext, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// --- Supabase Setup ---
const supabaseUrl = 'https://ttfdcqpzaxnxduvlhtgi.supabase.co';
const supabaseKey = 'sb_publishable_P4ot-bTeATcq9T0ew7YeXQ_3qb9pFvH';
let supabase = null;

// --- Data Context (Phase 2 & 5: Global State & Database) ---
const DataContext = createContext();
export const useData = () => useContext(DataContext);

// --- Configuration & Default Mock Data ---
const defaultDesc = `"Abstract Illusion" captures the essence of Teddy's vision through abstract forms and vibrant flavor profiles. The cocktail uses a palette of deep, rich spirits, swirling them into a sensory experience that evokes the natural beauty of its inspiration.`;

const cocktailMenuData = [
  { name: "Abstract Illusion", artist: "Teddy", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu1.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu1ct.webp", description: defaultDesc, cocktailImages: [] },
  { name: "Golden Hour", artist: "Mimi", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_2.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_2ct.webp", description: defaultDesc, cocktailImages: [] },
  { name: "Velvet Night", artist: "Teddy", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_3.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_3ct.webp", description: defaultDesc, cocktailImages: [] },
  { name: "Crimson Tide", artist: "Mimi", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_4.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_4ct.webp", description: defaultDesc, cocktailImages: [] },
  { name: "Emerald Dream", artist: "Teddy", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_5.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_5ct.webp", description: defaultDesc, cocktailImages: [] },
  { name: "Sapphire Soul", artist: "Mimi", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_6.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_6ct.webp", description: defaultDesc, cocktailImages: [] },
  { name: "Amber Glow", artist: "Teddy", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_7.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_7ct.webp", description: defaultDesc, cocktailImages: [] },
  { name: "Obsidian Whisper", artist: "Mimi", src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_8.webp", hoverSrc: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/menu_8ct.webp", description: defaultDesc, cocktailImages: [] }
];

const editorialStories = {
  teddy: [
    { category: "CRAFT", title: "The Art of Ice Carving", aspect: "aspect-[3/4]", src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80" },
    { category: "DESIGN", title: "The Geometry of Glassware", aspect: "aspect-[4/3]", src: "https://images.unsplash.com/photo-1571597314545-2384a51eb85c?auto=format&fit=crop&w=800&q=80" },
    { category: "VINTAGE", title: "Sourcing Mid-Century Bar Tools", aspect: "aspect-[2/3]", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" },
    { category: "DECOR", title: "Lighting the Perfect Mood", aspect: "aspect-square", src: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80" },
    { category: "CLASSICS", title: "Reimagining the Negroni", aspect: "aspect-[3/4]", src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80" }
  ],
  mimi: [
    { category: "ART", title: "Abstract Expressionism in Chelsea", aspect: "aspect-[3/4]", src: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80" },
    { category: "STUDIO", title: "Late Night Paint Splatters", aspect: "aspect-[4/3]", src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80" },
    { category: "INSPIRATION", title: "Color Palettes of New York Autumn", aspect: "aspect-[2/3]", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    { category: "ARCHITECTURE", title: "Brutalist Spaces & Soft Textures", aspect: "aspect-square", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
    { category: "GALLERY", title: "The First Solo Exhibition", aspect: "aspect-[3/4]", src: "https://images.unsplash.com/photo-1597330768910-c081e7d23588?auto=format&fit=crop&w=800&q=80" }
  ]
};

const catalogueItems = [
  { name: "Whispered Whirlwind", price: "129", src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80", designer: "Daniel Kim", year: "2026", colour: "Ebony Black", size: "2.7\" x 2.7\" x 5.0\"", material: "STONEWARE", info: "Tray with matte finish. Candle included in your order may differ in color.", stock: "03", images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1610701596027-14c0a524bcda?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1610701596013-14902b37bd14?auto=format&fit=crop&w=800&q=80"] },
  { name: "Enchanted Canvas", price: "375", src: "https://images.unsplash.com/photo-1597330768910-c081e7d23588?auto=format&fit=crop&w=800&q=80", designer: "Elena Rostova", year: "2025", colour: "Cerulean Blue", size: "12.0\" x 8.5\" x 4.0\"", material: "CERAMIC & CLAY", info: "Hand-sculpted centerpiece. Each piece is unique and may feature slight variations.", stock: "01", images: ["https://images.unsplash.com/photo-1597330768910-c081e7d23588?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1597330768875-14f09d84f93b?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1597330768900-349c258d4a66?auto=format&fit=crop&w=800&q=80"] },
  { name: "Ethereal Serenade", price: "89", src: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80", designer: "Studio Narkara", year: "2026", colour: "Midnight & Coral", size: "5.5\" x 4.0\" x 8.0\"", material: "MIXED MEDIA", info: "Abstract floral interpretation. Keep away from direct sunlight to preserve colors.", stock: "05", images: ["https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1602928321855-3a7c6f091c78?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1602928321590-b1935c181fcd?auto=format&fit=crop&w=800&q=80"] },
  { name: "Signature Glassware", price: "150", src: "https://images.unsplash.com/photo-1571597314545-2384a51eb85c?auto=format&fit=crop&w=800&q=80", designer: "Teddy", year: "2024", colour: "Clear Crystal", size: "3.5\" x 3.5\" x 4.2\"", material: "HAND-BLOWN GLASS", info: "Set of two. Crafted for optimal aroma release. Hand wash recommended.", stock: "12", images: ["https://images.unsplash.com/photo-1571597314545-2384a51eb85c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1582269438706-e7e0e7a2b0e6?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1571597314717-380ff95574c8?auto=format&fit=crop&w=800&q=80"] }
];

const journeyTimelineData = [
  { id: 1, name: "The First Shared Belief", desc: "Concept formulation", year: "2023" },
  { id: 2, name: "WAYD? at Narkara", desc: "A one-day bartender session", year: "2024" },
  { id: 3, name: "The Artail Movement", desc: "Collaborative pop-ups around the city", year: "2024" },
  { id: 4, name: "The Permanent Canvas", desc: "Opening our own gallery bar", year: "2025" },
  { id: 5, name: "The First Exhibition", desc: "Debuting our signature seasonal menu", year: "2026" }
];

const siteSettingsData = {
  quoteMain: "The bar becomes a\n(canvas)\nThe drinks are\nthe work",
  quoteCinematic: "We began with a shared belief:\nthat cocktails can be more than recipes.\nThey can be stories, memories,\nemotions, moments held briefly in a glass.",
  address: "254 10th Avenue\nChelsea, New York\nNY 10001",
  email: "hello@artailstory.com",
  phone: "+1 (212) 555-0199",
  hours1: "5:00 PM – 12:00 AM",
  hours2: "5:00 PM – 1:00 AM",
  hours3: "5:00 PM – 11:00 PM",
  hours4: "Closed (Studio Days)",
  barImage: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
  artist1_name: "Mimi",
  artist1_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  artist2_name: "Teddy",
  artist2_image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617539313314!2d-74.0084126234181!3d40.74844047138819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259b9b3117469%3A0xd134e199a405a163!2s254%2010th%20Ave%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1716720000000!5m2!1sen!2sus",
  latitude_longitude: "40.7128° N, 74.0060° W"
};

export const DataProvider = ({ children }) => {
  const [cocktails, setCocktails] = useState(cocktailMenuData);
  const [editorials, setEditorials] = useState(editorialStories);
  const [catalogue, setCatalogue] = useState(catalogueItems);
  const [timeline, setTimeline] = useState(journeyTimelineData);
  const [settings, setSettings] = useState(siteSettingsData);
  const [syncStatus, setSyncStatus] = useState(supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseUrl.startsWith('http') ? 'Mock Mode' : 'Synced');
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    const fetchSupabaseData = async () => {
      if (supabaseUrl === 'YOUR_SUPABASE_URL' || !supabase) {
        setDbLoading(false);
        return; 
      }
      try {
        const [
          { data: cData },
          { data: catData },
          { data: edData },
          { data: tmData },
          { data: stData }
        ] = await Promise.all([
          supabase.from('cocktails').select('*'),
          supabase.from('catalogue').select('*').order('created_at', { ascending: true }),
          supabase.from('editorials').select('*'),
          supabase.from('timeline').select('*').order('year', { ascending: true }),
          supabase.from('site_settings').select('*').limit(1).single()
        ]);

        if (cData && cData.length > 0) {
          const mappedCocktails = cData.map(item => ({ 
            ...item, 
            hoverSrc: item.hover_src || item.hoverSrc,
            cocktailImages: item.cocktail_images || item.cocktailImages || [],
            description: item.description || defaultDesc
          }));
          setCocktails(mappedCocktails);
        }
        if (catData && catData.length > 0) setCatalogue(catData);

        if (edData && edData.length > 0) {
          const grouped = { teddy: [], mimi: [] };
          edData.forEach(item => {
            if (grouped[item.artist]) grouped[item.artist].push(item);
          });
          setEditorials(grouped);
        }

        if (tmData && tmData.length > 0) setTimeline(tmData);
        
        // 🌟 [START: แก้ปัญหา \n ในข้อมูล Settings จากฐานข้อมูล] 🌟
        if (stData) {
          // ฟังก์ชันเล็กๆ ช่วยแปลง \n แบบตัวอักษร ให้เป็น Enter จริงๆ
          const formatText = (text) => text ? text.replace(/\\n/g, '\n') : text;

          setSettings({
            ...siteSettingsData, // fallback defaults
            ...stData,
            // แปลงค่าเฉพาะฟิลด์ที่มีโอกาสถูกกด Enter
            quoteMain: formatText(stData.quote_main ?? stData.quoteMain ?? siteSettingsData.quoteMain),
            quoteCinematic: formatText(stData.quote_cinematic ?? stData.quoteCinematic ?? siteSettingsData.quoteCinematic),
            address: formatText(stData.address ?? siteSettingsData.address),
            // ฟิลด์อื่นๆ ไม่จำเป็นต้องแปลง
            barImage: stData.bar_image ?? stData.barImage ?? siteSettingsData.barImage,
            hours1: stData.hours_1 ?? stData.hours1 ?? siteSettingsData.hours1,
            hours2: stData.hours_2 ?? stData.hours2 ?? siteSettingsData.hours2,
            hours3: stData.hours_3 ?? stData.hours3 ?? siteSettingsData.hours3,
            hours4: stData.hours_4 ?? stData.hours4 ?? siteSettingsData.hours4,
          });
        }
        // 🌟 [END: แก้ปัญหา \n] 🌟

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDbLoading(false);
      }
    };
    fetchSupabaseData();
  }, []);

  const contextValue = useMemo(() => ({
    cocktails, setCocktails, 
    editorials, setEditorials, 
    catalogue, setCatalogue, 
    timeline, setTimeline, 
    settings, setSettings, 
    syncStatus, setSyncStatus,
    dbLoading
  }), [cocktails, editorials, catalogue, timeline, settings, syncStatus, dbLoading]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

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

const ProductDetail = ({ item, onNavigate, onAcquire }) => {
  const { catalogue } = useData();
  const [imageIndex, setImageIndex] = useState(0);

  const handleDragEnd = (e, { offset }) => {
    const swipe = offset.x;
    if (swipe < -50 && imageIndex < item.images.length - 1) {
      setImageIndex(prev => prev + 1);
    } else if (swipe > 50 && imageIndex > 0) {
      setImageIndex(prev => prev - 1);
    }
  };

  const currentIndex = catalogue.findIndex(i => i.name === item.name);
  const handlePrev = () => { if (currentIndex > 0) onNavigate(catalogue[currentIndex - 1]); };
  const handleNext = () => { if (currentIndex < catalogue.length - 1) onNavigate(catalogue[currentIndex + 1]); };

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

const CatalogueOverlay = ({ onClose, cartItems, setCartItems, overlayView, setOverlayView, nyTime, setView }) => {
  const { catalogue } = useData();
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
        <div ref={headerRef} className="px-0">
          <h1 className="font-aura text-[10vw] md:text-[7vw] leading-[0.9] tracking-normal uppercase text-[#111111] mb-4 md:mb-6">
            ART &amp; OBJECTS
          </h1>
        </div>
        <div className={`sticky top-0 w-full z-50 py-4 transition-all duration-300 ${isSticky ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
              <span onClick={onClose} className="cursor-pointer hover:text-zinc-500 transition-colors">HOME</span>
              <span onClick={openGrid} className="cursor-pointer hover:text-zinc-500 transition-colors">CATALOGUE</span>
              <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">STORIES</span>
              <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">VISIT</span>
            </div>
            <div className="flex text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
              <span onClick={openBag} className="cursor-pointer hover:text-zinc-500 transition-colors">BAG ({cartCount})</span>
            </div>
          </div>
        </div>

        {overlayView === 'bag' ? (
          <BagView cartItems={cartItems} onRemove={handleRemoveFromBag} />
        ) : overlayView === 'detail' && selectedItem ? (
          <ProductDetail item={selectedItem} onNavigate={openDetail} onAcquire={handleAcquire} />
        ) : (
          <div className="w-full mt-10 md:mt-14">
            <div className="flex justify-between items-center w-full mb-4 md:mb-6 text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111] px-0">
              <span>OBJECTS ({catalogue.length})</span>
              <span>SHOW ALL</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-20 w-full">
              {catalogue.map((item, idx) => (
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

const VisitOverlay = ({ onClose, cartCount, setView, setOverlayView, nyTime }) => {
  const { settings } = useData();
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  const handleScroll = (e) => {
    if (headerRef.current) {
      setIsSticky(e.target.scrollTop > headerRef.current.offsetHeight - 20);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#ffffff] z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <div className="w-full flex flex-col pt-8 md:pt-12 px-2 md:px-4">
        <div ref={headerRef} className="px-0">
          <h1 className="font-aura text-[10vw] md:text-[7vw] leading-[0.9] tracking-normal uppercase text-[#111111] mb-4 md:mb-6">
            VISIT US
          </h1>
        </div>
        <div className={`sticky top-0 w-full z-50 py-4 transition-all duration-300 ${isSticky ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
              <span onClick={onClose} className="cursor-pointer hover:text-zinc-500 transition-colors">HOME</span>
              <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">CATALOGUE</span>
              <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">STORIES</span>
              <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">VISIT</span>
            </div>
            <div className="flex text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
              <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">BAG ({cartCount})</span>
            </div>
          </div>
        </div>

        <div className="w-full mt-10 md:mt-14 pb-24 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start px-0">
          <div className="md:col-span-5 flex flex-col gap-12">
            <div className="flex gap-4 items-start">
              <span className="font-inter text-zinc-400 text-xs md:text-sm font-light pt-1.5">01</span>
              <div className="flex flex-col">
                <h2 className="font-inter font-black text-2xl md:text-3xl tracking-tight text-[#111111] uppercase">ADDRESS</h2>
                <p className="font-inter text-sm md:text-base text-zinc-600 mt-2 leading-relaxed">
                  {(settings.address || '').replace(/\\n/g, '\n').split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-inter text-zinc-400 text-xs md:text-sm font-light pt-1.5">02</span>
              <div className="flex flex-col w-full">
                <h2 className="font-inter font-black text-2xl md:text-3xl tracking-tight text-[#111111] uppercase">HOURS</h2>
                <div className="font-inter text-sm md:text-base text-zinc-600 mt-2 flex flex-col gap-1.5 w-full max-w-xs">
                  <div className="flex justify-between">
                    <span>Wednesday – Thursday</span>
                    <span>{settings.hours1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday – Saturday</span>
                    <span>{settings.hours2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>{settings.hours3}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Monday – Tuesday</span>
                    <span>{settings.hours4}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-inter text-zinc-400 text-xs md:text-sm font-light pt-1.5">03</span>
              <div className="flex flex-col">
                <h2 className="font-inter font-black text-2xl md:text-3xl tracking-tight text-[#111111] uppercase">EMAIL</h2>
                <p className="font-inter text-sm md:text-base text-zinc-600 mt-2 leading-relaxed">
                  <a href={`mailto:${settings.email}`} className="hover:text-[#d92323] transition-colors">{settings.email}</a>
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-inter text-zinc-400 text-xs md:text-sm font-light pt-1.5">04</span>
              <div className="flex flex-col">
                <h2 className="font-inter font-black text-2xl md:text-3xl tracking-tight text-[#111111] uppercase">PHONE</h2>
                <p className="font-inter text-sm md:text-base text-zinc-600 mt-2 leading-relaxed">
                  <a href={`tel:${settings.phone}`} className="hover:text-[#d92323] transition-colors">{settings.phone}</a>
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col items-end w-full gap-0">
            <div className="w-full aspect-[16/10] bg-[#F5F5F5] overflow-hidden relative group">
              <img 
                src={settings.barImage} 
                alt="Artail Story Space" 
                className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:grayscale"
              />
            </div>
            <div className="w-[75%] aspect-[16/10] bg-[#EAEAEA] overflow-hidden relative group">
              <iframe 
                src={settings.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617539313314!2d-74.0084126234181!3d40.74844047138819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259b9b3117469%3A0xd134e199a405a163!2s254%2010th%20Ave%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1716720000000!5m2!1sen!2sus"}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full transition-all duration-700 ease-in-out group-hover:grayscale"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditorialOverlay = ({ onClose, cartCount, setView, setOverlayView, nyTime }) => {
  const { editorials, settings } = useData();
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  const handleScroll = (e) => {
    if (headerRef.current) {
      setIsSticky(e.target.scrollTop > headerRef.current.offsetHeight - 20);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#ffffff] z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <div className="w-full flex flex-col pt-8 md:pt-12 px-2 md:px-4">
        <div ref={headerRef} className="px-0">
          <h1 className="font-aura text-[10vw] md:text-[7vw] leading-[0.9] tracking-normal uppercase text-[#111111] mb-4 md:mb-6">
            EDITORIAL &amp; STORIES
          </h1>
        </div>
        <div className={`sticky top-0 w-full z-50 py-4 transition-all duration-300 ${isSticky ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
              <span onClick={onClose} className="cursor-pointer hover:text-zinc-500 transition-colors">HOME</span>
              <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">CATALOGUE</span>
              <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">STORIES</span>
              <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">VISIT</span>
            </div>
            <div className="flex text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
              <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">BAG ({cartCount})</span>
            </div>
          </div>
        </div>

        <div className="w-full mt-10 md:mt-14 pb-32 flex flex-col gap-24 md:gap-32 px-6 md:px-12 lg:px-24">
          
          {/* Artist 1: Mimi (Image Right, Text Left) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center order-2 md:order-1 px-4 md:px-0">
              <h3 className="font-aura text-xl md:text-2xl lg:text-3xl text-[#1C1C1C] leading-[1.3] mb-8">
                “I once believed I had lost my art. But behind the bar, I found it again. Today, I paint with flavor, balance, and emotion.
                <br/><br/>
                This pop-up is my canvas, and every drink tells the story of my return to myself.”
              </h3>
              <div className="font-mono text-[10px] md:text-xs text-[#9CA3AF] uppercase tracking-widest">
                — {settings.artist1_name || "MIMI"}
              </div>
            </div>
            <div className="md:col-span-6 lg:col-span-5 lg:col-start-8 relative order-1 md:order-2">
              <motion.div 
                whileHover={{ y: -8 }} 
                transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
                className="w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] bg-[#F2F1EC] overflow-hidden"
              >
                <img src={settings.artist1_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"} alt={settings.artist1_name || "Mimi"} loading="lazy" decoding="async" className="w-full h-full object-cover" draggable="false" />
              </motion.div>
            </div>
          </div>

          {/* Artist 2: Teddy (Image Left, Text Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-6 lg:col-span-5 relative order-1">
              <motion.div 
                whileHover={{ y: -8 }} 
                transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
                className="w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] bg-[#F2F1EC] overflow-hidden"
              >
                <img src={settings.artist2_image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80"} alt={settings.artist2_name || "Teddy"} loading="lazy" decoding="async" className="w-full h-full object-cover" draggable="false" />
              </motion.div>
            </div>
            <div className="md:col-span-6 lg:col-span-6 lg:col-start-7 flex flex-col justify-center order-2 px-4 md:px-0">
              <h3 className="font-aura text-xl md:text-2xl lg:text-3xl text-[#1C1C1C] leading-[1.3] mb-8">
                “Cocktails became my world when I realized they weren't just my job; they're how I express who I am. 
                <br/><br/>
                After years behind the bar, I'm taking the next step: blending cocktails and art, and turning drinks into stories.”
              </h3>
              <div className="flex flex-col gap-3">
                <div className="font-mono text-xs md:text-sm text-[#1C1C1C] uppercase tracking-widest font-bold">
                  — {settings.artist2_name || "TEDDY"}
                </div>
                <div className="font-mono text-[9px] md:text-[10px] text-[#9CA3AF] uppercase tracking-widest leading-relaxed">
                  Winner “Bar Star Awards”<br/>by New York Bartender Week 2025
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ZoomImage = ({ src, alt, className, containerRef }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start end", "center center"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.0]);

  return (
    <div ref={ref} className="w-full h-full overflow-hidden">
      <motion.img
        style={{ scale }}
        src={src}
        alt={alt}
        className={className}
      />
    </div>
  );
};

const MenuDetailOverlay = ({ item, onClose, nyTime, onMenuClick, cartCount, setView, setOverlayView }) => {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const overlayRef = useRef(null);
  const { settings } = useData();

  const { scrollYProgress } = useScroll({ container: overlayRef });
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1.1, 1.0]);

  const { cocktails } = useData();
  const moreItems = cocktails.filter(menu => menu.artist === item.artist && menu.name !== item.name);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [item]);

  const handleScroll = (e) => {
    if (headerRef.current) {
      setIsSticky(e.target.scrollTop > headerRef.current.offsetHeight - 20);
    }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-[#F5F5F5] z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <div className={`sticky top-0 w-full z-50 px-6 py-5 transition-all duration-300 ${isSticky ? 'bg-[#F5F5F5]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
            <span onClick={onClose} className="cursor-pointer hover:text-zinc-500 transition-colors">COCKTAILS</span>
            <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">CATALOGUE</span>
            <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">STORIES</span>
            <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">VISIT</span>
          </div>
          <div className="flex text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#111111]">
            <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">
              BAG ({cartCount})
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-4 md:pt-6 pb-24">
        <div ref={headerRef}>
          <h1 className="font-helvetica font-normal text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-[#111111] mb-2 md:mb-4">
            {item.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="md:col-span-7 lg:col-span-8 flex flex-col">
            <div className="w-full bg-[#EAEAEA] overflow-hidden shadow-sm">
              <motion.img 
                style={{ scale: imageScale }} 
                src={item.src} 
                alt={item.name} 
                className="w-full h-auto object-cover origin-top transform-gpu" 
              />
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <p className="font-inter text-sm md:text-base text-[#111111] leading-relaxed mb-10">
              {item.description || defaultDesc}
            </p>

            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 rounded-full bg-zinc-300 overflow-hidden shrink-0">
                <img src={item.artist === (settings.artist1_name || 'Mimi') ? (settings.artist1_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80") : (settings.artist2_image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80")} alt={item.artist} className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-helvetica text-lg md:text-xl font-normal text-[#111111]">{item.artist}</span>
                  <span className="font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest">• New York</span>
                </div>
                <span onClick={() => { onClose(); setView('editorial'); }} className="font-inter-tight text-[10px] md:text-xs text-[#111111] uppercase tracking-widest mt-1 cursor-pointer hover:text-[#d92323] transition-colors">+ About Artist</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-16 md:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
            {((item.cocktailImages && item.cocktailImages.length > 0) ? item.cocktailImages : (item.hoverSrc ? [item.hoverSrc] : [])).map((imgUrl, idx) => (
              <div key={idx} className="w-full aspect-[3/4] bg-[#EAEAEA] overflow-hidden shadow-sm">
                <ZoomImage 
                  src={imgUrl} 
                  alt={`${item.name} Cocktail ${idx + 1}`} 
                  className="w-full h-full object-cover origin-top transform-gpu" 
                  containerRef={overlayRef}
                />
              </div>
            ))}
          </div>
          <span className="block font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest mt-4">The Cocktail Interpretation</span>
        </div>

        {moreItems.length > 0 && (
          <div className="w-full mt-24 md:mt-32 pt-12 border-t border-[#111111]/20">
            <h3 className="font-helvetica text-3xl md:text-4xl lg:text-5xl text-[#111111] mb-8 md:mb-12 tracking-tight">More by {item.artist}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {moreItems.slice(0, 4).map((moreItem, idx) => (
                <div key={idx} onClick={() => onMenuClick(moreItem)} className="flex flex-col cursor-pointer group">
                  <div className="w-full aspect-[3/4] bg-[#EAEAEA] overflow-hidden mb-3">
                    <ZoomImage 
                      src={moreItem.src} 
                      alt={moreItem.name} 
                      className="w-full h-full object-cover origin-top transform-gpu" 
                      containerRef={overlayRef}
                    />
                  </div>
                  <span className="font-inter-tight font-bold text-[11px] md:text-xs text-[#111111]">"{moreItem.name}"</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const ContentStage = ({ rawProgress }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  useMotionValueEvent(rawProgress, "change", (latest) => {
    if (latest > 0.75 && !isRevealed) {
      setIsRevealed(true);
    }
  });

  const menus = [
    {
      title: "Sunflowers",
      image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80",
      caption: "Inspired by Vincent van Gogh's Sunflowers.\nA bright, warm, low-ABV cocktail with a refreshing,\neasy drinking character.",
      reference: "Vincent van Gogh, Sunflowers, 1889\nVan Gogh Museum, Amsterdam\n© Van Gogh Museum",
      quote: "This was my very first painting, from a time when I barely knew how people talked about art. I came from restaurant bartending, not galleries or textbooks.\n\nAfter discovering Van Gogh's Sunflowers and visiting an exhibition in New York inspired by his work, the feeling stayed with me. It quietly sparked the beginning of WAYD.\n\nThis drink follows the painting's direction. Bright in color, warm in energy, and full of life. Its refreshing, low-ABV character feels like a summer afternoon, easy, open, and gently layered.\n\nThis is not just a beverage. It is an experience of light, color, and emotion, and my interpretation of the WAYD style.",
      artist: "— Teddy",
      tags: "• Low ABV Light • Honest • Quietly expressive",
      ingredients: "Chinola Passionfruit, Dry Vermouth, Licor 43, Benedictine, Verjus",
      price: "$21"
    },
    {
      title: "Yellow",
      image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=1200&q=80",
      caption: "A cocktail that has undergone a milk-washing\nprocess. Inspired by Coldplay's song \"Yellow\".\nReferencing the album: Parachutes",
      reference: "Inspired by Coldplay (Album Parachutes)\n- \"Yellow\" (official artwork)\nImage courtesy of Spotify",
      quote: "People often ask about my favorite colors. Yellow has never been one of mine.\n\nYet, when it comes to music, Yellow is the song I return to most.\n\nI chose this drink to launch WAYD because it was with me long before any idea of a menu or a brand existed. During a time when life felt heavy and isolating, I was simply searching for a song that could offer solace. I paused at the title—Yellow—and as it began to play, tears flowed effortlessly.\n\nThe music didn't try to lift me up or promise answers; it simply existed, and that was enough.\n\nThis cocktail captures the essence of that night: soft, warm, and sincere.\n\nA gentle reminder that sometimes, light doesn't make a grand entrance.\n\nIf you've ever wondered who you're doing all of this for, welcome to Yellow...",
      artist: "— Mimi",
      tags: "• Warm • Luminous • Spirit-Forward",
      ingredients: "Milk-Washed Nikka days Whiskey, Sake, Honey Pear Tea, Mango, Maple Syrup",
      price: "$23"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isRevealed ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="w-full h-full bg-[#111111] overflow-y-auto overflow-x-hidden text-[#EAEAEA] flex flex-col pointer-events-auto"
    >
      <div className="w-full h-24 md:h-32 shrink-0"></div>
      
      {menus.map((menu, i) => (
        <div key={i} className="w-full flex flex-col md:flex-row min-h-[100vh] border-b border-[#333333] last:border-0 relative bg-[#111111]">
          
          {/* Left Column */}
          <div className="w-full md:w-[45%] flex flex-col items-center justify-start pt-16 md:pt-24 pb-16 px-8 md:px-16 border-b md:border-b-0 md:border-r border-[#333333] relative">
            <h2 className="font-aura font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-12 tracking-tight capitalize">
              {menu.title}
            </h2>
            <div className="w-full max-w-sm aspect-[4/5] bg-[#1C1C1C] overflow-hidden mb-12 shadow-2xl">
              <img src={menu.image} alt={menu.title} className="w-full h-full object-cover grayscale opacity-90" />
            </div>
            <p className="font-helvetica font-medium text-[11px] md:text-xs text-center text-[#EAEAEA] max-w-sm leading-[1.6] whitespace-pre-wrap">
              {menu.caption}
            </p>
            <div className="w-full absolute bottom-6 right-6 md:bottom-8 md:right-8 text-[8px] md:text-[9px] text-zinc-500 text-right font-mono uppercase whitespace-pre-wrap pointer-events-none">
              {menu.reference}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-[55%] flex flex-col h-full min-h-[50vh] md:min-h-screen relative">
            
            {/* Quote Area */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24">
              <div className="font-helvetica font-medium text-xs md:text-sm lg:text-[15px] leading-[1.8] text-[#EAEAEA] whitespace-pre-wrap max-w-md w-full">
                {menu.quote.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6">"{paragraph}"</p>
                ))}
                <div className="text-right font-helvetica font-bold mt-8 text-white">
                  {menu.artist}
                </div>
              </div>
            </div>

            {/* Bottom Metadata Panel */}
            <div className="w-full bg-[#1C1C1C] flex flex-col items-center justify-center py-10 px-8 border-t border-[#333333] mt-auto">
              <div className="font-helvetica font-bold text-[10px] md:text-xs text-white mb-2 tracking-wide text-center">
                {menu.tags}
              </div>
              <div className="font-helvetica text-[10px] md:text-xs text-zinc-400 text-center max-w-sm mb-2">
                {menu.ingredients}
              </div>
              <div className="font-mono text-xs md:text-sm text-white font-bold tracking-widest text-center mt-2">
                {menu.price}
              </div>
            </div>
            
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const HomeCatalogueStage = ({ setView, setOverlayView }) => {
  const { catalogue, dbLoading } = useData();
  const displayItems = catalogue.slice(0, 4);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } 
    }
  };

  const imageVariants = {
    hidden: { scale: 1.15 },
    visible: { 
      scale: 1, 
      transition: { duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <div className="w-full bg-[#F5F5F5] py-24 md:py-32 lg:py-40 flex flex-col items-center px-6 md:px-12 lg:px-24 relative">
      <div className="w-full max-w-[1400px] flex flex-col relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-0">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-[#111111] font-helvetica text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase"
          >
            OBJECTS
          </motion.h2>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <button 
              onClick={() => { setView('catalogue'); setOverlayView('grid'); }}
              className="text-[#111111] border border-[#111111] px-8 py-3 rounded-full font-inter-tight text-xs md:text-sm uppercase tracking-widest hover:bg-[#111111] hover:text-[#F5F5F5] transition-colors"
            >
              View All Objects
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {dbLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col animate-pulse">
                <div className="w-full aspect-[4/5] bg-zinc-200/50 border border-dashed border-zinc-400/40 mb-4 flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/20 to-transparent -translate-x-full animate-shimmer"></div>
                  <span className="font-helvetica text-[9px] text-zinc-500 uppercase tracking-widest font-bold z-10">[ LOADING OBJECT ]</span>
                </div>
                <div className="h-4 bg-zinc-300/40 w-3/4 mb-2"></div>
                <div className="h-3 bg-zinc-300/30 w-1/4"></div>
              </div>
            ))
          ) : (
            displayItems.map((item, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="flex flex-col group cursor-pointer"
                onClick={() => { setView('catalogue'); setOverlayView('grid'); }}
              >
                <div className="w-full aspect-[4/5] bg-[#EAEAEA] mb-4 overflow-hidden relative">
                  <motion.img 
                    variants={imageVariants}
                    src={item.src} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale origin-center" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
                </div>
                <h3 className="font-helvetica font-bold text-xs md:text-sm text-[#111111] uppercase tracking-wide truncate">{item.name}</h3>
                <p className="font-mono text-xs text-zinc-500 mt-1">${item.price}</p>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

const JourneyStage = () => {
  const { timeline } = useData();

  return (
    <div className="w-full bg-[#1C1C1C] pt-12 pb-24 md:pt-20 md:pb-32 lg:pt-24 lg:pb-40 flex justify-center items-start px-6 md:px-12 lg:px-48">
      <div className="w-full max-w-none grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start pt-4 md:pt-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="md:col-span-4 flex flex-col items-start pr-0 md:pr-12"
        >
          <h2 className="text-[#F5F5F5] font-helvetica text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.1] tracking-tight uppercase">
            Our<br />Journey
          </h2>
          <p className="text-[#F5F5F5] font-inter-tight text-xs md:text-sm font-normal tracking-normal mt-3 md:mt-4 max-w-[280px]">
            From a shared belief to a permanent canvas
          </p>
        </motion.div>
        <div className="md:col-span-8 flex flex-col w-full mt-8 md:mt-0">
          {timeline.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, delay: i * 0.25, ease: "easeOut" }}
              className="w-full border-b border-[#F5F5F5]/30 flex flex-col lg:flex-row justify-between items-start lg:items-baseline py-3 md:py-4 lg:py-5 gap-2 lg:gap-4 hover:bg-[#2A2A2A] transition-colors duration-300 px-2 lg:px-0"
            >
              <span className="font-inter-tight text-xl md:text-2xl lg:text-[1.8vw] font-normal text-[#F5F5F5] tracking-[-0.03em] leading-tight">{item.name}</span>
              <span className="font-inter-tight text-sm md:text-base font-normal text-[#F5F5F5] lg:text-right whitespace-normal lg:whitespace-nowrap tracking-normal">– {item.desc}, {item.year}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FooterStage = ({ onSecretClick }) => {
  const { settings } = useData();
  
  return (
    <div className="w-full bg-[#F5F5F5] pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20 flex justify-center items-start px-6 md:px-12">
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
            {(settings.address || '').replace(/\\n/g, '\n').split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
            <span onClick={onSecretClick} className="cursor-pointer text-[#111111]/5 select-none hover:text-[#d92323] transition-colors" title="Staff Only">.</span>
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

const HeroLandingStage = ({ setView, setOverlayView, cartCount }) => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Grid shatters outwards
  const gridLineYUp = useTransform(scrollY, [0, 200], ["0vh", "-100vh"]);
  const gridLineYDown = useTransform(scrollY, [0, 200], ["0vh", "100vh"]);
  const gridLineXLeft = useTransform(scrollY, [0, 200], ["0vw", "-100vw"]);
  const gridLineXRight = useTransform(scrollY, [0, 200], ["0vw", "100vw"]);
  const gridOpacity = useTransform(scrollY, [100, 250], [1, 0]);

  // Background zooms, blurs, and fades
  const bgScale = useTransform(scrollY, [0, 350], [1, 1.15]);
  const bgBlur = useTransform(scrollY, [0, 350], ["blur(0px)", "blur(20px)"]);
  const bgOpacity = useTransform(scrollY, [100, 400], [1, 0]);

  // Nav slides UP and fades
  const navY = useTransform(scrollY, [100, 400], ["0px", "-40px"]);
  const navOpacity = useTransform(scrollY, [100, 300], [1, 0]);

  // Subtitle drops down, blurs, and fades
  const subY = useTransform(scrollY, [200, 500], ["0px", "60px"]);
  const subOpacity = useTransform(scrollY, [200, 400], [1, 0]);
  const subBlur = useTransform(scrollY, [200, 500], ["blur(0px)", "blur(10px)"]);

  // Bottom blocks drop down further, blur, and fade
  const bottomY = useTransform(scrollY, [300, 600], ["0px", "80px"]);
  const bottomOpacity = useTransform(scrollY, [300, 500], [1, 0]);
  const bottomBlur = useTransform(scrollY, [300, 600], ["blur(0px)", "blur(10px)"]);

  const pointerEvents = useTransform(scrollY, (v) => v > 500 ? "none" : "auto");
  const visibilityState = useTransform(scrollY, (v) => v > 650 ? "hidden" : "visible");

  return (
    <div ref={containerRef} className="w-full h-[200vh] bg-[#111111] relative">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Background Image */}
        <motion.div style={{ opacity: bgOpacity, scale: bgScale, filter: bgBlur, WebkitFilter: bgBlur, visibility: visibilityState }} className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 origin-center">
          <img 
            src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/background.webp" 
            alt="background" 
            className="h-full w-auto object-contain" 
          />
        </motion.div>

        {/* Grid Lines - Animated individually */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
           <motion.div style={{ y: gridLineYUp, opacity: gridOpacity, visibility: visibilityState }} className="absolute left-[25%] w-[1px] h-full bg-white/10"></motion.div>
           <motion.div style={{ y: gridLineYDown, opacity: gridOpacity, visibility: visibilityState }} className="absolute left-[50%] w-[1px] h-full bg-white/10"></motion.div>
           <motion.div style={{ y: gridLineYUp, opacity: gridOpacity, visibility: visibilityState }} className="absolute left-[75%] w-[1px] h-full bg-white/10"></motion.div>
           
           <motion.div style={{ x: gridLineXLeft, opacity: gridOpacity, visibility: visibilityState }} className="absolute w-full h-[1px] bg-white/10 top-[25%]"></motion.div>
           <motion.div style={{ x: gridLineXRight, opacity: gridOpacity, visibility: visibilityState }} className="absolute w-full h-[1px] bg-white/10 top-[70%]"></motion.div>
        </div>

        {/* Navigation Bar */}
        <motion.nav style={{ opacity: navOpacity, y: navY, pointerEvents, visibility: visibilityState }} className="absolute top-[12%] left-[8vw] right-[8vw] flex justify-between items-center z-20">
            <div className="flex gap-16 md:gap-24">
                <span onClick={() => { setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5] text-[9px] md:text-[10px] font-inter-tight font-bold uppercase tracking-widest cursor-pointer hover:text-zinc-500 transition-colors">CATALOGUE</span>
                <span onClick={() => setView('editorial')} className="text-[#F5F5F5] text-[9px] md:text-[10px] font-inter-tight font-bold uppercase tracking-widest cursor-pointer hover:text-zinc-500 transition-colors">ABOUT</span>
                <span onClick={() => setView('visit')} className="text-[#F5F5F5] text-[9px] md:text-[10px] font-inter-tight font-bold uppercase tracking-widest cursor-pointer hover:text-zinc-500 transition-colors">VISIT</span>
            </div>
            <div>
                <span onClick={() => { setView('catalogue'); setOverlayView('bag'); }} className="text-[#F5F5F5] text-[9px] md:text-[10px] font-inter-tight font-bold uppercase tracking-widest cursor-pointer hover:text-zinc-500 transition-colors">
                    BAG ({cartCount})
                </span>
            </div>
        </motion.nav>

        {/* Centered Letters (WAYD?) & Subtitle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            <div className="relative flex items-center justify-center gap-4">
               <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/W.svg" alt="W" className="h-[26vh] object-contain brightness-0 invert" />
               <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/A.svg" alt="A" className="h-[26vh] object-contain brightness-0 invert" />
               <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/Y.svg" alt="Y" className="h-[26vh] object-contain brightness-0 invert -ml-4 md:-ml-8" />
               <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/D.svg" alt="D" className="h-[42vh] object-contain brightness-0 invert" />
               <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/question.svg" alt="?" className="h-[26vh] object-contain brightness-0 invert" />
               
               {/* Subtitle positioned absolutely relative to the letters container, so it doesn't affect centering layout */}
               <motion.div style={{ opacity: subOpacity, y: subY, filter: subBlur, WebkitFilter: subBlur, visibility: visibilityState }} className="absolute top-[100%] left-0 w-full pl-4 -mt-8 md:-mt-14">
                   <p className="text-sm md:text-base text-[#F5F5F5] font-inter-tight tracking-[0.3em] uppercase whitespace-nowrap">
                       WHAT ARE YOU DRINKING?
                   </p>
               </motion.div>
            </div>
        </div>

        {/* Bottom texts */}
        <motion.div style={{ opacity: bottomOpacity, y: bottomY, filter: bottomBlur, WebkitFilter: bottomBlur, pointerEvents, visibility: visibilityState }} className="absolute bottom-12 left-0 w-full flex items-start z-20">
            {/* Left Block */}
            <div className="flex-1 pl-[8vw] flex flex-col items-start">
                <p className="text-[9px] text-zinc-500 font-inter-tight tracking-[0.2em] uppercase leading-none">Lost in time</p>
                <img 
                    src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" 
                    alt="WAYD? WAYD? WAYD?" 
                    className="h-12 mt-2 object-contain"
                    style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(21%) saturate(1637%) hue-rotate(331deg) brightness(92%) contrast(89%)' }}
                />
            </div>
            
            {/* Middle Block */}
            <div className="flex-1 flex items-start justify-center gap-6">
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-zinc-500 font-inter-tight tracking-[0.2em] uppercase leading-none">The bar becomes</span>
                    <span className="text-[9px] text-zinc-500 font-inter-tight tracking-[0.2em] uppercase leading-none">The drinks are &nbsp;&nbsp;the work</span>
                </div>
                <div className="w-[80px] h-[1px] bg-zinc-700 mt-1"></div>
                <span className="text-[9px] text-zinc-500 font-inter-tight tracking-[0.2em] uppercase leading-none">A (Canvas)</span>
            </div>

            {/* Right Block */}
            <div className="flex-1 pr-[8vw] flex justify-end items-start pointer-events-auto">
                <motion.button 
                    whileHover="hover"
                    initial="initial"
                    animate="animate"
                    variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 15 } }
                    }}
                    className="relative overflow-hidden bg-[#C28256] text-[#111111] px-6 py-2 text-[9px] md:text-[10px] font-inter-tight font-bold tracking-[0.2em] uppercase cursor-pointer leading-none"
                >
                    {/* Sliding Background Layer */}
                    <motion.div 
                        variants={{
                            initial: { scaleX: 0 },
                            hover: { scaleX: 1 }
                        }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        style={{ originX: 0 }}
                        className="absolute inset-0 bg-[#F5F5F5] z-0"
                    />
                    
                    {/* Button text */}
                    <span className="relative z-10">[ Cocktail ]</span>
                </motion.button>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

const FrontendApp = ({ onSecretClick }) => {
  const { settings, cocktails } = useData(); 
  const scrollSequenceRef = useRef(null);
  
  const { scrollYProgress: rawProgress } = useScroll({
    target: scrollSequenceRef,
    offset: ["start start", "end end"]
  });
  const scrollYProgress = rawProgress;
  const curtainY = useTransform(scrollYProgress, [0.55, 0.90], ["0vh", "-100vh"]);
  
  const wineScale = useTransform(scrollYProgress, [0.02, 0.12], [1, 4]);
  const wineBlur = useTransform(scrollYProgress, [0.02, 0.12], ["blur(0px)", "blur(15px)"]);
  const wineOpacity = useTransform(scrollYProgress, [0.02, 0.12], [0.85, 0]);
  const wineHideY = useTransform(scrollYProgress, (v) => v > 0.13 ? -9999 : 0);

  const cornerOpacity = useTransform(scrollYProgress, [0.00, 0.04], [1, 0]);
  const cornerLeftX = useTransform(scrollYProgress, [0.00, 0.04], ["0vw", "-10vw"]); 
  const cornerRightX = useTransform(scrollYProgress, [0.00, 0.04], ["0vw", "10vw"]); 
  const cornerBottomY = useTransform(scrollYProgress, [0.00, 0.04], ["0vh", "15vh"]); 
  const coordY = useTransform(scrollYProgress, [0.00, 0.04], ["0vh", "-25vh"]); 
  const cornerHideY = useTransform(scrollYProgress, (v) => v > 0.05 ? -9999 : 0);

  const mainTextY = useTransform(scrollYProgress, [0.02, 0.12], ["0vh", "22vh"]); 
  const mw1 = useTransform(scrollYProgress, [0.15, 0.25], ["25vw", "0vw"]);
  const mw2 = useTransform(scrollYProgress, [0.15, 0.25], ["20vw", "0vw"]);
  const mw3 = useTransform(scrollYProgress, [0.15, 0.25], ["15vw", "0vw"]);
  const mw4 = useTransform(scrollYProgress, [0.15, 0.25], ["45vw", "0vw"]);
  const smallOpacity = useTransform(scrollYProgress, [0.15, 0.20], [1, 0]);
  const smallTextHideY = useTransform(scrollYProgress, (v) => v > 0.21 ? -9999 : 0);
  const line1Y = useTransform(scrollYProgress, [0.15, 0.25], ["-0.36em", "0em"]);
  const line1X = useTransform(scrollYProgress, [0.15, 0.25], ["0em", "-0.45em"]); 
  const line2Y = useTransform(scrollYProgress, [0.15, 0.25], ["0.36em", "0em"]);
  const line2X = useTransform(scrollYProgress, [0.15, 0.25], ["0em", "0.65em"]); 

  const gooeyFilter = useTransform(scrollYProgress, (v) => (v >= 0.24 && v <= 0.38) ? "url(#goo)" : "none");
  const logoBlur = useTransform(scrollYProgress, [0.25, 0.30], ["blur(0px)", "blur(5px)"]);
  const meltScaleY = useTransform(scrollYProgress, [0.25, 0.32], [1, 1.6]); 
  const logoOpacity = useTransform(scrollYProgress, [0.30, 0.34], [1, 0]); 
  const logoHideY = useTransform(scrollYProgress, (v) => v > 0.35 ? -9999 : 0);
  const dropOpacity = useTransform(scrollYProgress, [0.25, 0.28, 0.38, 0.39], [0, 1, 1, 0]); 
  const dropY = useTransform(scrollYProgress, [0.28, 0.38], ["0vh", "120vh"]); 
  const dropScaleY = useTransform(scrollYProgress, [0.28, 0.33, 0.38], [1, 3.5, 1]); 
  const dropHideX = useTransform(scrollYProgress, (v) => v > 0.40 ? -9999 : 0);
  const dropColor = useTransform(scrollYProgress, [0.29, 0.34], ["#000000", "#000000"]); 
  const textLayerMasterOpacity = useTransform(scrollYProgress, [0.50, 0.52], [1, 1]); 
  const bleedMaskSize = useTransform(scrollYProgress, [0.39, 0.55], ["0vmax 0vmax", "140vmax 140vmax"]);
  const bleedOpacity = useTransform(scrollYProgress, [0.39, 0.41], [0, 1]);

  const [view, setView] = useState('home');
  const [overlayView, setOverlayView] = useState('grid');
  const [cartItems, setCartItems] = useState([]);
  const [nyTime, setNyTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (!isLoading && cocktails && cocktails.length > 0) {
      const preloadLevel2Images = () => {
        const imagesToPreload = [
          settings.artist1_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", 
          settings.artist2_image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80", 
          ...cocktails.map(c => c.src),
          ...cocktails.map(c => c.hoverSrc)
        ];
        
        imagesToPreload.forEach(url => {
          const img = new Image();
          img.src = url; 
        });
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadLevel2Images);
      } else {
        setTimeout(preloadLevel2Images, 1500); 
      }
    }
  }, [isLoading, cocktails, settings]);

  useEffect(() => {
    if (view === 'catalogue' || view === 'editorial' || view === 'visit') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [view]);

  const scrollToMenu = () => {
    if (scrollSequenceRef.current) {
      const targetY = scrollSequenceRef.current.offsetTop + (window.innerHeight * 4.5);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const navY = useTransform(scrollYProgress, [0, 0.05, 0.86, 0.88], ["0%", "0%", "-100%", "0%"]);
  const navOpacity = useTransform(scrollYProgress, [0, 0.05, 0.86, 0.88], [0, 0, 0, 1]);
  const navBg = useTransform(scrollYProgress, [0.86, 0.88], ["rgba(17, 17, 17, 0)", "rgba(17, 17, 17, 0.85)"]);
  const navShadow = useTransform(scrollYProgress, [0.86, 0.88], ["0 4px 30px rgba(0,0,0,0)", "0 4px 30px rgba(0,0,0,0.5)"]);
  const navBackdrop = useTransform(scrollYProgress, [0.86, 0.88], ["blur(0px)", "blur(12px)"]);
  const navPointerEvents = useTransform(scrollYProgress, v => (v < 0.86) ? "none" : "auto");
  
  const navPt = useTransform(scrollYProgress, [0, 0.01], ["12vh", "20px"]);
  const navPl = useTransform(scrollYProgress, [0, 0.01], ["8vw", "24px"]);
  const navPr = useTransform(scrollYProgress, [0, 0.01], ["2.5vw", "24px"]);

  return (
    <div className="bg-[#111111] text-[#F5F5F5] selection:bg-[#F5F5F5] selection:text-[#111111] relative">
      <HeroLandingStage setView={setView} setOverlayView={setOverlayView} cartCount={cartCount} />
      
      {/* --- Preloader removed in favor of Skeleton loading --- */}

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
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}} />

      {view === 'catalogue' && <CatalogueOverlay onClose={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} overlayView={overlayView} setOverlayView={setOverlayView} nyTime={nyTime} setView={setView} />}
      {view === 'editorial' && <EditorialOverlay onClose={() => setView('home')} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} nyTime={nyTime} />}
      {view === 'visit' && <VisitOverlay onClose={() => setView('home')} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} nyTime={nyTime} />}
      {selectedMenu && <MenuDetailOverlay item={selectedMenu} onClose={() => setSelectedMenu(null)} nyTime={nyTime} onMenuClick={setSelectedMenu} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} />}

      {view !== 'catalogue' && view !== 'editorial' && view !== 'visit' && !selectedMenu && (
        <motion.nav 
          style={{ 
            y: navY, 
            opacity: navOpacity, 
            backgroundColor: navBg, 
            boxShadow: navShadow, 
            backdropFilter: navBackdrop, 
            WebkitBackdropFilter: navBackdrop, 
            pointerEvents: navPointerEvents,
            paddingTop: navPt,
            paddingBottom: "20px",
            paddingLeft: navPl,
            paddingRight: navPr,
            transform: "translateZ(0)",
            willChange: "transform, opacity, background-color, backdrop-filter, padding"
          }} 
          className="fixed top-0 left-0 w-full z-[999] flex justify-between items-start"
        >
          <motion.div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-inter-tight font-bold uppercase tracking-widest text-[#F5F5F5]">
            <span onClick={() => { setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">CATALOGUE</span>
            <span onClick={() => setView('editorial')} className="cursor-pointer hover:text-zinc-500 transition-colors">ABOUT</span>
            <span onClick={() => setView('visit')} className="cursor-pointer hover:text-zinc-500 transition-colors">VISIT</span>
          </motion.div>
          
          <motion.div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-none">
             <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/D.svg" alt="logo" className="h-6 sm:h-7 object-contain brightness-0 invert" />
          </motion.div>

          <motion.div className="flex text-2xl sm:text-3xl md:text-4xl font-inter-tight font-normal uppercase tracking-widest text-[#F5F5F5] leading-none">
            <span onClick={() => { setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-zinc-500 transition-colors">BAG/0{cartCount > 0 ? cartCount : '1'}.</span>
          </motion.div>
        </motion.nav>
      )}

      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="goo" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div ref={scrollSequenceRef} className="h-[600vh] w-full relative z-30">
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          
          <div className="absolute inset-0 w-full h-screen z-10 pointer-events-auto bg-[#F5F5F5]">
            <ContentStage rawProgress={rawProgress} onMenuClick={setSelectedMenu} />
          </div>

          <motion.div style={{ opacity: textLayerMasterOpacity, y: curtainY, transform: "translateZ(0)", willChange: "transform, opacity" }} className="absolute inset-0 w-full h-screen z-50 pointer-events-none bg-[#F5F5F5]">
                
                <motion.div style={{ filter: logoBlur, WebkitFilter: logoBlur, y: mainTextY, willChange: "transform, filter" }} className="absolute top-0 left-0 w-full flex flex-col items-center justify-start pt-[110px] md:pt-[130px] z-10">
                  <motion.div style={{ filter: gooeyFilter, WebkitFilter: gooeyFilter }} className="relative w-full mx-auto flex items-center justify-center">
                    
                    <motion.div className="absolute rounded-full z-0" style={{ backgroundColor: dropColor, width: '40px', height: '40px', top: '50%', marginTop: '-20px', left: '49%', marginLeft: '-20px', y: dropY, x: dropHideX, scaleY: dropScaleY, opacity: dropOpacity, originY: 0.5 }} />
                    
                    <motion.div style={{ opacity: logoOpacity, y: logoHideY, WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', willChange: "transform, opacity" }} className="relative flex items-center justify-center w-full z-10 text-[22vw] md:text-[18vw] lg:text-[16vw] font-bebas leading-[0.75] tracking-normal text-black whitespace-nowrap h-0 mt-[0.36em]">
                      <motion.div className="absolute flex justify-center items-center w-full h-full">
                      <motion.div style={{ y: line1Y, x: line1X }} className="absolute flex justify-center items-baseline w-full">
                        <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">W</motion.span>
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

                      <motion.div style={{ y: line2Y, x: line2X }} className="absolute flex justify-center items-baseline w-full">
                        <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">D</motion.span>
                        <motion.div style={{ maxWidth: mw4, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline pt-[0.2em]">
                          <span className="font-bebas pr-[0vw]">RINKING</span>
                        </motion.div>
                        <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">?</motion.span>
                      </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div className="absolute inset-0 flex justify-center items-start pt-[20px] md:pt-[40px] pointer-events-none z-20 overflow-hidden">
                  <motion.div style={{ y: wineHideY, willChange: "transform" }} className="w-full h-full flex justify-center items-start">
                    <motion.img 
                      src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/hero.webp" 
                      alt="Wine Splashing" 
                      className="h-[calc(100vh-20px)] md:h-[calc(100vh-40px)] w-auto object-cover object-top" 
                      style={{ opacity: wineOpacity, scale: wineScale, filter: wineBlur, WebkitFilter: wineBlur, mixBlendMode: 'multiply', willChange: "transform, opacity, filter" }} 
                      loading="eager"
                      fetchpriority="high"
                      decoding="sync"
                    />
                  </motion.div>
                </motion.div>

                <motion.div style={{ y: cornerHideY, willChange: "transform" }} className="absolute inset-0 pointer-events-none z-30">
                  <motion.div style={{ x: cornerLeftX, y: cornerBottomY, opacity: cornerOpacity, willChange: "transform, opacity" }} className="absolute top-[55vh] md:top-[60vh] font-inter font-medium text-[13px] md:text-[15px] text-[#111111] leading-[1.4] left-[15vw] md:left-[18vw] lg:left-[25vw]">
                      <motion.div>
                        {(settings.address || '').replace(/\\n/g, '\n').split('\n').map((l, i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}
                      </motion.div>
                  </motion.div>

                  <motion.div style={{ x: cornerRightX, y: cornerBottomY, opacity: cornerOpacity, willChange: "transform, opacity" }} className="absolute top-[55vh] md:top-[60vh] font-inter font-medium text-[9px] md:text-[11px] text-[#111111] leading-[1.4] text-right max-w-[200px] md:max-w-[260px] right-[15vw] md:right-[18vw] lg:right-[25vw]">
                      <motion.div>
                        {(settings.quoteCinematic || '').replace(/\\n/g, '\n').split('\n').map((l, i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}
                      </motion.div>
                  </motion.div>

                  <div className="absolute top-[24vh] md:top-[28vh] flex items-start justify-end right-[9vw] md:right-[13vw] lg:right-[15vw]">
                    <motion.div style={{ y: coordY, opacity: cornerOpacity, writingMode: 'vertical-rl', transform: 'rotate(180deg)', willChange: "transform, opacity" }} className="font-inter-tight font-bold text-[8px] md:text-[9px] uppercase tracking-widest text-[#111111]">
                        <motion.div>{settings.latitude_longitude || "40.7128° N, 74.0060° W"}</motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div className="absolute inset-0 bg-black z-40 ink-bleed-mask pointer-events-none" style={{ WebkitMaskSize: bleedMaskSize, maskSize: bleedMaskSize, opacity: bleedOpacity, willChange: "mask-size, opacity" }}></motion.div>
              </motion.div>
            </div>
          </div>

          <div className="w-full flex flex-col relative z-20 bg-[#F5F5F5] pointer-events-auto">
            <HomeCatalogueStage setView={setView} setOverlayView={setOverlayView} />
            <JourneyStage />
            <FooterStage onSecretClick={onSecretClick} />
          </div>

        </div>
  );
}

const uploadImageToSupabase = async (file) => {
  if (!file || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabase) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('WAYD-gallery').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('WAYD-gallery').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    alert(`Upload failed: ${error.message}`);
    return null;
  }
};

const EditableImage = ({ src, aspect = "aspect-[3/4]", className = "", onUpload, grayscale = false }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const tempUrl = URL.createObjectURL(file);
      if (onUpload) onUpload(tempUrl, false); 

      if (supabaseUrl !== 'YOUR_SUPABASE_URL') {
        setIsUploading(true);
        const publicUrl = await uploadImageToSupabase(file);
        if (publicUrl && onUpload) {
          onUpload(publicUrl, true); 
        }
        setIsUploading(false);
      } else {
        if (onUpload) onUpload(tempUrl, true); 
      }
    }
  };

  return (
    <div className={`relative w-full ${aspect} bg-[#EAEAEA] overflow-hidden group cursor-pointer ${className}`}>
      <img src={src} className={`w-full h-full object-cover transition-all duration-300 ${grayscale ? 'grayscale group-hover:grayscale-0' : ''} ${isUploading ? 'blur-sm opacity-50' : ''}`} alt="Editable content" />
      {isUploading && (
        <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
          <span className="bg-black/80 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">Uploading...</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <label className="text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          Upload Media
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={isUploading} />
        </label>
      </div>
    </div>
  );
};

const EditableText = ({ value, onChange, onSave, className, placeholder = "Enter text..." }) => {
  const [localVal, setLocalVal] = useState(value || '');
  
  useEffect(() => { setLocalVal(value || ''); }, [value]);

  return (
    <input 
      type="text" 
      value={localVal} 
      onChange={(e) => {
        setLocalVal(e.target.value);
        if (onChange) onChange(e.target.value);
      }}
      onBlur={() => {
        if (onSave && localVal !== value) onSave(localVal); 
      }}
      className={`bg-transparent border-b border-dashed border-transparent hover:border-zinc-300 focus:border-[#111111] focus:outline-none transition-colors w-full ${className}`}
      placeholder={placeholder}
    />
  );
};

const EditableTextArea = ({ value, onChange, onSave, className, placeholder = "Enter description...", rows = 3 }) => {
  const [localVal, setLocalVal] = useState(value || '');
  
  useEffect(() => { setLocalVal(value || ''); }, [value]);

  return (
    <textarea 
      value={localVal} 
      onChange={(e) => {
        setLocalVal(e.target.value);
        if (onChange) onChange(e.target.value);
      }}
      onBlur={() => {
        if (onSave && localVal !== value) onSave(localVal);
      }}
      className={`bg-transparent border-b border-dashed border-transparent hover:border-zinc-300 focus:border-[#111111] focus:outline-none transition-colors w-full resize-none ${className}`}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

const AdminLogin = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setErrorMsg('');
    setIsLoggingIn(true);
    
    if (supabaseUrl === 'YOUR_SUPABASE_URL' || !supabase) {
      setTimeout(() => { onLogin(); setIsLoggingIn(false); }, 800);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message.toUpperCase());
      setIsLoggingIn(false);
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] w-full max-w-md relative"
      >
        <button onClick={onCancel} className="absolute top-4 right-4 text-zinc-400 hover:text-[#111111] text-xs font-inter-tight uppercase tracking-widest transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="flex flex-col items-center mb-10">
          <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/logo3.svg" alt="WAYD Logo" className="h-12 mb-6" />
          <h2 className="font-helvetica font-bold text-xl text-[#111111] tracking-tight">EDITORIAL STUDIO</h2>
          <p className="font-inter-tight text-xs text-zinc-500 uppercase tracking-widest mt-2">Content Management</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {errorMsg && <div className="bg-red-50 text-red-500 border border-red-200 text-[10px] font-bold uppercase tracking-widest p-3 text-center">{errorMsg}</div>}
          <div className="flex flex-col gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-b border-zinc-300 py-3 font-inter text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors bg-transparent placeholder-zinc-400" placeholder="Studio Email" required />
          </div>
          <div className="flex flex-col gap-2">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-b border-zinc-300 py-3 font-inter text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors bg-transparent placeholder-zinc-400" placeholder="Passcode" required />
          </div>
          <button type="submit" disabled={isLoggingIn} className={`w-full font-inter-tight font-semibold text-[11px] uppercase tracking-widest py-4 mt-4 transition-colors ${isLoggingIn ? 'bg-zinc-400 text-white cursor-wait' : 'bg-[#111111] text-[#F5F5F5] hover:bg-zinc-800'}`}>
            {isLoggingIn ? 'AUTHENTICATING...' : 'ENTER STUDIO'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminStudioOverview = () => {
  const { cocktails, setCocktails, settings, setSettings, setSyncStatus } = useData();
  const [editingCocktail, setEditingCocktail] = useState(null); 

  const handleSaveCocktail = async () => {
    const newMenu = [...cocktails];
    const idx = newMenu.findIndex(i => i.id === editingCocktail.id || i.name === editingCocktail.name);
    if (idx !== -1) {
      newMenu[idx] = editingCocktail;
      setCocktails(newMenu);
    }

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && editingCocktail.id) {
      setSyncStatus('Saving...');
      try {
        const payload = {
          name: editingCocktail.name,
          artist: editingCocktail.artist,
          src: editingCocktail.src,
          hover_src: editingCocktail.hoverSrc,
          description: editingCocktail.description,
          cocktail_images: editingCocktail.cocktailImages
        };
        await supabase.from('cocktails').update(payload).eq('id', editingCocktail.id);
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
    setEditingCocktail(null);
  };

  const handleDeleteCocktail = async (e, id, idx) => {
    e.stopPropagation(); 
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && id) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('cocktails').delete().eq('id', id);
        setCocktails(prev => prev.filter(c => c.id !== id));
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Delete error:", e);
        setSyncStatus('Error');
      }
    } else {
      setCocktails(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleAddCocktail = async () => {
    const newDrink = {
      name: "New Cocktail",
      artist: "Teddy",
      src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
      hoverSrc: "https://images.unsplash.com/photo-1571597314545-2384a51eb85c?auto=format&fit=crop&w=800&q=80",
      description: defaultDesc,
      cocktailImages: []
    };

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        const payload = {
          name: newDrink.name,
          artist: newDrink.artist,
          src: newDrink.src,
          hover_src: newDrink.hoverSrc,
          description: newDrink.description,
          cocktail_images: newDrink.cocktailImages
        };
        const { data, error } = await supabase.from('cocktails').insert([payload]).select();
        if (error) throw error;
        if (data && data[0]) {
          const addedDrink = { 
            ...data[0], 
            hoverSrc: data[0].hover_src,
            cocktailImages: data[0].cocktail_images || [],
            description: data[0].description || ''
          };
          setCocktails(prev => [...prev, addedDrink]);
          setSyncStatus('Synced');
        }
      } catch(e) {
        console.error("Error adding drink:", e);
        setSyncStatus('Error');
      }
    } else {
      setCocktails(prev => [...prev, { ...newDrink, id: Date.now() }]);
    }
  };

  const handleSettingsUpdate = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingsSave = async (field, value) => {
    const dbMap = {
      artist1_name: 'artist1_name',
      artist1_image: 'artist1_image',
      artist2_name: 'artist2_name',
      artist2_image: 'artist2_image'
    };
    const dbField = dbMap[field] || field;

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && settings.id) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('site_settings').update({ [dbField]: value }).eq('id', settings.id);
        setSyncStatus('Synced');
      } catch (e) { 
        console.error("Save error:", e); 
        setSyncStatus('Error');
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-16 pb-24 relative">
      <div className="w-full bg-[#1c1c1e] h-[550px] md:h-[650px] relative overflow-hidden rounded-xl border border-zinc-800 shadow-inner">
         <div className="absolute top-8 right-8 text-right z-20 pointer-events-none hidden md:block">
            <p className="text-[#f5f5f5] font-inter-tight text-[11px] tracking-[0.05em] font-normal uppercase mb-1">EDIT ARTIST PROFILES</p>
            <p className="text-zinc-500 font-inter-tight text-[10px] tracking-[0.05em] uppercase font-normal">Changes sync to Stories Grid automatically</p>
         </div>

         <div className="absolute top-12 md:top-16 left-8 md:left-24 w-[160px] md:w-[220px] lg:w-[260px] flex flex-col z-20 group/artist">
            <div className="w-full aspect-[2/3] bg-[#2a2a2c] overflow-hidden mb-3 ring-1 ring-white/10 shadow-xl">
               <EditableImage 
                  src={settings.artist1_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"} 
                  aspect="h-full" 
                  grayscale={true} 
                  onUpload={(url, isFinal) => {
                      handleSettingsUpdate('artist1_image', url);
                      if (isFinal) handleSettingsSave('artist1_image', url);
                  }} 
               />
            </div>
            <div className="flex justify-between items-baseline w-full px-1">
               <EditableText 
                  value={settings.artist1_name || "Mimi"} 
                  onChange={v => handleSettingsUpdate('artist1_name', v)} 
                  onSave={v => handleSettingsSave('artist1_name', v)} 
                  className="text-[#f5f5f5] font-inter-tight text-base md:text-lg font-normal !border-b-zinc-700 focus:!border-[#f5f5f5]" 
               />
               <span className="text-zinc-500 font-inter-tight text-[10px] md:text-xs">7 Signature</span>
            </div>
         </div>

         <div className="absolute top-[35%] md:top-[30%] right-8 md:right-24 w-[160px] md:w-[220px] lg:w-[260px] flex flex-col z-20 group/artist">
            <div className="w-full aspect-[2/3] bg-[#2a2a2c] overflow-hidden mb-3 ring-1 ring-white/10 shadow-xl">
               <EditableImage 
                  src={settings.artist2_image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"} 
                  aspect="h-full" 
                  grayscale={true} 
                  onUpload={(url, isFinal) => {
                      handleSettingsUpdate('artist2_image', url);
                      if (isFinal) handleSettingsSave('artist2_image', url);
                  }} 
               />
            </div>
            <div className="flex justify-between items-baseline w-full px-1">
               <EditableText 
                  value={settings.artist2_name || "Teddy"} 
                  onChange={v => handleSettingsUpdate('artist2_name', v)} 
                  onSave={v => handleSettingsSave('artist2_name', v)} 
                  className="text-[#f5f5f5] font-inter-tight text-base md:text-lg font-normal !border-b-zinc-700 focus:!border-[#f5f5f5]" 
               />
               <span className="text-zinc-500 font-inter-tight text-[10px] md:text-xs">7 Signature</span>
            </div>
         </div>

         <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-10 pointer-events-none">
            <h2 className="text-[#f5f5f5]/10 font-bebas text-[15vw] md:text-[12vw] leading-[0.75] m-0 p-0 tracking-normal">MEET</h2>
            <h2 className="text-[#f5f5f5]/10 font-bebas text-[15vw] md:text-[12vw] leading-[0.75] m-0 p-0 tracking-normal">ARTISTS(OUR)</h2>
         </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-end mb-8">
          <h3 className="font-helvetica font-bold text-2xl tracking-tight uppercase">Exhibition Menu</h3>
          <span onClick={handleAddCocktail} className="font-inter-tight text-[10px] text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-black transition-colors">+ Add New Drink</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {cocktails.map((item, idx) => (
            <div key={idx} onClick={() => setEditingCocktail(item)} className="flex flex-col group relative cursor-pointer hover:opacity-80 transition-opacity">
              <button 
                onClick={(e) => handleDeleteCocktail(e, item.id, idx)} 
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex justify-center items-center rounded-full z-30 opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer"
                title="Delete Drink"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <div className="relative w-full aspect-[3/4] overflow-hidden mb-3 bg-[#EAEAEA]">
                <img src={item.src} className="absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-500 group-hover:opacity-0" alt="B&W" />
                <img src={item.hoverSrc} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" alt="Color" />
              </div>
              <div className="flex flex-col gap-1 px-1">
                <span className="font-inter-tight font-bold text-[13px] text-[#111111]">{item.name}</span>
                <span className="font-inter-tight font-normal text-[11px] text-zinc-500">{item.artist}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: editingCocktail ? 0 : '100%', boxShadow: editingCocktail ? '-10px 0 40px rgba(0,0,0,0.1)' : 'none' }} 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white z-[9999] overflow-y-auto border-l border-zinc-200"
      >
        {editingCocktail && (
          <div className="p-8 md:p-12 pb-24">
            <div className="flex justify-between items-center mb-12 border-b border-zinc-100 pb-4 sticky top-0 bg-white z-10 pt-4">
              <span className="font-bebas text-2xl uppercase tracking-wide">Edit Menu Detail</span>
              <div className="flex gap-6">
                <button onClick={() => setEditingCocktail(null)} className="font-inter-tight text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Cancel</button>
                <button onClick={handleSaveCocktail} className="font-inter-tight text-[10px] font-bold uppercase tracking-widest text-[#d92323] hover:text-black transition-colors">Save Changes</button>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">B&W COVER</span>
                  <div className="w-full aspect-[3/4] relative">
                    <EditableImage src={editingCocktail.src} aspect="h-full" grayscale={true} onUpload={(url) => setEditingCocktail({...editingCocktail, src: url})} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">COLOR REVEAL</span>
                  <div className="w-full aspect-[3/4] relative">
                    <EditableImage src={editingCocktail.hoverSrc} aspect="h-full" onUpload={(url) => setEditingCocktail({...editingCocktail, hoverSrc: url})} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">COCKTAIL NAME</span>
                  <EditableText value={editingCocktail.name} onChange={v => setEditingCocktail({...editingCocktail, name: v})} className="text-xl font-bold font-helvetica" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">ARTIST</span>
                  <EditableText value={editingCocktail.artist} onChange={v => setEditingCocktail({...editingCocktail, artist: v})} className="text-sm font-bold font-helvetica" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">DESCRIPTION</span>
                  <EditableTextArea value={editingCocktail.description} onChange={v => setEditingCocktail({...editingCocktail, description: v})} className="text-sm font-inter leading-relaxed" rows={5} placeholder="Write the cocktail interpretation story here..." />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-zinc-100 pt-8">
                <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">COCKTAIL GALLERY IMAGES</span>
                <p className="text-[10px] text-zinc-500 font-inter-tight">These images will be displayed in the 3-column grid at the bottom of the detail page.</p>
                
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {(editingCocktail.cocktailImages || []).map((img, i) => (
                    <div key={i} className="w-32 aspect-[3/4] shrink-0 snap-center relative group">
                      <EditableImage src={img} aspect="h-full" onUpload={(url) => {
                        const newImgs = [...(editingCocktail.cocktailImages || [])];
                        newImgs[i] = url;
                        setEditingCocktail({...editingCocktail, cocktailImages: newImgs});
                      }} />
                      <button onClick={() => {
                         const newImgs = editingCocktail.cocktailImages.filter((_, idx) => idx !== i);
                         setEditingCocktail({...editingCocktail, cocktailImages: newImgs});
                      }} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-5 h-5 flex justify-center items-center rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                  
                  <div 
                    onClick={() => {
                       const newImgs = [...(editingCocktail.cocktailImages || []), editingCocktail.hoverSrc];
                       setEditingCocktail({...editingCocktail, cocktailImages: newImgs});
                    }}
                    className="w-32 aspect-[3/4] shrink-0 snap-center border border-dashed border-zinc-300 hover:border-black flex flex-col justify-center items-center cursor-pointer transition-colors text-zinc-400 hover:text-black gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="font-inter-tight text-[9px] uppercase font-bold tracking-widest">Add Image</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </motion.div>
      {editingCocktail && <div onClick={() => setEditingCocktail(null)} className="fixed inset-0 bg-black/20 z-[9998] backdrop-blur-sm transition-opacity" />}
    </div>
  );
};

const AdminStudioEditorials = () => {
  const { editorials, setEditorials, setSyncStatus, settings } = useData();
  const [activeArtist, setActiveArtist] = useState('teddy');

  const handleUpdate = (idx, field, value) => {
    const newEd = { ...editorials };
    newEd[activeArtist][idx] = { ...newEd[activeArtist][idx], [field]: value };
    setEditorials(newEd);
  };

  const handleSave = async (idx, field, value) => {
    const item = editorials[activeArtist][idx];
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && item.id) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('editorials').update({ [field]: value }).eq('id', item.id);
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
  };

  const tabs = [
    { key: 'teddy', label: settings.artist2_name || 'Teddy' },
    { key: 'mimi', label: settings.artist1_name || 'Mimi' }
  ];

  return (
    <div className="w-full flex flex-col pb-24">
      <div className="flex gap-8 border-b border-zinc-200 mb-8 pb-4">
        {tabs.map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setActiveArtist(tab.key)} 
            className={`font-bebas text-3xl uppercase tracking-wide transition-colors ${activeArtist === tab.key ? 'text-[#111111]' : 'text-zinc-300 hover:text-zinc-400'}`}>
            {tab.label} Stories
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-0 items-start">
        {editorials[activeArtist].map((story, idx) => (
          <div key={idx} className="flex flex-col group">
            <div className="flex flex-col gap-1 mb-3 pr-3 md:pr-4">
              <EditableText value={story.category} onChange={(v) => handleUpdate(idx, 'category', v)} onSave={(v) => handleSave(idx, 'category', v)} className="font-inter-tight text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest" />
              <EditableText value={story.title} onChange={(v) => handleUpdate(idx, 'title', v)} onSave={(v) => handleSave(idx, 'title', v)} className="font-helvetica font-bold text-[11px] md:text-xs text-[#111111] leading-tight" />
            </div>
            <div className="relative">
              <EditableImage src={story.src} aspect={story.aspect} className="grayscale-0 transition-all duration-300 group-hover:grayscale" onUpload={(url, isFinal) => {
                 handleUpdate(idx, 'src', url);
                 if (isFinal) handleSave(idx, 'src', url);
              }} />
              
              <div className="absolute -right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-full pr-4 z-10">
                {['aspect-[3/4]', 'aspect-[4/3]', 'aspect-[2/3]', 'aspect-square'].map(ratio => (
                  <button key={ratio} onClick={() => { handleUpdate(idx, 'aspect', ratio); handleSave(idx, 'aspect', ratio); }} className={`w-6 h-6 border flex items-center justify-center text-[8px] bg-white transition-colors ${story.aspect === ratio ? 'border-black text-black' : 'border-zinc-200 text-zinc-400 hover:border-black'}`} title={ratio}>
                    {ratio === 'aspect-[3/4]' ? '3:4' : ratio === 'aspect-[4/3]' ? '4:3' : ratio === 'aspect-square' ? '1:1' : '2:3'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminStudioCatalogue = () => {
  const { catalogue, setCatalogue, setSyncStatus } = useData();
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = async () => {
    const newCat = [...catalogue];
    const idx = newCat.findIndex(i => i.id === editingItem.id || i.name === editingItem.name); 
    if (idx !== -1) {
      newCat[idx] = editingItem;
      setCatalogue(newCat);
    }
    
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && editingItem.id) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('catalogue').update(editingItem).eq('id', editingItem.id);
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
    setEditingItem(null);
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-end mb-8">
        <h3 className="font-helvetica font-bold text-2xl tracking-tight uppercase">Objects & Artifacts</h3>
        <span className="font-inter-tight text-[10px] text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-black transition-colors">+ Add Object</span>
      </div>

      <div className="flex flex-col border-t border-zinc-200">
        {catalogue.map((item, idx) => (
          <div key={idx} onClick={() => setEditingItem(item)} className="flex items-center justify-between py-4 border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors group px-2">
            <div className="flex items-center gap-4 w-2/3">
              <div className="w-12 aspect-[4/5] bg-zinc-100 overflow-hidden shrink-0">
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-helvetica font-bold text-sm text-[#111111] group-hover:text-[#d92323] transition-colors">{item.name}</span>
                <span className="font-inter-tight text-[10px] text-zinc-400 uppercase tracking-widest mt-1">{item.designer}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-1/3">
              <span className="font-helvetica font-bold text-sm text-[#111111]">${item.price}</span>
              <div className="flex items-center gap-2">
                {Number(item.stock) > 0 ? (
                  <><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="font-inter-tight text-[10px] uppercase tracking-widest text-zinc-500">In Stock ({item.stock})</span></>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="font-inter-tight text-[10px] uppercase tracking-widest text-red-500">Sold Out</span></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: editingItem ? 0 : '100%', boxShadow: editingItem ? '-10px 0 40px rgba(0,0,0,0.1)' : 'none' }} 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white z-[9999] overflow-y-auto border-l border-zinc-200"
      >
        {editingItem && (
          <div className="p-8 md:p-12 pb-24">
            <div className="flex justify-between items-center mb-12 border-b border-zinc-100 pb-4 sticky top-0 bg-white z-10 pt-4">
              <span className="font-bebas text-2xl uppercase tracking-wide">Edit Object</span>
              <div className="flex gap-6">
                <button onClick={() => setEditingItem(null)} className="font-inter-tight text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Cancel</button>
                <button onClick={handleSave} className="font-inter-tight text-[10px] font-bold uppercase tracking-widest text-[#d92323] hover:text-black transition-colors">Save Changes</button>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <div className="w-full flex gap-2 overflow-x-auto pb-4 snap-x">
                {editingItem.images.map((img, i) => (
                  <div key={i} className="w-48 aspect-[4/5] shrink-0 snap-center relative group">
                    <EditableImage src={img} aspect="aspect-[4/5]" onUpload={(url) => {
                      const newImgs = [...editingItem.images]; newImgs[i] = url;
                      setEditingItem({...editingItem, images: newImgs, src: i===0 ? url : editingItem.src});
                    }} />
                    {i === 0 && <span className="absolute top-2 left-2 bg-black text-white text-[8px] px-1 uppercase pointer-events-none">Main Cover</span>}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">OBJECT NAME</span>
                  <EditableText value={editingItem.name} onChange={v => setEditingItem({...editingItem, name: v})} className="text-xl font-bold font-helvetica" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">PRICE ($)</span>
                  <EditableText value={editingItem.price} onChange={v => setEditingItem({...editingItem, price: v})} className="text-sm font-bold font-helvetica" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">STOCK QTY</span>
                  <EditableText value={editingItem.stock} onChange={v => setEditingItem({...editingItem, stock: v})} className={`text-sm font-bold font-helvetica ${Number(editingItem.stock) === 0 ? 'text-red-500' : ''}`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">DESIGNER</span>
                  <EditableText value={editingItem.designer} onChange={v => setEditingItem({...editingItem, designer: v})} className="text-sm font-bold font-helvetica" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">YEAR</span>
                  <EditableText value={editingItem.year} onChange={v => setEditingItem({...editingItem, year: v})} className="text-sm font-bold font-helvetica" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">COLOUR</span>
                  <EditableText value={editingItem.colour} onChange={v => setEditingItem({...editingItem, colour: v})} className="text-sm font-bold font-helvetica" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">MATERIAL</span>
                  <EditableText value={editingItem.material} onChange={v => setEditingItem({...editingItem, material: v})} className="text-sm font-bold font-helvetica" />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <span className="font-helvetica text-zinc-400 text-[9px] font-bold uppercase tracking-widest">INFO / DESCRIPTION</span>
                  <EditableTextArea value={editingItem.info} onChange={v => setEditingItem({...editingItem, info: v})} className="text-sm font-bold font-helvetica" />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      {editingItem && <div onClick={() => setEditingItem(null)} className="fixed inset-0 bg-black/20 z-[9998] backdrop-blur-sm transition-opacity" />}
    </div>
  );
};

const AdminStudioOrders = () => {
  const [mockOrders, setMockOrders] = useState([
    { id: "ORD-001", customer: "Sophia L.", email: "sophia.l@example.com", phone: "+1 212-555-0199", address: "123 Bedford Ave, Apt 4B\nBrooklyn, NY 11211", date: "Today, 14:30", total: 464, status: "Pending", items: [{ name: "Enchanted Canvas", qty: 1, price: 375 }, { name: "Ethereal Serenade", qty: 1, price: 89 }], tracking: "" },
    { id: "ORD-002", customer: "James W.", email: "james.w@example.com", phone: "+1 917-555-4422", address: "456 Lexington Ave\nNew York, NY 10017", date: "Yesterday", total: 150, status: "Processing", items: [{ name: "Signature Glassware", qty: 1, price: 150 }], tracking: "" },
    { id: "ORD-003", customer: "Emma R.", email: "emma.rose@example.com", phone: "+1 646-555-8811", address: "789 Park Ave, Suite 1200\nNew York, NY 10021", date: "May 28, 2026", total: 210, status: "Shipped", items: [{ name: "Sculptural Vase Set", qty: 1, price: 210 }], tracking: "TRK987654321" },
    { id: "ORD-004", customer: "Michael T.", email: "m.thomas@example.com", phone: "+1 212-555-9933", address: "321 Broadway\nNew York, NY 10007", date: "May 27, 2026", total: 75, status: "Shipped", items: [{ name: "The Artail Story Book", qty: 1, price: 75 }], tracking: "TRK123456789" },
  ]);

  const [selectedOrderId, setSelectedOrder] = useState(mockOrders[0].id);
  const [filter, setFilter] = useState('All');
  
  const selectedOrder = mockOrders.find(o => o.id === selectedOrderId);
  const filteredOrders = filter === 'All' ? mockOrders : mockOrders.filter(o => o.status === filter);

  const stats = {
    today: mockOrders.filter(o => o.date.includes('Today')).length,
    revenue: mockOrders.reduce((sum, o) => sum + o.total, 0),
    toFulfill: mockOrders.filter(o => o.status !== 'Shipped').length
  };

  const handleUpdateStatus = (id, newStatus) => {
    setMockOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleSaveTracking = (id, trackingNo) => {
    setMockOrders(prev => prev.map(o => o.id === id ? { ...o, tracking: trackingNo, status: 'Shipped' } : o));
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-140px)]">
      <div className="grid grid-cols-3 gap-6 mb-6 shrink-0">
        <div className="bg-[#F5F5F5] p-6 border border-zinc-200 flex flex-col gap-1">
          <span className="font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest">Orders Today</span>
          <span className="font-bebas text-4xl text-[#111111]">{stats.today}</span>
        </div>
        <div className="bg-[#F5F5F5] p-6 border border-zinc-200 flex flex-col gap-1">
          <span className="font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest">Total Revenue (All Time)</span>
          <span className="font-bebas text-4xl text-[#111111]">${stats.revenue}</span>
        </div>
        <div className="bg-[#111111] p-6 flex flex-col gap-1">
          <span className="font-inter-tight text-[10px] text-zinc-400 uppercase tracking-widest">To Fulfill</span>
          <div className="flex items-center gap-3">
             <span className="font-bebas text-4xl text-[#F5F5F5]">{stats.toFulfill}</span>
             {stats.toFulfill > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 border border-zinc-200 overflow-hidden">
        <div className="w-1/3 border-r border-zinc-200 bg-[#F5F5F5] flex flex-col">
          <div className="p-4 border-b border-zinc-200 bg-white z-10 flex gap-4 overflow-x-auto shrink-0 hide-scrollbar">
             {['All', 'Pending', 'Processing', 'Shipped'].map(f => (
               <button 
                 key={f} 
                 onClick={() => setFilter(f)} 
                 className={`font-inter-tight text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${filter === f ? 'bg-[#111111] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
               >
                 {f}
               </button>
             ))}
          </div>
          
          <div className="flex flex-col overflow-y-auto flex-1">
            {filteredOrders.length === 0 ? (
               <div className="p-8 text-center font-inter-tight text-xs text-zinc-400 uppercase tracking-widest">No orders found</div>
            ) : (
              filteredOrders.map((order, idx) => (
                <div key={idx} onClick={() => setSelectedOrder(order.id)} className={`p-5 border-b border-zinc-200 cursor-pointer transition-colors flex flex-col gap-3 ${selectedOrderId === order.id ? 'bg-white border-l-4 border-l-[#111111]' : 'hover:bg-white text-[#111111] border-l-4 border-l-transparent'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-helvetica font-bold text-sm tracking-tight text-[#111111]">{order.id}</span>
                      <span className="font-inter-tight text-[10px] text-zinc-500">{order.customer}</span>
                    </div>
                    <span className="font-helvetica font-bold text-xs text-[#111111]">${order.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-inter-tight text-[9px] text-zinc-400 uppercase tracking-widest">{order.date}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${order.status === 'Shipped' ? 'bg-green-100 text-green-700' : order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="w-2/3 bg-white overflow-y-auto flex flex-col relative">
          {selectedOrder ? (
            <>
              <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-zinc-200 p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-4">
                  <h4 className="font-helvetica font-bold text-xl tracking-tight text-[#111111]">{selectedOrder.id}</h4>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${selectedOrder.status === 'Shipped' ? 'bg-green-100 text-green-700' : selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                {selectedOrder.status === 'Pending' && (
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Processing')} className="bg-white border border-zinc-300 hover:border-[#111111] text-[#111111] font-inter-tight text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-colors">
                    Mark as Processing
                  </button>
                )}
              </div>

              <div className="p-8 md:p-12 flex flex-col gap-12 max-w-2xl mx-auto w-full">
                <div className="grid grid-cols-2 gap-12">
                  <div className="flex flex-col gap-4">
                    <span className="font-inter-tight text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dashed border-zinc-200 pb-2">Customer</span>
                    <div className="flex flex-col gap-1 text-sm font-inter text-[#111111]">
                      <span className="font-bold">{selectedOrder.customer}</span>
                      <a href={`mailto:${selectedOrder.email}`} className="text-zinc-500 hover:text-[#d92323] transition-colors">{selectedOrder.email}</a>
                      <a href={`tel:${selectedOrder.phone}`} className="text-zinc-500 hover:text-[#d92323] transition-colors">{selectedOrder.phone}</a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="font-inter-tight text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dashed border-zinc-200 pb-2">Shipping Address</span>
                    <p className="text-sm font-inter text-zinc-600 leading-relaxed">
                      {(selectedOrder.address || '').split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-inter-tight text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dashed border-zinc-200 pb-2">Purchased Items ({selectedOrder.items.length})</span>
                  <div className="flex flex-col gap-4">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div className="flex gap-4 items-start">
                          <div className="w-12 h-12 bg-[#F5F5F5] border border-zinc-200 flex justify-center items-center font-inter-tight text-xs text-zinc-400">IMG</div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-helvetica font-bold text-sm text-[#111111]">"{item.name}"</span>
                            <span className="font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest">Qty: {item.qty} × ${item.price}</span>
                          </div>
                        </div>
                        <span className="font-helvetica font-bold text-sm text-[#111111]">${item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-baseline border-t border-[#111111] pt-4 mt-2">
                    <span className="font-helvetica font-bold text-sm uppercase text-[#111111]">Total Paid</span>
                    <span className="font-bebas text-4xl tracking-wide text-[#111111]">${selectedOrder.total}</span>
                  </div>
                </div>

                <div className="bg-[#F5F5F5] p-6 border border-zinc-200 flex flex-col gap-4">
                  <span className="font-inter-tight text-[10px] font-bold text-[#111111] uppercase tracking-widest">Fulfillment</span>
                  
                  {selectedOrder.status !== 'Shipped' ? (
                    <div className="flex flex-col gap-3">
                      <p className="font-inter text-xs text-zinc-500">Enter the tracking number below to fulfill this order and notify the customer.</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. TRK123456789" 
                          className="flex-1 bg-white border border-zinc-300 px-3 py-2 font-inter text-sm focus:outline-none focus:border-[#111111]"
                          id={`tracking-${selectedOrder.id}`}
                        />
                        <button 
                          onClick={() => {
                            const val = document.getElementById(`tracking-${selectedOrder.id}`).value;
                            if(val) handleSaveTracking(selectedOrder.id, val);
                          }} 
                          className="bg-[#111111] hover:bg-zinc-800 text-white font-inter-tight text-[10px] font-bold uppercase tracking-widest px-6 transition-colors"
                        >
                          Fulfill Order
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="font-inter font-bold text-sm">Order fulfilled and shipped.</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest">Tracking Number:</span>
                        <span className="font-helvetica font-bold text-xs text-[#111111]">{selectedOrder.tracking}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center font-inter-tight text-zinc-400 text-xs uppercase tracking-widest">Select an order to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminStudioTimeline = () => {
  const { timeline, setTimeline, setSyncStatus } = useData();

  const handleUpdate = (id, field, value) => {
    setTimeline(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = async (id, field, value) => {
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('timeline').update({ [field]: value }).eq('id', id);
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
  };

  const handleAddNode = async (index) => {
    const newNode = { name: "New Event Title", desc: "Event description...", year: "Year" };
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        const { data } = await supabase.from('timeline').insert([newNode]).select();
        if (data && data[0]) {
          const newTimeline = [...timeline];
          newTimeline.splice(index + 1, 0, data[0]);
          setTimeline(newTimeline);
          setSyncStatus('Synced');
        }
      } catch(e) { 
        console.error(e); 
        setSyncStatus('Error');
      }
    } else {
      const newTimeline = [...timeline];
      newTimeline.splice(index + 1, 0, { ...newNode, id: Date.now() });
      setTimeline(newTimeline);
    }
  };

  const handleDeleteNode = async (id) => {
    setTimeline(prev => prev.filter(item => item.id !== id));
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('timeline').delete().eq('id', id);
        setSyncStatus('Synced');
      } catch(e) { 
        console.error(e); 
        setSyncStatus('Error');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pb-24 items-center">
      <div className="text-center mb-16">
        <h3 className="font-bebas text-5xl tracking-wide uppercase text-[#111111]">Our Journey</h3>
        <p className="font-inter-tight text-xs text-zinc-500 uppercase tracking-widest mt-2">Click text to edit • Hover line to add/remove events</p>
      </div>

      <div className="relative w-full flex flex-col items-center">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-zinc-300 -z-10"></div>

        {timeline.map((item, index) => (
          <div key={item.id} className="relative flex w-full justify-between items-center group py-8">
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#111111] rounded-full z-10 transition-transform group-hover:scale-125"></div>

            <div className={`w-1/2 flex justify-end pr-12 ${index % 2 === 0 ? 'order-1' : 'order-3 pr-0 pl-12 justify-start'}`}>
              <div className="relative flex items-center group/node">
                <EditableText value={item.year} onChange={v => handleUpdate(item.id, 'year', v)} onSave={v => handleSave(item.id, 'year', v)} className={`font-bebas text-4xl text-zinc-300 w-24 ${index % 2 === 0 ? 'text-right' : 'text-left'}`} />
                <button onClick={() => handleDeleteNode(item.id)} className={`absolute opacity-0 group-hover/node:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-2 ${index % 2 === 0 ? '-left-10' : '-right-10'}`} title="Remove Event">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            <div className="w-8 shrink-0 order-2"></div>

            <div className={`w-1/2 flex flex-col justify-start pl-12 ${index % 2 === 0 ? 'order-3' : 'order-1 pl-0 pr-12 items-end'}`}>
              <EditableText value={item.name} onChange={v => handleUpdate(item.id, 'name', v)} onSave={v => handleSave(item.id, 'name', v)} className={`font-inter-tight font-bold text-lg text-[#111111] leading-tight ${index % 2 === 0 ? 'text-left' : 'text-right'}`} />
              <EditableText value={item.desc} onChange={v => handleUpdate(item.id, 'desc', v)} onSave={v => handleSave(item.id, 'desc', v)} className={`font-inter text-sm text-zinc-500 mt-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`} />
            </div>

            {index < timeline.length - 1 && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 flex justify-center items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleAddNode(index)} className="w-6 h-6 bg-white border border-[#111111] rounded-full text-[#111111] flex justify-center items-center hover:bg-[#111111] hover:text-white transition-colors pb-0.5" title="Insert Event">+</button>
              </div>
            )}
          </div>
        ))}

        <div className="relative flex justify-center items-center py-8">
           <button onClick={() => handleAddNode(timeline.length - 1)} className="w-10 h-10 bg-zinc-100 hover:bg-[#111111] border border-dashed border-zinc-300 hover:border-[#111111] rounded-full text-zinc-400 hover:text-white flex justify-center items-center transition-all pb-1 text-xl" title="Add Final Event">+</button>
        </div>
      </div>
    </div>
  );
};

const AdminStudioSettings = () => {
  const { settings, setSettings, setSyncStatus } = useData();

  const handleUpdate = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field, value) => {
    const dbMap = {
      quoteMain: 'quote_main',
      quoteCinematic: 'quote_cinematic',
      barImage: 'bar_image',
      hours1: 'hours_1',
      hours2: 'hours_2',
      hours3: 'hours_3',
      hours4: 'hours_4',
      map_embed_url: 'map_embed_url',
      latitude_longitude: 'latitude_longitude',
      address: 'address',
      email: 'email',
      phone: 'phone'
    };
    const dbField = dbMap[field] || field;

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && settings.id) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('site_settings').update({ [dbField]: value }).eq('id', settings.id);
        setSyncStatus('Synced');
      } catch (e) { 
        console.error("Save error:", e); 
        setSyncStatus('Error');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pb-24">
      <div className="flex justify-between items-end mb-12 border-b border-zinc-200 pb-4">
        <h3 className="font-bebas text-4xl tracking-wide uppercase text-[#111111]">Site Settings & Identity</h3>
      </div>

      <div className="flex flex-col gap-8 mb-16">
         <span className="font-inter-tight text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2">01. Hero Identity & Quotes</span>
         
         <div className="bg-[#EAEAEA] p-12 md:p-16 flex flex-col items-center text-center gap-4 relative overflow-hidden group">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-4">MAIN HERO TEXT (NEW LINE = ENTER)</span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#d92323]/10 rounded-full blur-xl -z-10"></div>
            <EditableTextArea
                value={settings.quoteMain || ''}
                onChange={v => handleUpdate('quoteMain', v)}
                onSave={v => handleSave('quoteMain', v)}
                className="font-inter font-normal text-3xl md:text-[2.5vw] text-[#111111] leading-[1.1] tracking-tight uppercase text-center w-full max-w-lg bg-transparent h-48 md:h-64"
                rows={6}
            />
         </div>

         <div className="bg-[#EAEAEA] p-12 md:p-16 flex flex-col items-start gap-4">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-4">CINEMATIC SCROLL TEXT</span>
            <EditableTextArea
                value={settings.quoteCinematic || ''}
                onChange={v => handleUpdate('quoteCinematic', v)}
                onSave={v => handleSave('quoteCinematic', v)}
                className="font-inter font-medium text-[11px] md:text-[13px] text-[#111111] leading-[1.4] w-full max-w-sm bg-transparent"
            />
         </div>
      </div>

      <div className="flex flex-col gap-8">
         <span className="font-inter-tight text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2">02. Visit Us (Location & Hours)</span>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            <div className="flex flex-col gap-10">
               <div className="flex flex-col gap-2">
                 <span className="font-inter font-black text-xl text-[#111111] uppercase">ADDRESS</span>
                 <EditableTextArea value={settings.address || ''} onChange={v => handleUpdate('address', v)} onSave={v => handleSave('address', v)} className="font-inter text-sm text-zinc-600 leading-relaxed bg-transparent" />
               </div>
               
               <div className="flex flex-col gap-2">
                 <span className="font-inter font-black text-xl text-[#111111] uppercase">HOURS</span>
                 <div className="font-inter flex flex-col gap-1.5 mt-2">
                    <div className="flex justify-between items-center border-b border-zinc-200/50 py-1">
                        <span className="text-sm text-zinc-600">Wednesday – Thursday</span>
                        <EditableText value={settings.hours1} onChange={v => handleUpdate('hours1', v)} onSave={v => handleSave('hours1', v)} className="text-sm text-zinc-600 text-right w-32 bg-transparent" />
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-200/50 py-1">
                        <span className="text-sm text-zinc-600">Friday – Saturday</span>
                        <EditableText value={settings.hours2} onChange={v => handleUpdate('hours2', v)} onSave={v => handleSave('hours2', v)} className="text-sm text-zinc-600 text-right w-32 bg-transparent" />
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-200/50 py-1">
                        <span className="text-sm text-zinc-600">Sunday</span>
                        <EditableText value={settings.hours3} onChange={v => handleUpdate('hours3', v)} onSave={v => handleSave('hours3', v)} className="text-sm text-zinc-600 text-right w-32 bg-transparent" />
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-200/50 py-1">
                        <span className="text-sm text-zinc-400">Monday – Tuesday</span>
                        <EditableText value={settings.hours4} onChange={v => handleUpdate('hours4', v)} onSave={v => handleSave('hours4', v)} className="text-sm text-zinc-400 text-right w-32 bg-transparent" />
                    </div>
                 </div>
               </div>

               <div className="flex flex-col gap-2">
                 <span className="font-inter font-black text-xl text-[#111111] uppercase">CONTACT</span>
                 <div className="flex items-center gap-4 mt-2">
                     <span className="text-xs font-bold text-zinc-400 w-12 uppercase tracking-widest">EMAIL</span>
                     <EditableText value={settings.email} onChange={v => handleUpdate('email', v)} onSave={v => handleSave('email', v)} className="text-sm text-zinc-600 bg-transparent" />
                 </div>
                 <div className="flex items-center gap-4 mt-2">
                     <span className="text-xs font-bold text-zinc-400 w-12 uppercase tracking-widest">PHONE</span>
                     <EditableText value={settings.phone} onChange={v => handleUpdate('phone', v)} onSave={v => handleSave('phone', v)} className="text-sm text-zinc-600 bg-transparent" />
                 </div>
               </div>
            </div>

            <div className="flex flex-col">
               <span className="font-inter font-black text-xl text-[#111111] uppercase mb-4">BAR SPACE PHOTO</span>
               <EditableImage 
                 src={settings.barImage} 
                 aspect="aspect-[16/10]" 
                 onUpload={(url, isFinal) => {
                   handleUpdate('barImage', url);
                   if (isFinal) handleSave('barImage', url);
                 }} 
               />
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-3">Click image to update gallery photo</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-8 mt-16">
         <span className="font-inter-tight text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2">03. Google Map Integration & Location Coordinates</span>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            <div className="flex flex-col gap-2">
               <span className="font-inter font-black text-xl text-[#111111] uppercase">COORDINATES (LAT, LONG)</span>
               <EditableText 
                  value={settings.latitude_longitude || "40.7128° N, 74.0060° W"} 
                  onChange={v => handleUpdate('latitude_longitude', v)} 
                  onSave={v => handleSave('latitude_longitude', v)} 
                  className="text-sm font-bold font-helvetica"
                  placeholder="e.g. 40.7128° N, 74.0060° W"
               />
               <span className="text-[10px] text-zinc-400 uppercase mt-1">This is displayed vertically on the hero splash screen corners.</span>
            </div>

            <div className="flex flex-col gap-2">
               <span className="font-inter font-black text-xl text-[#111111] uppercase">GOOGLE MAP EMBED URL (IFRAME SRC)</span>
               <EditableTextArea 
                  value={settings.map_embed_url || "https://www.google.com/maps/embed?..."} 
                  onChange={v => handleUpdate('map_embed_url', v)} 
                  onSave={v => handleSave('map_embed_url', v)} 
                  className="text-xs font-mono text-zinc-600 bg-transparent" 
                  placeholder="Paste the Google Maps embed iframe 'src' URL here..."
                  rows={4}
               />
               <span className="text-[10px] text-zinc-400 uppercase mt-1">Go to Google Maps &gt; Share &gt; Embed a Map &gt; Copy the 'src' URL from the iframe tag.</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const AdminLayout = ({ onLogout }) => {
  const { syncStatus } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const menuItems = [
    { id: 'overview', label: 'Bar & Artists', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'editorials', label: 'Stories Grid', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'catalogue', label: 'Catalogue', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'timeline', label: 'Our Journey', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'orders', label: 'Order Ledger', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'settings', label: 'Site Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <AdminStudioOverview />;
      case 'editorials': return <AdminStudioEditorials />;
      case 'catalogue': return <AdminStudioCatalogue />;
      case 'timeline': return <AdminStudioTimeline />;
      case 'orders': return <AdminStudioOrders />;
      case 'settings': return <AdminStudioSettings />;
      default: return (
        <div className="w-full h-64 border-2 border-dashed border-zinc-200 flex justify-center items-center">
          <span className="font-inter font-bold text-zinc-400">Module under construction</span>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#ffffff] overflow-hidden font-inter">
      <aside className={`bg-[#F5F5F5] border-r border-zinc-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 shrink-0">
          {isSidebarOpen && <span className="font-bebas text-2xl tracking-wide text-[#111111]">STUDIO</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-zinc-400 hover:text-[#111111] transition-colors p-2 -mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 flex flex-col gap-2 px-4">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-md transition-colors ${activeTab === item.id ? 'bg-white shadow-sm text-[#111111] font-bold' : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-[#111111]'}`}
              title={!isSidebarOpen ? item.label : ""}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon}></path>
              </svg>
              {isSidebarOpen && <span className="font-inter-tight text-[11px] uppercase tracking-widest truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-zinc-200">
          <button onClick={onLogout} className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-colors ${!isSidebarOpen && 'justify-center px-0'}`} title={!isSidebarOpen ? "Logout" : ""}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            {isSidebarOpen && <span className="font-inter-tight text-[11px] uppercase tracking-widest font-bold">Close Studio</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        <header className="h-20 flex items-center px-8 md:px-12 shrink-0 justify-between">
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-zinc-100/80 px-3 py-1.5 rounded-full border border-zinc-200/50">
               {syncStatus === 'Mock Mode' && <><span className="w-2 h-2 rounded-full bg-orange-400"></span><span className="font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest">Local Mock Mode</span></>}
               {syncStatus === 'Synced' && <><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest">Saved to Cloud</span></>}
               {syncStatus === 'Saving...' && (
                 <>
                   <svg className="w-3 h-3 text-zinc-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   <span className="font-inter-tight text-[10px] text-zinc-500 uppercase tracking-widest">Saving...</span>
                 </>
               )}
               {syncStatus === 'Error' && <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span><span className="font-inter-tight text-[10px] text-red-500 uppercase tracking-widest">Save Failed</span></>}
             </div>
           </div>
           <span className="font-helvetica font-bold text-sm text-[#111111] uppercase tracking-tight">
              {menuItems.find(m => m.id === activeTab)?.label}
           </span>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-0">
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

const MainApp = () => {
  const [appMode, setAppMode] = useState('frontend');

  const renderApp = () => {
    switch (appMode) {
      case 'admin-login':
        return <AdminLogin onLogin={() => setAppMode('admin-dashboard')} onCancel={() => setAppMode('frontend')} />;
      case 'admin-dashboard':
        return <AdminLayout onLogout={async () => {
          if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) { await supabase.auth.signOut(); }
          setAppMode('frontend');
        }} />;
      case 'frontend':
      default:
        return <FrontendApp onSecretClick={() => setAppMode('admin-login')} />;
    }
  };

  return (
    <DataProvider>
      {renderApp()}
    </DataProvider>
  );
};

// Component หุ้ม (Wrapper) สำหรับโหลด Supabase Script เพื่อเลี่ยงข้อจำกัดการ Import ของแคนวาส
export default function App() {
  const [isDbConnecting, setIsDbConnecting] = useState(true);

  useEffect(() => {
    const initSupa = () => {
       if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http')) {
          supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
       }
       setIsDbConnecting(false);
    };

    if (window.supabase) {
      initSupa();
      return;
    }
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@supabase/supabase-js@2";
    script.crossOrigin = "anonymous";
    script.onload = initSupa;
    document.body.appendChild(script);
  }, []);

  if (isDbConnecting) {
    return (
      <div className="fixed inset-0 bg-[#111111] z-[99999] flex flex-col justify-center items-center">
         <motion.div 
           animate={{ opacity: [0.5, 1, 0.5] }} 
           transition={{ repeat: Infinity, duration: 1.5 }}
           className="font-inter-tight text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#F5F5F5]"
         >
           Connecting to Secure Database...
         </motion.div>
      </div>
    );
  }

  return <MainApp />;
}