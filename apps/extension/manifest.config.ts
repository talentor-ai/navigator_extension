import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest(() => ({
  manifest_version: 3,
  name: 'Talentor AI',
  version: '1.0.0',
  action: {
    default_popup: 'index.html',
  },
  permissions: ['activeTab', 'scripting'],
  background: {
    service_worker: 'src/Apps/ServiceWorker/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://www.linkedin.com/jobs/*'],
      js: ['src/Apps/HTMLInjector/index.tsx'],
    },
  ],
  icons: {
    '16': '16.png',
    '48': '48.png',
    '128': '128.png',
  },
}));
