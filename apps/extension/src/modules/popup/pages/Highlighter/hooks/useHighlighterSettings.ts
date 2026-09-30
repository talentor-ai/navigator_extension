import { useCallback, useEffect } from 'react';
import { isHighlighterEnabledForHost } from '@modules/highlighter';
import useHighlighterSettingsStore, {
  startHighlighterSettingsStoreSync,
} from '@modules/popup/store/useHighlighterSettingsStore';
import useCurrentHostname from '@modules/popup/hooks/useCurrentHostname';

/**
 * Per-page highlighter flag: reads this iframe's hostname entry from the shared
 * settings store and writes back only that host, so enabling the highlighter on
 * one site never affects another.
 */
const useHighlighterSettings = () => {
  const hostname = useCurrentHostname();
  const settings = useHighlighterSettingsStore((state) => state.settings);
  const isHydrated = useHighlighterSettingsStore((state) => state.isHydrated);
  const setEnabled = useHighlighterSettingsStore((state) => state.setEnabled);

  useEffect(() => {
    startHighlighterSettingsStoreSync();
  }, []);

  const enabled = isHighlighterEnabledForHost(settings, hostname);

  const updateEnabled = useCallback(
    async (value: boolean) => {
      if (!hostname) return;
      await setEnabled(hostname, value);
    },
    [hostname, setEnabled],
  );

  return {
    enabled,
    hasHostname: Boolean(hostname),
    isLoading: !isHydrated,
    updateEnabled,
  };
};

export default useHighlighterSettings;
