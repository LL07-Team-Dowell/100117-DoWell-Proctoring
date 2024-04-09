import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const localOrigin = "http://127.0.0.1:5173";
const productionOrigin = "http://0.0.0.0:5173";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    // origin: localOrigin,
    origin: productionOrigin,
  },
})
