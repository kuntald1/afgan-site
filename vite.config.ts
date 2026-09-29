import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // three.js is the heaviest dependency — split it (and framer-motion)
        // into separate chunks so they cache independently and don't block
        // the initial paint.
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (
              id.includes('three') ||
              id.includes('@react-three')
            ) {
              return 'three'
            }
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
              return 'motion'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
