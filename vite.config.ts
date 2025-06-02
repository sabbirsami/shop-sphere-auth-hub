import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    cors: true,
  },
  preview: {
    host: 'localhost',
    port: 5173,
    cors: true,
  },
});
