# Wildflower Finder — Project Spec

## Overview
Mobile-first React app for identifying wildflowers native to Rabun County, Georgia. Private hobby tool for a beginner. Searchable/browsable catalog of 35 wildflowers with effort ratings.

## Tech Stack
- React + Vite (JavaScript, no TypeScript)
- Static JSON data (`public/wildflowers.json`) — no backend
- Plain CSS (mobile-first)

## Current State
- App is scaffolded and functional at `wildflower-finder/`
- Dev server: `cd wildflower-finder && npm run dev` → `http://localhost:5173`
- **NOT visually verified yet**

## Architecture
Single-component app (`src/App.jsx`) with two views toggled by state:

### List View
- Green gradient header (🌸 Rabun County Wildflowers)
- Search input — filters by flower name (case-insensitive)
- Results count ("Showing X of Y wildflowers")
- Scrollable list of cards showing: name, bloom season, color-coded effort tags

### Detail View
- Back button
- Hero image (250px, object-fit cover)
- Sections: Bloom Season, Sunlight, Water Needs, Effort to Plant, Effort to Maintain, Notes

### Effort Color Coding
- Easy → `#4CAF50` (green)
- Moderate → `#FFC107` (yellow)
- Hard/High → `#F44336` (red)

## Data Shape (`wildflowers.json`)
```json
{
  "id": 1,
  "name": "Black-eyed Susan",
  "bloomSeason": "June–September",
  "sunlight": "Full sun",
  "waterNeeds": "Low",
  "effortToPlant": "Easy",
  "effortToMaintain": "Low",
  "imageUrl": "https://images.unsplash.com/photo-...",
  "notes": "Cheerful yellow blooms, attracts pollinators, very hardy"
}
```

35 entries total. Species include shade-lovers (Trillium, Bloodroot, Solomon's Seal) and sun-lovers (Coneflower, Asters, Wild Indigo). One entry (Lady's Slipper Orchid) has Hard/High effort.

## Key Files
```
wildflower-finder/
├── public/wildflowers.json    # 35 wildflower entries
├── src/
│   ├── App.jsx                # Main component (list + detail views)
│   ├── App.css                # All app styles
│   ├── index.css              # Global reset
│   └── main.jsx               # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Known Issues
1. **Unsplash images are placeholders** — many entries share the same URL and don't show the actual species. Need real wildflower-specific images.
2. **App not visually verified** — needs manual check in browser.
3. **CSS has a typo** — `App.css` line 71: `active: #f5f5f5;` is invalid (should only be in `:active` pseudo-class, which is already on line 74-76). Harmless but sloppy.

## Remaining Work
1. Verify the app runs and looks correct
2. Replace placeholder image URLs with species-accurate images
3. Fix any visual/functional issues found during verification
4. (Optional) Deploy to Vercel: `npm i -g vercel && vercel`
5. (Optional) Add filter by bloom season, sunlight, or effort level
