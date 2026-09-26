export type FocusTaskSettings = {
  removeShorts: boolean;
};

/**
 * Focus-task settings keyed by exact hostname (`window.location.hostname`, no
 * path or route). Stored in `chrome.storage.local` because the popup iframe
 * (extension origin) and the page content script (youtube.com origin) do not
 * share `localStorage`.
 */
export type FocusTasks = Record<string, FocusTaskSettings>;
