/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CESIUM_ION_TOKEN?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_MODE?: 'proxy' | 'remote' | 'mock'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svg' {
  const component: string
  export default component
}
