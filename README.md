# Matrix Flip Clock (React)

This project is now a Vite + React rewrite of the original standalone `index.html` flip clock. The legacy vanilla build is still available as `legacy-index.html` if you need it for reference.

## Getting Started

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open the printed local URL in your browser.

## Build

- Production build: `npm run build`
- Preview the build locally: `npm run preview`

## Notes

- The React app preserves all features from the previous version, including the matrix background, countdown/clock modes, effective time tracker, live view camera, and iOS fullscreen tweaks.
- For the best compatibility on Apple devices, run the React build through a modern bundler (the provided Vite setup) rather than serving the raw `legacy-index.html`.
