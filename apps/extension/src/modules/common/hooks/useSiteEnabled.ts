import { useCallback, useEffect, useState } from 'react';
import {
  isHostEnabled,
  setHostEnabled,
  subscribeEnabledHosts,
} from '../utils/siteAccess';

export const useSiteEnabled = (hostname: string | null) => {
  const [enabled, setEnabledState] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!hostname) {
      setIsReady(true);
      return;
    }
    let active = true;
    void isHostEnabled(hostname).then((isEnabled) => {
      if (!active) return;
      setEnabledState(isEnabled);
      setIsReady(true);
    });
    const unsubscribe = subscribeEnabledHosts((hosts) => {
      if (!active) return;
      setEnabledState(hosts[hostname] === true);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [hostname]);

  const setEnabled = useCallback(
    async (next: boolean) => {
      if (!hostname) return;
      setEnabledState(next);
      await setHostEnabled(hostname, next);
    },
    [hostname],
  );

  return { enabled, isReady, setEnabled };
};
