import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest(() => ({
  manifest_version: 3,
  name: 'Talentor AI',
  version: '1.0.0',
  icons: {
    '16': '16.png',
    '48': '48.png',
    '128': '128.png',
  },
}));
