# AGENTS.md — 卫星-地面站-通信前端平台

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server at `http://localhost:3000` |
| `npm run build` | `vue-tsc && vite build` (typecheck then build — must pass both) |
| `npm run dev:electron` | Vite + Electron concurrently (requires `wait-on`) |
| `npm run build:win` / `build:zip` | Production build + Electron-builder packaging → `dist-electron/` |

No test/lint/formatter config. Validate with `npm run build` only.

## Architecture

- **Framework**: Vue 3 + TypeScript + Vite, Element Plus UI, Pinia state, Vue Router (hash history)
- **3D**: Cesium (`vite-plugin-cesium`, `ion.cesium.com` token via `VITE_CESIUM_ION_TOKEN` in `.env`) — wired via `useCesium` composable. Three.js used separately in `SatNetViewer.vue` (not a Cesium replacement).
- **ECharts** for dashboard charts
- **Auth**: Local-only via `src/stores/auth.ts` (`localStorage`). Test accounts: `admin/admin`, `operator/ops`, `viewer/viewer`
- **Dark mode**: `localStorage` key `theme` + `document.documentElement.classList.add('dark')`
- **Polling**: `usePolling` composable at `src/composables/usePolling.ts` (default 5s interval)

## Routes (5 active, all `requiresAuth`)

| Path | Component |
|------|-----------|
| `/` | Dashboard |
| `/earth` | EarthView → CesiumViewer |
| `/editor` | VisualEditor → CesiumViewer (with edit panels) |
| `/instances` | InstanceManagement |
| `/links` | LinkManagement |

## Cesium setup (`src/composables/useCesium.ts`)

- Retries Viewer creation with 3 fallback strategies in Electron
- `baseLayer: false` → manually adds ArcGIS World_Imagery + World_Boundaries_and_Places overlay
- Terrain: `CesiumWorldTerrain` with `requestVertexNormals: true`, `verticalExaggeration: 1.5`
- `resolutionScale = 1` (fixed, not scaled by devicePixelRatio)
- Disables credit display, sun, moon, fog, collision detection
- Camera zoom clamped: `min=5,000,000`, `max=80,000,000`
- Requires `VITE_CESIUM_ION_TOKEN` in `.env` — token needs `assets:read` permission

## CesiumViewer.vue satellite coloring

Satellite 3D model colors classified by orbit altitude:
- **LEO** (≤10,000,000m alt): `#2ecc71` green
- **MEO** (10M–30M alt): `#ff9f43` orange
- **GEO** (>30,000,000m alt): `#ff6b6b` red
- Ground stations: gold cylinder (`#f1c40f`)

`buildScene` at `src/components/cesium/CesiumViewer.vue` recreates all entities on any store change. LEO/MEO/GEO coloring applies to both 3D point size and `point.color`.

## Styling

Custom CSS variables prefixed `--vscode-*`. Element Plus theme overridden via these variables. No CSS framework or preprocessor.

## Environment

`VITE_API_BASE_URL` — If set to a full URL, API prefix appended as `/api`. If unset, Vite proxy forwards `/api` to `http://172.30.106.121:8080`.

## Electron

- Entry: `electron/main.cjs`, preload: `electron/preload.cjs`
- Context isolation, exposes `window.electronAPI` (getAppVersion, minimize/maximize/closeWindow)

## CI

GitHub Pages on push to main: `npm ci` → `npm run build` → upload `dist/`.

## Stores

- `auth.ts` — login/logout, role-based guard
- `satellite.ts` — satellite CRUD + selection
- `instance.ts`, `link.ts` — topology data
- `emulate.ts` — emulation config
- `node.ts` — node management
- `ui.ts` — immersive mode toggle
