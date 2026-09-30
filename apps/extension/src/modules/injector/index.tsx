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
import { isExtensionContextValid } from '@common/utils/extensionContext';
import {
  SITE_CHANGED,
  SITE_PING,
  isHostEnabled,
  subscribeEnabledHosts,
} from '@common/utils/siteAccess';
import injectorCss from './injector.css?inline';

const HOST_ID = 'talentor-ai-root';
const ROOT_ID = 'talentor-ai-shadow-root';

/**
 * Reloading the extension leaves this content script running with dead
 * `chrome.*` bindings. Poll while the overlay is mounted so an orphaned script
 * removes its UI instead of throwing "Extension context invalidated" forever.
 */
const CONTEXT_WATCH_MS = 5000;

let root: Root | null = null;
let stopHighlighter: (() => void) | null = null;
let isShutDown = false;
let contextWatchId: number | null = null;

const clearContextWatch = () => {
  if (contextWatchId === null) return;
  window.clearInterval(contextWatchId);
  contextWatchId = null;
};

const startContextWatch = () => {
  if (contextWatchId !== null || isShutDown) return;

  contextWatchId = window.setInterval(() => {
    if (isExtensionContextValid()) return;
    shutdown();
  }, CONTEXT_WATCH_MS);
};

const mount = () => {
  if (isShutDown || document.getElementById(HOST_ID)) return;

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
  startContextWatch();
};

const unmount = () => {
  clearContextWatch();
  stopJobPicker();
  stopHighlighter?.();
  stopHighlighter = null;
  root?.unmount();
  root = null;
  document.getElementById(HOST_ID)?.remove();
};

const shutdown = () => {
  if (isShutDown) return;
  isShutDown = true;
  unmount();
};

const syncWithSitePreference = async () => {
  if (isShutDown) return;
  if (!isExtensionContextValid()) {
    shutdown();
    return;
  }

  const enabled = await isHostEnabled(window.location.hostname);

  if (isShutDown) return;
  if (!isExtensionContextValid()) {
    shutdown();
    return;
  }

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

// Toolbar popup pings the content script to detect a missing/stale script.
try {
  if (isExtensionContextValid() && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type !== SITE_PING && message?.type !== SITE_CHANGED) {
        return;
      }
      sendResponse({ ok: true });
      void syncWithSitePreference();
      return true;
    });
  }
} catch {
  /* context already invalidated; nothing to register */
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
