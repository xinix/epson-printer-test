import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'dev.bakkersonline.be',
    port: 8808,
    open: '/',
    https: true,
  },
  plugins: [
    vue(),
    mkcert(),
  ],
})
