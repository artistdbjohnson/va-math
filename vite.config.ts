import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'VA Math',
        short_name: 'VA Math',
        description: 'Built by a veteran for veterans. Transparent VA disability rating calculator.',
        theme_color: '#0a0c10',
        background_color: '#0a0c10',
        display: 'standalone',
        icons: []
      }
    })
  ]
})