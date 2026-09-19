import type { HighlighterSettings } from './types';

export const HIGHLIGHTER_SETTINGS_KEY = 'highlighter-settings';

export const DEFAULT_HIGHLIGHTER_SETTINGS: HighlighterSettings = {
  enabled: false,
};

const normalizeSettings = (value: unknown): HighlighterSettings => {
  const record =
    value && typeof value === 'object' ? (value as { enabled?: unknown }) : {};

  return {
    enabled: typeof record.enabled === 'boolean' ? record.enabled : false,
  };
};

export const readHighlighterSettings =
  async (): Promise<HighlighterSettings> => {
    try {
      const result = await chrome.storage?.local?.get(HIGHLIGHTER_SETTINGS_KEY);
      return normalizeSettings(result?.[HIGHLIGHTER_SETTINGS_KEY]);
    } catch {
      return normalizeSettings(undefined);
    }
  };

export const writeHighlighterSettings = async (
  settings: HighlighterSettings,
): Promise<void> => {
  try {
    await chrome.storage?.local?.set({
      [HIGHLIGHTER_SETTINGS_KEY]: settings,
    });
  } catch {
    /* storage unavailable; nothing to persist */
  }
};

export const subscribeHighlighterSettings = (
  listener: (settings: HighlighterSettings) => void,
): (() => void) => {
  if (!chrome.storage?.onChanged) return () => {};
  const handler = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: string,
  ) => {
    if (area !== 'local' || !changes[HIGHLIGHTER_SETTINGS_KEY]) return;
    listener(normalizeSettings(changes[HIGHLIGHTER_SETTINGS_KEY].newValue));
  };
  chrome.storage.onChanged.addListener(handler);
  return () => chrome.storage.onChanged.removeListener(handler);
};
