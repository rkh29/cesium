# AGENTS.md — 卫星-地面站-通信前端平台

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server at `http://localhost:3000` |
| `npm run build` | `vue-tsc && vite build` (typecheck then build — must pass both) |
| `npm run dev:electron` | Vite + Electron concurrently (requires `wait-on`) |
| `npm run build:win` / `build:zip` | Production build + Electron-builder packaging → `dist-electron/` |

No test/lint/formatter config. Only validate with `npm run build`.  
`build` output: `minify: false`, `sourcemap: true`, manual chunks for `element-plus` and `vue-vendor`.

## Architecture

- **Framework**: Vue 3 + TypeScript + Vite, Element Plus (zh-cn locale), Pinia, Vue Router (hash history)
- **3D**: Cesium via `vite-plugin-cesium`, token from `VITE_CESIUM_ION_TOKEN` in `.env`. Three.js used separately in `SatNetViewer.vue` (demo only, not a Cesium replacement).
- **ECharts** on dashboard; **Axios** for all API calls (interceptor unwraps `ApiResponse.code/msg/data`, rejects on `code !== 0`)
- **Auth**: Local-only via `src/stores/auth.ts` (`localStorage` keys `satops_user`, `satops_token`, `satops_registered_users`). Only hardcoded account: `admin`/`admin`. Other users self-register (default role `viewer`). Roles: `admin`, `operator`, `viewer`.
- **Dark mode**: `localStorage` key `theme` + `document.documentElement.classList.add('dark')`. Defaults to dark.
- **Polling**: `usePolling` composable (`src/composables/usePolling.ts`, default 5s interval)

## Routes (7 total, 5 active pages — all `requiresAuth`)

| Path | Component |
|------|-----------|
| `/` | Dashboard |
| `/earth` | EarthView → CesiumViewer |
| `/editor` | VisualEditor → CesiumViewer (with edit panels) |
| `/instances` | InstanceManagement |
| `/links` | LinkManagement |
| `/topology/instances` | redirect → `/instances` |
| `/topology/links` | redirect → `/links` |
| `/:pathMatch(.*)*` | catch-all redirect → `/` |

## Stores

- `src/stores/auth.ts` — login/logout, role-based guard
- `src/stores/satellite.ts` — 450-satellite architecture (LEO 420 + MEO 24 + GEO 6), CRUD, position fetching
- `src/stores/instance.ts`, `src/stores/link.ts` — topology data
- `src/stores/emulate.ts` — emulation config
- `src/stores/node.ts` — node management
- `src/stores/ui.ts` — immersive mode toggle
- `src/store/anomaly.ts` (note: `store/` not `stores/`) — `useAnomalyStore`, hits `/api/anomalies`

## API layer (`src/api/index.ts`)

- **Base URL logic**: If `VITE_API_BASE_URL` is set to a full URL (`http://...`), appends `/api` prefix. If unset, Vite dev proxy forwards `/api` → `http://172.30.106.121:8080` (5s timeout).
- **WebSocket**: `wsUrl` export auto-constructs `ws(s)://host/api/ws` from `VITE_API_BASE_URL` or `window.location`.
- API modules: `instanceApi`, `linkApi`, `nodeApi`, `resourceApi`, `emulateApi`, `platformApi`, `positionApi`, `fileApi`, `databaseApi`

## Cesium (`src/composables/useCesium.ts`)

- **Singleton pattern**: single `ShallowRef<Viewer>` shared across all callers
- Retries Viewer creation with 3 fallback strategies in Electron (1s delay between attempts)
- `baseLayer: false` → ArcGIS World_Imagery + World_Boundaries_and_Places overlay (alpha 0.5)
- Terrain: `CesiumWorldTerrain` with `requestVertexNormals: true`, `verticalExaggeration: 1.5`
- Disables credit display, sun, moon, fog, collision detection
- Camera zoom: `minZoom=5,000,000`, `maxZoom=80,000,000`
- Requires `VITE_CESIUM_ION_TOKEN` with `assets:read` permission

## CesiumViewer.vue (`src/components/cesium/CesiumViewer.vue`)

- `buildScene` recreates all entities on any store change (satellites, ground stations, links, paths)
- Satellite point coloring by altitude + status override:
  - **LEO** (≤10,000,000m alt): `#2ecc71` green
  - **MEO** (10M–30M alt): `#ff9f43` orange
  - **GEO** (>30,000,000m alt): `#ff6b6b` red
  - **Abnormal** (warning/danger/offline): uses `statusColor()` — red/yellow/gray
- Ground stations: gold cylinder (`#f1c40f`)
- Path trail: 30min for LEO, 1hr for GEO; wider/thicker for abnormal sats

## TypeScript

- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`
- `tsconfig.node.json` only covers `vite.config.ts`

## Electron

- Entry: `electron/main.cjs`, preload: `electron/preload.cjs`
- Context isolation, `window.electronAPI` (getAppVersion, minimize/maximize/closeWindow)
- WebGL probe on `did-finish-load`; `backgroundThrottling: false`

## Styling

Custom CSS variables prefixed `--vscode-*`. Element Plus theme overridden via these variables (dark + light). No CSS framework or preprocessor. Sidebar layout in `App.vue`.
