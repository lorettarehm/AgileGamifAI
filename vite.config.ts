import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/AgileGamifAI/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
