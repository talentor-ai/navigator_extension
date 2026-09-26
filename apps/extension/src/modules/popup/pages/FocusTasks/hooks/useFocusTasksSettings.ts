import { useCallback, useEffect, useMemo } from 'react';
import { getFocusTaskSettings, isYouTubeHost } from '@modules/focus';
import useFocusTasksStore, {
  startFocusTasksStoreSync,
} from '@modules/popup/store/useFocusTasksStore';
import useCurrentHostname from './useCurrentHostname';

const useFocusTasksSettings = () => {
  const hostname = useCurrentHostname();
  const tasks = useFocusTasksStore((state) => state.tasks);
  const isHydrated = useFocusTasksStore((state) => state.isHydrated);
  const setRemoveShorts = useFocusTasksStore((state) => state.setRemoveShorts);

  useEffect(() => {
    startFocusTasksStoreSync();
  }, []);

  const isYouTube = useMemo(() => isYouTubeHost(hostname), [hostname]);
  const settings = useMemo(
    () => getFocusTaskSettings(tasks, hostname),
    [tasks, hostname],
  );
  const isLoading = !isHydrated;

  const updateRemoveShorts = useCallback(
    async (value: boolean) => {
      if (!hostname) return;
      await setRemoveShorts(hostname, value);
    },
    [hostname, setRemoveShorts],
  );

  return { hostname, isYouTube, settings, isLoading, updateRemoveShorts };
};

export default useFocusTasksSettings;
