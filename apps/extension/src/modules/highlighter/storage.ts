import { subscribeStorageChanges } from '@common/utils/extensionContext';
import type { HighlighterSettings } from './types';

export const HIGHLIGHTER_SETTINGS_KEY = 'highlighter-settings';

/**
 * Per-hostname enable flags, keyed by exact hostname (`window.location.hostname`).
 * A missing key means the highlighter is disabled on that page, so the flag is
 * never shared across sites. Stored in `chrome.storage.local` because both the
 * popup iframe and the page content script must read it.
 */
export const DEFAULT_HIGHLIGHTER_SETTINGS: HighlighterSettings = {};

export const normalizeHighlighterSettings = (
  value: unknown,
): HighlighterSettings => {
  if (!value || typeof value !== 'object') return {};

  const settings: HighlighterSettings = {};

  for (const [host, enabled] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (!host || typeof enabled !== 'boolean') continue;
    settings[host] = enabled;
  }

  return settings;
};

export const isHighlighterEnabledForHost = (
  settings: HighlighterSettings,
  hostname: string | null | undefined,
): boolean => (hostname ? settings[hostname] === true : false);

export const readHighlighterSettings =
  async (): Promise<HighlighterSettings> => {
    try {
      const result = await chrome.storage?.local?.get(HIGHLIGHTER_SETTINGS_KEY);
      return normalizeHighlighterSettings(result?.[HIGHLIGHTER_SETTINGS_KEY]);
    } catch {
      return {};
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

/**
 * Persists the flag for a single host. Disabling deletes the host key instead of
 * storing a stale `false`, keeping the map free of no-op records.
 */
export const setHighlighterEnabled = async (
  hostname: string,
  enabled: boolean,
): Promise<void> => {
  if (!hostname) return;

  const settings = await readHighlighterSettings();

  if (enabled) {
    settings[hostname] = true;
  } else {
    delete settings[hostname];
  }

  await writeHighlighterSettings(settings);
};

export const subscribeHighlighterSettings = (
  listener: (settings: HighlighterSettings) => void,
): (() => void) => {
  const handler = (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string,
  ) => {
    if (area !== 'local' || !changes[HIGHLIGHTER_SETTINGS_KEY]) return;
    listener(
      normalizeHighlighterSettings(changes[HIGHLIGHTER_SETTINGS_KEY].newValue),
    );
  };

  return subscribeStorageChanges(handler);
};
