import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- Configuration & Data ---
const cocktailMenuData = [
  { name: "Sunflowers", artist: "Teddy", src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80", hoverSrc: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80" },
  { name: "Starry Night", artist: "Mimi", src: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=800&q=80", hoverSrc: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80" },
  { name: "Almond Blossom", artist: "Teddy", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80", hoverSrc: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80" },
  { name: "Self Portrait", artist: "Mimi", src: "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&w=800&q=80", hoverSrc: "https://images.unsplash.com/photo-1609345265499-2244bb6a6198?auto=format&fit=crop&w=800&q=80" },
  { name: "Cafe Terrace", artist: "Teddy", src: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&w=800&q=80", hoverSrc: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80" },
  { name: "Water Lilies", artist: "Mimi", src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80", hoverSrc: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80" },
  { name: "The Kiss", artist: "Teddy", src: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=800&q=80", hoverSrc: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80" }
];

// --- ฉาก 1: นิทรรศการเมนู (Exhibition Marquee) รวมกับคำคม ---
const ContentStage = () => {
  return (
    <div className="w-full h-screen bg-[#F5F5F5] flex flex-col justify-center items-center relative overflow-hidden select-none py-20">
      
      {/* ส่วนหัวข้อความ (Manifesto) */}
      <div className="w-full flex flex-col items-center justify-center mb-16 md:mb-20 px-4">
        <h3 className="font-helvetica font-normal text-[5.5vw] sm:text-[4.5vw] md:text-[3vw] lg:text-[2.5vw] text-[#111111] text-center leading-[1.3] tracking-tight">
          “The bar becomes a canvas.<br />The drinks are the work.”
        </h3>
        
        <div className="flex items-center gap-4 mt-6 md:mt-8 text-[8px] md:text-[10px] font-inter font-semibold uppercase tracking-[0.2em] text-[#111111]">
          <span>Experience them as you would</span>
          <div className="w-12 md:w-20 h-[1px] bg-[#111111]"></div>
          <span>Art</span>
        </div>
      </div>

      {/* แถบเมนูค็อกเทล (รูปสี่เหลี่ยมจัตุรัส เรียงติดกัน) */}
      <div className="flex-1 flex items-center w-full overflow-hidden">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 45, repeat: Infinity }}
          className="flex w-max"
        >
          {/* ชุดที่ 1 */}
          <div className="flex items-start gap-2 md:gap-4 pr-2 md:pr-4">
            {cocktailMenuData.map((item, i) => (
              <div key={`set1-${i}`} className="w-[45vw] sm:w-[35vw] md:w-[28vw] lg:w-[22vw] flex flex-col flex-shrink-0 cursor-pointer group">
                
                {/* รูปภาพ (Aspect Square เหมือนในเรฟเฟอเรนซ์) */}
                <div className="relative w-full aspect-square bg-[#EAEAEA] overflow-hidden mb-3">
                  <img src={item.src} alt={item.name} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 ease-in-out opacity-100 group-hover:opacity-0" draggable="false" />
                  <img src={item.hoverSrc} alt={`${item.name} cocktail`} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105" draggable="false" />
                </div>

                {/* ข้อความอยู่ด้านล่างภาพ ซ่อนไว้และจะแสดงเมื่อ Hover เท่านั้น */}
                <div className="flex justify-between items-baseline w-full text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="font-helvetica font-bold text-[#111111]">“{item.name}”</span>
                  <span className="font-inter font-medium text-zinc-400">{item.artist}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* ชุดที่ 2 สำหรับลูป */}
          <div className="flex items-start gap-2 md:gap-4 pr-2 md:pr-4">
            {cocktailMenuData.map((item, i) => (
              <div key={`set2-${i}`} className="w-[45vw] sm:w-[35vw] md:w-[28vw] lg:w-[22vw] flex flex-col flex-shrink-0 cursor-pointer group">
                
                <div className="relative w-full aspect-square bg-[#EAEAEA] overflow-hidden mb-3">
                  <img src={item.src} alt={item.name} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 ease-in-out opacity-100 group-hover:opacity-0" draggable="false" />
                  <img src={item.hoverSrc} alt={`${item.name} cocktail`} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105" draggable="false" />
                </div>

                {/* ข้อความอยู่ด้านล่างภาพ ซ่อนไว้และจะแสดงเมื่อ Hover เท่านั้น */}
                <div className="flex justify-between items-baseline w-full text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="font-helvetica font-bold text-[#111111]">“{item.name}”</span>
                  <span className="font-inter font-medium text-zinc-400">{item.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- ฉาก 2: Artists พร้อมข้อมูลจริง (ปรับเลย์เอาต์กระชับตามเรฟฯ) ---
const ArtistStage = () => {
  return (
    <div className="w-full bg-[#1c1c1e] py-12 md:py-16 flex flex-col justify-center items-center px-6 md:px-12 lg:px-24">
      <div className="w-full max-w-[1200px] flex flex-col">
        {/* Header พร้อม Badge รางวัล */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mb-8 md:mb-12 gap-6 md:gap-8">
          <h2 className="text-[#f5f5f5] font-helvetica text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.1] tracking-tight uppercase">
            Meet Our<br />Artists
          </h2>
          <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-[#f5f5f5]/20 pl-4 md:pl-0 md:pr-4">
            <p className="text-[#f5f5f5] font-helvetica text-xs md:text-sm tracking-[0.15em] font-bold uppercase mb-1.5">Winner "Bar Star Awards"</p>
            <p className="text-[#888888] font-inter text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-semibold">by New York Bartender Week 2025</p>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full max-w-[900px] mx-auto">
          {/* ศิลปิน 1: Mimi */}
          <div className="flex flex-col items-center group">
            <div className="w-full max-w-[400px] flex flex-col items-start">
              <div className="w-full aspect-square bg-[#2a2a2c] overflow-hidden mb-4 md:mb-6">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" alt="Mimi" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" draggable="false" />
              </div>
              <h3 className="text-[#f5f5f5] font-helvetica text-2xl md:text-3xl font-normal tracking-wide uppercase">Mimi</h3>
              <p className="text-[#a0a0a0] font-inter text-[10px] md:text-xs tracking-[0.15em] mt-2 uppercase font-normal">7 Signatures</p>
            </div>
          </div>

          {/* ศิลปิน 2: Teddy */}
          <div className="flex flex-col items-center group">
            <div className="w-full max-w-[400px] flex flex-col items-start">
              <div className="w-full aspect-square bg-[#2a2a2c] overflow-hidden mb-4 md:mb-6">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" alt="Teddy" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" draggable="false" />
              </div>
              <h3 className="text-[#f5f5f5] font-helvetica text-2xl md:text-3xl font-normal tracking-wide uppercase">Teddy</h3>
              <p className="text-[#a0a0a0] font-inter text-[10px] md:text-xs tracking-[0.15em] mt-2 uppercase font-normal">5 Signatures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ฉาก 3: ไทม์ไลน์ร้าน (Our Journey Stage) ถอดดีไซน์จาก Accolades เรฟเฟอเรนซ์เป๊ะๆ ระดับมิลลิเมตร ---
const JourneyStage = () => {
  const journeyTimeline = [
    { name: "The First Shared Belief", desc: "Concept formulation", year: "2023" },
    { name: "WAYD? at Narkara", desc: "A one-day bartender session", year: "2024" },
    { name: "The Artail Movement", desc: "Collaborative pop-ups around the city", year: "2024" },
    { name: "The Permanent Canvas", desc: "Opening our own gallery bar", year: "2025" }
  ];

  // ลบ min-h-screen ออก และลด py ลง เพื่อให้เป็นแถบ (Strip) ไม่เต็มจอ
  return (
    <div className="w-full bg-[#F5F5F5] py-16 md:py-20 lg:py-24 flex justify-center items-start px-6 md:px-12 lg:px-24">
      <div className="w-full max-w-[1300px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start pt-8 md:pt-10">
        
        {/* ฝั่งซ้าย: ข้อความหลักและซับ (col-span-4) */}
        <div className="md:col-span-4 flex flex-col items-start pr-0 md:pr-12">
          {/* ปรับขนาด, leading, tracking ให้เท่ากับ "Meet Our Artists" เป๊ะๆ เพื่อ Consistency */}
          <h2 className="text-[#111111] font-helvetica text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.1] tracking-tight uppercase">
            Our<br />Journey
          </h2>
          {/* ซับไตเติ้ลตัวเล็ก ปรับระยะห่าง (mt) ให้กระชับขึ้น */}
          <p className="text-[#111111] font-helvetica text-xs md:text-sm tracking-normal mt-3 md:mt-4 max-w-[280px]">
            From a shared belief to a permanent canvas
          </p>
        </div>

        {/* ฝั่งขวา: รายการไทม์ไลน์ (col-span-8) */}
        {/* นำ border-t border-[#111111]/30 ออก เพื่อไม่ให้มีเส้นด้านบนสุด */}
        <div className="md:col-span-8 flex flex-col w-full mt-8 md:mt-0">
          {journeyTimeline.map((item, i) => (
            <div key={i} className="w-full border-b border-[#111111]/30 flex flex-col lg:flex-row justify-between items-start lg:items-baseline py-3 md:py-4 lg:py-5 gap-2 lg:gap-4 hover:bg-zinc-100/50 transition-colors duration-300 px-2 lg:px-0">
              {/* ลด padding แนวนอนและแนวตั้ง เพื่อบีบช่องว่างระหว่างบรรทัดให้ชิดกันตามรูปเรฟ */}
              
              {/* ลดขนาดฟอนต์หัวข้อรายการลงนิดนึงให้สมส่วนกับช่องว่างที่แคบลง */}
              <span className="font-helvetica text-xl md:text-2xl lg:text-[1.8vw] font-normal text-[#111111] tracking-[-0.03em] leading-tight">
                {item.name}
              </span>
              
              {/* คำอธิบาย + ปี - ปรับขนาดจาก text-xs md:text-sm ให้ใหญ่ขึ้นเป็น text-sm md:text-base */}
              <span className="font-helvetica text-sm md:text-base text-[#111111] lg:text-right whitespace-normal lg:whitespace-nowrap tracking-normal">
                – {item.desc}, {item.year}
              </span>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// --- ฉาก 4: Footer สไตล์ Minimalist Gallery (New York - Dark Mode) ---
const FooterStage = () => {
  return (
    <div className="w-full bg-[#1c1c1e] py-24 md:py-32 flex justify-center items-start px-6 md:px-12 lg:px-24">
      <div className="w-full max-w-[1300px] flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8">
        
        {/* Left Side: Heading & Address */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 md:gap-12">
          <h2 className="text-[#f5f5f5] font-helvetica text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.1] tracking-tight uppercase">
            Finest gallery in<br />New York
          </h2>
          <p className="text-[#a0a0a0] font-helvetica text-sm md:text-base leading-relaxed">
            524 W 24th St<br />
            Chelsea Art District – NY<br />
            10011
          </p>
        </div>

        {/* Right Side: Links Grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 pt-2">
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Home</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Artists</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Exhibitions</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Collection</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Art Fairs</a>
          </div>
          {/* Col 2 */}
          <div className="flex flex-col gap-4">
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">News</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Videos</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">About</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Contact</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Residency</a>
          </div>
          {/* Col 3 */}
          <div className="flex flex-col gap-4">
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">Insta</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">X (Twitter)</a>
            <a href="#" className="text-[#a0a0a0] hover:text-[#f5f5f5] font-helvetica text-sm md:text-base transition-colors">YouTube</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function App() {
  const scrollSequenceRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollSequenceRef,
    offset: ["start start", "end end"]
  });

  const galleryInitY = useTransform(scrollYProgress, [0, 1], ["0vh", "-600vh"]);
  const textInitY = useTransform(scrollYProgress, [0, 0.0583], ["42vh", "0vh"]);
  
  const smallOpacity = useTransform(scrollYProgress, [0.06, 0.09], [1, 0]);
  const smallTextHideY = useTransform(scrollYProgress, (v) => v > 0.095 ? -9999 : 0);
  const w1 = useTransform(scrollYProgress, [0.09, 0.15], ["2.1em", "0em"]);
  const w2 = useTransform(scrollYProgress, [0.09, 0.15], ["1.4em", "0em"]);
  const w3 = useTransform(scrollYProgress, [0.09, 0.15], ["1.5em", "0em"]);
  const w4 = useTransform(scrollYProgress, [0.09, 0.15], ["4.4em", "0em"]);
  const ml1 = useTransform(scrollYProgress, [0.09, 0.15], ["0em", "-0.1em"]);
  const ml2 = useTransform(scrollYProgress, [0.09, 0.15], ["0em", "-0.1em"]);
  const ml3 = useTransform(scrollYProgress, [0.09, 0.15], ["0em", "-0.1em"]);
  const ml4 = useTransform(scrollYProgress, [0.09, 0.15], ["0em", "0.05em"]);

  const gooeyFilter = useTransform(scrollYProgress, (v) => v >= 0.14 ? "url(#goo)" : "none");
  const logoBlur = useTransform(scrollYProgress, [0.15, 0.20], ["blur(0px)", "blur(3px)"]);
  
  const meltScaleY = useTransform(scrollYProgress, [0.16, 0.23], [1, 2.2]);
  const logoOpacity = useTransform(scrollYProgress, [0.22, 0.25], [1, 0]); 
  const logoHideY = useTransform(scrollYProgress, (v) => v > 0.255 ? -9999 : 0);

  const dropOpacity = useTransform(scrollYProgress, [0.14, 0.16, 0.28, 0.30], [0, 1, 1, 0]); 
  const dropY = useTransform(scrollYProgress, [0.21, 0.29], ["0vh", "60vh"]);
  const dropScaleY = useTransform(scrollYProgress, [0.21, 0.25, 0.29], [1, 2, 1]); 
  const dropHideX = useTransform(scrollYProgress, (v) => v > 0.305 ? -9999 : 0);

  const textLayerMasterOpacity = useTransform(scrollYProgress, [0.29, 0.31], [1, 0]); 
  
  const bleedMaskSize = useTransform(scrollYProgress, [0.30, 0.60], ["0vmax 0vmax", "140vmax 140vmax"]);
  const bleedOpacity = useTransform(scrollYProgress, [0.30, 0.32], [0, 1]);

  const s1_y = useTransform(scrollYProgress, [0.32, 0.38], ["50px", "0px"]);
  const s1_op = useTransform(scrollYProgress, [0.32, 0.38], [0, 1]);
  
  const curtainY = useTransform(scrollYProgress, [0.45, 0.60], ["0vh", "-100vh"]);

  // --- ปรับจังหวะสกรอลล์ให้พอดีกับ Footer ใหม่ที่สั้นลง ---
  const stageY = useTransform(scrollYProgress, [0.65, 0.73, 0.78, 0.86, 0.90, 1], ["0vh", "-100vh", "-100vh", "-155vh", "-155vh", "-180vh"]);

  return (
    <div className="bg-[#F5F5F5] text-[#111111] selection:bg-[#111111] selection:text-[#F5F5F5] relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        .font-helvetica { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        ::-webkit-scrollbar { display: none; }
        .ink-bleed-mask {
          mask-image: radial-gradient(circle, black 15%, transparent 60%);
          -webkit-mask-image: radial-gradient(circle, black 15%, transparent 60%);
          mask-repeat: no-repeat;
          -webkit-mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-position: center;
        }
      `}} />

      <nav className="fixed top-0 left-0 w-full z-[999] bg-[#F5F5F5]/70 backdrop-blur-md px-6 py-5 flex justify-between items-center text-xs md:text-sm font-inter font-bold uppercase tracking-[0.15em] text-[#111111] pointer-events-auto">
        <div className="flex gap-6 md:gap-10">
          <span className="cursor-pointer hover:text-gray-500 transition-colors">Catalogue</span>
          <span className="cursor-pointer hover:text-gray-500 transition-colors">Info</span>
          <span className="cursor-pointer hover:text-gray-500 transition-colors">Archive</span>
          <span className="cursor-pointer hover:text-gray-500 transition-colors">Editorial</span>
        </div>
      </nav>

      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="goo" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* ขยายความสูงรวมของจอให้รองรับสกรอลล์ที่ยาวขึ้น (h-[1200vh]) */}
      <div ref={scrollSequenceRef} className="h-[1200vh] w-full relative z-20">
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          
          {/* THE STAGE: รวมนิทรรศการเมนู, ศิลปิน, ไทม์ไลน์ร้าน, และ Footer เข้าด้วยกัน */}
          <div className="absolute inset-0 z-0 pointer-events-auto bg-[#F5F5F5]">
            <motion.div style={{ y: stageY }} className="w-full flex flex-col">
              <ContentStage />
              <ArtistStage />
              <JourneyStage />
              <FooterStage />
            </motion.div>
          </div>

          {/* THE CURTAIN */}
          <motion.div style={{ y: curtainY }} className="absolute inset-0 z-10 bg-[#F5F5F5]">
            <motion.div style={{ y: galleryInitY }} className="absolute inset-0 pt-16 md:pt-24 flex flex-col items-center w-full z-10 pointer-events-auto">
              <div className="w-full max-w-[90vw] xl:max-w-6xl mx-auto flex justify-center items-center gap-6 md:gap-10 lg:gap-16 h-[18vh] sm:h-[22vh] md:h-[28vh] lg:h-[32vh]">
                <motion.div className="h-full aspect-[3/4] overflow-hidden" whileHover={{ scale: 1.05 }}>
                  <img src="https://i.ibb.co/sdH3XHVd/main-3-0-5x.png" className="w-full h-full object-cover grayscale shadow-sm" draggable="false" />
                </motion.div>
                <motion.div className="h-full aspect-[4/3] overflow-hidden" whileHover={{ scale: 1.05 }}>
                  <img src="https://i.ibb.co/bjV9cNG8/Artboard-1-0-5x.png" className="w-full h-full object-cover grayscale shadow-sm" draggable="false" />
                </motion.div>
                <motion.div className="h-full aspect-[3/4] overflow-hidden" whileHover={{ scale: 1.05 }}>
                  <img src="https://i.ibb.co/Y79gLfW0/main-2-0-5x.png" className="w-full h-full object-cover grayscale shadow-sm" draggable="false" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div style={{ opacity: textLayerMasterOpacity, y: textInitY }} className="absolute inset-0 flex flex-col items-center justify-center px-2 z-20 pointer-events-none">
              <motion.div style={{ filter: logoBlur, WebkitFilter: logoBlur }} className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div style={{ filter: gooeyFilter, WebkitFilter: gooeyFilter }} className="relative w-full mx-auto flex items-center justify-center">
                  <motion.div className="absolute bg-[#111111] rounded-full z-0" style={{ width: '40px', height: '40px', top: '50%', marginTop: '-20px', y: dropY, x: dropHideX, scaleY: dropScaleY, opacity: dropOpacity, originY: 0.5 }} />
                  <motion.div style={{ opacity: logoOpacity, y: logoHideY, WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }} className="flex items-baseline justify-center w-full z-10 text-[6vw] sm:text-[6.5vw] md:text-[7vw] lg:text-[7.4vw] xl:text-[7.6vw] font-helvetica font-bold tracking-[-0.04em] leading-[0.8] text-[#111111] whitespace-nowrap">
                    <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">W</motion.span>
                    <motion.div style={{ width: w1, marginLeft: ml1, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline"><span className="whitespace-nowrap pr-[0.15em] uppercase">HAT</span></motion.div>
                    <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">A</motion.span>
                    <motion.div style={{ width: w2, marginLeft: ml2, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline"><span className="whitespace-nowrap pr-[0.2em] uppercase">RE</span></motion.div>
                    <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">Y</motion.span>
                    <motion.div style={{ width: w3, marginLeft: ml3, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline"><span className="whitespace-nowrap pr-[0.2em] uppercase">OU</span></motion.div>
                    <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">D</motion.span>
                    <motion.div style={{ width: w4, marginLeft: ml4, opacity: smallOpacity, y: smallTextHideY }} className="flex-shrink-0 flex overflow-hidden items-baseline"><span className="whitespace-nowrap pr-0 uppercase">RINKING</span></motion.div>
                    <motion.span style={{ scaleY: meltScaleY }} className="flex-shrink-0 inline-block origin-top">?</motion.span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div className="absolute inset-0 bg-[#1c1c1e] z-30 ink-bleed-mask flex items-center justify-center pointer-events-none" style={{ WebkitMaskSize: bleedMaskSize, maskSize: bleedMaskSize, opacity: bleedOpacity }}>
              <div className="relative w-full max-w-[1200px] h-full px-6 md:px-12 flex flex-col items-center">
                <motion.div className="absolute inset-x-0 top-[45%] text-center px-4 flex flex-col items-center w-full" style={{ y: s1_y, opacity: s1_op }}>
                  <h2 className="text-[#F5F5F5] tracking-tight whitespace-nowrap text-[clamp(28px,6vw,100px)] flex gap-3 items-baseline justify-center">
                    <span className="font-inter font-light">Where</span> 
                    <span className="font-helvetica font-bold">Imagination</span> 
                    <span className="font-inter font-light">Meets Art</span>
                  </h2>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
