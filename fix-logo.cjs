const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf8');

// The original wrapper
const oldWrapper1 = '<div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-none">';

// The new wrapper
const newWrapper1 = `<div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (typeof onClose === 'function') onClose(); else if (typeof setView === 'function') setView('home'); }}>`;

file = file.split(oldWrapper1).join(newWrapper1);

fs.writeFileSync('src/App.jsx', file);
