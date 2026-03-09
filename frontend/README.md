# Board Design

A browser-based 3D snowboard customizer with a Figma-like UI. Place stickers, text, and images as decals onto a realistic 3D snowboard model — position, rotate, and scale them in real time. No downloads, no accounts, no friction.

**Live demo:** [https://pawelataman.github.io/board-design/](https://pawelataman.github.io/board-design/)

## Features

- **3D Decal System** — Place stickers, custom text, and uploaded images onto front and back faces of a snowboard model with physically-based rendering
- **Precision Gizmos** — Drag, rotate, and scale elements with interactive PivotControls directly on the 3D surface
- **Layer Management** — Full layer panel with reordering, visibility toggles, and lock controls
- **Sticker Library** — 20+ built-in SVG sticker designs across multiple categories, plus custom image uploads
- **Dual-Face PNG Export** — Renders both front and back of the board into a single side-by-side image using off-screen render targets with auto-cropping
- **Design Sharing** — Generate a shareable URL that encodes the entire design as a base64 query parameter
- **Auto-Save** — Designs persist to localStorage automatically with debounced saves
- **Mobile Responsive** — Adaptive layout with bottom tab bar and slide-up panels on small screens
- **SaaS Landing Page** — Marketing page at `/` with animated 3D hero, feature grid, testimonials, and CTAs

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 with React Compiler |
| 3D Engine | Three.js via @react-three/fiber (R3F) v9 |
| 3D Helpers | @react-three/drei v10 (Decal, PivotControls, OrbitControls, Environment, ContactShadows, useGLTF) |
| State | Zustand v5 |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Routing | React Router v7 (lazy-loaded routes) |
| Animation | @react-spring/three |
| Build | Vite v7 with babel-plugin-react-compiler |
| Package Manager | pnpm |
| Deployment | GitHub Pages via GitHub Actions |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 10

### Install & Run

```bash
# Clone the repository
git clone https://github.com/pawelataman/board-design.git
cd board-design

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The app will be available at `http://localhost:5173/`.

### Build

```bash
pnpm build
```

Output is written to `dist/`. The production build sets `base: "/board-design/"` for GitHub Pages compatibility.

### Preview Production Build

```bash
pnpm preview
```

### Lint

```bash
pnpm lint
```

## Project Structure

```
src/
├── main.tsx                        # Entry point (no StrictMode)
├── App.tsx                         # Router with lazy-loaded routes
├── index.css                       # Global styles, design tokens, glass panels
├── pages/
│   ├── LandingPage.tsx             # Marketing landing page (composes components)
│   └── Designer.tsx                # 3D editor page with floating UI panels
├── components/
│   ├── canvas/
│   │   ├── Scene.tsx               # R3F Canvas, lighting, OrbitControls, export logic
│   │   ├── Board.tsx               # Snowboard GLTF model rendering
│   │   ├── ElementGizmo.tsx        # PivotControls wrapper for decal manipulation
│   │   ├── StickerDecal.tsx        # SVG sticker decals with side-aware rotation
│   │   ├── ImageDecal.tsx          # Uploaded image decals with aspect ratio preservation
│   │   └── TextDecal.tsx           # Text decals rendered via canvas texture
│   ├── ui/
│   │   ├── Toolbar.tsx             # Top toolbar (tools, flip, share, export)
│   │   ├── LayersPanel.tsx         # Left panel — layer list with reorder/visibility/lock
│   │   ├── PropertiesPanel.tsx     # Right panel — element properties and scale slider
│   │   ├── LibraryPopover.tsx      # Sticker browser and image upload popover
│   │   └── MobileTabBar.tsx        # Bottom tab bar for mobile layout
│   └── landing/                    # Landing page section components
│       ├── Navbar.tsx
│       ├── Hero.tsx                # 3D auto-rotating board preview + CTA
│       ├── StatsBar.tsx
│       ├── Features.tsx
│       ├── HowItWorks.tsx
│       ├── Testimonials.tsx
│       ├── CallToAction.tsx
│       ├── Footer.tsx
│       ├── FadeInSection.tsx       # Scroll-triggered fade-in animation wrapper
│       ├── AnimatedNumber.tsx      # Intersection-observer animated counter
│       ├── icons.tsx               # SVG icon components
│       └── data.ts                 # Static content arrays (features, steps, stats, etc.)
├── store/
│   └── useDesignStore.ts           # Zustand store — all state, CRUD, persistence, sharing
└── assets/
    └── stickers/
        └── index.ts                # Built-in SVG sticker library (inline data URLs)

public/
├── models/snowboard.glb            # 3D snowboard model (Edge, Front, Back meshes)
├── logo.png                        # App logo (hexagon + board)
└── 404.html                        # GitHub Pages SPA redirect handler
```

## How It Works

### Designer Architecture

The designer uses a **full-bleed 3D canvas as background** with floating, glass-morphism UI panels overlaid on top — similar to Figma's layout model. The canvas and UI are siblings in the DOM, with `pointer-events` toggling to allow interaction with both layers.

### Decal Rendering

Each design element (sticker, text, image) is rendered as a [Drei `<Decal>`](https://drei.docs.pmnd.rs/misc/decal) projected onto the board mesh surface. Front-face decals use `rotation={[0, 0, rotation]}` while back-face decals use `rotation={[0, Math.PI, rotation]}` to handle the mirroring correctly.

### Gizmo Controls

Elements are manipulated via `<PivotControls>` with `autoTransform={false}` and explicit `matrix` prop binding. The Z-axis is disabled (`activeAxes={[true, true, false]}`). OrbitControls are disabled during gizmo drags using a ref-based mutation pattern (required for React Compiler compatibility).

### Export Pipeline

The dual-face PNG export:
1. Saves camera state and creates two `WebGLRenderTarget` instances
2. Repositions camera to front view, renders to off-screen target
3. Repositions camera to back view, renders to second target
4. Reads pixel data, Y-flips (WebGL is bottom-up), auto-crops to board bounding box
5. Composites both panels side-by-side on a 2D canvas with padding
6. Downloads as PNG

### Persistence & Sharing

- **Auto-save**: Zustand store subscribes to changes and saves to `localStorage` (key: `board_design_v2`) with a 1-second debounce
- **Share URLs**: The design state (excluding custom uploaded images) is serialized to JSON, base64-encoded, and appended as a `?design=` query parameter
- **Load priority**: Shared design URL param takes precedence over localStorage on mount

## Deployment

The project deploys automatically to GitHub Pages on push to `main` via the workflow at `.github/workflows/static.yml`. The workflow installs dependencies with pnpm, runs `tsc -b && vite build`, and deploys the `dist/` directory.

The `public/404.html` file implements the [SPA GitHub Pages](https://github.com/rafgraph/spa-github-pages) redirect technique so that client-side routes (like `/app`) work correctly after hard refreshes or direct navigation.

## License

This project is not currently licensed. All rights reserved.
