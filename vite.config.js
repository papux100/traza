import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // En desarrollo, las peticiones a /api se reenvían al servidor Fastify local.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    // El cliente de Supabase hace crecer el paquete; el aviso de tamaño no aplica aquí.
    chunkSizeWarningLimit: 800,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
