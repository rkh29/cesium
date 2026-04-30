import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isGithubPages = process.env.GITHUB_ACTIONS === 'true'

  return {
    plugins: [vue(), cesium()],
    base: isGithubPages ? '/Satellite-Anomaly-Detection-System/' : './',
    server: {
      port: 3000,
      proxy: env.VITE_API_BASE_URL
        ? {}
        : {
            '/api': {
              target: 'http://172.30.106.121:8080',
              changeOrigin: true,
              timeout: 5000
            }
          }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: false,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue-vendor': ['vue', 'vue-router', 'pinia']
          }
        }
      }
    }
  }
})
