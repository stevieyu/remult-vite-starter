import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import serverPlugin from './server/vitePlugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    serverPlugin()
  ],
})
