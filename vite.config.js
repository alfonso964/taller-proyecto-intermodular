import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
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
            type: 'image/png',
            purpose: 'any' // 👈 Ahora indicamos claramente que es el icono normal
          },
          {
            src: 'logo-grande.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any' // 👈 Separado para evitar el aviso de maskable innecesario
          }
        ],
        // 👈 Añadimos capturas reales para quitar los avisos de "Richer PWA Install UI"
        // Nota: Asegúrate de guardar dos capturas de tu app en la carpeta public con estos nombres
        screenshots: [
          {
            src: 'captura-movil.png',
            sizes: '360x740',
            type: 'image/png',
            form_factor: 'narrow' // Interfaz de móvil
          },
          {
            src: 'captura-escritorio.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide' // Interfaz de ordenador
          }
        ]
      }
    })
  ]
});