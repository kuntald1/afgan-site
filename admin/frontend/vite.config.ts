import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served at https://ace-preview.duckdns.org/admin/, not from the domain
  // root — this makes every built asset reference /admin/assets/... instead
  // of /assets/..., which is required for it to load correctly at that path.
  base: '/admin/',
})
