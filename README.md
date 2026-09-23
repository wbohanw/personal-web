# Bohan’s Little Planet

An interactive blue miniature planet for Bohan Wang’s six destinations: projects, experience, milestones, books, life (including photos), and research & leadership. Built with React, TypeScript, Three.js, and React Three Fiber.

## Local development

```sh
npm install
npm run dev
```

Production build: `npm run build`. Preview the build: `npm run preview`.

## The world

- Drag the planet to rotate it. Hover over a bottom navigation item (or focus it with the keyboard) to turn smoothly toward its landmark without opening content. Click a building, its label, or the navigation item to open the place.
- The map is a keyboard-accessible directory. Content opens in a native dialog; Escape returns to the planet.
- Daylight and moonlight follow the system’s light/dark appearance automatically, including changes while the page is open.
- **Enter the World** shows a minimal Loading screen while the full-screen view settles and renders, then reveals the centered planet and flies smoothly down to the clearing. Walk with WASD (Shift to move faster), turn with drag or arrow keys, and use E near a landmark to open its content. The walking view keeps its controls minimal; touch users can hold the on-screen direction buttons and drag to look. Escape or **Exit** returns immediately to the portfolio without an exit animation. Walking follows the spherical surface and checks forward geometry for obstacles; content dialogs and background tabs pause movement. Canvas resizing happens behind the loading screen. Reduced-motion preferences skip the entry flight.
- Music is the original `src/assets/blue.mp3`. Each fresh page load offers an immersive experience with music or a silent entry; Escape enters silently. The bottom-right circular player spins during playback and stops when paused, with matching pause/play icons. Reduced-motion preferences disable the spin.
- Visited places are saved locally in the browser. No tracking service or backend is used.
- Links such as `/#projects`, `/#life`, and `/#about` open the corresponding content after the entry choice. The old `/#photos` link opens Life.
- A content directory remains usable if WebGL is unavailable.

## Editing content

- `src/planet/data.ts`: destinations, publications, leadership roles, awards, photos, and connections to existing content.
- `src/portfolio/portfolioData.ts`: project descriptions, covers, metrics, and links, reused by the new site.
- `src/data/content.json`: work experience.
- `src/planet/ContentPanel.tsx`: the interiors, including the bookshelf and life sections. The bookshelf is intentionally awaiting Bohan’s real reading list.
- `src/planet/content.css`: minimal full-page content layouts, with serif headings, project rows, plain-text metadata, unframed photos, and system-theme colors.
- `src/planet/world.ts`: procedural buildings, landscape, foliage, boats, and paths. Static meshes are merged by material.
- `src/planet/PlanetScene.tsx`: lighting, camera, rotation, building interactions, projected labels, and rendering lifecycle.
- `src/planet/WorldWalk.tsx`: entry render readiness and instant overview restoration, spherical walking, collision checks, keyboard and pointer controls, and nearby destinations.
- `src/planet/planet.css`: desktop/mobile layouts and day/night presentation.

The previous page components remain in the repository as source material; the app entry point now serves the planet. No production deployment is performed by the development workflow.
