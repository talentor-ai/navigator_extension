import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import '@lang/i18n';
import { App } from './App';
import { startHighlighter } from '@modules/highlighter';
import { startJobPicker, stopJobPicker } from './jobPicker';
import {
  JOB_PICKER_START,
  JOB_PICKER_STOP,
  isExtensionOrigin,
} from '@common/utils/jobPickerBridge';
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
let stopHighlighter: (() => void) | null = null;

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

  stopHighlighter = startHighlighter();
};

const unmount = () => {
  stopJobPicker();
  stopHighlighter?.();
  stopHighlighter = null;
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

// Job picker bridge: the overlay iframe asks the content script to highlight
// hovered page elements and return the clicked one's text.
window.addEventListener('message', (event) => {
  if (!isExtensionOrigin(event.origin)) return;
  if (!event.source) return;

  const type = (event.data as { type?: unknown } | null)?.type;
  if (type === JOB_PICKER_START) {
    startJobPicker(event.source as Window);
  } else if (type === JOB_PICKER_STOP) {
    stopJobPicker();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
