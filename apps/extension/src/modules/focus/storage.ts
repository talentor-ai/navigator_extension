import { DEFAULT_FOCUS_TASK_SETTINGS, FOCUS_TASKS_KEY } from './constants';
import type { FocusTaskSettings, FocusTasks } from './types';

const normalizeFocusTaskSettings = (value: unknown): FocusTaskSettings => {
  const record =
    value && typeof value === 'object'
      ? (value as { removeShorts?: unknown })
      : {};

  return {
    removeShorts:
      typeof record.removeShorts === 'boolean' ? record.removeShorts : false,
  };
};

export const normalizeFocusTasks = (value: unknown): FocusTasks => {
  if (!value || typeof value !== 'object') return {};

  const tasks: FocusTasks = {};

  for (const [host, entry] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (!host || !entry || typeof entry !== 'object') continue;
    tasks[host] = normalizeFocusTaskSettings(entry);
  }

  return tasks;
};

export const getFocusTaskSettings = (
  tasks: FocusTasks,
  hostname: string | null | undefined,
): FocusTaskSettings =>
  hostname
    ? (tasks[hostname] ?? DEFAULT_FOCUS_TASK_SETTINGS)
    : DEFAULT_FOCUS_TASK_SETTINGS;

export const readFocusTasks = async (): Promise<FocusTasks> => {
  try {
    const result = await chrome.storage?.local?.get(FOCUS_TASKS_KEY);
    return normalizeFocusTasks(result?.[FOCUS_TASKS_KEY]);
  } catch {
    return {};
  }
};

export const writeFocusTasks = async (tasks: FocusTasks): Promise<void> => {
  try {
    await chrome.storage?.local?.set({ [FOCUS_TASKS_KEY]: tasks });
  } catch {
    /* storage unavailable; nothing to persist */
  }
};

/**
 * Persists the settings for a single host. When `removeShorts` is false the
 * host key is deleted instead of storing a stale `{ removeShorts: false }`
 * entry, keeping the storage map free of no-op records.
 */
export const setFocusTaskSettings = async (
  hostname: string,
  settings: FocusTaskSettings,
): Promise<void> => {
  if (!hostname) return;

  const tasks = await readFocusTasks();

  if (settings.removeShorts) {
    tasks[hostname] = { removeShorts: true };
  } else {
    delete tasks[hostname];
  }

  await writeFocusTasks(tasks);
};

export const subscribeFocusTasks = (
  listener: (tasks: FocusTasks) => void,
): (() => void) => {
  if (!chrome.storage?.onChanged) return () => {};

  const handler = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: string,
  ) => {
    if (area !== 'local' || !changes[FOCUS_TASKS_KEY]) return;
    listener(normalizeFocusTasks(changes[FOCUS_TASKS_KEY].newValue));
  };

  chrome.storage.onChanged.addListener(handler);
  return () => chrome.storage.onChanged.removeListener(handler);
};
