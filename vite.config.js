import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    // Proxy /api/* to the deployed Vercel serverless functions so `npm run dev`
    // works end-to-end without needing `vercel dev`. The proxy bypasses CORS
    // and keeps the same-origin contract from the browser's perspective.
    proxy: {
      '/api': {
        target: 'https://bihar-udyog-mitra.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
