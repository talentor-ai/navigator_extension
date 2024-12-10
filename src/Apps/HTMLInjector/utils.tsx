import { BUTTON_CONTAINER_PATH } from '@injector/constants';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ToRender from './App';

// Before all, remove the previous elements injected
export const removeInjectedContent = () => {
  const injectedElements = document.querySelectorAll(
    '#talentor-ai-injected-add-button',
  );
  injectedElements.forEach((element) => {
    element.remove();
  });
};

// Function to inject code into the .jobs-search-results__list-item elements
export const injectHTMLBaseContent = (observer: MutationObserver) => {
  const container = document.querySelector(BUTTON_CONTAINER_PATH)?.parentNode;
  console.info(container);

  if (!container) return;

  observer.disconnect(); // Stop observing once the target is found

  // Create a container for the React component
  const reactRoot = document.createElement('div');
  reactRoot.id = 'talentor-ai-injected-button';

  // Inject the container into the target element
  container.appendChild(reactRoot);

  // Mount the React component
  createRoot(document.getElementById('talentor-ai-injected-button')!).render(
    <StrictMode>
      <ToRender />
    </StrictMode>,
  );
};
