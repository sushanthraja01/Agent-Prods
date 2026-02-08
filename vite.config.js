import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],

  build: {
    outDir: "dist"
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://ae-sprotsbackend.onrender.com",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
