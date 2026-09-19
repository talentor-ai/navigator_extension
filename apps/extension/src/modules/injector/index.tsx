import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import '@lang/i18n';
import { App } from './App';
import {
  SITE_CHANGED,
  SITE_PING,
  isHostEnabled,
  subscribeEnabledHosts,
} from '@common/utils/siteAccess';
import injectorCss from './injector.css?inline';

const HOST_ID = 'talentor-ai-root';
const ROOT_ID = 'talentor-ai-shadow-root';

let root: Root | null = null;

const mount = () => {
  if (document.getElementById(HOST_ID)) return;

  const host = document.createElement('div');
  host.id = HOST_ID;

  const shadowRoot = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = injectorCss;
  shadowRoot.appendChild(style);

  const rootElement = document.createElement('div');
  rootElement.id = ROOT_ID;
  shadowRoot.appendChild(rootElement);

  document.documentElement.appendChild(host);

  root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

const unmount = () => {
  root?.unmount();
  root = null;
  document.getElementById(HOST_ID)?.remove();
};

const syncWithSitePreference = async () => {
  const enabled = await isHostEnabled(window.location.hostname);
  if (enabled) {
    mount();
  } else {
    unmount();
  }
};

const start = () => {
  void syncWithSitePreference();
};

subscribeEnabledHosts(() => {
  void syncWithSitePreference();
});

if (chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== SITE_PING && message?.type !== SITE_CHANGED) {
      return;
    }
    sendResponse({ ok: true });
    void syncWithSitePreference();
    return true;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
