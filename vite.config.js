import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'analytics.js',
      name: 'Analytics',
      fileName: 'analytics',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        entryFileNames: 'analytics.js'
      }
    }
  }
}); 