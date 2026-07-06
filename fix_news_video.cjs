const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Update AdminStudioNews Payload
const oldPayload = `          content: updatedItem.content,
          image: updatedItem.image,
          hashtag: updatedItem.hashtag
        };`;

const newPayload = `          content: updatedItem.content,
          image: updatedItem.image,
          hashtag: updatedItem.hashtag,
          video: updatedItem.video
        };`;

content = content.replace(oldPayload, newPayload);

// 2. Update AdminStudioNews UI
const oldCoverPhoto = `              <div className="flex flex-col gap-2 mt-4">
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
            </div>`;

const newCoverPhoto = `              <div className="flex flex-col gap-2 mt-4">
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
            </div>`;

content = content.replace(oldCoverPhoto, newCoverPhoto);


// 3. Update NewsOverlay Grid View
const oldGridImage = `              <div key={item.id} onClick={() => setSelectedNewsId(item.id)} className="relative flex flex-col snap-start shrink-0 w-[85vw] sm:w-[50vw] md:w-[38vw] lg:w-[28vw] xl:w-[22vw] aspect-[4/3] bg-zinc-900 overflow-hidden cursor-pointer group/card">
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105" />`;

const newGridImage = `              <div key={item.id} onClick={() => setSelectedNewsId(item.id)} className="relative flex flex-col snap-start shrink-0 w-[85vw] sm:w-[50vw] md:w-[38vw] lg:w-[28vw] xl:w-[22vw] aspect-[4/3] bg-zinc-900 overflow-hidden cursor-pointer group/card">
                {item.video ? (
                  <video src={item.video} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105" autoPlay loop muted playsInline />
                ) : (
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105" />
                )}`;

content = content.replace(oldGridImage, newGridImage);


// 4. Update NewsOverlay Detail View
const oldDetailImage = `                {/* Left side: Image */}
                <div className="w-full md:w-1/2 h-[45%] md:h-full relative bg-black shrink-0">
                  <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                </div>`;

const newDetailImage = `                {/* Left side: Image/Video */}
                <div className="w-full md:w-1/2 h-[45%] md:h-full relative bg-black shrink-0">
                  {selectedItem.video ? (
                    <video src={selectedItem.video} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                  ) : (
                    <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                  )}
                </div>`;

content = content.replace(oldDetailImage, newDetailImage);


fs.writeFileSync('src/App.jsx', content);
console.log('Successfully updated News Video support!');
