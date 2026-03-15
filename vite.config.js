import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方依赖
          vendor: ['vue', 'pinia'],
          // 地图相关
          map: ['@amap/amap-jsapi-loader'],
          // 数据可视化
          chart: ['echarts'],
          // UI库
          bootstrap: ['bootstrap']
        }
      }
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 生成sourcemap
    sourcemap: false
  },
  // 开发服务器配置
  server: {
    port: 5173,
    open: true
  }
})