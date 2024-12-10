import { createRoot } from 'react-dom/client';
import { BUTTON_CONTAINER_PATH } from './constants';
import { StrictMode } from 'react';
import { ApplyButton } from '@injector/components';

console.info('Running injector!');

// -------------------------------------------- Addition of button
(function () {
  const observer = new MutationObserver(() => {
    const container = document.querySelector(BUTTON_CONTAINER_PATH)?.parentNode;

    if (!container) return;

    observer.disconnect(); // Stop observing once the target is found

    // Create a container for the React component
    const reactRoot = document.createElement('div');
    reactRoot.id = 'talentor-ai-injected-button';

    // Inject the container into the target element
    container.appendChild(reactRoot);

    // Mount the React component
    createRoot(reactRoot!).render(
      <StrictMode>
        <ApplyButton />
      </StrictMode>,
    );
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

// --------------------------------------------- Injection of core app
(function () {
  const container =
    (document.querySelector('#artdeco-toasts__wormhole') as HTMLElement) ||
    document.body;
  console.log('Injecting core app');
  // Create a container for the React component
  const shadowHost = document.createElement('div');
  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  // Adding styles to the shadow root
  const styleLink = document.createElement('link');
  styleLink.setAttribute('rel', 'stylesheet');
  styleLink.setAttribute('href', chrome.runtime.getURL('@popup/app.css')); // Link to your Tailwind build
  shadowRoot.appendChild(styleLink);

  const reactRoot = document.createElement('div');
  reactRoot.id = 'talentor-ai-injected-app';
  shadowRoot.appendChild(reactRoot);

  container.appendChild(shadowHost);
  const root = createRoot(document.getElementById('talentor-ai-injected-app')!);
  root.render(<></>);
})();
