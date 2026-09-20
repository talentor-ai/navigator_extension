import { DEFAULT_ROOT_SELECTOR } from './constants/defaults';
import { createHighlighter } from './engine/createHighlighter';
import {
  getSelectorForHost,
  readHighlighterSelectors,
  subscribeHighlighterSelectors,
} from './selectors';
import {
  readHighlighterSettings,
  subscribeHighlighterSettings,
} from './storage';
import type { HighlighterController } from './types';

const resolveRootSelector = (
  selectors: Record<string, string>,
  hostname: string,
): string => {
  const selector = getSelectorForHost(selectors, hostname).trim();
  return selector === '' ? DEFAULT_ROOT_SELECTOR : selector;
};

/**
 * Starts keyword highlighting when the feature is enabled, scoped to the
 * selector configured for the current hostname (whole page by default). Reacts
 * to popup settings and per-host selector changes without a page reload: when
 * the selector for this host changes, the controller is rebuilt so the whole
 * container is scanned again.
 */
export const startHighlighter = (): (() => void) => {
  const hostname = window.location.hostname;
  let controller: HighlighterController | null = null;
  let activeSelector: string | null = null;

  const stopController = (): void => {
    if (!controller) return;
    try {
      controller.stop();
    } catch {
      /* engine teardown must never break the coordinator */
    }
    controller = null;
    activeSelector = null;
  };

  const sync = async (): Promise<void> => {
    try {
      const [settings, selectors] = await Promise.all([
        readHighlighterSettings(),
        readHighlighterSelectors(),
      ]);

      if (!settings.enabled) {
        stopController();
        return;
      }

      const rootSelector = resolveRootSelector(selectors, hostname);

      if (controller && rootSelector === activeSelector) return;

      stopController();
      activeSelector = rootSelector;
      controller = createHighlighter({ rootSelector });
    } catch {
      stopController();
    }
  };

  const runSync = (): void => {
    void sync();
  };

  const unsubscribeSettings = subscribeHighlighterSettings(runSync);
  const unsubscribeSelectors = subscribeHighlighterSelectors(runSync);

  runSync();

  return () => {
    stopController();
    unsubscribeSettings();
    unsubscribeSelectors();
  };
};
