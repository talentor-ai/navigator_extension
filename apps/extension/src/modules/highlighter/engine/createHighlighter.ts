import {
  DEFAULT_KEYWORD_LISTS,
  DEFAULT_ROOT_SELECTOR,
  DEFAULT_TEXT_SELECTOR,
  DEFAULT_THEME_MODE,
} from '../constants/defaults';
import type { HighlighterController, HighlighterOptions } from '../types';
import { supportsCustomHighlights } from './dom';
import { HIGHLIGHT_TONES, buildPatternSets } from './patterns';
import { createScanner } from './scan';
import {
  HIGHLIGHT_NAMES,
  buildHighlightStyle,
  isDarkThemeActive,
  observeThemeChanges,
} from './theme';

const STYLE_ID = 'talentor-highlighter-style';

const OBSERVER_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  characterData: true,
};

export const createHighlighter = (
  options: HighlighterOptions = {},
): HighlighterController => {
  const noopController: HighlighterController = { stop: () => {} };

  if (!supportsCustomHighlights()) {
    return noopController;
  }

  const {
    rootSelector = DEFAULT_ROOT_SELECTOR,
    textSelector = DEFAULT_TEXT_SELECTOR,
    themeMode = DEFAULT_THEME_MODE,
    keywordLists = DEFAULT_KEYWORD_LISTS,
  } = options;

  const patternSets = buildPatternSets(keywordLists);

  const findRoot = (): Element | null => {
    try {
      return (
        document.querySelector(rootSelector) ??
        document.querySelector(DEFAULT_ROOT_SELECTOR)
      );
    } catch {
      try {
        return document.querySelector(DEFAULT_ROOT_SELECTOR);
      } catch {
        return null;
      }
    }
  };

  const initialRoot = findRoot();

  if (!initialRoot) {
    return noopController;
  }

  const scanner = createScanner(textSelector, patternSets);

  let observedRoot: Element | null = null;
  let rootObserver: MutationObserver | null = null;
  let documentObserver: MutationObserver | null = null;
  let stopThemeObserver: (() => void) | null = null;
  let animationFrameId: number | null = null;
  let stopped = false;

  const clearManagedHighlights = (): void => {
    if (!globalThis.CSS?.highlights) return;

    for (const name of Object.values(HIGHLIGHT_NAMES)) {
      CSS.highlights.delete(name);
    }
  };

  const ensureHighlightStyle = (): void => {
    let style = document.getElementById(STYLE_ID);

    if (!(style instanceof HTMLStyleElement)) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.documentElement.append(style);
    }

    style.textContent = buildHighlightStyle(isDarkThemeActive(themeMode));
  };

  const updateHighlights = (root: Element): void => {
    rootObserver?.disconnect();

    try {
      const rangesByTone = scanner.scan(root);

      for (const tone of HIGHLIGHT_TONES) {
        CSS.highlights.set(
          HIGHLIGHT_NAMES[tone],
          new Highlight(...rangesByTone[tone]),
        );
      }
    } finally {
      if (rootObserver && observedRoot === root && root.isConnected) {
        rootObserver.observe(root, OBSERVER_OPTIONS);
      }
    }
  };

  const scheduleScan = (): void => {
    if (stopped || animationFrameId !== null) return;

    animationFrameId = requestAnimationFrame(() => {
      animationFrameId = null;

      const currentRoot = observedRoot;

      if (!currentRoot || !currentRoot.isConnected) {
        attachRootObserver(findRoot());
        return;
      }

      updateHighlights(currentRoot);
    });
  };

  const attachRootObserver = (root: Element | null): void => {
    if (observedRoot === root && rootObserver) return;

    rootObserver?.disconnect();
    rootObserver = null;
    observedRoot = root;
    clearManagedHighlights();

    if (!observedRoot || !observedRoot.isConnected) return;

    rootObserver = new MutationObserver(scheduleScan);
    updateHighlights(observedRoot);
  };

  const stop = (): void => {
    if (stopped) return;

    stopped = true;

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    rootObserver?.disconnect();
    rootObserver = null;
    documentObserver?.disconnect();
    documentObserver = null;
    stopThemeObserver?.();
    stopThemeObserver = null;

    observedRoot = null;
    clearManagedHighlights();
    document.getElementById(STYLE_ID)?.remove();
  };

  const start = (): void => {
    ensureHighlightStyle();
    stopThemeObserver = observeThemeChanges(themeMode, ensureHighlightStyle);
    attachRootObserver(initialRoot);

    documentObserver = new MutationObserver(() => {
      const nextRoot = findRoot();

      if (nextRoot !== observedRoot) {
        attachRootObserver(nextRoot);
      }
    });

    documentObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  start();

  return { stop };
};
