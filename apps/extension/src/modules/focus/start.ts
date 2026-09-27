import {
  getFocusTaskSettings,
  readFocusTasks,
  subscribeFocusTasks,
} from './storage';
import type { FocusTaskSettings } from './types';
import { applyYouTubeFocusTasks, isYouTubeHost } from './youtube';

/**
 * Starts the focus tasks for the current host. Only YouTube hosts are acted on;
 * elsewhere this is a no-op. Subscribes to focus-task storage changes so popup
 * toggles take effect live (no reload), and returns a cleanup. Idempotent for
 * React StrictMode double-invoke: every `start` returns its own cleanup.
 */
export const startFocusTasks = (): (() => void) => {
  const hostname = window.location.hostname;

  if (!isYouTubeHost(hostname)) return () => {};

  let cleanup: (() => void) | null = null;
  let isDisposed = false;
  let generation = 0;

  const stopTasks = (): void => {
    if (!cleanup) return;
    try {
      cleanup();
    } catch {
      /* teardown must never break the coordinator */
    }
    cleanup = null;
  };

  const applySettings = (settings: FocusTaskSettings): void => {
    stopTasks();
    try {
      cleanup = applyYouTubeFocusTasks(settings);
    } catch {
      cleanup = null;
    }
  };

  const sync = async (): Promise<void> => {
    const runId = ++generation;
    try {
      const tasks = await readFocusTasks();
      if (isDisposed || runId !== generation) return;
      applySettings(getFocusTaskSettings(tasks, hostname));
    } catch {
      if (isDisposed || runId !== generation) return;
      stopTasks();
    }
  };

  const runSync = (): void => {
    void sync();
  };

  const unsubscribe = subscribeFocusTasks(runSync);

  runSync();

  return () => {
    isDisposed = true;
    stopTasks();
    unsubscribe();
  };
};
