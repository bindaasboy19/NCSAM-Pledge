import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cyber-awareness-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        timeout: 240000,
        proxyTimeout: 240000,
        headers: {
          Origin: 'https://ncsam-pledge.vercel.app',
        },
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'https://cyber-awareness-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        timeout: 240000,
        proxyTimeout: 240000,
        headers: {
          Origin: 'https://ncsam-pledge.vercel.app',
        },
      },
    },
  },
});
