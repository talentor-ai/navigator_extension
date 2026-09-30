import { create } from 'zustand';
import {
  DEFAULT_HIGHLIGHTER_SETTINGS,
  readHighlighterSettings,
  setHighlighterEnabled,
  subscribeHighlighterSettings,
} from '@modules/highlighter';
import type { HighlighterSettings } from '@modules/highlighter';

// chrome.storage.local (not localStorage) is required because the popup iframe
// (extension origin) and the page content script (host-page origin) have
// different origins and do not share localStorage. This store is the single
// writer of the `highlighter-settings` chrome.storage.local key; the content
// script only reads it.

interface HighlighterSettingsStore {
  settings: HighlighterSettings;
  isHydrated: boolean;
  setEnabled: (hostname: string, value: boolean) => Promise<void>;
}

const useHighlighterSettingsStore = create<HighlighterSettingsStore>((set) => ({
  settings: DEFAULT_HIGHLIGHTER_SETTINGS,
  isHydrated: false,
  setEnabled: async (hostname, value) => {
    set((state) => {
      const next: HighlighterSettings = { ...state.settings };
      if (value) {
        next[hostname] = true;
      } else {
        delete next[hostname];
      }
      return { settings: next };
    });
    await setHighlighterEnabled(hostname, value);
  },
}));

let isSyncStarted = false;

export const startHighlighterSettingsStoreSync = (): void => {
  if (isSyncStarted) return;
  isSyncStarted = true;

  void readHighlighterSettings().then((settings) => {
    useHighlighterSettingsStore.setState({ settings, isHydrated: true });
  });

  subscribeHighlighterSettings((settings) => {
    useHighlighterSettingsStore.setState({ settings, isHydrated: true });
  });
};

export default useHighlighterSettingsStore;
