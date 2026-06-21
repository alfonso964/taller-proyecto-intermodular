import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // 👈 Importamos el plugin

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza la app automáticamente cuando subas cambios
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Taller Montilla - IA Diagnostic',
        short_name: 'TallerIA',
        description: 'Aplicación de gestión y diagnóstico inteligente para talleres mecánicos',
        theme_color: '#2563eb', // El azul corporativo de tus títulos del CV
        background_color: '#ffffff',
        display: 'standalone', // Hace que se abra a pantalla completa sin barra de navegador
        orientation: 'portrait', // Fuerza la orientación vertical en el móvil
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
            purpose: 'any maskable' // Permite que Android adapte el icono a círculos o cuadrados
          }
        ]
      }
    })
  ]
});