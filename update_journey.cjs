const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Add to siteSettingsData
content = content.replace(
  'homeVideo: ""\n};',
  'homeVideo: "",\n  journey_title: "Our\\nJourney",\n  journey_subtitle: "From a shared belief to a permanent canvas"\n};'
);

// 2. Add mapping to DataProvider
content = content.replace(
  'artist2_subtext: formatText(stData.artist2_subtext ?? siteSettingsData.artist2_subtext),',
  'artist2_subtext: formatText(stData.artist2_subtext ?? siteSettingsData.artist2_subtext),\n            journey_title: formatText(stData.journey_title ?? siteSettingsData.journey_title),\n            journey_subtitle: formatText(stData.journey_subtitle ?? siteSettingsData.journey_subtitle),'
);

// 3. Inject `settings` into components that use nav menus but don't have `settings` destructured.
// The regex finds `const { ... } = useData();` and adds `settings` if it's missing.
content = content.replace(/const\s*{\s*([^}]+?)\s*}\s*=\s*useData\(\);/g, (match, p1) => {
  if (p1.includes('settings')) return match; // Already has it
  return `const { ${p1}, settings } = useData();`;
});

// Wait, some components don't call useData() at all, like NewsOverlay? Let's check NewsOverlay.
// If it doesn't call useData, we need to inject it. We can do that manually later if it fails.

// 4. Replace `>Our Journey</span>` with `>{(settings?.journey_title || "Our Journey").replace(/\n/g, ' ')}</span>`
content = content.replace(/>Our Journey<\/span>/g, '>{(settings?.journey_title || "Our Journey").replace(/\\n/g, \' \')}</span>');

// 5. Replace `>Our<br />Journey\n              </h2>` in JourneyOverlay
content = content.replace(
  /<h2 className="text-\[#F5F5F5\] font-helvetica text-3xl md:text-4xl lg:text-\[3\.5vw\] font-normal leading-\[1\.1\] tracking-tight uppercase">\s*Our<br \/>Journey\s*<\/h2>/,
  '<h2 className="text-[#F5F5F5] font-helvetica text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.1] tracking-tight uppercase whitespace-pre-wrap">\n                {settings?.journey_title || "Our\\nJourney"}\n              </h2>'
);

// 6. Replace subtitle in JourneyOverlay
content = content.replace(
  /<p className="text-zinc-500 font-helvetica text-xs md:text-sm font-normal tracking-normal mt-3 md:mt-4 max-w-\[280px\]">\s*From a shared belief to a permanent canvas\s*<\/p>/,
  '<p className="text-zinc-500 font-helvetica text-xs md:text-sm font-normal tracking-normal mt-3 md:mt-4 max-w-[280px]">\n                {settings?.journey_subtitle || "From a shared belief to a permanent canvas"}\n              </p>'
);

fs.writeFileSync('src/App.jsx', content);
console.log('Replacements complete');
