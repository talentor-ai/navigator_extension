import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getSelectorForHost,
  readHighlighterSelectors,
  setHighlighterSelector,
  subscribeHighlighterSelectors,
} from '@modules/highlighter';

const DEBOUNCE_MS = 300;
const SELECTOR_FIELD = 'selector';

const readHostname = (): string => {
  try {
    return new URLSearchParams(window.location.search).get('host') ?? '';
  } catch {
    return '';
  }
};

/**
 * Resolves the current host's CSS selector, hydrates it into a small RHF form
 * (so the shared `Input` container can be reused), and persists changes to the
 * shared highlighter selector map (debounced, per exact hostname).
 */
const useHighlighterSelector = () => {
  const hostname = useMemo(readHostname, []);
  const { register, watch, reset } = useForm<{ selector: string }>({
    defaultValues: { selector: '' },
  });
  const [isLoading, setIsLoading] = useState(Boolean(hostname));
  const selector = watch(SELECTOR_FIELD);
  const selectorRef = useRef('');
  const lastPersistedRef = useRef('');

  selectorRef.current = selector ?? '';

  useEffect(() => {
    if (!hostname) {
      setIsLoading(false);
      return;
    }

    let active = true;

    void readHighlighterSelectors().then((selectors) => {
      if (!active) return;
      const stored = getSelectorForHost(selectors, hostname);
      lastPersistedRef.current = stored;
      reset({ selector: stored });
      setIsLoading(false);
    });

    const unsubscribe = subscribeHighlighterSelectors((selectors) => {
      if (!active) return;
      const next = getSelectorForHost(selectors, hostname);
      if (next === lastPersistedRef.current) return;
      lastPersistedRef.current = next;
      reset({ selector: next });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [hostname, reset]);

  useEffect(() => {
    if (!hostname || isLoading) return;

    const value = selectorRef.current;

    const timeoutId = window.setTimeout(() => {
      if (value === lastPersistedRef.current) return;
      lastPersistedRef.current = value;
      void setHighlighterSelector(hostname, value);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [selector, hostname, isLoading]);

  return {
    hasHostname: Boolean(hostname),
    isLoading,
    register,
  };
};

export default useHighlighterSelector;
