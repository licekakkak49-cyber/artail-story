const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Banner Image
content = content.replace(
  'src="/gallery_bar_space.png"',
  'src={settings?.barImage || "/gallery_bar_space.png"}'
);

// 2. Address
content = content.replace(
  '              92 Central Park Offices Building, Unit No.NY4401, 44th Floor, Central Park West, Upper West Side, New York, NY 10024',
  '              {(settings?.address || "92 Central Park Offices Building, Unit No.NY4401, 44th Floor, Central Park West, Upper West Side, New York, NY 10024").split("\\n").map((line, i) => <div key={i}>{line}</div>)}'
);

// 3. Phone
content = content.replace(
  '<a href="tel:+12127218209" className="hover:text-[#C28256] transition-colors duration-300">\n                  (+1) 212-721-8209\n                </a>',
  '<a href={`tel:${settings?.phone?.replace(/[^0-9+]/g, \'\') || "+12127218209"}`} className="hover:text-[#C28256] transition-colors duration-300">\n                  {settings?.phone || "(+1) 212-721-8209"}\n                </a>'
);

// 4. Email
content = content.replace(
  '<a href="mailto:nyc@wayd.co" className="hover:text-[#C28256] transition-colors duration-300">\n                  nyc@wayd.co\n                </a>',
  '<a href={`mailto:${settings?.email || "nyc@wayd.co"}`} className="hover:text-[#C28256] transition-colors duration-300">\n                  {settings?.email || "nyc@wayd.co"}\n                </a>'
);

fs.writeFileSync('src/App.jsx', content);
console.log('VisitOverlay updated successfully!');
