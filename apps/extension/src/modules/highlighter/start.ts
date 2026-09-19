import { createHighlighter } from './engine/createHighlighter';
import {
  readHighlighterSettings,
  subscribeHighlighterSettings,
} from './storage';
import type { HighlighterController } from './types';

/**
 * Starts whole-page highlighting when the feature is enabled and stops it when
 * disabled. Reacts to settings changes from the popup without a page reload.
 */
export const startHighlighter = (): (() => void) => {
  let controller: HighlighterController | null = null;

  const stopController = (): void => {
    if (!controller) return;
    try {
      controller.stop();
    } catch {
      /* engine teardown must never break the coordinator */
    }
    controller = null;
  };

  const sync = async (): Promise<void> => {
    try {
      const settings = await readHighlighterSettings();

      if (!settings.enabled) {
        stopController();
        return;
      }

      if (controller) return;
      controller = createHighlighter();
    } catch {
      stopController();
    }
  };

  const runSync = (): void => {
    void sync();
  };

  const unsubscribeSettings = subscribeHighlighterSettings(runSync);

  runSync();

  return () => {
    stopController();
    unsubscribeSettings();
  };
};
