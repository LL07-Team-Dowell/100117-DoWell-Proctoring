import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// const origin = "http://127.0.0.1:4173"; // local
const origin = "http://0.0.0.0:4173"; // production

const publicBasePath = '/';

// https://vitejs.dev/config/
export default defineConfig({
  base: publicBasePath,
  plugins: [react()],
  server: {
    port: 4173,
    strictPort: true,
    host: true,
    origin: origin,
  },
})
