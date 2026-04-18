import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue(), cesium()],
    base: './', // Electron 需要相对路径
    server: {
      port: 3000,
      // 如果设置了 VITE_API_BASE_URL，则不使用代理，直接使用环境变量中的地址
      // 如果没有设置，则代理到真实后端（需要根据实际情况修改 IP）
      proxy: env.VITE_API_BASE_URL ? {} : {
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
      // 关闭压缩，避免某些第三方库在极端压缩下触发奇怪的运行时错误
      // 桌面客户端对体积不敏感，这样更稳定也更方便排查问题
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
