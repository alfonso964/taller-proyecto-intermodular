import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // 👈 Dejamos tu plugin real (SWC)
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(), // Usa tu plugin nativo sin conflictos
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Taller Montilla - IA Diagnostic',
        short_name: 'TallerIA',
        description: 'Aplicación de gestión y diagnóstico inteligente para talleres mecánicos',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo-pequeño.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-grande.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'logo-grande.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});