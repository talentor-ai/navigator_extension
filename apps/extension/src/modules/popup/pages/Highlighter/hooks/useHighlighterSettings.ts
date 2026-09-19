import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_HIGHLIGHTER_SETTINGS,
  readHighlighterSettings,
  subscribeHighlighterSettings,
  writeHighlighterSettings,
} from '@modules/highlighter';
import type { HighlighterSettings } from '@modules/highlighter';

const useHighlighterSettings = () => {
  const [settings, setSettings] = useState<HighlighterSettings>(
    DEFAULT_HIGHLIGHTER_SETTINGS,
  );
  const [isLoading, setIsLoading] = useState(true);
  const settingsRef = useRef<HighlighterSettings>(DEFAULT_HIGHLIGHTER_SETTINGS);

  const applySettings = useCallback((next: HighlighterSettings) => {
    if (settingsRef.current.enabled === next.enabled) return;
    settingsRef.current = next;
    setSettings(next);
  }, []);

  useEffect(() => {
    let active = true;

    void readHighlighterSettings().then((stored) => {
      if (!active) return;
      applySettings(stored);
      setIsLoading(false);
    });

    const unsubscribe = subscribeHighlighterSettings((next) => {
      if (!active) return;
      applySettings(next);
      setIsLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [applySettings]);

  const updateEnabled = useCallback(async (enabled: boolean) => {
    const current = settingsRef.current;
    if (current.enabled === enabled) return;
    const next: HighlighterSettings = { enabled };
    settingsRef.current = next;
    setSettings(next);
    await writeHighlighterSettings(next);
  }, []);

  return { settings, isLoading, updateEnabled };
};

export default useHighlighterSettings;
