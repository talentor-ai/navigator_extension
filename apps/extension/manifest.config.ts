import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest(() => ({
  manifest_version: 3,
  name: 'Talentor AI',
  version: '1.0.0',
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/modules/injector/index.tsx'],
      run_at: 'document_idle',
    },
  ],
  web_accessible_resources: [
    {
      resources: ['index.html', 'assets/*'],
      matches: ['http://*/*', 'https://*/*'],
    },
  ],
  icons: {
    '16': '16.png',
    '48': '48.png',
    '128': '128.png',
  },
}));
