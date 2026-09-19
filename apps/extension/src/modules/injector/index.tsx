import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@lang/i18n';
import { App } from './App';
import injectorCss from './injector.css?inline';

const HOST_ID = 'talentor-ai-root';
const ROOT_ID = 'talentor-ai-shadow-root';

const mount = () => {
  if (document.getElementById(HOST_ID)) return;

  const host = document.createElement('div');
  host.id = HOST_ID;

  const shadowRoot = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = injectorCss;
  shadowRoot.appendChild(style);

  const root = document.createElement('div');
  root.id = ROOT_ID;
  shadowRoot.appendChild(root);

  document.documentElement.appendChild(host);

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
