import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import manifest from './src/assets/manifest.json';
import { crx } from '@crxjs/vite-plugin';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.tsx'),
      },
    },
  },
});
