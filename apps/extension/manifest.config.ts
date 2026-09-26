import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest(() => ({
  manifest_version: 3,
  name: 'Talentor AI',
  version: '1.0.0',
  permissions: ['storage', 'activeTab'],
  action: {
    default_popup: 'toolbar.html',
    default_title: 'Talentor AI',
    default_icon: {
      16: '16.png',
      48: '48.png',
      128: '128.png',
    },
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/modules/injector/index.tsx'],
      run_at: 'document_idle',
    },
    {
      matches: ['https://www.youtube.com/*'],
      js: ['src/modules/focus/content.ts'],
      run_at: 'document_start',
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
