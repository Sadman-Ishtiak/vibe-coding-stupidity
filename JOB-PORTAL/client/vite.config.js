import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        // Keep existing runtime URLs like /assets/css/app.min.css working
        // after moving assets out of public/.
        { src: 'src/assets/**/*', dest: 'assets' },

        // Keep the default Vite favicon reference in index.html working.
        { src: 'src/assets/vite.svg', dest: '' },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('react-router')) return 'router'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react-vendor'

          if (
            id.includes('html-react-parser') ||
            id.includes('htmlparser2') ||
            id.includes('domhandler') ||
            id.includes('domutils') ||
            id.includes('entities')
          ) {
            return 'html-parser'
          }

          return 'vendor'
        },
      },
    },
  },
})
