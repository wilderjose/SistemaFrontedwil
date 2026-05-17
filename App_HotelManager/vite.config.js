import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          // Si estás programando local, usa localhost. Si no, usa Render.
          target: mode === 'development' 
            ? 'http://127.0.0.1:8000' 
            : 'https://hotel-backend-zzae.onrender.com',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})