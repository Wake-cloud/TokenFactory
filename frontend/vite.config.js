import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.js


export default defineConfig({
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
  define: {
    global: 'window', // Ensures global is properly set in the browser
  },
});
