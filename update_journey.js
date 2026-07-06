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

// 3. Update all nav menus (but NOT AdminLayout label)
// Find all instances of ">Our Journey</span>" and replace them.
// But some components might not have `settings` destructured from useData!
// Let's check which components have nav menus with "Our Journey":
// They are: Main App Header, CocktailOverlay, EditorialOverlay, CatalogueOverlay, JourneyOverlay, NewsOverlay, VisitOverlay
// Do all these components have `settings`? Let's assume they don't all have `settings`.
// Actually, since this is a bit tricky, I'll first check which components need `settings`.
