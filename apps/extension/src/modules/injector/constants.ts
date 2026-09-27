export const APP_PAGE = 'index.html';

const APP_BASE_URL = chrome.runtime.getURL(APP_PAGE);

/**
 * The popup runs in an extension-origin iframe, so it cannot read the host
 * page URL. Forward the exact hostname (no path/route) as a query param so the
 * Resaltador selector can be scoped per site.
 */
export const APP_URL =
  typeof window !== 'undefined' && window.location.hostname
    ? `${APP_BASE_URL}?host=${encodeURIComponent(window.location.hostname)}`
    : APP_BASE_URL;

export const EDGE_MARGIN = 5;
export const LAUNCHER_SIZE = 56;
export const PANEL_WIDTH = 400;
export const PANEL_HEIGHT = 600;
