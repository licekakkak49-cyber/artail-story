const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Update siteSettingsData
content = content.replace(
  '  homeVideo: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/uploads/MainVid_2.mp4",',
  '  homeVideo: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/uploads/MainVid_2.mp4",\n  social_facebook: "https://facebook.com",\n  social_instagram: "https://instagram.com",\n  social_tiktok: "https://tiktok.com",\n  social_youtube: "",'
);

// 2. Update fetchSupabaseData
content = content.replace(
  '            homeVideo: stData.home_video ?? stData.homeVideo ?? siteSettingsData.homeVideo,',
  '            homeVideo: stData.home_video ?? stData.homeVideo ?? siteSettingsData.homeVideo,\n            social_facebook: stData.social_facebook ?? siteSettingsData.social_facebook,\n            social_instagram: stData.social_instagram ?? siteSettingsData.social_instagram,\n            social_tiktok: stData.social_tiktok ?? siteSettingsData.social_tiktok,\n            social_youtube: stData.social_youtube ?? siteSettingsData.social_youtube,'
);

// 3. Update handleSave in AdminStudioSettings
content = content.replace(
  "      homeVideo: 'home_video'",
  "      homeVideo: 'home_video',\n      social_facebook: 'social_facebook',\n      social_instagram: 'social_instagram',\n      social_tiktok: 'social_tiktok',\n      social_youtube: 'social_youtube'"
);

// 4. Add UI section in AdminStudioSettings
const socialUI = `
         <span className="font-helvetica text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2 mt-8">02. Social Media Links</span>
         
         <div className="flex flex-col gap-8 mt-4">
            <div className="flex flex-col gap-1.5 w-full md:w-1/2">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Instagram URL</span>
               <EditableText value={settings.social_instagram} onSave={v => { handleUpdate('social_instagram', v); handleSave('social_instagram', v); }} className="font-helvetica text-sm text-black border-b border-dashed border-zinc-300" />
               <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Leave empty to hide icon</span>
            </div>
            <div className="flex flex-col gap-1.5 w-full md:w-1/2">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Facebook URL</span>
               <EditableText value={settings.social_facebook} onSave={v => { handleUpdate('social_facebook', v); handleSave('social_facebook', v); }} className="font-helvetica text-sm text-black border-b border-dashed border-zinc-300" />
               <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Leave empty to hide icon</span>
            </div>
            <div className="flex flex-col gap-1.5 w-full md:w-1/2">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">TikTok URL</span>
               <EditableText value={settings.social_tiktok} onSave={v => { handleUpdate('social_tiktok', v); handleSave('social_tiktok', v); }} className="font-helvetica text-sm text-black border-b border-dashed border-zinc-300" />
               <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Leave empty to hide icon</span>
            </div>
            <div className="flex flex-col gap-1.5 w-full md:w-1/2">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">YouTube URL</span>
               <EditableText value={settings.social_youtube} onSave={v => { handleUpdate('social_youtube', v); handleSave('social_youtube', v); }} className="font-helvetica text-sm text-black border-b border-dashed border-zinc-300" />
               <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Leave empty to hide icon</span>
            </div>
         </div>
`;
content = content.replace(
  '         <span className="font-helvetica text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2 mt-8">02. Our Journey Section</span>',
  socialUI + '\n         <span className="font-helvetica text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-dashed border-zinc-200 pb-2 mt-8">03. Our Journey Section</span>'
);

// Need to update the section title numbers
content = content.replace(
  '03. Artists & Collaborators',
  '04. Artists & Collaborators'
);

// 5. Update FooterStage UI
const oldFooter = `const FooterStage = ({ onSecretClick }) => {
  return (
    <div className="w-full bg-black pt-6 pb-16 px-[8vw] flex justify-between items-center border-t border-zinc-900">
      <div className="flex items-center gap-6">
        {/* Instagram */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-300">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
        
        {/* Facebook */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-300">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
        </a>

        {/* TikTok */}
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-300">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.15-.25-.23V14c0 1.63-.42 3.25-1.28 4.62-1.7 2.77-5.07 4.24-8.29 3.52-3.1-.69-5.54-3.51-5.74-6.68-.3-4.63 3.64-8.81 8.31-8.31.25.03.5.07.75.12V11.2c-.36-.08-.73-.13-1.11-.14-2.18-.08-4.22 1.58-4.57 3.73-.42 2.5 1.48 4.95 3.98 5.11 2.21.14 4.31-1.37 4.7-3.53.07-.4.1-.81.09-1.22V.02z" />
          </svg>
        </a>
      </div>`;

const newFooter = `const FooterStage = ({ onSecretClick }) => {
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
      </div>`;

content = content.replace(oldFooter, newFooter);

fs.writeFileSync('src/App.jsx', content);
console.log('Successfully updated App.jsx for social links!');
