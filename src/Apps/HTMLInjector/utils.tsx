// Before all, remove the previous elements injected
export const removeInjectedContent = () => {
  const injectedElements = document.querySelectorAll(
    '.talentor-ai-injected-add-button',
  );
  injectedElements.forEach((element) => {
    element.remove();
  });
};

// Function to inject code into the .jobs-search-results__list-item elements
export const injectHTMLBaseContent = () => {
  // Removing the previous injected elements
  removeInjectedContent();

  const jobItems = document.querySelectorAll('.jobs-search-results__list-item');

  if (jobItems.length > 0) {
    jobItems.forEach((item) => {
      // Create a test element to inject
      // TODO: Remove this code and inject React components
      const injectedElement = document.createElement('div');
      injectedElement.className = 'talentor-ai-injected-add-button'; // Add a class to the injected element
      injectedElement.textContent = 'X';
      injectedElement.style.color = 'red'; // Style the injected content
      injectedElement.style.cssText = `position: absolute; top: 0; left: 0; z-index: 9999`; // Reset the style of the injected content

      // Append the injected element to each job item
      item.appendChild(injectedElement); // Add a relative position to the parent element
    });
  } else {
    console.info('No elements found.');
  }
};
