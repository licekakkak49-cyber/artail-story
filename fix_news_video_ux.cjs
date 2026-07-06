const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Add playingVideoId state to NewsOverlay
content = content.replace(
  '  const [selectedNewsId, setSelectedNewsId] = useState(null);',
  '  const [selectedNewsId, setSelectedNewsId] = useState(null);\n  const [playingVideoId, setPlayingVideoId] = useState(null);'
);

// 2. Update Grid View Video
const oldGridVideo = `{item.video ? (
                  <video src={item.video} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105" autoPlay loop muted playsInline />
                ) : (`;

const newGridVideo = `{item.video ? (
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
                ) : (`;

content = content.replace(oldGridVideo, newGridVideo);

// 3. Update Detail View Video
const oldDetailVideo = `{selectedItem.video ? (
                    <video src={selectedItem.video} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                  ) : (`;

const newDetailVideo = `{selectedItem.video ? (
                    <video src={selectedItem.video} className="w-full h-full object-cover" controls playsInline />
                  ) : (`;

content = content.replace(oldDetailVideo, newDetailVideo);

fs.writeFileSync('src/App.jsx', content);
console.log('Successfully updated video UX in NewsOverlay!');
