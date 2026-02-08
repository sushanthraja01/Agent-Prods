import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0', // allows access from other PC
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://ae-sprotsbackend.onrender.com', // backend runs here
        changeOrigin: true,
        secure: false
      }
    }
  }
})
