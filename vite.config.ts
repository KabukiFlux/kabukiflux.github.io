import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_TIME__: JSON.stringify(Date.now().toString(36)),
  },
})
