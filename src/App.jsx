import React, { useRef, useState, useEffect, createContext, useContext, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { CheckoutOverlay } from './components/ecommerce/CheckoutOverlay';
import { OrderSuccessOverlay } from './components/ecommerce/OrderSuccessOverlay';
import { AuthOverlay } from './components/ecommerce/AuthOverlay';
import { ClientProfileOverlay } from './components/ecommerce/ClientProfileOverlay';

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
  {
    id: 'mock_1',
    name: "Sunflowers",
    src: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80",
    caption: "A bright, warm, low-ABV cocktail with a refreshing,\neasy drinking character.",
    reference: "Reference: Vincent van Gogh, Sunflowers (1889)",
    quote: "This was my very first painting, from a time when I barely knew how people talked about art. I came from restaurant bartending, not galleries or textbooks.\n\nAfter discovering Van Gogh's Sunflowers and visiting an exhibition in New York inspired by his work, the feeling stayed with me. It quietly sparked the beginning of WAYD.\n\nThis drink follows the painting's direction. Bright in color, warm in energy, and full of life. Its refreshing, low-ABV character feels like a summer afternoon, easy, open, and gently layered.\n\nThis is not just a beverage. It is an experience of light, color, and emotion, and my interpretation of the WAYD style.",
    artist: "Teddy",
    tags: "• Low ABV Light • Honest • Quietly expressive",
    ingredients: "Chinola Passionfruit, Dry Vermouth, Licor 43, Benedictine, Verjus",
    price: "$21"
  },
  {
    id: 'mock_2',
    name: "Yellow",
    src: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=1200&q=80",
    caption: "A cocktail that has undergone a milk-washing\nprocess.",
    reference: "Reference: Coldplay, Yellow (2000)",
    quote: "People often ask about my favorite colors. Yellow has never been one of mine.\n\nYet, when it comes to music, Yellow is the song I return to most.\n\nI chose this drink to launch WAYD because it was with me long before any idea of a menu or a brand existed. During a time when life felt heavy and isolating, I was simply searching for a song that could offer solace. I paused at the title—Yellow—and as it began to play, tears flowed effortlessly.\n\nThe music didn't try to lift me up or promise answers; it simply existed, and that was enough.\n\nThis cocktail captures the essence of that night: soft, warm, and sincere.\n\nA gentle reminder that sometimes, light doesn't make a grand entrance.\n\nIf you've ever wondered who you're doing all of this for, welcome to Yellow...",
    artist: "Mimi",
    tags: "• Warm • Luminous • Spirit-Forward",
    ingredients: "Milk-Washed Nikka days Whiskey, Sake, Honey Pear Tea, Mango, Maple Syrup",
    price: "$23"
  }
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

const demoGalleryItem = {
  id: 'demo-item-999',
  name: "The Kai Vase (Demo Gallery)",
  price: "145",
  src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
  designer: "Wayd Studio",
  year: "2026",
  colour: "Matte Cream",
  size: "4.5\" x 4.5\" x 6.0\"",
  material: "Handcrafted Ceramic",
  info: "A beautifully sculpted, minimal ceramic vase. This is a demo item to showcase the multiple image gallery with 5 pictures for your client.",
  stock: "10",
  images: [
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1610701596027-14c0a524bcda?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1610701596013-14902b37bd14?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1597330768910-c081e7d23588?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1597330768875-14f09d84f93b?auto=format&fit=crop&w=800&q=80"
  ]
};

const catalogueItems = [
  demoGalleryItem,
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

const newsData = [
  {
    id: 1,
    title: "New Seasonal Menu Launch",
    subtitle: "Spring Collection 2026",
    category: "MENU",
    date: "March 15, 2026",
    content: "Discover our latest collection of signature cocktails inspired by the vibrant colors and fresh ingredients of spring. Every drink is a canvas, and our mixologists have painted a masterpiece of flavors. Join us to experience the new standard of Artail.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Artail Gallery Expansion",
    subtitle: "New Space Opening in Chelsea",
    category: "ANNOUNCEMENT",
    date: "April 02, 2026",
    content: "We are thrilled to announce the opening of our new gallery space in the heart of Chelsea. This expanded venue will feature immersive art installations paired perfectly with our bespoke cocktail menu. A new chapter for WAYD? begins here.",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Guest Bartender Series",
    subtitle: "Featuring Daniel Kim from Seoul",
    category: "EVENT",
    date: "April 18, 2026",
    content: "For one night only, renowned mixologist Daniel Kim will be taking over the bar. Experience his award-winning techniques and unique flavor profiles that have taken the Seoul cocktail scene by storm. Reservations highly recommended.",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Awarded Best Conceptual Bar",
    subtitle: "New York Bartender Week 2025",
    category: "PRESS",
    date: "May 10, 2026",
    content: "We are incredibly honored to receive the 'Best Conceptual Bar' award at this year's New York Bartender Week. This recognition is a testament to our team's dedication to pushing the boundaries of what a bar can be. Thank you to everyone who has supported our journey.",
    image: "https://images.unsplash.com/photo-1582222135687-0b25e71c990b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "The Art of Mixology",
    subtitle: "Masterclass with Mimi",
    category: "WORKSHOP",
    date: "May 25, 2026",
    content: "Join our Head Mixologist, Mimi, for an exclusive masterclass. Learn the secrets behind our signature drinks, the philosophy of flavor pairing, and hands-on techniques to elevate your home bartending skills. Limited spots available.",
    image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    title: "Gallery Exhibition: Liquid Canvas",
    subtitle: "A showcase of color and taste",
    category: "EXHIBITION",
    date: "June 05, 2026",
    content: "Our new art exhibition 'Liquid Canvas' explores the intersection of visual art and mixology. Each artwork in the gallery is paired with a corresponding cocktail, creating a multi-sensory experience that challenges perception.",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    title: "Late Night Studio Sessions",
    subtitle: "Live jazz and signature cocktails",
    category: "EVENT",
    date: "June 15, 2026",
    content: "Introducing our Late Night Studio Sessions every Thursday. Enjoy live performances from local jazz artists in an intimate setting. We've crafted a special late-night menu featuring moody, complex cocktails designed to complement the music.",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    title: "New Merch Drop",
    subtitle: "Exclusive WAYD? Gallery Apparel",
    category: "PRODUCT",
    date: "July 01, 2026",
    content: "Our highly anticipated merchandise collection is finally here. Featuring minimal designs inspired by our gallery aesthetic, the collection includes heavy-weight tees, custom glassware, and limited edition art prints. Available now in-store.",
    image: "https://images.unsplash.com/photo-1529336953128-a85760f58cb5?auto=format&fit=crop&w=1200&q=80"
  }
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
  artist1_subtext: "",
  artist1_quote: "“I once believed I had lost my art. But behind the bar, I found it again. Today, I paint with flavor, balance, and emotion.\n\nThis pop-up is my canvas, and every drink tells the story of my return to myself.”",
  artist2_name: "Teddy",
  artist2_image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  artist2_subtext: "Winner “Bar Star Awards” by New York Bartender Week 2025",
  artist2_quote: "“Cocktails became my world when I realized they weren't just my job; they're how I express who I am.\n\nAfter years behind the bar, I'm taking the next step: blending cocktails and art, and turning drinks into stories.”",
  map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617539313314!2d-74.0084126234181!3d40.74844047138819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259b9b3117469%3A0xd134e199a405a163!2s254%2010th%20Ave%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1716720000000!5m2!1sen!2sus",
  latitude_longitude: "40.7128° N, 74.0060° W",
  homeVideo: "",
  journey_title: "Our\nJourney",
  journey_subtitle: "From a shared belief to a permanent canvas"
};

export const DataProvider = ({ children }) => {
  const [cocktails, setCocktails] = useState(cocktailMenuData);
  const [editorials, setEditorials] = useState(editorialStories);
  const [catalogue, setCatalogue] = useState(catalogueItems);
  const [timeline, setTimeline] = useState(journeyTimelineData);
  const [news, setNews] = useState(newsData);
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
          { data: nwData },
          { data: stData }
        ] = await Promise.all([
          supabase.from('cocktails').select('*'),
          supabase.from('catalogue').select('*').order('created_at', { ascending: true }),
          supabase.from('editorials').select('*'),
          supabase.from('timeline').select('*').order('year', { ascending: true }),
          supabase.from('news').select('*').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*').limit(1).single()
        ]);

        if (cData) {
          if (cData.length === 0) {
            setCocktails(cocktailMenuData);
          } else {
            const mappedCocktails = cData.map(item => ({ 
              ...item, 
              hoverSrc: item.hover_src || item.hoverSrc,
              cocktailImages: item.cocktail_images || item.cocktailImages || [],
              description: item.description || defaultDesc
            }));
            setCocktails(mappedCocktails);
          }
        }
        if (catData && catData.length > 0) {
          setCatalogue([demoGalleryItem, ...catData]);
        }

        if (edData && edData.length > 0) {
          const grouped = { teddy: [], mimi: [] };
          edData.forEach(item => {
            if (grouped[item.artist]) grouped[item.artist].push(item);
          });
          setEditorials(grouped);
        }

        if (tmData) setTimeline(tmData);
        if (nwData) setNews(nwData);
        
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
            homeVideo: stData.home_video ?? stData.homeVideo ?? siteSettingsData.homeVideo,
            social_facebook: stData.social_facebook ?? siteSettingsData.social_facebook,
            social_instagram: stData.social_instagram ?? siteSettingsData.social_instagram,
            social_tiktok: stData.social_tiktok ?? siteSettingsData.social_tiktok,
            social_youtube: stData.social_youtube ?? siteSettingsData.social_youtube,
            artist1_name: stData.artist1_name ?? siteSettingsData.artist1_name,
            artist2_name: stData.artist2_name ?? siteSettingsData.artist2_name,
            artist1_image: stData.artist1_image ?? siteSettingsData.artist1_image,
            artist2_image: stData.artist2_image ?? siteSettingsData.artist2_image,
            artist1_quote: formatText(stData.artist1_quote ?? siteSettingsData.artist1_quote),
            artist2_quote: formatText(stData.artist2_quote ?? siteSettingsData.artist2_quote),
            artist1_subtext: formatText(stData.artist1_subtext ?? siteSettingsData.artist1_subtext),
            artist2_subtext: formatText(stData.artist2_subtext ?? siteSettingsData.artist2_subtext),
            journey_title: formatText(stData.journey_title ?? siteSettingsData.journey_title),
            journey_subtitle: formatText(stData.journey_subtitle ?? siteSettingsData.journey_subtitle),
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
    news, setNews,
    settings, setSettings, 
    syncStatus, setSyncStatus,
    dbLoading
  }), [cocktails, editorials, catalogue, timeline, news, settings, syncStatus, dbLoading]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

const BagView = ({ cartItems, onRemove, onCheckout, onBack, onUpdateQty }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
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
        ) : (
          cartItems.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 border-b border-black/10 py-6 group">
              <div className="w-full md:w-[55%] flex items-center gap-6">
                <div className="w-16 md:w-20 aspect-[4/5] bg-[#F5F5F5] overflow-hidden shrink-0">
                  <img src={item.src || item.image || item.image_url || (item.images && item.images[0])} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" draggable="false" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-helvetica text-black text-[12px] md:text-[14px] font-bold tracking-tight">"{item.name}"</span>
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">{item.designer}</span>
                </div>
              </div>
              <div className="w-full md:w-[45%] flex justify-between items-center md:items-center mt-2 md:mt-0">
                <div className="w-1/3 md:w-[33%] flex flex-col md:flex-row md:justify-center items-start md:items-center gap-1.5 md:gap-0">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest md:hidden">QTY</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQty(idx, item.qty - 1)} className="w-5 h-5 flex items-center justify-center border border-black/20 hover:border-black rounded-full text-[10px] transition-colors" disabled={item.qty <= 1}>-</button>
                    <span className="font-helvetica text-black text-[12px] font-bold tracking-tight w-4 text-center">{item.qty < 10 ? `0${item.qty}` : item.qty}</span>
                    <button onClick={() => onUpdateQty(idx, item.qty + 1)} className="w-5 h-5 flex items-center justify-center border border-black/20 hover:border-black rounded-full text-[10px] transition-colors" disabled={item.qty >= (item.stock || 10)}>+</button>
                  </div>
                </div>
                <div className="w-1/3 md:w-[33%] flex flex-col md:flex-row md:justify-end items-start md:items-center gap-1.5 md:gap-0">
                  <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest md:hidden">PRICE</span>
                  <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">${Number(item.price) * item.qty}</span>
                </div>
                <div className="w-1/3 md:w-[33%] flex justify-end items-center">
                  <span onClick={() => onRemove(idx)} className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:text-black underline underline-offset-4 decoration-1 transition-colors">REMOVE</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="w-full md:w-1/3 flex flex-col mt-8 md:mt-0 md:pl-8 lg:pl-16">
        <div className="flex flex-col gap-6 border-b border-black/10 pb-8 mb-8">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">ORDER SUMMARY</span>
          <div className="flex justify-between items-center">
            <span className="font-helvetica text-black text-[10px] font-bold uppercase tracking-widest">SUBTOTAL</span>
            <span className="font-helvetica text-black text-[14px] font-bold tracking-tight">${subtotal}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-helvetica text-[#a0a0a0] text-[10px] font-bold uppercase tracking-widest">SHIPPING</span>
            <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold tracking-tight text-right uppercase">CALCULATED AT<br/>CHECKOUT</span>
          </div>
        </div>
        <button onClick={onCheckout} className={`w-full font-helvetica font-semibold text-[11px] uppercase tracking-widest py-4 transition-colors flex justify-center items-center ${cartItems.length > 0 ? 'bg-black text-[#F5F5F5] hover:bg-zinc-800' : 'bg-[#EAEAEA] text-[#a0a0a0] pointer-events-none'}`}>
          PROCEED TO CHECKOUT
        </button>
      </div>
      </div>
    </div>
  );
};

const ProductDetail = ({ item, onNavigate, onAcquire, onBack }) => {
  const { catalogue, settings } = useData();
  const [imageIndex, setImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAcquireClick = () => {
    onAcquire(item, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

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
        <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 md:gap-x-12 relative h-full">
        <div className="flex flex-col gap-1.5">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">OBJECT</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">"{item.name}"</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">DESIGNER</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">{item.designer}</span>
        </div>
        <div className="flex flex-col gap-1.5 hidden md:flex">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">YEAR</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">{item.year}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">COLOUR</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">{item.colour}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SIZE</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">{item.size}</span>
        </div>
        <div className="flex flex-col gap-1.5 hidden md:flex">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">MATERIAL</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">{item.material}</span>
        </div>
        <div className="flex flex-col gap-1.5 md:hidden">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">YEAR</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">{item.year}</span>
        </div>
        <div className="flex flex-col gap-1.5 md:hidden">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">MATERIAL</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight">{item.material}</span>
        </div>
        <div className="flex flex-col gap-1.5 col-span-2 md:col-span-3 lg:col-span-2">
          <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">INFO</span>
          <span className="font-helvetica text-black text-[12px] font-bold tracking-tight leading-snug max-w-md">{item.info}</span>
        </div>
        <div className="col-span-2 md:col-span-3 flex flex-col w-full mt-8 md:mt-16 gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-end w-full gap-4 md:gap-8 max-w-lg border-t border-black/10 pt-6">
            <div className="flex flex-col gap-1.5 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="font-helvetica text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">QTY</span>
                <span className="font-helvetica text-[#a0a0a0] text-[8px] uppercase tracking-widest">({item.stock || 10} AVAILABLE)</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center border border-black/20 hover:border-black rounded-full text-[10px] transition-colors"
                >-</button>
                <span className="font-helvetica text-black text-[14px] font-bold tracking-tight w-4 text-center">{quantity < 10 ? `0${quantity}` : quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(item.stock || 10, q + 1))}
                  className="w-6 h-6 flex items-center justify-center border border-black/20 hover:border-black rounded-full text-[10px] transition-colors"
                >+</button>
              </div>
            </div>
            <button 
              onClick={handleAcquireClick} 
              className={`w-full font-helvetica font-semibold text-[11px] uppercase tracking-widest py-4 transition-all duration-300 flex justify-center items-center gap-3 border ${
                isAdded 
                  ? 'bg-white text-black border-black/20 shadow-sm' 
                  : 'bg-black text-[#F5F5F5] border-transparent hover:bg-zinc-800'
              }`}
            >
              {isAdded ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <span>ADD TO BAG</span>
                  <span className="w-1 h-1 bg-[#F5F5F5] rounded-full opacity-30"></span>
                  <span>${item.price}</span>
                </>
              )}
            </button>
          </div>
          <div className="flex justify-between w-full max-w-lg mt-8 md:mt-12 pt-4 border-t border-black/10">
             <span onClick={handlePrev} className={`font-helvetica text-[10px] font-bold uppercase tracking-widest transition-colors ${currentIndex > 0 ? 'text-black cursor-pointer hover:text-zinc-500' : 'text-zinc-300 pointer-events-none'}`}>Previous</span>
            <span onClick={handleNext} className={`font-helvetica text-[10px] font-bold uppercase tracking-widest transition-colors ${currentIndex < catalogueItems.length - 1 ? 'text-black cursor-pointer hover:text-zinc-500' : 'text-zinc-300 pointer-events-none'}`}>Next</span>
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
        </div>
        
        {item.images.length > 1 && (
          <div className="w-full max-w-[280px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px] flex gap-2 mt-4 overflow-x-auto pb-2 snap-x">
            {item.images.map((imgUrl, i) => (
              <div 
                key={i} 
                onClick={() => setImageIndex(i)} 
                className={`w-16 h-16 shrink-0 cursor-pointer snap-start transition-all duration-300 border-b-2 ${imageIndex === i ? 'border-black opacity-100' : 'border-transparent opacity-50 hover:opacity-100'} bg-[#F5F5F5] overflow-hidden`}
              >
                <img src={imgUrl} alt={`thumbnail ${i+1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

const CatalogueOverlay = ({ onClose, cartItems, setCartItems, overlayView, setOverlayView, nyTime, setView, onCheckout, currentUser, setEcommerceView }) => {
  const { catalogue, settings } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleAcquire = (itemToAdd, qty = 1) => {
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
  };

  const handleRemoveFromBag = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="fixed inset-0 bg-[#ffffff] z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <nav className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center bg-white/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.05)] h-32 sm:h-36 md:h-40 px-[8vw]">
        <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-black/80">
          <span onClick={() => { onClose(); setView('cocktail'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
          <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
          <span onClick={openGrid} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
          <span onClick={() => { onClose(); setView('journey'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
          <span onClick={() => { onClose(); setView('news'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
          <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
        </div>
        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center z-[1001]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-black bg-transparent border-none p-0"
            aria-label="Toggle Menu"
          >
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
            <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
          </button>
        </div>

        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>
           <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-black/80">
          <span onClick={openBag} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {
              onClose();
              setEcommerceView('profile');
            } else {
              onClose();
              setEcommerceView('auth');
            }
          }} className="hidden md:inline-block cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-black/20 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300">
            {currentUser ? 'Account' : 'Log In'}
          </span>
        </div>
      </nav>
      {/* Main Content Area */}
      <div className="w-full pt-[160px] md:pt-[180px] px-[8vw] pb-32 flex flex-col bg-white text-black">
        <h1 className="font-helvetica font-bold text-[40px] leading-[0.9] tracking-tight uppercase text-black mb-4 md:mb-8">
          SHOP
        </h1>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#ffffff] z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
              style={{ pointerEvents: 'auto' }}
            >
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('cocktail'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('editorial'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
              <span onClick={() => { setIsMobileMenuOpen(false); openGrid(); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('journey'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('news'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('visit'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
              
              <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (currentUser) {
                      onClose();
                      setEcommerceView('profile');
                    } else {
                      onClose();
                      setEcommerceView('auth');
                    }
                  }} 
                  className="bg-black text-white hover:bg-black/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
                >
                  {currentUser ? 'Account' : 'Log In'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {overlayView === 'bag' ? (
          <BagView cartItems={cartItems} onRemove={handleRemoveFromBag} onCheckout={onCheckout} onBack={openGrid} onUpdateQty={handleUpdateQty} />
        ) : overlayView === 'detail' && selectedItem ? (
          <ProductDetail item={selectedItem} onNavigate={openDetail} onAcquire={handleAcquire} onBack={openGrid} />
        ) : (
          <div className="w-full mt-10 md:mt-14">
            <div className="flex justify-between items-center w-full mb-4 md:mb-6 text-[10px] md:text-xs font-helvetica font-thin capitalize tracking-widest text-black px-0">
              <span>OBJECTS ({catalogue.length})</span>
              <span>SHOW ALL</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pb-20 w-full">
              {catalogue.map((item, idx) => (
                <div key={idx} onClick={() => openDetail(item)} className="flex flex-col group cursor-pointer">
                  <div className="w-full aspect-[4/5] bg-[#F5F5F5] overflow-hidden mb-2 md:mb-3">
                    <img src={item.src || item.image || item.image_url || (item.images && item.images[0])} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]" draggable="false" />
                  </div>
                  <div className="flex justify-between items-start w-full text-[10px] md:text-[11px] lg:text-xs opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-1 md:px-2 pt-1 md:pt-0">
                    <span className="font-helvetica font-bold text-black pr-4">"{item.name}"</span>
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

const NewsOverlay = ({ onClose, cartCount, setView, setOverlayView, currentUser, setEcommerceView }) => {
  const { settings, news } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e) => {
    if (headerRef.current) {
      setIsSticky(e.target.scrollTop > headerRef.current.offsetHeight - 20);
    }
  };

  const handleHorizontalScroll = (e) => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    if (scrollWidth > clientWidth) {
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  };

  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const selectedItem = selectedNewsId ? news.find(i => i.id === selectedNewsId) : null;

  const handleNextNews = () => {
    const currentIndex = news.findIndex(i => i.id === selectedNewsId);
    if (currentIndex < news.length - 1) {
      setSelectedNewsId(news[currentIndex + 1].id);
    }
  };

  const handlePrevNews = () => {
    const currentIndex = news.findIndex(i => i.id === selectedNewsId);
    if (currentIndex > 0) {
      setSelectedNewsId(news[currentIndex - 1].id);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = window.innerWidth > 768 ? window.innerWidth * 0.4 : window.innerWidth * 0.85;
      container.scrollTo({
        left: container.scrollLeft - scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = window.innerWidth > 768 ? window.innerWidth * 0.4 : window.innerWidth * 0.85;
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    handleHorizontalScroll();
    window.addEventListener('resize', handleHorizontalScroll);
    return () => window.removeEventListener('resize', handleHorizontalScroll);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <nav className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center bg-black/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-32 sm:h-36 md:h-40 px-[8vw]">
        <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { onClose(); setView('cocktail'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
          <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
          <span onClick={() => { onClose(); setView('journey'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
          <span onClick={() => { onClose(); setView('news'); }} className="cursor-pointer text-[#C28256] transition-colors duration-300">News</span>
          <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
        </div>
        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center z-[1001]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-[#F5F5F5] bg-transparent border-none p-0"
          >
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
            <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
          </button>
        </div>

        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>
           <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {
              onClose(); setView('catalogue'); setEcommerceView('profile');
            } else {
              onClose(); setView('catalogue'); setEcommerceView('auth');
            }
          }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-[#F5F5F5]/20 rounded-full hover:bg-[#F5F5F5] hover:text-black hover:border-[#F5F5F5] transition-all duration-300">
            {currentUser ? 'Account' : 'Log In'}
          </span>
        </div>
      </nav>

      <div className="w-full h-screen px-0 flex flex-col justify-center bg-black text-[#F5F5F5] relative pt-32 pb-16">
        {/* Horizontal Slider Section */}
        <div className="relative w-full group">
          <div 
            ref={scrollContainerRef}
            onScroll={handleHorizontalScroll}
            className="w-full flex gap-2 md:gap-3 overflow-x-auto snap-x snap-mandatory pl-2 pr-12 md:pl-3 md:pr-16 pb-8 hide-scrollbar scroll-smooth scroll-pl-2 md:scroll-pl-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {news.map((item) => (
              <div key={item.id} onClick={() => setSelectedNewsId(item.id)} className="relative flex flex-col snap-start shrink-0 w-[85vw] sm:w-[50vw] md:w-[38vw] lg:w-[28vw] xl:w-[22vw] aspect-[4/3] bg-zinc-900 overflow-hidden cursor-pointer group/card">
                {item.video ? (
                  <>
                    <video 
                      src={item.video} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105" 
                      loop 
                      muted 
                      playsInline 
                      ref={(el) => {
                        if (el) {
                          if (playingVideoId === item.id) el.play().catch(e => console.log(e));
                          else el.pause();
                        }
                      }}
                    />
                    {playingVideoId !== item.id && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideoId(item.id);
                        }}
                      >
                         <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/50 hover:bg-black/60 transition-colors group-hover/card:scale-110">
                           <svg className="w-5 h-5 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                         </div>
                      </div>
                    )}
                  </>
                ) : (
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105" />
                )}
                
                {/* Gradient Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none transition-opacity duration-500" />
                
                {/* Text Overlay Box */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5 transition-transform duration-500 transform group-hover/card:-translate-y-1">
                  <div className="border border-white p-3 md:p-4 flex flex-col items-center justify-center backdrop-blur-sm bg-black/10">
                    <h3 className="font-helvetica font-bold text-2xl md:text-3xl text-white uppercase tracking-tight text-center leading-none mb-1.5 w-full truncate">
                      {item.title}
                    </h3>
                    <p className="font-helvetica font-medium text-[9px] md:text-[10px] text-white/90 uppercase tracking-widest text-center w-full truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow Button (Appears on hover when scrolled) */}
          {scrollProgress > 0.01 && (
            <button 
              onClick={scrollLeft}
              className="hidden md:flex absolute left-[4vw] top-[13.1vw] lg:top-[8.1vw] -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 backdrop-blur-md"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
{/* Right Arrow Button (Appears on hover unless scrolled to end) */}
          {scrollProgress < 0.99 && (
            <button 
              onClick={scrollRight}
              className="hidden md:flex absolute right-[4vw] top-[13.1vw] lg:top-[8.1vw] -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 backdrop-blur-md"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full px-[8vw] mt-8">
          <div className="w-full max-w-sm mx-auto h-[1px] bg-zinc-800 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-white transition-all duration-150 ease-out" 
              style={{ width: `${Math.max(5, scrollProgress * 100)}%` }} 
            />
          </div>
        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {selectedNewsId && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 md:px-[5vw]"
              onClick={() => setSelectedNewsId(null)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl h-[85vh] md:h-[75vh] flex flex-col md:flex-row bg-[#151515] overflow-hidden"
              >
                {/* Left side: Image/Video */}
                <div className="w-full md:w-1/2 h-[45%] md:h-full relative bg-black shrink-0">
                  {selectedItem.video ? (
                    <video src={selectedItem.video} className="w-full h-full object-cover" controls playsInline />
                  ) : (
                    <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                  )}
                </div>
                
                {/* Right side: Content */}
                <div className="w-full md:w-1/2 h-[55%] md:h-full flex flex-col p-6 md:p-12 lg:p-16 relative">
                  
                  {/* Top: Category & Close */}
                  <div className="flex justify-between items-center mb-8 md:mb-12 text-[#F5F5F5]/80 border-b border-white/10 pb-4">
                    <span className="font-helvetica text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#C28256] rounded-full inline-block"></span>
                      {selectedItem.category}
                    </span>
                    <button onClick={() => setSelectedNewsId(null)} className="hover:text-white transition-colors p-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  
                  {/* Middle: Nav Arrows */}
                  <div className="flex items-center gap-6 text-[#F5F5F5]/50 mb-6 md:mb-8">
                    <button onClick={handlePrevNews} disabled={!news.length || selectedItem.id === news[0].id} className="hover:text-white disabled:opacity-30 disabled:hover:text-[#F5F5F5]/50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={handleNextNews} disabled={!news.length || selectedItem.id === news[news.length - 1].id} className="hover:text-white disabled:opacity-30 disabled:hover:text-[#F5F5F5]/50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto hide-scrollbar pr-4">
                    <h2 className="font-helvetica font-bold text-xl md:text-2xl lg:text-3xl text-white mb-2 leading-tight tracking-tight">
                      {selectedItem.title}
                    </h2>
                    <h4 className="font-helvetica font-light uppercase text-[15px] text-[#F5F5F5]/80 leading-relaxed mb-6 md:mb-8">
                      {selectedItem.subtitle}
                    </h4>
                    <p className="font-helvetica font-light text-[15px] text-[#F5F5F5]/80 leading-relaxed mb-8">
                      {selectedItem.content}
                    </p>
                    <div className="text-[#F5F5F5]/80 text-[15px] font-helvetica font-light flex gap-3 flex-wrap">
                      <span>#waydgallery</span>
                      <span>#artailstory</span>
                      <span>#conceptualbar</span>
                    </div>
                  </div>

                  {/* Bottom: Date */}
                  <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10 text-[#F5F5F5]/80 text-[10px] md:text-xs font-helvetica tracking-widest uppercase shrink-0">
                    {selectedItem.date}
                  </div>
                  
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase text-[#F5F5F5]"
            style={{ pointerEvents: 'auto' }}
          >
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('cocktail'); }} className="text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('editorial'); }} className="text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('grid'); }} className="text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('journey'); }} className="text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('news'); }} className="text-[#C28256] text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('visit'); }} className="text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VisitOverlay = ({ onClose, cartCount, setView, setOverlayView, nyTime, currentUser, setEcommerceView }) => {
  const { settings } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const headerRef = useRef(null);

  const handleScroll = (e) => {
    if (headerRef.current) {
      setIsSticky(e.target.scrollTop > headerRef.current.offsetHeight - 20);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <nav className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center bg-black/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-32 sm:h-36 md:h-40 px-[8vw]">
        <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { onClose(); setView('cocktail'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
          <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
          <span onClick={() => { onClose(); setView('journey'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
          <span onClick={() => { onClose(); setView('news'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
          <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
        </div>
        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center z-[1001]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-[#F5F5F5] bg-transparent border-none p-0"
            aria-label="Toggle Menu"
          >
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
            <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
          </button>
        </div>

        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>
           <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {
              onClose();
              setEcommerceView('profile');
            } else {
              onClose();
              setEcommerceView('auth');
            }
          }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300">
            {currentUser ? 'Account' : 'Log In'}
          </span>
        </div>
      </nav>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
            style={{ pointerEvents: 'auto' }}
          >
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('cocktail'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('editorial'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('journey'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('news'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('visit'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
            
            <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('bag'); }} 
                className="border border-white/20 text-[#F5F5F5] hover:bg-white hover:text-black rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
              >
                Bag ({cartCount})
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser) {
                    onClose();
                    setEcommerceView('profile');
                  } else {
                    onClose();
                    setEcommerceView('auth');
                  }
                }} 
                className="bg-white text-black hover:bg-white/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
              >
                {currentUser ? 'Account' : 'Log In'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="w-full pt-[160px] md:pt-[180px] px-[12vw] md:px-[22vw] pb-32 flex flex-col bg-black text-[#F5F5F5]">
        <h1 className="font-helvetica font-bold text-[40px] leading-[0.9] tracking-tight uppercase text-[#F5F5F5] mb-4 md:mb-8">
          VISIT US
        </h1>

        {/* Gallery Bar Artistic Space Banner */}
        <div className="w-full aspect-[21/9] md:aspect-[21/9] bg-zinc-900 overflow-hidden relative mb-6 shadow-2xl">
          <img 
            src={settings?.barImage || "/gallery_bar_space.png"} 
            alt="Gallery Bar Space" 
            className="w-full h-full object-cover grayscale-0 hover:grayscale opacity-90 transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Info Grid (Reference-style layout with NY Mockup) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-y-0 md:gap-x-8 items-start px-0 bg-black text-[#F5F5F5] font-helvetica">

          {/* Left: Address Only (No label) */}
          <div className="md:col-span-6 flex flex-col justify-start">
            <div className="text-[15px] md:text-[17px] text-[#F5F5F5]/80 font-light leading-relaxed max-w-md">
              {(settings?.address || "92 Central Park Offices Building, Unit No.NY4401, 44th Floor, Central Park West, Upper West Side, New York, NY 10024").split("\n").map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </div>

          {/* Middle: Phone and Email (Aligned to top) */}
          <div className="md:col-span-3 flex flex-col justify-start md:pt-1">
            <div className="space-y-4">
              <div className="text-[15px] md:text-[17px] text-[#F5F5F5]/80 font-light leading-none">
                <a href={`tel:${settings?.phone?.replace(/[^0-9+]/g, '') || "+12127218209"}`} className="hover:text-[#C28256] transition-colors duration-300">
                  {settings?.phone || "(+1) 212-721-8209"}
                </a>
              </div>
              <div className="text-[15px] md:text-[17px] text-[#F5F5F5]/80 font-light leading-none pt-1">
                <a href={`mailto:${settings?.email || "nyc@wayd.co"}`} className="hover:text-[#C28256] transition-colors duration-300">
                  {settings?.email || "nyc@wayd.co"}
                </a>
              </div>
            </div>
          </div>

          {/* Right: Open Map Button (Aligned to top) */}
          <div className="md:col-span-3 flex md:justify-end items-start md:pt-0">
            <button 
              onClick={() => setShowMap(true)}
              className="border border-white/40 hover:border-white text-white font-helvetica text-[10px] md:text-[11px] font-light tracking-[0.2em] px-8 py-3.5 transition-all duration-300 rounded-none w-full md:w-auto text-center bg-transparent"
            >
              OPEN OUR MAP
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Modal Overlay */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-black/40 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
          >
            <div className="relative w-full max-w-4xl aspect-[16/10] bg-zinc-900 border border-zinc-800 shadow-2xl p-2 flex flex-col">
              <button 
                onClick={() => setShowMap(false)}
                className="absolute -top-12 right-0 text-zinc-400 hover:text-white font-helvetica text-xs font-bold uppercase tracking-widest flex items-center gap-2 py-2"
              >
                <span>[ Close Map ]</span>
                <span className="text-lg">×</span>
              </button>
              
              <iframe 
                src={settings.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.5794829399347!2d-73.973347!3d40.774929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc158!2sCentral%20Park%20West%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1716720000000!5m2!1sen!2sus"}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EditorialOverlay = ({ onClose, cartCount, setView, setOverlayView, nyTime, currentUser, setEcommerceView }) => {
  const { editorials, settings } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-black z-[9999] overflow-y-auto">
      <nav className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center bg-black/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-32 sm:h-36 md:h-40 px-[8vw]">
        <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { onClose(); setView('cocktail'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
          <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
          <span onClick={() => { onClose(); setView('journey'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
          <span onClick={() => { onClose(); setView('news'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
          <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
        </div>
        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center z-[1001]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-[#F5F5F5] bg-transparent border-none p-0"
            aria-label="Toggle Menu"
          >
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
            <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
          </button>
        </div>

        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>
           <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {
              onClose();
              setEcommerceView('profile');
            } else {
              onClose();
              setEcommerceView('auth');
            }
          }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300">
            {currentUser ? 'Account' : 'Log In'}
          </span>
        </div>
      </nav>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
            style={{ pointerEvents: 'auto' }}
          >
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('cocktail'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('editorial'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('journey'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('news'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
            <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('visit'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
            
            <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('bag'); }} 
                className="border border-white/20 text-[#F5F5F5] hover:bg-white hover:text-black rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
              >
                Bag ({cartCount})
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser) {
                    onClose();
                    setEcommerceView('profile');
                  } else {
                    onClose();
                    setEcommerceView('auth');
                  }
                }} 
                className="bg-white text-black hover:bg-white/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
              >
                {currentUser ? 'Account' : 'Log In'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="w-full pt-[160px] md:pt-[180px] px-[8vw] pb-32 flex flex-col bg-black text-[#F5F5F5]">
        <h1 className="font-helvetica font-bold text-[40px] leading-[0.9] tracking-tight uppercase text-[#F5F5F5] mb-4 md:mb-8">
          ABOUT
        </h1>


        {/* Dynamic Space */}
        {/* Dynamic Space (Matching Menu catalog layout) */}
        <div className="w-full flex flex-col bg-black text-[#EAEAEA]">
          
          {/* Artist 1: Mimi (Text Left, Image Right) */}
          <div className="w-full flex flex-col md:flex-row min-h-[90vh] relative bg-black py-16 md:py-24">
            {/* Left Column (Text details) */}
            <div className="w-full md:w-[46%] flex flex-col justify-center items-center p-8 md:p-12 lg:p-20 relative bg-black">
              <div className="font-helvetica font-medium text-xs md:text-sm lg:text-[15px] leading-[1.8] whitespace-pre-wrap max-w-md w-full">
                
                {/* Title */}
                <h2 className="font-helvetica font-bold text-[30px] text-white mb-6 tracking-wide uppercase text-left leading-[1.2]">
                  {settings.artist1_name || "MIMI"}
                </h2>
                {settings.artist1_subtext && (
                  <p className="font-helvetica font-light text-[16px] uppercase tracking-widest text-zinc-300 mb-8">
                    {settings.artist1_subtext}
                  </p>
                )}

                {/* Description (Larger text) */}
                <div className="space-y-6 text-zinc-300 font-light leading-[1.8] text-[16px]">
                  {(settings.artist1_quote || "").split('\n').filter(p => p.trim() !== '').map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

              </div>
            </div>

            {/* Right Column (Portrait) */}
            <div className="w-full md:w-[54%] flex flex-col items-center justify-center px-8 md:px-12 relative">
              <div className="w-full max-w-sm lg:max-w-md flex flex-col">
                <div className="w-full aspect-[4/5] bg-zinc-900 overflow-hidden shadow-2xl">
                  <img src={settings.artist1_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"} alt={settings.artist1_name || "Mimi"} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out" draggable="false" />
                </div>
              </div>
            </div>
          </div>

          {/* Artist 2: Teddy */}
          <div className="w-full flex flex-col md:flex-row min-h-[90vh] relative bg-black py-16 md:py-24">
            {/* Left Column (Portrait) */}
            <div className="w-full md:w-[54%] flex flex-col items-center justify-center px-8 md:px-12 relative">
              <div className="w-full max-w-sm lg:max-w-md flex flex-col">
                <div className="w-full aspect-[4/5] bg-zinc-900 overflow-hidden shadow-2xl">
                  <img src={settings.artist2_image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80"} alt={settings.artist2_name || "Teddy"} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out" draggable="false" />
                </div>
              </div>
            </div>

            {/* Right Column (Text details) */}
            <div className="w-full md:w-[46%] flex flex-col justify-center items-center p-8 md:p-12 lg:p-20 relative bg-black">
              <div className="font-helvetica font-medium text-xs md:text-sm lg:text-[15px] leading-[1.8] whitespace-pre-wrap max-w-md w-full">
                
                {/* Title */}
                <h2 className="font-helvetica font-bold text-[30px] text-white mb-6 tracking-wide uppercase text-left leading-[1.2]">
                  {settings.artist2_name || "TEDDY"}
                </h2>
                {(settings.artist2_subtext) && (
                  <p className="font-helvetica font-light text-[16px] uppercase tracking-widest text-zinc-300 mb-8">
                    {settings.artist2_subtext}
                  </p>
                )}

                {/* Description (Larger text) */}
                <div className="space-y-6 text-zinc-300 font-light leading-[1.8] text-[16px]">
                  {(settings.artist2_quote || "").split('\n').filter(p => p.trim() !== '').map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
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

const MenuDetailOverlay = ({ item, onClose, nyTime, onMenuClick, cartCount, setView, setOverlayView, currentUser, setEcommerceView }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const overlayRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: overlayRef });
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1.1, 1.0]);

  const { cocktails, settings } = useData();
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
      <div className={`sticky top-0 w-full z-50 px-6 h-32 sm:h-36 md:h-40 flex items-center transition-all duration-300 ${isSticky ? 'bg-[#F5F5F5]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
        <div className="flex justify-between items-center w-full relative">
          <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-black">
            <span onClick={() => { onClose(); setView('cocktail'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
            <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
            <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
            <span onClick={() => { onClose(); setView('journey'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
          <span onClick={() => { onClose(); setView('news'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
            <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
          </div>
          {/* Hamburger Icon */}
          <div className="md:hidden flex items-center z-[1001]">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-black bg-transparent border-none p-0"
              aria-label="Toggle Menu"
            >
              <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
              <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
              <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
            </button>
          </div>

          <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>
             <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0" />
          </div>

          <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-black">
            <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">
              BAG ({cartCount})
            </span>
            <span onClick={() => {
              if (currentUser) {
                onClose();
                setEcommerceView('profile');
              } else {
                onClose();
                setEcommerceView('auth');
              }
            }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-black/20 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300">
              {currentUser ? 'Account' : 'Log In'}
            </span>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#ffffff] z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
              style={{ pointerEvents: 'auto' }}
            >
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('cocktail'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('editorial'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('grid'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('journey'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('news'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
              <span onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('visit'); }} className="text-black text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
              
              <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('bag'); }} 
                  className="border border-black/20 text-black hover:bg-black hover:text-white rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
                >
                  Bag ({cartCount})
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (currentUser) {
                      onClose();
                      setEcommerceView('profile');
                    } else {
                      onClose();
                      setEcommerceView('auth');
                    }
                  }} 
                  className="bg-black text-white hover:bg-black/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
                >
                  {currentUser ? 'Account' : 'Log In'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-4 md:pt-6 pb-24">
        <div ref={headerRef}>
          <h1 className="font-helvetica font-normal text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-black mb-2 md:mb-4">
            {item.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="md:col-span-7 lg:col-span-8 flex flex-col">
            <div className="w-full bg-[#EAEAEA] overflow-hidden shadow-sm">
              <motion.img 
                style={{ scale: imageScale }} 
                src={item.src || item.image || item.image_url || (item.images && item.images[0])} 
                alt={item.name} 
                className="w-full h-auto object-cover origin-top transform-gpu" 
              />
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <p className="font-helvetica text-sm md:text-base text-black leading-relaxed mb-10">
              {item.description || defaultDesc}
            </p>

            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 rounded-full bg-zinc-300 overflow-hidden shrink-0">
                <img src={item.artist === (settings.artist1_name || 'Mimi') ? (settings.artist1_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80") : (settings.artist2_image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80")} alt={item.artist} className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-helvetica text-lg md:text-xl font-normal text-black">{item.artist}</span>
                  <span className="font-helvetica text-[10px] text-zinc-500 uppercase tracking-widest">• New York</span>
                </div>
                <span onClick={() => { onClose(); setView('editorial'); }} className="font-helvetica text-[10px] md:text-xs text-black uppercase tracking-widest mt-1 cursor-pointer hover:text-[#d92323] transition-colors">+ About Artist</span>
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
          <span className="block font-helvetica text-[10px] text-zinc-500 uppercase tracking-widest mt-4">The Cocktail Interpretation</span>
        </div>

        {moreItems.length > 0 && (
          <div className="w-full mt-24 md:mt-32 pt-12 border-t border-black/20">
            <h3 className="font-helvetica text-3xl md:text-4xl lg:text-5xl text-black mb-8 md:mb-12 tracking-tight">More by {item.artist}</h3>
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
                  <span className="font-helvetica font-bold text-[11px] md:text-xs text-black">"{moreItem.name}"</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
const CocktailMenuItem = ({ menu, i }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const paragraphs = menu.quote ? menu.quote.split('\n\n') : [];
  const shouldTruncate = paragraphs.length > 2;
  const displayParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2);

  return (
    <div key={i} className="w-full flex flex-col md:flex-row min-h-[90vh] relative bg-black py-16 md:py-24">
      
      {/* Left Column (Image & Reference) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 relative group/image">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl flex flex-col">
          <div className="w-full aspect-square bg-[#1C1C1C] overflow-hidden shadow-2xl cursor-pointer">
            <img src={menu.image} alt={menu.title} className="w-full h-full object-cover grayscale opacity-90 group-hover/image:grayscale-0 group-hover/image:opacity-100 transition-all duration-700 ease-out" />
          </div>
          <div className="w-full text-[8px] md:text-[9px] text-zinc-500 text-right font-helvetica uppercase whitespace-pre-wrap mt-3 tracking-wider leading-relaxed">
            {menu.reference}
          </div>
        </div>
      </div>

      {/* Right Column (Text and Actions) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 relative bg-black">
        <div className="font-helvetica font-medium text-xs md:text-sm lg:text-[15px] leading-[1.8] whitespace-pre-wrap max-w-md lg:max-w-lg xl:max-w-xl w-full">
          
          {/* Title & Price */}
          <div className="mb-6 w-full flex justify-between items-baseline border-b border-white/10 pb-4">
            <h2 className="font-helvetica font-bold text-[30px] text-white tracking-tight uppercase leading-[1.2]">
              {menu.title}
            </h2>
            <span className="font-helvetica font-light text-xs md:text-sm text-zinc-500 tracking-widest ml-4 shrink-0">
              {menu.price}
            </span>
          </div>

          {/* Caption */}
          <div className="font-helvetica font-light text-[14px] text-zinc-300 leading-[1.1] whitespace-pre-wrap mb-8 uppercase tracking-wider">
            {menu.caption}
          </div>

          {/* Description Paragraphs without outer double quotes */}
          <div className="space-y-6 text-zinc-300 font-light leading-[1.8] text-xs md:text-sm">
            {displayParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
            
            {shouldTruncate && !isExpanded && (
              <button 
                onClick={() => setIsExpanded(true)} 
                className="group relative text-zinc-300 text-[13px] uppercase tracking-widest hover:text-white transition-colors mt-4"
              >
                + Read full story
                <span className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </button>
            )}
            {isExpanded && (
              <button 
                onClick={() => setIsExpanded(false)} 
                className="group relative text-zinc-300 text-[13px] uppercase tracking-widest hover:text-white transition-colors mt-4"
              >
                - Show less
                <span className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </button>
            )}
          </div>

          <div className="text-right text-xs md:text-sm tracking-wider text-zinc-300 font-helvetica mt-8">
            {menu.artist}
          </div>

        </div>
      </div>
    </div>
  );
};
const CocktailOverlay = ({ onClose, cartCount, setView, setOverlayView, nyTime, currentUser, setEcommerceView, onMenuClick }) => {
  const { cocktails, settings } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  const handleScroll = (e) => {
    if (headerRef.current) {
      setIsSticky(e.target.scrollTop > headerRef.current.offsetHeight - 20);
    }
  };

  const defaultMenus = [
    {
      title: "Sunflowers",
      image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80",
      caption: "A bright, warm, low-ABV cocktail with a refreshing,\neasy drinking character.",
      reference: "Reference: Vincent van Gogh, Sunflowers (1889)",
      quote: "This was my very first painting, from a time when I barely knew how people talked about art. I came from restaurant bartending, not galleries or textbooks.\n\nAfter discovering Van Gogh's Sunflowers and visiting an exhibition in New York inspired by his work, the feeling stayed with me. It quietly sparked the beginning of WAYD.\n\nThis drink follows the painting's direction. Bright in color, warm in energy, and full of life. Its refreshing, low-ABV character feels like a summer afternoon, easy, open, and gently layered.\n\nThis is not just a beverage. It is an experience of light, color, and emotion, and my interpretation of the WAYD style.",
      artist: "Teddy",
      tags: "• Low ABV Light • Honest • Quietly expressive",
      ingredients: "Chinola Passionfruit, Dry Vermouth, Licor 43, Benedictine, Verjus",
      price: "$21"
    },
    {
      title: "Yellow",
      image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=1200&q=80",
      caption: "A cocktail that has undergone a milk-washing\nprocess.",
      reference: "Reference: Coldplay, Yellow (2000)",
      quote: "People often ask about my favorite colors. Yellow has never been one of mine.\n\nYet, when it comes to music, Yellow is the song I return to most.\n\nI chose this drink to launch WAYD because it was with me long before any idea of a menu or a brand existed. During a time when life felt heavy and isolating, I was simply searching for a song that could offer solace. I paused at the title—Yellow—and as it began to play, tears flowed effortlessly.\n\nThe music didn't try to lift me up or promise answers; it simply existed, and that was enough.\n\nThis cocktail captures the essence of that night: soft, warm, and sincere.\n\nA gentle reminder that sometimes, light doesn't make a grand entrance.\n\nIf you've ever wondered who you're doing all of this for, welcome to Yellow...",
      artist: "Mimi",
      tags: "• Warm • Luminous • Spirit-Forward",
      ingredients: "Milk-Washed Nikka days Whiskey, Sake, Honey Pear Tea, Mango, Maple Syrup",
      price: "$23"
    }
  ];

  const menus = cocktails && cocktails.length > 0 ? cocktails.map(c => ({
    title: c.name || '',
    image: c.src || '',
    caption: c.caption || '',
    reference: c.reference || '',
    quote: c.quote || '',
    artist: c.artist || '',
    tags: c.tags || '',
    ingredients: c.ingredients || '',
    price: c.price || ''
  })) : defaultMenus;

  return (
    <div className="fixed inset-0 bg-black z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <nav className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center bg-black/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-32 sm:h-36 md:h-40 px-[8vw]">
        <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { if (typeof onClose === 'function') onClose(); setView('cocktail'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
          <span onClick={() => { if (typeof onClose === 'function') onClose(); setView('editorial'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
          <span onClick={() => { if (typeof onClose === 'function') onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
          <span onClick={() => { if (typeof onClose === 'function') onClose(); setView('journey'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
          <span onClick={() => { if (typeof onClose === 'function') onClose(); setView('news'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
          <span onClick={() => { if (typeof onClose === 'function') onClose(); setView('visit'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
        </div>
        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center z-[1001]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-[#F5F5F5] bg-transparent border-none p-0"
            aria-label="Toggle Menu"
          >
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
            <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
          </button>
        </div>

        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>
           <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { if (typeof onClose === 'function') onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {
              if (typeof onClose === 'function') onClose();
              setEcommerceView('profile');
            } else {
              if (typeof onClose === 'function') onClose();
              setView('auth');
            }
          }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300">
            {currentUser ? 'Account' : 'Log In'}
          </span>
        </div>
      </nav>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
            style={{ pointerEvents: 'auto' }}
          >
            <span onClick={() => { setIsMobileMenuOpen(false); if (typeof onClose === 'function') onClose(); setView('cocktail'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
            <span onClick={() => { setIsMobileMenuOpen(false); if (typeof onClose === 'function') onClose(); setView('editorial'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
            <span onClick={() => { setIsMobileMenuOpen(false); if (typeof onClose === 'function') onClose(); setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
            <span onClick={() => { setIsMobileMenuOpen(false); if (typeof onClose === 'function') onClose(); setView('journey'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
            <span onClick={() => { setIsMobileMenuOpen(false); if (typeof onClose === 'function') onClose(); setView('news'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
            <span onClick={() => { setIsMobileMenuOpen(false); if (typeof onClose === 'function') onClose(); setView('visit'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
            
            <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); if (typeof onClose === 'function') onClose(); setView('catalogue'); setOverlayView('bag'); }} 
                className="border border-white/20 text-[#F5F5F5] hover:bg-white hover:text-black rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
              >
                Bag ({cartCount})
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser) {
                    if (typeof onClose === 'function') onClose();
                    setEcommerceView('profile');
                  } else {
                    if (typeof onClose === 'function') onClose();
                    setView('auth');
                  }
                }} 
                className="bg-white text-black hover:bg-white/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
              >
                {currentUser ? 'Account' : 'Log In'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="w-full pt-[160px] md:pt-[180px] px-[8vw] pb-32 flex flex-col bg-black text-[#F5F5F5]">
        <h1 className="font-helvetica font-bold text-[40px] leading-[0.9] tracking-tight uppercase text-[#F5F5F5] mb-4 md:mb-8">
          MENU
        </h1>

        <div className="w-full pb-24 flex flex-col bg-black text-[#EAEAEA] pointer-events-auto">
          {menus.map((menu, i) => (
            <CocktailMenuItem key={i} menu={menu} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeCatalogueStage = ({ setView, setOverlayView }) => {
  const { catalogue, dbLoading, settings } = useData();
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
            className="text-black font-helvetica text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase"
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
              className="text-black border border-black px-8 py-3 rounded-full font-helvetica text-xs md:text-sm uppercase tracking-widest hover:bg-black hover:text-[#F5F5F5] transition-colors"
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
                    src={item.src || item.image || item.image_url || (item.images && item.images[0])} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale origin-center" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
                </div>
                <h3 className="font-helvetica font-bold text-xs md:text-sm text-black uppercase tracking-wide truncate">{item.name}</h3>
                <p className="font-mono text-xs text-zinc-500 mt-1">${item.price}</p>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

const JourneyOverlay = ({ onClose, cartCount, setView, setOverlayView, nyTime, currentUser, setEcommerceView }) => {
  const { timeline, settings } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  const [customImages, setCustomImages] = useState([
    {
      src: '/bar_award_1.png',
      badge: "ASIA'S 50 BEST BARS 2025",
      rank: '',
      name: 'WAYD',
      location: ''
    },
    {
      src: '/bar_award_2.png',
      badge: "THE BEST BAR IN THAILAND 2025,\nSPONSORED BY AMARO LUCANO",
      rank: '',
      name: 'WAYD',
      location: ''
    },
    {
      src: '/bar_award_3.png',
      badge: "THE WORLD'S 50 BEST BARS 2025",
      rank: '',
      name: 'WAYD',
      location: ''
    }
  ]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    if (files.length === 0) return;

    const newImages = files.map((file, idx) => {
      const url = URL.createObjectURL(file);
      const mockTexts = [
        { badge: "ASIA'S 50 BEST BARS 2025", rank: '', name: 'WAYD', location: '' },
        { badge: 'THE BEST BAR IN THAILAND 2025', rank: '', name: 'WAYD', location: '' },
        { badge: "THE WORLD'S 50 BEST BARS 2025", rank: '', name: 'WAYD', location: '' }
      ];
      return {
        src: url,
        badge: mockTexts[idx]?.badge || 'MEMORIES',
        rank: mockTexts[idx]?.rank || '',
        name: 'MY BAR',
        location: 'MEMORIES'
      };
    });
    setCustomImages(newImages);
  };

  const updateImageText = (index, field, value) => {
    setCustomImages(prev => prev.map((img, i) => i === index ? { ...img, [field]: value } : img));
  };

  const handleScroll = (e) => {
    if (headerRef.current) {
      setIsSticky(e.target.scrollTop > headerRef.current.offsetHeight - 20);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] overflow-y-auto" onScroll={handleScroll}>
      <nav className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center bg-black/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-32 sm:h-36 md:h-40 px-[8vw]">
        <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { onClose(); setView('cocktail'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
          <span onClick={() => { onClose(); setView('editorial'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
          <span onClick={() => { onClose(); setView('journey'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
          <span onClick={() => { onClose(); setView('news'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
          <span onClick={() => { onClose(); setView('visit'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
        </div>
        {/* Hamburger Icon */}
        <div className="md:hidden flex items-center z-[1001]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-[#F5F5F5] bg-transparent border-none p-0"
            aria-label="Toggle Menu"
          >
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
            <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
          </button>
        </div>

        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>
           <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
          <span onClick={() => { onClose(); setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
          <span onClick={() => {
            if (currentUser) {
              onClose();
              setEcommerceView('profile');
            } else {
              onClose();
              setEcommerceView('auth');
            }
          }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300">
            {currentUser ? 'Account' : 'Log In'}
          </span>
        </div>
      </nav>
      {/* Main Content Area */}
      <div className="w-full pt-[160px] md:pt-[180px] px-[8vw] pb-32 flex flex-col bg-black text-[#F5F5F5]">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
              style={{ pointerEvents: 'auto' }}
            >
              <span onClick={() => { setIsMobileMenuOpen(false); setView('home'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Home</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('cocktail'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('editorial'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('journey'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('news'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('visit'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
              
              <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); onClose(); setView('catalogue'); setOverlayView('bag'); }} 
                  className="border border-white/20 text-[#F5F5F5] hover:bg-white hover:text-black rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
                >
                  Bag ({cartCount})
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (currentUser) {
                      onClose();
                      setEcommerceView('profile');
                    } else {
                      onClose();
                      setEcommerceView('auth');
                    }
                  }} 
                  className="bg-white text-black hover:bg-white/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
                >
                  {currentUser ? 'Account' : 'Log In'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full mt-10 md:mt-14 pb-24 flex flex-col bg-black text-[#EAEAEA] pointer-events-auto px-6 md:px-12 lg:px-48">
          <div className="w-full max-w-none grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start pt-16">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="md:col-span-4 flex flex-col items-start pr-0 md:pr-12"
            >
              <h2 className="text-[#F5F5F5] font-helvetica text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.1] tracking-tight uppercase whitespace-pre-wrap">
                {settings?.journey_title || "Our\nJourney"}
              </h2>
              <p className="text-zinc-500 font-helvetica text-xs md:text-sm font-normal tracking-normal mt-3 md:mt-4 max-w-[280px]">
                {settings?.journey_subtitle || "From a shared belief to a permanent canvas"}
              </p>
            </motion.div>
            <div className="md:col-span-8 flex flex-col w-full mt-8 md:mt-0">
              {timeline.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                  className="w-full border-b border-[#333333] flex flex-col lg:flex-row justify-between items-start lg:items-baseline py-5 lg:py-6 gap-2 lg:gap-4 hover:bg-[#1A1A1A] transition-colors duration-300 px-2 lg:px-0"
                >
                  <span className="font-helvetica text-xl md:text-2xl lg:text-[1.8vw] font-normal text-[#F5F5F5] tracking-[-0.03em] leading-tight">{item.name}</span>
                  <span className="font-helvetica text-sm md:text-base font-normal text-zinc-400 lg:text-right whitespace-normal lg:whitespace-nowrap tracking-normal">– {item.desc}, {item.year}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards & Gallery Section */}
        <div className="w-full mt-24 flex flex-col items-center px-0 md:px-4 lg:px-12">

            {/* Dynamic Grid Layout */}
            <div className={`grid gap-6 w-full ${
              customImages.length === 1 ? 'grid-cols-1' : 
              customImages.length === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
            }`}>
              {customImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative aspect-[4/3] md:aspect-square bg-zinc-900 overflow-hidden group flex flex-col justify-between p-6 md:p-8"
                >
                  {/* Image Background */}
                  <img 
                    src={img.src} 
                    alt={`Moment ${idx + 1}`} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700 ease-in-out pointer-events-none" 
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 opacity-95 transition-opacity duration-500 group-hover:opacity-75 pointer-events-none" />


                  {/* Bottom details: No.4, BAR US, BANGKOK */}
                  <div className="relative z-10 w-full flex flex-col items-center gap-2 mt-auto">
                    {img.rank && (
                      <div className="bg-white px-2 py-0.5 shadow-md">
                        <span 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateImageText(idx, 'rank', e.target.innerText)}
                          className="font-helvetica font-black text-[10px] md:text-[12px] text-black uppercase tracking-tight block outline-none cursor-text"
                        >
                          {img.rank}
                        </span>
                      </div>
                    )}

                    {img.name && img.name !== 'WAYD' && (
                      <div className="bg-white px-1 py-[2px] shadow-md leading-none">
                        <span 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateImageText(idx, 'name', e.target.innerText)}
                          className="font-helvetica font-bold text-xl md:text-2xl lg:text-3xl text-black uppercase tracking-wide block leading-none outline-none cursor-text"
                        >
                          {img.name}
                        </span>
                      </div>
                    )}

                    {img.location && (
                      <div className="bg-white px-3 py-1 shadow-md">
                        <span 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateImageText(idx, 'location', e.target.innerText)}
                          className="font-helvetica font-black text-[9px] md:text-[10px] text-black uppercase tracking-widest block outline-none cursor-text"
                        >
                          {img.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FooterStage = ({ onSecretClick }) => {
  const { settings } = useData();
  
  return (
    <div className="w-full bg-black pt-6 pb-16 px-[8vw] flex justify-between items-center border-t border-zinc-900">
      <div className="flex items-center gap-6">
        {/* Instagram */}
        {settings?.social_instagram && (
          <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        )}
        
        {/* Facebook */}
        {settings?.social_facebook && (
          <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
        )}

        {/* TikTok */}
        {settings?.social_tiktok && (
          <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.15-.25-.23V14c0 1.63-.42 3.25-1.28 4.62-1.7 2.77-5.07 4.24-8.29 3.52-3.1-.69-5.54-3.51-5.74-6.68-.3-4.63 3.64-8.81 8.31-8.31.25.03.5.07.75.12V11.2c-.36-.08-.73-.13-1.11-.14-2.18-.08-4.22 1.58-4.57 3.73-.42 2.5 1.48 4.95 3.98 5.11 2.21.14 4.31-1.37 4.7-3.53.07-.4.1-.81.09-1.22V.02z" />
            </svg>
          </a>
        )}

        {/* YouTube */}
        {settings?.social_youtube && (
          <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        )}
      </div>
      
      {/* Hidden staff access dot */}
      <span onClick={onSecretClick} className="cursor-pointer text-zinc-950/20 select-none hover:text-[#d92323] transition-colors" title="Staff Only">.</span>
    </div>
  );
};

const HeroLandingStage = ({ setView, setOverlayView, cartCount, scrollToMenu, currentUser, setEcommerceView }) => {
  const containerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // 1. Clear Area (0 - 600px)
  const gridLineYUp = useTransform(scrollY, [0, 200], ["0vh", "-100vh"]);
  const gridLineYDown = useTransform(scrollY, [0, 200], ["0vh", "100vh"]);
  const gridLineXLeft = useTransform(scrollY, [0, 200], ["0vw", "-100vw"]);
  const gridLineXRight = useTransform(scrollY, [0, 200], ["0vw", "100vw"]);
  const gridOpacity = useTransform(scrollY, [100, 250], [1, 0]);

  const bgScale = useTransform(scrollY, [0, 350], [1, 1.15]);
  const bgBlur = useTransform(scrollY, [0, 350], ["blur(0px)", "blur(20px)"]);
  const bgOpacity = useTransform(scrollY, [100, 400], [1, 0]);

  const navY = useTransform(scrollY, [100, 400], ["0px", "-40px"]);
  const navOpacity = useTransform(scrollY, [100, 300], [1, 0]);

  const subY = useTransform(scrollY, [200, 500], ["0px", "60px"]);
  const subOpacity = useTransform(scrollY, [200, 400], [1, 0]);
  const subBlur = useTransform(scrollY, [200, 500], ["blur(0px)", "blur(10px)"]);

  const bottomY = useTransform(scrollY, [300, 600], ["0px", "80px"]);
  const bottomOpacity = useTransform(scrollY, [300, 500], [1, 0]);
  const bottomBlur = useTransform(scrollY, [300, 600], ["blur(0px)", "blur(10px)"]);

  const pointerEvents = useTransform(scrollY, (v) => v > 500 ? "none" : "auto");
  const visibilityState = useTransform(scrollY, (v) => v > 650 ? "hidden" : "visible");

  // 2. Melt (600 - 1000px)
  const gooeyFilter = useTransform(scrollY, (v) => (v >= 800 && v <= 1400) ? "url(#goo)" : "none");
  const logoBlur = useTransform(scrollY, [800, 950], ["blur(0px)", "blur(5px)"]);
  const meltScaleY = useTransform(scrollY, [800, 1000], [1, 1.6]);
  const logoOpacity = useTransform(scrollY, [900, 1000], [1, 0]);

  // 3. The Drop & Secret Swap (950 - 1400px)
  const dropOpacity = useTransform(scrollY, [900, 1000, 1350, 1400], [0, 1, 1, 0]);
  const dropY = useTransform(scrollY, [950, 1400], ["0vh", "120vh"]);
  const dropScaleY = useTransform(scrollY, [950, 1100, 1400], [1, 3.5, 1]);
  
  // Secret Color Swap mid-air!
  const stageBg = useTransform(scrollY, [1100, 1350], ["#111111", "#F5F5F5"]);
  const dropColor = useTransform(scrollY, [1100, 1350], ["#F5F5F5", "#222222"]);

  // 4. Ink Bleed (1350 - 1650px)
  const bleedMaskSize = useTransform(scrollY, [1350, 1650], ["0vmax 0vmax", "110vmax 110vmax"]);
  const bleedOpacity = useTransform(scrollY, [1350, 1400], [0, 1]);

  return (
    <motion.div ref={containerRef} style={{ backgroundColor: stageBg }} className="w-full h-[280vh] relative">
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
        <motion.nav style={{ opacity: navOpacity, y: navY, pointerEvents, visibility: visibilityState }} className="absolute top-[12%] left-[8vw] right-[8vw] flex justify-between items-center z-50">
            {/* Desktop Links */}
            <div className="hidden md:flex gap-16 md:gap-24">
                <span onClick={() => setView('cocktail')} className="text-[#F5F5F5]/80 text-[9px] md:text-[10px] font-helvetica font-thin capitalize tracking-widest cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
                <span onClick={() => setView('editorial')} className="text-[#F5F5F5]/80 text-[9px] md:text-[10px] font-helvetica font-thin capitalize tracking-widest cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
                <span onClick={() => { setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5]/80 text-[9px] md:text-[10px] font-helvetica font-thin capitalize tracking-widest cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
                <span onClick={() => setView('journey')} className="text-[#F5F5F5]/80 text-[9px] md:text-[10px] font-helvetica font-thin capitalize tracking-widest cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
                <span onClick={() => setView('news')} className="text-[#F5F5F5]/80 text-[9px] md:text-[10px] font-helvetica font-thin capitalize tracking-widest cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
                <span onClick={() => setView('visit')} className="text-[#F5F5F5]/80 text-[9px] md:text-[10px] font-helvetica font-thin capitalize tracking-widest cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
            </div>
            {/* Hamburger Icon */}
            <div className="md:hidden flex items-center z-[1001]">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-[#F5F5F5] bg-transparent border-none p-0"
                aria-label="Toggle Menu"
              >
                <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
                <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
                <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
              </button>
            </div>
            
            <div className="hidden md:flex items-center text-[9px] md:text-[10px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
                <span onClick={() => { setView('catalogue'); setOverlayView('bag'); }} className="text-[#F5F5F5]/80 text-[9px] md:text-[10px] font-helvetica font-thin capitalize tracking-widest cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">
                    BAG ({cartCount})
                </span>
                <span onClick={() => {
                  if (currentUser) {
                    setEcommerceView('profile');
                  } else {
                    setEcommerceView('auth');
                  }
                }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  {currentUser ? 'Account' : 'Log In'}
                </span>
            </div>
        </motion.nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
              style={{ pointerEvents: 'auto' }}
            >
              <span onClick={() => { setIsMobileMenuOpen(false); setView('cocktail'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('editorial'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('journey'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('news'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
              <span onClick={() => { setIsMobileMenuOpen(false); setView('visit'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
              
              <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setView('catalogue'); setOverlayView('bag'); }} 
                  className="border border-white/20 text-[#F5F5F5] hover:bg-white hover:text-black rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
                >
                  Bag ({cartCount})
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (currentUser) {
                      setEcommerceView('profile');
                    } else {
                      setEcommerceView('auth');
                    }
                  }} 
                  className="bg-white text-black hover:bg-white/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
                >
                  {currentUser ? 'Account' : 'Log In'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Melt & Drop Sequence */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            <motion.div style={{ filter: gooeyFilter, WebkitFilter: gooeyFilter }} className="relative w-full mx-auto flex items-center justify-center">
                
                {/* The Drop (Changes color mid-air) */}
                <motion.div className="absolute rounded-full z-0" style={{ backgroundColor: dropColor, width: '40px', height: '40px', top: '50%', marginTop: '-20px', left: '49%', marginLeft: '-20px', y: dropY, scaleY: dropScaleY, opacity: dropOpacity, originY: 0.5 }} />

                {/* Centered Letters (WAYD?) */}
                <motion.div style={{ opacity: logoOpacity, filter: logoBlur, WebkitFilter: logoBlur }} className="relative flex items-center justify-center gap-0 md:gap-4">
                   <motion.img style={{ filter: "brightness(0) invert(1)", scaleY: meltScaleY, originY: 0 }} src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/W.svg" alt="W" className="h-[15vh] md:h-[26vh] object-contain" />
                   <motion.img style={{ filter: "brightness(0) invert(1)", scaleY: meltScaleY, originY: 0 }} src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/A.svg" alt="A" className="h-[15vh] md:h-[26vh] object-contain" />
                   <motion.img style={{ filter: "brightness(0) invert(1)", scaleY: meltScaleY, originY: 0 }} src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/Y.svg" alt="Y" className="h-[15vh] md:h-[26vh] object-contain -ml-4 md:-ml-8" />
                   <motion.img style={{ filter: "brightness(0) invert(1)", scaleY: meltScaleY, originY: 0 }} src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/D.svg" alt="D" className="h-[25vh] md:h-[42vh] object-contain" />
                   <motion.img style={{ filter: "brightness(0) invert(1)", scaleY: meltScaleY, originY: 0 }} src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/question.svg" alt="?" className="h-[15vh] md:h-[26vh] object-contain" />
                   
                   {/* Subtitle positioned absolutely */}
                   <motion.div style={{ opacity: subOpacity, y: subY, filter: subBlur, WebkitFilter: subBlur, visibility: visibilityState }} className="absolute top-[100%] left-0 w-full pl-2 md:pl-4 -mt-10 md:-mt-14 text-left">
                       <p className="text-[9px] md:text-base text-[#F5F5F5] font-helvetica tracking-[0.2em] md:tracking-[0.3em] uppercase whitespace-nowrap">
                           WHAT ARE YOU DRINKING?
                       </p>
                   </motion.div>
                </motion.div>
            </motion.div>
        </div>

        {/* Bottom texts */}
        <motion.div style={{ opacity: bottomOpacity, y: bottomY, filter: bottomBlur, WebkitFilter: bottomBlur, pointerEvents, visibility: visibilityState }} className="absolute bottom-12 left-0 w-full flex items-start z-20">
            {/* Left Block */}
            <div className="flex-1 pl-[8vw] flex flex-col items-start">
                <p className="text-[9px] text-zinc-500 font-helvetica tracking-[0.2em] uppercase leading-none">Lost in time</p>
                <img 
                    src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" 
                    alt="WAYD? WAYD? WAYD?" 
                    className="h-12 mt-2 object-contain"
                    style={{ filter: 'brightness(0) saturate(100%) invert(64%) sepia(21%) saturate(1637%) hue-rotate(331deg) brightness(92%) contrast(89%)' }}
                />
            </div>
            
            {/* Middle Block */}
            <div className="hidden md:flex flex-1 items-start justify-center gap-6">
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-zinc-500 font-helvetica tracking-[0.2em] uppercase leading-none">The bar becomes</span>
                    <span className="text-[9px] text-zinc-500 font-helvetica tracking-[0.2em] uppercase leading-none">The drinks are &nbsp;&nbsp;the work</span>
                </div>
                <div className="w-[80px] h-[1px] bg-zinc-700 mt-1"></div>
                <span className="text-[9px] text-zinc-500 font-helvetica tracking-[0.2em] uppercase leading-none">A (Canvas)</span>
            </div>

            {/* Right Block */}
            <div className="flex-1 pr-[8vw] flex justify-end items-start pointer-events-auto">
                <motion.button 
                    onClick={scrollToMenu}
                    whileHover="hover"
                    initial="initial"
                    animate="animate"
                    variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 15 } }
                    }}
                    className="relative overflow-hidden bg-[#C28256] text-black px-4 py-1.5 md:px-6 md:py-2 text-[8px] md:text-[10px] font-helvetica font-bold tracking-[0.2em] uppercase cursor-pointer leading-none whitespace-nowrap"
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

        {/* Ink Bleed Mask Overlay (Off-Black) */}
        <motion.div 
            className="absolute inset-0 bg-[#222222] z-40 ink-bleed-mask pointer-events-none" 
            style={{ 
                WebkitMaskSize: bleedMaskSize, 
                maskSize: bleedMaskSize, 
                opacity: bleedOpacity, 
                willChange: "mask-size, opacity" 
            }}>
        </motion.div>
      </div>
    </motion.div>
  );
};

const FrontendApp = ({ onSecretClick, onAdminDirectLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings, cocktails } = useData(); 
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const [view, setView] = useState('home');
  const [overlayView, setOverlayView] = useState('grid');
  const [cartItems, setCartItems] = useState([]);
  const [nyTime, setNyTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  // Ecommerce States
  const [ecommerceView, setEcommerceView] = useState(null); // 'checkout', 'success', 'auth', 'profile'
  const [currentUser, setCurrentUser] = useState(null);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  
  const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);

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
    if (view === 'catalogue' || view === 'editorial' || view === 'visit' || view === 'cocktail' || view === 'journey') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [view]);

  const scrollToMenu = () => {
    window.scrollTo({ top: window.innerHeight * 2.8, behavior: 'auto' });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="bg-black text-[#F5F5F5] selection:bg-[#F5F5F5] selection:text-black relative">
      
      {/* --- Preloader removed in favor of Skeleton loading --- */}

      <style dangerouslySetInnerHTML={{__html: `
        .font-helvetica { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; }
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

      {view === 'catalogue' && <CatalogueOverlay onClose={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} overlayView={overlayView} setOverlayView={setOverlayView} nyTime={nyTime} setView={setView} onCheckout={() => { setView('home'); setEcommerceView('checkout'); }} currentUser={currentUser} setEcommerceView={setEcommerceView} />}
      {view === 'editorial' && <EditorialOverlay onClose={() => setView('home')} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} nyTime={nyTime} currentUser={currentUser} setEcommerceView={setEcommerceView} />}
      {view === 'visit' && <VisitOverlay onClose={() => setView('home')} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} nyTime={nyTime} currentUser={currentUser} setEcommerceView={setEcommerceView} />}
      {view === 'cocktail' && <CocktailOverlay onClose={() => setView('home')} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} nyTime={nyTime} currentUser={currentUser} setEcommerceView={setEcommerceView} onMenuClick={setSelectedMenu} />}
      {view === 'journey' && <JourneyOverlay onClose={() => setView('home')} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} nyTime={nyTime} currentUser={currentUser} setEcommerceView={setEcommerceView} />}
      {view === 'news' && <NewsOverlay onClose={() => setView('home')} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} currentUser={currentUser} setEcommerceView={setEcommerceView} />}
      {selectedMenu && <MenuDetailOverlay item={selectedMenu} onClose={() => setSelectedMenu(null)} nyTime={nyTime} onMenuClick={setSelectedMenu} cartCount={cartCount} setView={setView} setOverlayView={setOverlayView} currentUser={currentUser} setEcommerceView={setEcommerceView} />}

      <AnimatePresence>
      {view !== 'catalogue' && view !== 'editorial' && view !== 'visit' && view !== 'cocktail' && view !== 'journey' && view !== 'news' && !selectedMenu && (
        <motion.nav 
          initial={{ y: "0%", opacity: 1 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed top-0 left-0 w-full z-[999] flex justify-between items-center transition-all duration-500 h-32 sm:h-36 md:h-40 px-[8vw] md:px-[8vw] ${
            view === 'home' && !isScrolled
              ? 'bg-transparent backdrop-blur-none shadow-none'
              : 'bg-black/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          }`}
        >
          <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
            <span onClick={() => setView('cocktail')} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Menu</span>
            <span onClick={() => setView('editorial')} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">About</span>
            <span onClick={() => { setView('catalogue'); setOverlayView('grid'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Shop</span>
            <span onClick={() => setView('journey')} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
            <span onClick={() => setView('news')} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">News</span>
            <span onClick={() => setView('visit')} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300">Visit</span>
          </div>
          {/* Hamburger Icon */}
          <div className="md:hidden flex items-center z-[1001]">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="flex flex-col justify-between w-5 h-3 cursor-pointer focus:outline-none text-[#F5F5F5] bg-transparent border-none p-0"
              aria-label="Toggle Menu"
            >
              <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(1px, -1px)' : 'none' }}></span>
              <span className="w-full h-[1px] bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
              <span className="w-full h-[1px] bg-current transition-transform duration-300 origin-left" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(1px, 1px)' : 'none' }}></span>
            </button>
          </div>
          
          <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>
             <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/svgwayd.svg" alt="logo" className="h-20 sm:h-24 md:h-28 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="hidden md:flex items-center text-[9px] sm:text-[10px] md:text-[11px] font-helvetica font-thin capitalize tracking-widest text-[#F5F5F5]/80">
            <span onClick={() => { setView('catalogue'); setOverlayView('bag'); }} className="cursor-pointer hover:text-[#C28256] transition-colors duration-300 mr-4 sm:mr-6 md:mr-8">Bag ({cartCount})</span>
            <span onClick={() => {
              if (currentUser) {
                setEcommerceView('profile');
              } else {
                setEcommerceView('auth');
              }
            }} className="cursor-pointer px-3 py-1 sm:px-4 sm:py-1.5 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300">
              {currentUser ? 'Account' : 'Log In'}
            </span>
          </div>
        </motion.nav>
      )}
      
        {/* Mobile Menu Overlay for Global Nav */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[90] flex flex-col justify-center items-center gap-12 font-helvetica uppercase"
            style={{ pointerEvents: 'auto' }}
          >
            <span onClick={() => { setIsMobileMenuOpen(false); setView('cocktail'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Menu</span>
            <span onClick={() => { setIsMobileMenuOpen(false); setView('editorial'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">About</span>
            <span onClick={() => { setIsMobileMenuOpen(false); setView('catalogue'); setOverlayView('grid'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Shop</span>
            <span onClick={() => { setIsMobileMenuOpen(false); setView('journey'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>
            <span onClick={() => { setIsMobileMenuOpen(false); setView('news'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">News</span>
            <span onClick={() => { setIsMobileMenuOpen(false); setView('visit'); }} className="text-[#F5F5F5] text-2xl font-thin capitalize tracking-widest cursor-pointer">Visit</span>
            
            <div className="flex flex-col gap-4 mt-8 w-full max-w-[280px]">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setView('catalogue'); setOverlayView('bag'); }} 
                className="border border-white/20 text-[#F5F5F5] hover:bg-white hover:text-black rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase transition-all duration-300"
              >
                Bag ({cartCount})
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser) {
                    setEcommerceView('profile');
                  } else {
                    setEcommerceView('auth');
                  }
                }} 
                className="bg-white text-black hover:bg-white/80 rounded-full px-6 py-2.5 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300"
              >
                {currentUser ? 'Account' : 'Log In'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      <div className="w-full flex flex-col relative z-20 bg-black pointer-events-auto">
        {/* Full-Screen Home Video Banner */}
        <div className="w-full h-screen bg-black relative overflow-hidden flex items-center justify-center">
          {settings.homeVideo ? (
            <video 
              key={settings.homeVideo}
              src={settings.homeVideo} 
              className="absolute inset-0 w-full h-full object-cover" 
              autoPlay 
              loop 
              muted 
              playsInline
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center text-zinc-600 uppercase tracking-widest text-xs font-helvetica">
              [ No Video Uploaded - Set in Admin Settings ]
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          
          {/* Scroll Down Indicator */}
          <div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F5F5F5] font-helvetica text-[9px] tracking-[0.25em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer animate-pulse"
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileMenuOpen(true);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span>Explore WAYD?</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7M12 8v12" />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col relative z-20 bg-[#F5F5F5] pointer-events-auto">
        <FooterStage onSecretClick={onSecretClick} />
      </div>

      <AnimatePresence>
        {ecommerceView === 'checkout' && (
          <CheckoutOverlay
            onClose={() => setEcommerceView(null)}
            onReturnToBag={() => {
              setEcommerceView(null);
              setView('catalogue');
              setTimeout(() => setOverlayView('bag'), 50); // slight delay to ensure render
            }}
            cartItems={cartItems}
            cartTotal={cartTotal}
            onSuccess={(details) => {
              setLastOrderDetails(details);
              setCartItems([]);
              setEcommerceView('success');
            }}
          />
        )}
        {ecommerceView === 'success' && (
          <OrderSuccessOverlay
            onClose={() => setEcommerceView(null)}
            orderDetails={lastOrderDetails}
            onSetPassword={async (pwd) => {
              setCurrentUser({ email: lastOrderDetails.email });
              setEcommerceView('profile');
            }}
          />
        )}
        {ecommerceView === 'auth' && (
          <AuthOverlay
            onClose={() => setEcommerceView(null)}
            setView={setView}
            setOverlayView={setOverlayView}
            setEcommerceView={setEcommerceView}
            cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
            currentUser={currentUser}
            onLogin={async (email, password) => {
              const isAdmin = email === 'admin@waydgallery.com' || email === 'admin@wayd.com' || email === 'admin';
              
              if (supabase) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                
                if (isAdmin && onAdminDirectLogin) {
                  setEcommerceView(null);
                  onAdminDirectLogin();
                  return;
                }

                setCurrentUser({
                  email: data.user.email,
                  id: data.user.id,
                  firstName: data.user.user_metadata?.first_name,
                  lastName: data.user.user_metadata?.last_name,
                  username: data.user.user_metadata?.username
                });
              } else {
                if (isAdmin && onAdminDirectLogin) {
                  setEcommerceView(null);
                  onAdminDirectLogin();
                  return;
                }
                setCurrentUser({ email });
              }
            }}
            onRegister={async (email, password, info) => {
              if (supabase) {
                const { data, error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    data: {
                      first_name: info.firstName,
                      last_name: info.lastName,
                      username: info.username
                    }
                  }
                });
                if (error) throw error;
                if (data.user) {
                  setCurrentUser({
                    email: data.user.email,
                    id: data.user.id,
                    firstName: info.firstName,
                    lastName: info.lastName,
                    username: info.username
                  });
                } else {
                  throw new Error('Please check your email for the confirmation link.');
                }
              } else {
                setCurrentUser({
                  email,
                  firstName: info.firstName,
                  lastName: info.lastName,
                  username: info.username
                });
              }
            }}
          />
        )}
        {ecommerceView === 'profile' && (
          <ClientProfileOverlay
            onClose={() => setEcommerceView(null)}
            user={currentUser}
            onLogout={() => { setCurrentUser(null); setEcommerceView(null); }}
            onUpdateUser={setCurrentUser}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

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

const EditableVideo = ({ src, aspect = "aspect-[16/9]", className = "", onUpload }) => {
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
      {src ? (
        <video src={src} className={`w-full h-full object-cover transition-all duration-300 ${isUploading ? 'blur-sm opacity-50' : ''}`} muted loop playsInline autoPlay />
      ) : (
        <div className="w-full h-full bg-[#1C1C1C] flex items-center justify-center text-zinc-500 font-sans text-xs uppercase tracking-widest">
          No Video Uploaded
        </div>
      )}
      {isUploading && (
        <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
          <span className="bg-black/80 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">Uploading...</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <label className="text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          Upload Video
          <input type="file" accept="video/*" className="hidden" onChange={handleFile} disabled={isUploading} />
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
      className={`bg-transparent border-b border-dashed border-transparent hover:border-zinc-300 focus:border-black focus:outline-none transition-colors w-full ${className}`}
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
      className={`bg-transparent border-b border-dashed border-transparent hover:border-zinc-300 focus:border-black focus:outline-none transition-colors w-full resize-none ${className}`}
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
        <button onClick={onCancel} className="absolute top-4 right-4 text-zinc-400 hover:text-black text-xs font-sans uppercase tracking-widest transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="flex flex-col items-center mb-10">
          <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/logo3.svg" alt="WAYD Logo" className="h-12 mb-6" />
          <h2 className="font-sans font-bold text-xl text-black tracking-tight">EDITORIAL STUDIO</h2>
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mt-2">Content Management</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {errorMsg && <div className="bg-red-50 text-red-500 border border-red-200 text-[10px] font-bold uppercase tracking-widest p-3 text-center">{errorMsg}</div>}
          <div className="flex flex-col gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-b border-zinc-300 py-3 font-sans text-sm text-black focus:outline-none focus:border-black transition-colors bg-transparent placeholder-zinc-400" placeholder="Studio Email" required />
          </div>
          <div className="flex flex-col gap-2">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-b border-zinc-300 py-3 font-sans text-sm text-black focus:outline-none focus:border-black transition-colors bg-transparent placeholder-zinc-400" placeholder="Passcode" required />
          </div>
          <button type="submit" disabled={isLoggingIn} className={`w-full font-sans font-semibold text-[11px] uppercase tracking-widest py-4 mt-4 transition-colors ${isLoggingIn ? 'bg-zinc-400 text-white cursor-wait' : 'bg-black text-[#F5F5F5] hover:bg-zinc-800'}`}>
            {isLoggingIn ? 'AUTHENTICATING...' : 'ENTER STUDIO'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminStudioOverview = () => {
  const { cocktails, setCocktails, setSyncStatus, settings, setSettings } = useData();
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
          caption: editingCocktail.caption,
          reference: editingCocktail.reference,
          quote: editingCocktail.quote,
          tags: "",
          ingredients: "",
          price: editingCocktail.price,
          hover_src: "",
          description: "",
          cocktail_images: []
        };
        
        if (typeof editingCocktail.id === 'string' && editingCocktail.id.startsWith('mock_')) {
          const { data, error } = await supabase.from('cocktails').insert([payload]).select();
          if (error) throw error;
          if (data && data[0]) {
             const updatedMenu = [...newMenu];
             const idx = updatedMenu.findIndex(i => i.id === editingCocktail.id);
             if (idx !== -1) {
                 updatedMenu[idx] = data[0];
                 setCocktails(updatedMenu);
                 setEditingCocktail(data[0]);
             }
          }
        } else {
          await supabase.from('cocktails').update(payload).eq('id', editingCocktail.id);
        }
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
  };

  const handleDeleteCocktail = async (e, id, idx) => {
    e.stopPropagation(); 
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && id) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('cocktails').delete().eq('id', id);
        setCocktails(prev => prev.filter(c => c.id !== id));
        if (editingCocktail?.id === id) setEditingCocktail(null);
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Delete error:", e);
        setSyncStatus('Error');
      }
    } else {
      setCocktails(prev => prev.filter((_, i) => i !== idx));
      if (editingCocktail?.id === id) setEditingCocktail(null);
    }
  };

  const handleAddCocktail = async () => {
    const newDrink = {
      name: "New Cocktail",
      artist: "— Teddy",
      src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
      caption: "A short description...",
      reference: "Inspired by...",
      quote: "The full story...",
      price: "$20"
    };

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        const payload = {
          name: newDrink.name,
          artist: newDrink.artist,
          src: newDrink.src,
          caption: newDrink.caption,
          reference: newDrink.reference,
          quote: newDrink.quote,
          tags: "",
          ingredients: "",
          price: newDrink.price,
          hover_src: "",
          description: "",
          cocktail_images: []
        };
        const { data, error } = await supabase.from('cocktails').insert([payload]).select();
        if (error) throw error;
        if (data && data[0]) {
          setCocktails(prev => [...prev, data[0]]);
          setEditingCocktail(data[0]);
          setSyncStatus('Synced');
        }
      } catch(e) {
        console.error("Error adding drink:", e);
        setSyncStatus('Error');
      }
    } else {
      const added = { ...newDrink, id: Date.now() };
      setCocktails(prev => [...prev, added]);
      setEditingCocktail(added);
    }
  };

  return (
    <div className="w-full flex h-[calc(100vh-140px)] overflow-hidden relative">
      {/* Left List Container */}
      <div className={`w-full md:w-1/3 border-r-0 md:border-r border-zinc-200 md:pr-4 flex-col h-full ${editingCocktail ? 'hidden md:flex' : 'flex'}`}>
         <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200 shrink-0">
           <h3 className="font-sans font-bold text-3xl uppercase tracking-wide text-black">Cocktails</h3>
           <span onClick={handleAddCocktail} className="font-sans text-[10px] text-black font-bold uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white border border-black px-3 py-1.5 rounded-full transition-colors">+ Add</span>
         </div>
         
         <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-24">
            {cocktails.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setEditingCocktail(item)} 
                className={`p-4 border border-zinc-200 cursor-pointer flex gap-4 transition-colors ${editingCocktail?.id === item.id ? 'bg-[#F5F5F5] border-black' : 'hover:bg-[#F5F5F5]'}`}
              >
                 <div className="w-16 aspect-[3/4] shrink-0 bg-zinc-200 overflow-hidden">
                   <img src={item.src} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex flex-col justify-center gap-1">
                   <span className="font-sans font-bold text-sm text-black">{item.name}</span>
                   <span className="font-sans text-[10px] text-zinc-500 uppercase">{item.artist}</span>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Right Form Container */}
      <div className={`w-full md:w-2/3 md:pl-8 flex-col h-full overflow-y-auto pb-24 absolute inset-0 bg-white md:static z-50 md:z-auto ${editingCocktail ? 'flex' : 'hidden md:flex'}`}>
         {editingCocktail ? (
           <div className="flex flex-col max-w-2xl px-4 md:px-0">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sticky top-0 bg-white z-10 py-4 border-b border-zinc-200 gap-4 md:gap-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setEditingCocktail(null)} className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <span className="font-sans font-bold text-2xl uppercase tracking-wide">Edit Details</span>
                </div>
                <div className="flex justify-end gap-4 w-full md:w-auto">
                  <button onClick={(e) => handleDeleteCocktail(e, editingCocktail.id, cocktails.findIndex(c => c.id === editingCocktail.id))} className="font-sans text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">Delete</button>
                  <button onClick={handleSaveCocktail} className="font-sans text-[10px] font-bold uppercase tracking-widest bg-black text-white px-4 py-2 hover:bg-black transition-colors rounded-full shadow-md">Save Changes</button>
                </div>
             </div>

             <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Cocktail Name</label>
                    <input type="text" value={editingCocktail.name || ''} onChange={e => setEditingCocktail({...editingCocktail, name: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-3 font-sans text-black focus:outline-none focus:border-black" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Price</label>
                    <input type="text" value={editingCocktail.price || ''} onChange={e => setEditingCocktail({...editingCocktail, price: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-3 font-sans text-black focus:outline-none focus:border-black" placeholder="$21" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Artist</label>
                  <input type="text" value={editingCocktail.artist || ''} onChange={e => setEditingCocktail({...editingCocktail, artist: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-3 font-sans text-black focus:outline-none focus:border-black" placeholder="— Teddy" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Main Image</label>
                  <div className="w-48 aspect-[4/5] ring-1 ring-black/5 shadow-md">
                     <EditableImage src={editingCocktail.src} aspect="h-full" onUpload={(url) => setEditingCocktail({...editingCocktail, src: url})} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Caption (Top Left)</label>
                  <textarea value={editingCocktail.caption || ''} onChange={e => setEditingCocktail({...editingCocktail, caption: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-3 font-mono text-sm text-black focus:outline-none focus:border-black min-h-[100px] whitespace-pre-wrap" placeholder="Inspired by..." />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Reference (Bottom Left)</label>
                  <textarea value={editingCocktail.reference || ''} onChange={e => setEditingCocktail({...editingCocktail, reference: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-3 font-mono text-sm text-black focus:outline-none focus:border-black min-h-[100px] whitespace-pre-wrap" placeholder="Vincent van Gogh, Sunflowers..." />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Main Story / Quote</label>
                  <textarea value={editingCocktail.quote || ''} onChange={e => setEditingCocktail({...editingCocktail, quote: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-4 font-sans font-bold text-xl leading-[1.3] text-black focus:outline-none focus:border-black min-h-[300px] whitespace-pre-wrap" placeholder="This was my very first painting..." />
                </div>

             </div>
           </div>
         ) : (
           <div className="hidden md:flex h-full items-center justify-center">
             <span className="font-sans text-xs uppercase tracking-widest text-zinc-400">Select a cocktail to edit</span>
           </div>
         )}
      </div>
    </div>
  );
};

const AdminStudioEditorials = () => {
  const { settings, setSettings, setSyncStatus } = useData();
  const [activeArtist, setActiveArtist] = useState('1');

  const handleUpdate = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field, value) => {
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        const { error } = await supabase.from('site_settings').update({ [field]: value }).eq('id', 1);
        if (error) throw error;
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
  };

  const tabs = [
    { key: '1', label: settings.artist1_name || 'Mimi (Artist 1)' },
    { key: '2', label: settings.artist2_name || 'Teddy (Artist 2)' }
  ];

  const prefix = `artist${activeArtist}`;

  return (
    <div className="w-full flex flex-col pb-24 h-[calc(100vh-140px)] overflow-y-auto pr-4">
      <div className="flex gap-8 border-b border-zinc-200 mb-8 pb-4 shrink-0">
        {tabs.map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setActiveArtist(tab.key)} 
            className={`font-sans font-bold text-3xl uppercase tracking-wide transition-colors ${activeArtist === tab.key ? 'text-black' : 'text-zinc-300 hover:text-zinc-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 max-w-4xl">
        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Artist Name</label>
          <input 
            type="text" 
            value={settings[`${prefix}_name`] || ''} 
            onChange={(e) => handleUpdate(`${prefix}_name`, e.target.value)}
            onBlur={(e) => handleSave(`${prefix}_name`, e.target.value)}
            className="w-full bg-[#F5F5F5] border border-zinc-200 p-4 font-sans text-black focus:outline-none focus:border-black transition-colors"
            placeholder="e.g. MIMI"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Artist Portrait (Upload Image)</label>
          <div className="w-48">
            <EditableImage 
              src={settings[`${prefix}_image`] || 'https://via.placeholder.com/400x500?text=Upload+Portrait'} 
              aspect="aspect-[4/5]" 
              onUpload={(url, isFinal) => {
                handleUpdate(`${prefix}_image`, url);
                if (isFinal) handleSave(`${prefix}_image`, url);
              }} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Main Quote / Story</label>
          <textarea 
            value={settings[`${prefix}_quote`] || ''} 
            onChange={(e) => handleUpdate(`${prefix}_quote`, e.target.value)}
            onBlur={(e) => handleSave(`${prefix}_quote`, e.target.value)}
            className="w-full bg-[#F5F5F5] border border-zinc-200 p-4 font-sans font-bold text-xl md:text-2xl text-black focus:outline-none focus:border-black transition-colors min-h-[200px] resize-y leading-[1.3]"
            placeholder="“I once believed I had lost my art...”"
          />
          <p className="text-[10px] text-zinc-400 font-sans uppercase tracking-widest">Use Return key for paragraphs.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Subtext / Awards</label>
          <textarea 
            value={settings[`${prefix}_subtext`] || ''} 
            onChange={(e) => handleUpdate(`${prefix}_subtext`, e.target.value)}
            onBlur={(e) => handleSave(`${prefix}_subtext`, e.target.value)}
            className="w-full bg-[#F5F5F5] border border-zinc-200 p-4 font-mono text-sm text-black focus:outline-none focus:border-black transition-colors min-h-[100px] resize-y"
            placeholder="Winner Bar Star Awards..."
          />
        </div>
      </div>
    </div>
  );
};

const AdminStudioCatalogue = () => {
  const { catalogue, setCatalogue, setSyncStatus, settings } = useData();
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
        <h3 className="font-sans font-bold text-2xl tracking-tight uppercase">Objects & Artifacts</h3>
        <span className="font-sans text-[10px] text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-black transition-colors">+ Add Object</span>
      </div>

      <div className="flex flex-col border-t border-zinc-200">
        {catalogue.map((item, idx) => (
          <div key={idx} onClick={() => setEditingItem(item)} className="flex items-center justify-between py-4 border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors group px-2">
            <div className="flex items-center gap-4 w-2/3">
              <div className="w-12 aspect-[4/5] bg-zinc-100 overflow-hidden shrink-0">
                <img src={item.src || item.image || item.image_url || (item.images && item.images[0])} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-sm text-black group-hover:text-[#d92323] transition-colors">{item.name}</span>
                <span className="font-sans text-[10px] text-zinc-400 uppercase tracking-widest mt-1">{item.designer}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-1/3">
              <span className="font-sans font-bold text-sm text-black">${item.price}</span>
              <div className="flex items-center gap-2">
                {Number(item.stock) > 0 ? (
                  <><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="font-sans text-[10px] uppercase tracking-widest text-zinc-500">In Stock ({item.stock})</span></>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="font-sans text-[10px] uppercase tracking-widest text-red-500">Sold Out</span></>
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
              <span className="font-sans font-bold text-2xl uppercase tracking-wide">Edit Object</span>
              <div className="flex gap-6">
                <button onClick={() => setEditingItem(null)} className="font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Cancel</button>
                <button onClick={handleSave} className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#d92323] hover:text-black transition-colors">Save Changes</button>
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
                    {i > 0 && (
                      <button 
                        onClick={() => {
                          const newImgs = editingItem.images.filter((_, index) => index !== i);
                          setEditingItem({...editingItem, images: newImgs});
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove Image"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <div 
                  onClick={() => setEditingItem({...editingItem, images: [...editingItem.images, '']})}
                  className="w-48 aspect-[4/5] shrink-0 snap-center relative group bg-zinc-100 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors border border-dashed border-zinc-300"
                >
                  <span className="text-3xl text-zinc-400 font-light mb-1">+</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Add Image</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <span className="font-sans text-zinc-400 text-[9px] font-bold uppercase tracking-widest">OBJECT NAME</span>
                  <EditableText value={editingItem.name} onChange={v => setEditingItem({...editingItem, name: v})} className="text-xl font-bold font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-zinc-400 text-[9px] font-bold uppercase tracking-widest">PRICE ($)</span>
                  <EditableText value={editingItem.price} onChange={v => setEditingItem({...editingItem, price: v})} className="text-sm font-bold font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-zinc-400 text-[9px] font-bold uppercase tracking-widest">STOCK QTY</span>
                  <EditableText value={editingItem.stock} onChange={v => setEditingItem({...editingItem, stock: v})} className={`text-sm font-bold font-sans ${Number(editingItem.stock) === 0 ? 'text-red-500' : ''}`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-zinc-400 text-[9px] font-bold uppercase tracking-widest">DESIGNER</span>
                  <EditableText value={editingItem.designer} onChange={v => setEditingItem({...editingItem, designer: v})} className="text-sm font-bold font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-zinc-400 text-[9px] font-bold uppercase tracking-widest">YEAR</span>
                  <EditableText value={editingItem.year} onChange={v => setEditingItem({...editingItem, year: v})} className="text-sm font-bold font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-zinc-400 text-[9px] font-bold uppercase tracking-widest">COLOUR</span>
                  <EditableText value={editingItem.colour} onChange={v => setEditingItem({...editingItem, colour: v})} className="text-sm font-bold font-sans" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-zinc-400 text-[9px] font-bold uppercase tracking-widest">MATERIAL</span>
                  <EditableText value={editingItem.material} onChange={v => setEditingItem({...editingItem, material: v})} className="text-sm font-bold font-sans" />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <span className="font-sans text-zinc-400 text-[9px] font-bold uppercase tracking-widest">INFO / DESCRIPTION</span>
                  <EditableTextArea value={editingItem.info} onChange={v => setEditingItem({...editingItem, info: v})} className="text-sm font-bold font-sans" />
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

  const [selectedOrderId, setSelectedOrder] = useState(null); // start null for mobile view
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 shrink-0">
        <div className="p-4 md:p-6 border border-black/10 flex flex-col gap-1">
          <span className="font-sans text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">Orders Today</span>
          <span className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-black mt-2">{stats.today}</span>
        </div>
        <div className="p-4 md:p-6 border border-black/10 flex flex-col gap-1">
          <span className="font-sans text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">Total Revenue</span>
          <span className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-black mt-2">${stats.revenue}</span>
        </div>
        <div className="bg-black p-4 md:p-6 flex flex-col gap-1">
          <span className="font-sans text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">To Fulfill</span>
          <div className="flex items-center gap-3 mt-2">
             <span className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-[#F5F5F5]">{stats.toFulfill}</span>
             {stats.toFulfill > 0 && <span className="w-2 h-2 rounded-none bg-white animate-pulse"></span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 border border-black/10 overflow-hidden bg-white">
        
        {/* Left Panel: List */}
        <div className={`w-full md:w-1/3 border-r-0 md:border-r border-black/10 flex flex-col ${selectedOrderId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-black/10 flex gap-4 overflow-x-auto shrink-0 hide-scrollbar bg-white">
             {['All', 'Pending', 'Processing', 'Shipped'].map(f => (
               <button 
                 key={f} 
                 onClick={() => setFilter(f)} 
                 className={`font-sans text-[9px] font-bold uppercase tracking-widest pb-1 transition-colors whitespace-nowrap ${filter === f ? 'text-black border-b border-black' : 'text-[#a0a0a0] hover:text-black'}`}
               >
                 {f}
               </button>
             ))}
          </div>
          
          <div className="flex flex-col overflow-y-auto flex-1">
            {filteredOrders.length === 0 ? (
               <div className="p-8 text-center font-sans text-[11px] text-[#a0a0a0] font-bold uppercase tracking-widest">No orders found</div>
            ) : (
              filteredOrders.map((order, idx) => (
                <div key={idx} onClick={() => setSelectedOrder(order.id)} className={`p-4 border-b border-black/10 cursor-pointer transition-colors flex flex-col gap-3 ${selectedOrderId === order.id ? 'bg-[#F5F5F5] border-l-2 border-l-[#111111]' : 'hover:bg-[#F5F5F5] bg-white border-l-2 border-l-transparent'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans font-bold text-[12px] tracking-tight text-black">{order.id}</span>
                      <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#a0a0a0]">{order.customer}</span>
                    </div>
                    <span className="font-sans font-bold text-[12px] text-black">${order.total}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-sans text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">{order.date}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${order.status === 'Shipped' ? 'border-black bg-black text-white' : 'border-black/20 text-black'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right Panel: Detail */}
        <div className={`w-full md:w-2/3 bg-white overflow-y-auto flex-col relative ${selectedOrderId ? 'flex' : 'hidden md:flex'}`}>
          {selectedOrder ? (
            <div className="flex flex-col">
              <div className="sticky top-0 bg-white border-b border-black/10 p-4 md:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 z-20">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedOrder(null)} className="md:hidden text-black font-sans text-[9px] font-bold uppercase tracking-widest hover:underline underline-offset-4 decoration-1 mr-2">
                    {"< BACK"}
                  </button>
                  <h4 className="font-sans font-bold text-lg md:text-xl tracking-tight text-black uppercase">{selectedOrder.id}</h4>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${selectedOrder.status === 'Shipped' ? 'border-black bg-black text-white' : 'border-black/20 text-black'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="hidden sm:block px-4 py-2 border border-black/20 hover:border-black text-black font-sans text-[9px] font-bold uppercase tracking-widest transition-colors">
                    PRINT INVOICE
                  </button>
                  {selectedOrder.status === 'Pending' && (
                    <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Processing')} className="bg-black hover:bg-[#333333] text-white font-sans text-[9px] font-bold uppercase tracking-widest px-4 py-2 transition-colors">
                      MARK PROCESSING
                    </button>
                  )}
                  {selectedOrder.status === 'Shipped' && (
                    <button className="px-4 py-2 border border-black/20 hover:border-red-500 hover:text-red-500 text-black font-sans text-[9px] font-bold uppercase tracking-widest transition-colors">
                      REFUND
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 md:p-8 lg:p-12 flex flex-col gap-12 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="flex flex-col gap-4">
                    <span className="font-sans text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest border-b border-black/10 pb-2">CUSTOMER</span>
                    <div className="flex flex-col gap-1 text-[11px] font-sans font-thin capitalize tracking-widest text-black">
                      <span>{selectedOrder.customer}</span>
                      <a href={`mailto:${selectedOrder.email}`} className="text-[#a0a0a0] hover:text-black transition-colors">{selectedOrder.email}</a>
                      <a href={`tel:${selectedOrder.phone}`} className="text-[#a0a0a0] hover:text-black transition-colors">{selectedOrder.phone}</a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="font-sans text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest border-b border-black/10 pb-2">SHIPPING ADDRESS</span>
                    <p className="text-[11px] font-sans font-thin capitalize tracking-widest text-black leading-relaxed">
                      {(selectedOrder.address || '').split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-sans text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest border-b border-black/10 pb-2">ITEMS ({selectedOrder.items.length})</span>
                  <div className="flex flex-col">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start py-4 border-b border-black/10">
                        <div className="flex gap-4 items-start">
                          <div className="w-16 aspect-[4/5] bg-[#F5F5F5] border border-black/10 flex justify-center items-center font-sans text-[9px] text-[#a0a0a0] font-bold uppercase">IMG</div>
                          <div className="flex flex-col gap-1">
                            <span className="font-sans font-bold text-[12px] tracking-tight text-black">"{item.name}"</span>
                            <span className="font-sans text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">QTY: 0{item.qty}</span>
                          </div>
                        </div>
                        <span className="font-sans font-bold text-[12px] text-black">${item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4 bg-[#F5F5F5] p-6 border border-black/10">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SUBTOTAL</span>
                      <span className="font-sans text-black text-[12px] font-bold tracking-tight">${selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">SHIPPING</span>
                      <span className="font-sans text-black text-[12px] font-bold tracking-tight">FREE</span>
                    </div>
                    <div className="w-full h-[1px] bg-black/10 my-2"></div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-sans font-bold text-[12px] uppercase text-black">TOTAL</span>
                      <span className="font-sans font-bold text-2xl tracking-tight text-black">${selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-sans text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest border-b border-black/10 pb-2">FULFILLMENT</span>
                  
                  {selectedOrder.status !== 'Shipped' ? (
                    <div className="flex flex-col gap-4">
                      <p className="font-sans font-bold text-[11px] uppercase tracking-widest text-[#a0a0a0]">ENTER TRACKING NUMBER TO FULFILL THIS ORDER</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. TRK123456789" 
                          className="flex-1 bg-white border border-black/20 px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-black placeholder:text-[#a0a0a0]"
                          id={`tracking-${selectedOrder.id}`}
                        />
                        <button 
                          onClick={() => {
                            const val = document.getElementById(`tracking-${selectedOrder.id}`).value;
                            if(val) handleSaveTracking(selectedOrder.id, val);
                          }} 
                          className="bg-black hover:bg-[#333333] text-white font-sans text-[9px] font-bold uppercase tracking-widest px-8 py-3 sm:py-0 transition-colors whitespace-nowrap"
                        >
                          FULFILL ORDER
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-6 border border-black bg-white">
                      <div className="flex items-center gap-2 text-black">
                        <span className="font-sans font-bold text-[11px] uppercase tracking-widest">ORDER FULFILLED</span>
                      </div>
                      <div className="flex gap-2 mt-2 items-center">
                        <span className="font-sans text-[9px] text-[#a0a0a0] font-bold uppercase tracking-widest">TRACKING NO:</span>
                        <span className="font-sans font-bold text-[11px] uppercase tracking-widest text-black">{selectedOrder.tracking}</span>
                        <button className="ml-2 px-2 py-1 text-[8px] border border-black/20 hover:border-black font-sans font-thin capitalize tracking-widest">UPDATE</button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center font-sans text-[#a0a0a0] text-[9px] font-bold uppercase tracking-widest">
              SELECT AN ORDER TO VIEW DETAILS
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminStudioTimeline = () => {
  const { timeline, setTimeline, setSyncStatus, settings, setSettings } = useData();
  const [editingEvent, setEditingEvent] = useState(null);

  const handleUpdateSetting = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSetting = async (field, value) => {
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('site_settings').update({ [field]: value }).eq('id', 1);
        setSyncStatus('Synced');
      } catch(e) {
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
  };

  const handleSaveEvent = async () => {
    const newTimeline = [...timeline];
    const idx = newTimeline.findIndex(i => i.id === editingEvent.id);
    if (idx !== -1) {
      newTimeline[idx] = editingEvent;
      setTimeline(newTimeline);
    }

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && editingEvent.id) {
      setSyncStatus('Saving...');
      try {
        const payload = {
          year: editingEvent.year,
          name: editingEvent.name,
          desc: editingEvent.desc
        };
        
        if (typeof editingEvent.id === 'string' && editingEvent.id.startsWith('mock_')) {
          const { data, error } = await supabase.from('timeline').insert([payload]).select();
          if (error) throw error;
          if (data && data[0]) {
             const updatedTimeline = [...newTimeline];
             const idx = updatedTimeline.findIndex(i => i.id === editingEvent.id);
             if (idx !== -1) {
                 updatedTimeline[idx] = data[0];
                 setTimeline(updatedTimeline);
                 setEditingEvent(data[0]);
             }
          }
        } else {
          const { error } = await supabase.from('timeline').update(payload).eq('id', editingEvent.id);
          if (error) throw error;
        }
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
  };

  const handleDeleteEvent = async (e, id, idx) => {
    e.stopPropagation(); 
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && id) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('timeline').delete().eq('id', id);
        setTimeline(prev => prev.filter(c => c.id !== id));
        if (editingEvent?.id === id) setEditingEvent(null);
        setSyncStatus('Synced');
      } catch(e) { 
        console.error("Delete error:", e);
        setSyncStatus('Error');
      }
    } else {
      setTimeline(prev => prev.filter((_, i) => i !== idx));
      if (editingEvent?.id === id) setEditingEvent(null);
    }
  };

  const handleAddEvent = async () => {
    const newNode = { name: "New Event Title", desc: "Event description...", year: "Year" };

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        const { data, error } = await supabase.from('timeline').insert([newNode]).select();
        if (error) throw error;
        if (data && data[0]) {
          setTimeline(prev => [...prev, data[0]]);
          setEditingEvent(data[0]);
          setSyncStatus('Synced');
        }
      } catch(e) {
        console.error("Error adding event:", e);
        setSyncStatus('Error');
      }
    } else {
      const added = { ...newNode, id: Date.now() };
      setTimeline(prev => [...prev, added]);
      setEditingEvent(added);
    }
  };

  return (
    <div className="w-full flex h-[calc(100vh-140px)] overflow-hidden relative">
      {/* Left List Container */}
      <div className={`w-full md:w-1/3 border-r-0 md:border-r border-zinc-200 md:pr-4 flex-col h-full ${editingEvent ? 'hidden md:flex' : 'flex'}`}>
         <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200 shrink-0">
           <h3 className="font-sans font-bold text-3xl uppercase tracking-wide text-black">Timeline</h3>
           <span onClick={handleAddEvent} className="font-sans text-[10px] text-black font-bold uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white border border-black px-3 py-1.5 rounded-full transition-colors">+ Add</span>
         </div>
         
         <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-24">
            <div className="flex flex-col gap-4 p-4 border border-zinc-200 bg-[#F5F5F5]/50 mb-4 rounded-sm">
              <span className="font-sans font-black text-[10px] text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2">Page Header Settings</span>
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Main Title (Use Enter for new line)</span>
                <EditableTextArea 
                  value={settings.journey_title || "Our\nJourney"} 
                  onSave={v => { handleUpdateSetting('journey_title', v); handleSaveSetting('journey_title', v); }} 
                  className="font-sans text-base font-bold bg-white border border-zinc-200 p-2 rounded-sm" 
                  rows={2} 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Subtitle</span>
                <EditableTextArea 
                  value={settings.journey_subtitle || "From a shared belief to a permanent canvas"} 
                  onSave={v => { handleUpdateSetting('journey_subtitle', v); handleSaveSetting('journey_subtitle', v); }} 
                  className="font-sans text-xs bg-white border border-zinc-200 p-2 rounded-sm" 
                  rows={2} 
                />
              </div>
            </div>

            {timeline.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setEditingEvent(item)} 
                className={`p-4 border border-zinc-200 cursor-pointer flex flex-col gap-1 transition-colors ${editingEvent?.id === item.id ? 'bg-[#F5F5F5] border-black' : 'hover:bg-[#F5F5F5]'}`}
              >
                 <span className="font-sans font-bold text-lg text-black">{item.year}</span>
                 <span className="font-sans text-xs text-zinc-500 uppercase tracking-widest">{item.name}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Right Form Container */}
      <div className={`w-full md:w-2/3 md:pl-8 flex-col h-full overflow-y-auto pb-24 absolute inset-0 bg-white md:static z-50 md:z-auto ${editingEvent ? 'flex' : 'hidden md:flex'}`}>
         {editingEvent ? (
           <div className="flex flex-col max-w-2xl px-4 md:px-0">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sticky top-0 bg-white z-10 py-4 border-b border-zinc-200 gap-4 md:gap-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setEditingEvent(null)} className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <span className="font-sans font-bold text-2xl uppercase tracking-wide">Edit Event</span>
                </div>
                <div className="flex justify-end gap-4 w-full md:w-auto">
                  <button onClick={(e) => handleDeleteEvent(e, editingEvent.id, timeline.findIndex(c => c.id === editingEvent.id))} className="font-sans text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">Delete</button>
                  <button onClick={handleSaveEvent} className="font-sans text-[10px] font-bold uppercase tracking-widest bg-black text-white px-4 py-2 hover:bg-black transition-colors rounded-full shadow-md">Save Changes</button>
                </div>
             </div>

             <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Year</label>
                    <input type="text" value={editingEvent.year || ''} onChange={e => setEditingEvent({...editingEvent, year: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-3 font-sans text-black focus:outline-none focus:border-black" placeholder="e.g. 2025" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Event Title</label>
                    <input type="text" value={editingEvent.name || ''} onChange={e => setEditingEvent({...editingEvent, name: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-3 font-sans text-black focus:outline-none focus:border-black" placeholder="New Event Title" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">Event Description</label>
                  <textarea value={editingEvent.desc || ''} onChange={e => setEditingEvent({...editingEvent, desc: e.target.value})} className="w-full bg-[#F5F5F5] border border-zinc-200 p-4 font-sans text-sm leading-[1.6] text-black focus:outline-none focus:border-black min-h-[200px] whitespace-pre-wrap" placeholder="Describe the event..." />
                </div>
             </div>
           </div>
         ) : (
           <div className="hidden md:flex h-full items-center justify-center">
             <span className="font-sans text-xs uppercase tracking-widest text-zinc-400">Select an event to edit</span>
           </div>
         )}
      </div>
    </div>
  );
};

const AdminStudioBanner = () => {
  const { settings, setSettings, setSyncStatus } = useData();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    if (supabaseUrl === 'YOUR_SUPABASE_URL' || !supabase) {
      setBanners([settings.homeVideo]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.storage.from('WAYD-gallery').list('uploads', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });
      if (error) throw error;
      
      const videoFiles = data.filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return ['mp4', 'mov', 'webm'].includes(ext);
      });
      
      const urls = videoFiles.map(file => {
        const { data: urlData } = supabase.storage.from('WAYD-gallery').getPublicUrl(`uploads/${file.name}`);
        return urlData.publicUrl;
      });
      
      if (settings.homeVideo && !urls.includes(settings.homeVideo)) {
        urls.push(settings.homeVideo);
      }
      
      setBanners(urls);
    } catch (e) {
      console.error("Error fetching banners:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSetLive = async (url) => {
    setSettings(prev => ({ ...prev, homeVideo: url }));
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && settings.id) {
      setSyncStatus('Saving...');
      try {
        await supabase.from('site_settings').update({ home_video: url }).eq('id', settings.id);
        setSyncStatus('Synced');
      } catch (e) { 
        console.error("Save error:", e); 
        setSyncStatus('Error');
      }
    }
  };

  const handleDelete = async (url) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    
    // Extract filename from URL
    const filename = url.split('/').pop();
    
    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Deleting...');
      try {
        const { error } = await supabase.storage.from('WAYD-gallery').remove([`uploads/${filename}`]);
        if (error) throw error;
        
        setBanners(prev => prev.filter(b => b !== url));
        setSyncStatus('Deleted');
        setTimeout(() => setSyncStatus('Synced'), 2000);
      } catch (e) {
        console.error("Delete error:", e);
        setSyncStatus('Error');
      }
    } else {
      setBanners(prev => prev.filter(b => b !== url));
    }
  };

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
        setUploading(true);
        const publicUrl = await uploadImageToSupabase(file);
        if (publicUrl) {
           await fetchBanners();
           handleSetLive(publicUrl);
        }
        setUploading(false);
      } else {
        const tempUrl = URL.createObjectURL(file);
        setBanners([tempUrl, ...banners]);
        handleSetLive(tempUrl);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pb-24">
      <div className="flex justify-between items-end mb-12 border-b border-zinc-200 pb-4">
        <h3 className="font-sans font-bold text-4xl tracking-wide uppercase text-black">Banner Gallery</h3>
        <label className="cursor-pointer bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#d92323] transition-colors relative text-center min-w-[200px]">
           {uploading ? 'UPLOADING...' : 'UPLOAD NEW VIDEO'}
           <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>
      
      {loading ? (
        <div className="w-full py-20 flex justify-center items-center font-sans text-zinc-400 text-sm tracking-widest uppercase">Loading Gallery...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {banners.map((url, idx) => {
            const isLive = settings.homeVideo === url;
            return (
              <div key={idx} className={`relative flex flex-col gap-3 p-4 border ${isLive ? 'border-[#d92323] bg-red-50/20' : 'border-zinc-200'} transition-all`}>
                 <div className="relative w-full aspect-[16/9] bg-black overflow-hidden">
                    <video src={url} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                    {isLive && (
                      <div className="absolute top-3 left-3 bg-[#d92323] text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                         LIVE NOW
                      </div>
                    )}
                 </div>
                 <div className="flex justify-between items-center mt-2">
                    <div className="truncate text-xs font-mono text-zinc-500 max-w-[60%]">
                       {url.split('/').pop().substring(0, 20)}...
                    </div>
                    {!isLive && (
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleDelete(url)} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-[#d92323] transition-colors">
                          Delete
                        </button>
                        <button onClick={() => handleSetLive(url)} className="text-xs font-bold uppercase tracking-widest text-black hover:text-[#d92323] transition-colors">
                          Set as Live
                        </button>
                      </div>
                    )}
                 </div>
              </div>
            );
          })}
          {banners.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-zinc-300 text-zinc-400">
               <span className="font-sans text-sm tracking-widest uppercase mb-2">No videos found</span>
               <span className="font-sans text-xs">Upload a video to build your banner gallery</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const AdminStudioNews = () => {
  const { news, setNews, setSyncStatus } = useData();
  const [editingItem, setEditingItem] = useState(null);

  const handleAddNew = async () => {
    const newItem = { 
      title: "New Article Title", 
      subtitle: "Article Subtitle", 
      category: "NEWS", 
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }), 
      content: "Article content goes here...", 
      hashtag: "#waydgallery #artailstory", 
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80" 
    };

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      setSyncStatus('Saving...');
      try {
        const { data, error } = await supabase.from('news').insert([newItem]).select();
        if (error) throw error;
        if (data && data[0]) {
          setNews(prev => [data[0], ...prev]);
          setEditingItem(data[0]);
          setSyncStatus('Synced');
        }
      } catch(e) {
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    } else {
      const mockId = 'mock_' + Date.now();
      const mockItem = { id: mockId, ...newItem };
      setNews(prev => [mockItem, ...prev]);
      setEditingItem(mockItem);
    }
  };

  const handleUpdate = (field, value) => {
    if (editingItem) {
      setEditingItem(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveItem = async (field, value) => {
    if (!editingItem) return;
    
    const updatedItem = field ? { ...editingItem, [field]: value } : editingItem;
    
    const newNews = [...news];
    const idx = newNews.findIndex(i => i.id === updatedItem.id);
    if (idx !== -1) {
      newNews[idx] = updatedItem;
      setNews(newNews);
    }

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      if (typeof updatedItem.id === 'string' && updatedItem.id.startsWith('mock_')) return;
      setSyncStatus('Saving...');
      try {
        const payload = {
          title: updatedItem.title,
          subtitle: updatedItem.subtitle,
          category: updatedItem.category,
          date: updatedItem.date,
          content: updatedItem.content,
          image: updatedItem.image,
          hashtag: updatedItem.hashtag,
          video: updatedItem.video
        };
        const { error } = await supabase.from('news').update(payload).eq('id', updatedItem.id);
        if (error) throw error;
        setSyncStatus('Synced');
      } catch(e) {
        console.error("Save error:", e);
        setSyncStatus('Error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      setNews(prev => prev.filter(i => i.id !== id));
      if (editingItem?.id === id) setEditingItem(null);
      if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase && typeof id !== 'string') {
        setSyncStatus('Saving...');
        try {
          const { error } = await supabase.from('news').delete().eq('id', id);
          if (error) throw error;
          setSyncStatus('Synced');
        } catch(e) {
          console.error("Delete error:", e);
          setSyncStatus('Error');
        }
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pb-24">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0 mb-8 md:mb-12 border-b border-zinc-200 pb-4">
        <h3 className="font-sans font-bold text-2xl md:text-4xl tracking-wide uppercase text-black">News & Announcements</h3>
        <button onClick={handleAddNew} className="bg-black text-white px-4 md:px-6 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shrink-0">
          + Add Article
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Col: List */}
        <div className={`w-full md:w-1/3 flex-col gap-2 ${editingItem ? 'hidden md:flex' : 'flex'}`}>
          {news.map(item => (
            <div 
              key={item.id} 
              onClick={() => setEditingItem(item)}
              className={`flex flex-col p-4 border cursor-pointer transition-all duration-300 ${editingItem?.id === item.id ? 'border-black bg-zinc-100' : 'border-zinc-200 hover:border-black/40 bg-white'}`}
            >
              <span className="font-sans font-bold text-sm uppercase truncate">{item.title}</span>
              <span className="font-sans text-[10px] text-zinc-500 uppercase mt-1">{item.date}</span>
            </div>
          ))}
          {news.length === 0 && <span className="text-xs text-zinc-400 uppercase italic">No news articles</span>}
        </div>

        {/* Right Col: Editor */}
        <div className={`w-full md:w-2/3 flex-col ${editingItem ? 'flex' : 'hidden md:flex'}`}>
          {editingItem ? (
            <div className="flex flex-col gap-6 p-6 border border-zinc-200 bg-white relative">
              <div className="flex justify-between items-center md:hidden mb-2">
                <button 
                  onClick={() => setEditingItem(null)}
                  className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
                >
                  &larr; Back to List
                </button>
              </div>

              <button 
                onClick={() => handleDelete(editingItem.id)} 
                className="absolute top-6 right-6 text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-700 transition-colors"
              >
                Delete
              </button>

              <div className="flex flex-col gap-1.5 w-full md:w-3/4">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Category</span>
                 <EditableText value={editingItem.category} onSave={v => { handleUpdate('category', v); handleSaveItem('category', v); }} className="font-sans text-sm text-black border-b border-dashed border-zinc-300" />
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-3/4">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Date</span>
                 <EditableText value={editingItem.date} onSave={v => { handleUpdate('date', v); handleSaveItem('date', v); }} className="font-sans text-sm text-black border-b border-dashed border-zinc-300" />
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Main Title</span>
                 <EditableTextArea value={editingItem.title} onSave={v => { handleUpdate('title', v); handleSaveItem('title', v); }} className="font-sans text-2xl font-black text-black border-b border-dashed border-zinc-300" rows={1} />
              </div>

              <div className="flex flex-col gap-1.5">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Subtitle</span>
                 <EditableTextArea value={editingItem.subtitle} onSave={v => { handleUpdate('subtitle', v); handleSaveItem('subtitle', v); }} className="font-sans text-sm text-zinc-600 border-b border-dashed border-zinc-300" rows={1} />
              </div>


              <div className="flex flex-col gap-1.5 mt-2">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Hashtags</span>
                 <EditableText value={editingItem.hashtag} onSave={v => { handleUpdate('hashtag', v); handleSaveItem('hashtag', v); }} className="font-sans text-sm text-black border-b border-dashed border-zinc-300" />
                 <span className="text-[9px] text-zinc-400 uppercase">Separate with spaces (e.g. #waydgallery #artailstory)</span>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Article Content</span>
                 <EditableTextArea value={editingItem.content} onSave={v => { handleUpdate('content', v); handleSaveItem('content', v); }} className="font-sans text-xs text-zinc-600 border border-zinc-200 p-2" rows={8} />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                 <span className="font-sans font-black text-sm text-black uppercase">Cover Photo</span>
                 <EditableImage 
                   src={editingItem.image} 
                   aspect="aspect-[4/3]" 
                   onUpload={(url, isFinal) => {
                     handleUpdate('image', url);
                     if (isFinal) handleSaveItem('image', url);
                   }} 
                 />
                 <span className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Suggested Aspect Ratio: 4:3 (Landscape)</span>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                 <span className="font-sans font-black text-sm text-black uppercase">Cover Video (Optional)</span>
                 <EditableVideo 
                   src={editingItem.video} 
                   aspect="aspect-[4/3]" 
                   onUpload={(url, isFinal) => {
                     handleUpdate('video', url);
                     if (isFinal) handleSaveItem('video', url);
                   }} 
                 />
                 <span className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Upload an MP4/WebM video to play instead of the photo.</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border border-dashed border-zinc-300 bg-zinc-50">
               <span className="text-zinc-400 text-sm font-sans uppercase tracking-widest font-bold">Select an article to edit</span>
            </div>
          )}
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
      phone: 'phone',
      homeVideo: 'home_video',
      social_facebook: 'social_facebook',
      social_instagram: 'social_instagram',
      social_tiktok: 'social_tiktok',
      social_youtube: 'social_youtube'
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
        <h3 className="font-sans font-bold text-4xl tracking-wide uppercase text-black">Visit</h3>
      </div>

      <div className="flex flex-col gap-8">
         <span className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2">01. Visit Us (Location & Hours)</span>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            <div className="flex flex-col gap-10">
               <div className="flex flex-col gap-2">
                 <span className="font-sans font-black text-xl text-black uppercase">ADDRESS</span>
                 <EditableTextArea value={settings.address || ''} onSave={v => { handleUpdate('address', v); handleSave('address', v); }} className="font-sans text-sm text-zinc-600 leading-relaxed bg-transparent" />
               </div>
               
               <div className="flex flex-col gap-2">
                 <span className="font-sans font-black text-xl text-black uppercase">CONTACT</span>
                 <div className="flex items-center gap-4 mt-2">
                     <span className="text-xs font-bold text-zinc-400 w-12 uppercase tracking-widest">EMAIL</span>
                     <EditableText value={settings.email} onSave={v => { handleUpdate('email', v); handleSave('email', v); }} className="text-sm text-zinc-600 bg-transparent" />
                 </div>
                 <div className="flex items-center gap-4 mt-2">
                     <span className="text-xs font-bold text-zinc-400 w-12 uppercase tracking-widest">PHONE</span>
                     <EditableText value={settings.phone} onSave={v => { handleUpdate('phone', v); handleSave('phone', v); }} className="text-sm text-zinc-600 bg-transparent" />
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col">
                 <span className="font-sans font-black text-xl text-black uppercase mb-4">VISIT BANNER IMAGE</span>
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
      </div>

      <div className="flex flex-col gap-8 mt-16">
         <span className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2">02. Google Map Integration & Location Coordinates</span>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            <div className="flex flex-col gap-2">
               <span className="font-sans font-black text-xl text-black uppercase">GOOGLE MAP EMBED URL (IFRAME SRC)</span>
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

      <div className="flex flex-col gap-8 mt-16">
         <span className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2">03. Social Media Links</span>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            <div className="flex flex-col gap-1.5 w-full md:w-3/4">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Instagram URL</span>
               <EditableText value={settings.social_instagram} onSave={v => { handleUpdate('social_instagram', v); handleSave('social_instagram', v); }} className="font-sans text-sm text-black border-b border-dashed border-zinc-300" />
               <span className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Leave empty to hide icon</span>
            </div>
            <div className="flex flex-col gap-1.5 w-full md:w-3/4">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Facebook URL</span>
               <EditableText value={settings.social_facebook} onSave={v => { handleUpdate('social_facebook', v); handleSave('social_facebook', v); }} className="font-sans text-sm text-black border-b border-dashed border-zinc-300" />
               <span className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Leave empty to hide icon</span>
            </div>
            <div className="flex flex-col gap-1.5 w-full md:w-3/4">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">TikTok URL</span>
               <EditableText value={settings.social_tiktok} onSave={v => { handleUpdate('social_tiktok', v); handleSave('social_tiktok', v); }} className="font-sans text-sm text-black border-b border-dashed border-zinc-300" />
               <span className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Leave empty to hide icon</span>
            </div>
            <div className="flex flex-col gap-1.5 w-full md:w-3/4">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">YouTube URL</span>
               <EditableText value={settings.social_youtube} onSave={v => { handleUpdate('social_youtube', v); handleSave('social_youtube', v); }} className="font-sans text-sm text-black border-b border-dashed border-zinc-300" />
               <span className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Leave empty to hide icon</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const AdminLayout = ({ onLogout }) => {
  const { syncStatus, settings } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  
  const menuItems = [
    { id: 'overview', label: 'Cocktail Menu', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'banner', label: 'Banners', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'editorials', label: 'About Page', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'catalogue', label: 'Catalogue', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'orders', label: 'Order Ledger', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'timeline', label: 'Our Journey', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'news', label: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15' },
    { id: 'settings', label: 'Visit', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <AdminStudioOverview />;
      case 'editorials': return <AdminStudioEditorials />;
      case 'catalogue': return <AdminStudioCatalogue />;
      case 'timeline': return <AdminStudioTimeline />;
      case 'news': return <AdminStudioNews />;
      case 'orders': return <AdminStudioOrders />;
      case 'banner': return <AdminStudioBanner />;
      case 'settings': return <AdminStudioSettings />;
      default: return (
        <div className="w-full h-64 border-2 border-dashed border-zinc-200 flex justify-center items-center">
          <span className="font-sans font-bold text-zinc-400">Module under construction</span>
        </div>
      );
    }
  };

  return (
    <div className="flex h-[100dvh] bg-[#ffffff] overflow-hidden font-sans relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`bg-[#F5F5F5] border-r border-zinc-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out fixed md:relative z-50 h-full ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 shrink-0">
          {(isSidebarOpen || window.innerWidth < 768) && <span className="font-sans font-bold text-2xl tracking-wide text-black">STUDIO</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-zinc-400 hover:text-black transition-colors p-2 -mr-2 hidden md:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-black transition-colors p-2 -mr-2 md:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 flex flex-col gap-2 px-4">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-md transition-colors ${activeTab === item.id ? 'bg-white shadow-sm text-black font-bold' : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-black'}`}
              title={!isSidebarOpen ? item.label : ""}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon}></path>
              </svg>
              {(isSidebarOpen || window.innerWidth < 768) && <span className="font-sans text-[11px] uppercase tracking-widest truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-zinc-200">
          <button onClick={onLogout} className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-colors ${!isSidebarOpen && 'justify-center px-0'}`} title={!isSidebarOpen ? "Logout" : ""}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            {(isSidebarOpen || window.innerWidth < 768) && <span className="font-sans text-[11px] uppercase tracking-widest font-bold">Close Studio</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        <header className="h-20 flex items-center px-4 md:px-12 shrink-0 justify-between">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-zinc-600 p-2 border border-zinc-200 rounded-md">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
             </button>
             <div className="flex items-center gap-2 bg-zinc-100/80 px-3 py-1.5 rounded-full border border-zinc-200/50">
               {syncStatus === 'Mock Mode' && <><span className="w-2 h-2 rounded-full bg-orange-400"></span><span className="font-sans text-[10px] text-zinc-500 uppercase tracking-widest hidden md:inline">Local Mock Mode</span></>}
               {syncStatus === 'Synced' && <><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="font-sans text-[10px] text-zinc-500 uppercase tracking-widest hidden md:inline">Saved to Cloud</span></>}
               {syncStatus === 'Saving...' && (
                 <>
                   <svg className="w-3 h-3 text-zinc-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   <span className="font-sans text-[10px] text-zinc-500 uppercase tracking-widest hidden md:inline">Saving...</span>
                 </>
               )}
               {syncStatus === 'Error' && <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span><span className="font-sans text-[10px] text-red-500 uppercase tracking-widest hidden md:inline">Save Failed</span></>}
             </div>
           </div>
           <span className="font-sans font-bold text-sm text-black uppercase tracking-tight">
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
        return <FrontendApp onSecretClick={() => setAppMode('admin-login')} onAdminDirectLogin={() => setAppMode('admin-dashboard')} />;
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
      <div className="fixed inset-0 bg-black z-[99999] flex flex-col justify-center items-center">
         <motion.div 
           animate={{ opacity: [0.5, 1, 0.5] }} 
           transition={{ repeat: Infinity, duration: 1.5 }}
           className="font-helvetica text-[10px] md:text-xs font-thin capitalize tracking-widest text-[#F5F5F5]"
         >
           Connecting to Secure Database...
         </motion.div>
      </div>
    );
  }

  return <MainApp />;
}