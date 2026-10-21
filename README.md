# Wildflower Finder

A React and Vite app for browsing native wildflowers of Rabun County, Georgia. Search by name, browse photo cards, and open details showing bloom season, sunlight, water needs, planting effort, maintenance effort, and notes.

The browser loads the catalog from `public/wildflowers.json`. The app browses catalog records; photograph-based identification is not implemented.

## Run locally

Install Node.js and npm, then run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Build and checks

```sh
npm run build
npm run preview
npm run lint
```

No automated test command is defined in `package.json`.

## Project layout

- `src/App.jsx`: catalog loading, name search, cards, and detail views.
- `src/App.css` and `src/index.css`: presentation.
- `public/`: catalog JSON and public assets.
- `scripts/`: supporting data scripts.
- [SPEC.md](SPEC.md): project specification.

Keep catalog fields aligned with the UI when editing data. Image availability and botanical data quality were not verified in this documentation review.

## How this was built

Documentation reviewed with OpenAI Codex assistance against the application source.
