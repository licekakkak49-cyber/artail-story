const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. DataProvider State Update
content = content.replace(
  'const [timeline, setTimeline] = useState(journeyTimelineData);',
  'const [timeline, setTimeline] = useState(journeyTimelineData);\n  const [news, setNews] = useState(newsData);'
);

content = content.replace(
  "supabase.from('timeline').select('*').order('year', { ascending: true }),",
  "supabase.from('timeline').select('*').order('year', { ascending: true }),\n          supabase.from('news').select('*').order('created_at', { ascending: false }),"
);

content = content.replace(
  "const [ckData, ctData, edData, tmData, stData] = results.map(r => r.data);",
  "const [ckData, ctData, edData, tmData, nwData, stData] = results.map(r => r.data);"
);

content = content.replace(
  "if (tmData && tmData.length > 0) setTimeline(tmData);",
  "if (tmData && tmData.length > 0) setTimeline(tmData);\n        if (nwData && nwData.length > 0) setNews(nwData);"
);

content = content.replace(
  "timeline, setTimeline, syncStatus, setSyncStatus",
  "timeline, setTimeline, news, setNews, syncStatus, setSyncStatus"
);

// 2. NewsOverlay Update
content = content.replace(
  'const NewsOverlay = ({ onClose, cartCount, setView, setOverlayView, currentUser, setEcommerceView }) => {',
  'const NewsOverlay = ({ onClose, cartCount, setView, setOverlayView, currentUser, setEcommerceView }) => {\n  const { settings, news } = useData();'
);
// In NewsOverlay, change newsData to news
const newsOverlayRegex = /const selectedItem = selectedNewsId \? newsData\.find/g;
content = content.replace(newsOverlayRegex, 'const selectedItem = selectedNewsId ? news.find');

content = content.replace(
  /const currentIndex = newsData\.findIndex/g,
  'const currentIndex = news.findIndex'
);

content = content.replace(
  /if \(currentIndex < newsData\.length - 1\) \{/g,
  'if (currentIndex < news.length - 1) {'
);

content = content.replace(
  /setSelectedNewsId\(newsData\[currentIndex \+ 1\]\.id\);/g,
  'setSelectedNewsId(news[currentIndex + 1].id);'
);

content = content.replace(
  /setSelectedNewsId\(newsData\[currentIndex - 1\]\.id\);/g,
  'setSelectedNewsId(news[currentIndex - 1].id);'
);

content = content.replace(
  /\{newsData\.map\(\(item\) => \(/g,
  '{news.map((item) => ('
);


// 3. Add AdminStudioNews Component
const adminNewsComponent = `
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

  const handleSaveItem = async () => {
    if (!editingItem) return;
    
    const newNews = [...news];
    const idx = newNews.findIndex(i => i.id === editingItem.id);
    if (idx !== -1) {
      newNews[idx] = editingItem;
      setNews(newNews);
    }

    if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabase) {
      if (typeof editingItem.id === 'string' && editingItem.id.startsWith('mock_')) return;
      setSyncStatus('Saving...');
      try {
        const payload = {
          title: editingItem.title,
          subtitle: editingItem.subtitle,
          category: editingItem.category,
          date: editingItem.date,
          content: editingItem.content,
          image: editingItem.image
        };
        const { error } = await supabase.from('news').update(payload).eq('id', editingItem.id);
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
      <div className="flex justify-between items-end mb-12 border-b border-zinc-200 pb-4">
        <h3 className="font-helvetica font-bold text-4xl tracking-wide uppercase text-black">News & Announcements</h3>
        <button onClick={handleAddNew} className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
          + Add Article
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Col: List */}
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          {news.map(item => (
            <div 
              key={item.id} 
              onClick={() => setEditingItem(item)}
              className={\`flex flex-col p-4 border cursor-pointer transition-all duration-300 \${editingItem?.id === item.id ? 'border-black bg-zinc-100' : 'border-zinc-200 hover:border-black/40 bg-white'}\`}
            >
              <span className="font-helvetica font-bold text-sm uppercase truncate">{item.title}</span>
              <span className="font-helvetica text-[10px] text-zinc-500 uppercase mt-1">{item.date}</span>
            </div>
          ))}
          {news.length === 0 && <span className="text-xs text-zinc-400 uppercase italic">No news articles</span>}
        </div>

        {/* Right Col: Editor */}
        <div className="w-full md:w-2/3 flex flex-col">
          {editingItem ? (
            <div className="flex flex-col gap-6 p-6 border border-zinc-200 bg-white relative">
              <button 
                onClick={() => handleDelete(editingItem.id)} 
                className="absolute top-6 right-6 text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-700 transition-colors"
              >
                Delete
              </button>

              <div className="flex flex-col gap-1.5 w-3/4">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Category</span>
                 <EditableText value={editingItem.category} onSave={v => { handleUpdate('category', v); handleSaveItem(); }} className="font-helvetica text-sm text-black border-b border-dashed border-zinc-300" />
              </div>

              <div className="flex flex-col gap-1.5 w-3/4">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Date</span>
                 <EditableText value={editingItem.date} onSave={v => { handleUpdate('date', v); handleSaveItem(); }} className="font-helvetica text-sm text-black border-b border-dashed border-zinc-300" />
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Main Title</span>
                 <EditableTextArea value={editingItem.title} onSave={v => { handleUpdate('title', v); handleSaveItem(); }} className="font-helvetica text-2xl font-black text-black border-b border-dashed border-zinc-300" rows={1} />
              </div>

              <div className="flex flex-col gap-1.5">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Subtitle</span>
                 <EditableTextArea value={editingItem.subtitle} onSave={v => { handleUpdate('subtitle', v); handleSaveItem(); }} className="font-helvetica text-sm text-zinc-600 border-b border-dashed border-zinc-300" rows={1} />
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Article Content</span>
                 <EditableTextArea value={editingItem.content} onSave={v => { handleUpdate('content', v); handleSaveItem(); }} className="font-helvetica text-xs text-zinc-600 border border-zinc-200 p-2" rows={8} />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                 <span className="font-helvetica font-black text-sm text-black uppercase">Cover Photo</span>
                 <EditableImage 
                   src={editingItem.image} 
                   aspect="aspect-[4/3]" 
                   onUpload={(url, isFinal) => {
                     handleUpdate('image', url);
                     if (isFinal) handleSaveItem();
                   }} 
                 />
                 <span className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Suggested Aspect Ratio: 4:3 (Landscape)</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border border-dashed border-zinc-300 bg-zinc-50">
               <span className="text-zinc-400 text-sm font-helvetica uppercase tracking-widest font-bold">Select an article to edit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`;

content = content.replace(
  'const AdminStudioSettings = () => {',
  adminNewsComponent + '\n\nconst AdminStudioSettings = () => {'
);

// 4. Update AdminLayout Menu and Render
content = content.replace(
  "{ id: 'timeline', label: 'Our Journey', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },",
  "{ id: 'timeline', label: 'Our Journey', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },\n    { id: 'news', label: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15' },"
);

content = content.replace(
  "case 'timeline': return <AdminStudioTimeline />;",
  "case 'timeline': return <AdminStudioTimeline />;\n      case 'news': return <AdminStudioNews />;"
);


fs.writeFileSync('src/App.jsx', content);
console.log('Successfully applied all changes for News feature!');
