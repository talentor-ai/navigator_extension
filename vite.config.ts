import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { crx } from '@crxjs/vite-plugin';
import tsConfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.config.ts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsConfigPaths(), crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
