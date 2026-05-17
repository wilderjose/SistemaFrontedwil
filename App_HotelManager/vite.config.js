import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Redirige cualquier petición que empiece con /api al backend
      '/api': {
        target: 'http://127.0.0.1:8000', // <-- El puerto donde corre tu Django/Node
        changeOrigin: true,
        secure: false,
      }
    }
  }
})