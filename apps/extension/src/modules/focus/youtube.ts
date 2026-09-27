import {
  YOUTUBE_HOSTS,
  YOUTUBE_HOME_URL,
  YOUTUBE_SHORTS_SELECTORS,
} from './constants';
import type { FocusTaskSettings } from './types';

const SHORTS_STYLE_ID = 'talentor-focus-youtube-shorts';

const NAVIGATE_EVENT = 'yt-navigate-finish';

const MUTATION_DEBOUNCE_MS = 200;

export const isYouTubeHost = (hostname: string | null | undefined): boolean =>
  hostname ? YOUTUBE_HOSTS.includes(hostname) : false;

export const isShortsUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return (
      isYouTubeHost(parsed.hostname) && /^\/shorts(\/|$)/.test(parsed.pathname)
    );
  } catch {
    return false;
  }
};

const buildShortsCss = (): string =>
  YOUTUBE_SHORTS_SELECTORS.map(
    (selector) => `${selector} { display: none !important; }`,
  ).join('\n');

const ensureShortsStyle = (): void => {
  if (document.getElementById(SHORTS_STYLE_ID)) return;

  try {
    const style = document.createElement('style');
    style.id = SHORTS_STYLE_ID;
    style.textContent = buildShortsCss();
    (document.head ?? document.documentElement)?.appendChild(style);
  } catch {
    /* page refused the style injection; nothing else to do */
  }
};

const removeShortsStyle = (): void => {
  try {
    document.getElementById(SHORTS_STYLE_ID)?.remove();
  } catch {
    /* detached document during navigation */
  }
};

const redirectIfShorts = (): void => {
  if (!isShortsUrl(window.location.href)) return;
  window.location.replace(YOUTUBE_HOME_URL);
};

type Debounced = (() => void) & { cancel: () => void };

const createDebounced = (fn: () => void, wait: number): Debounced => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const run = ((): void => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn();
    }, wait);
  }) as Debounced;

  run.cancel = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };

  return run;
};

/**
 * Single active Shorts-removal instance per document. Re-applying replaces the
 * previous listeners/observer and returned cleanup functions are guarded so a
 * stale teardown can never remove a newer instance.
 */
let activeCleanup: (() => void) | null = null;

const releaseActive = (): void => {
  const cleanup = activeCleanup;
  if (!cleanup) return;
  cleanup();
};

/**
 * Removes Shorts from YouTube when `settings.removeShorts` is true: injects a
 * single stylesheet and redirects `/shorts` navigations back home. Returns a
 * cleanup that removes the stylesheet, listeners and observer. Idempotent and
 * safe to call repeatedly.
 */
export const applyYouTubeFocusTasks = (
  settings: FocusTaskSettings,
): (() => void) => {
  releaseActive();

  if (!settings.removeShorts) {
    removeShortsStyle();
    return () => {};
  }

  ensureShortsStyle();

  const runChecks = (): void => {
    ensureShortsStyle();
    redirectIfShorts();
  };

  const scheduleCheck = createDebounced(runChecks, MUTATION_DEBOUNCE_MS);

  const handleNavigation = (): void => {
    runChecks();
  };

  document.addEventListener(NAVIGATE_EVENT, handleNavigation);
  window.addEventListener('popstate', handleNavigation);

  let observer: MutationObserver | null = null;

  try {
    const root = document.documentElement;
    if (root) {
      observer = new MutationObserver(() => scheduleCheck());
      observer.observe(root, { childList: true, subtree: true });
    }
  } catch {
    observer = null;
  }

  runChecks();

  const cleanup = (): void => {
    if (activeCleanup !== cleanup) return;
    activeCleanup = null;

    document.removeEventListener(NAVIGATE_EVENT, handleNavigation);
    window.removeEventListener('popstate', handleNavigation);
    scheduleCheck.cancel();
    observer?.disconnect();
    removeShortsStyle();
  };

  activeCleanup = cleanup;

  return cleanup;
};
