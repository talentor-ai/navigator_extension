import { injectHTMLBaseContent } from './utils';

console.info('LinkedIn page found!');

/*
 * This component makes 2 things:
 * 1. Just after the DOM is loaded, it injects the base content into the page
 * 2. It observes the pagination container to inject the base content into the new items
 */

if (document.readyState === 'loading') {
  // The document is still loading
  document.addEventListener('DOMContentLoaded', () => {
    injectHTMLBaseContent();

    // Optionally, observe DOM changes to inject into newly added items
    const observer = new MutationObserver(injectHTMLBaseContent);
    observer.observe(document.body, { childList: true, subtree: true });
  });
} else {
  injectHTMLBaseContent();
}

// Creating an observer to update the injected content after the DOM changes
const paginationContainer = document.querySelector(
  '.scaffold-layout__list-container',
);
if (paginationContainer) {
  // Create a MutationObserver instance
  const observer = new MutationObserver((mutationsList) => {
    // Loop through the mutations to find the childList type
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        injectHTMLBaseContent();
      }
    }
  });
  // Start observing the target div for changes
  observer.observe(paginationContainer, {
    childList: true, // Observe when children are added or removed
    attributes: false, // Observe attribute changes
    subtree: false, // Observe all children of the target div
  });
}
