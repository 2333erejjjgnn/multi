# MultiChain NFT Swap — Intent Generator

This project is a small front-end app for creating shareable "intent" documents that describe NFT swap proposals across blockchains.

Structure
- `index.html` — minimal landing page that loads the app.
- `styles/` — modular CSS files (base, layout, components).
- `src/` — ES module sources: `constants.js`, `ui.js`, `intent.js`, `dom.js`, `app.js`.

Features
- Create an "intent" JSON describing a proposed swap.
- Copy JSON, download intent (.json), or copy a shareable link that encodes the intent in the URL.
- Accessible color palette.

Dev
- This project uses native ES modules. Serve over a local HTTP server to run (e.g., `python -m http.server`).

Next improvements
- Add localStorage history, server-backed short links, and form validation.
