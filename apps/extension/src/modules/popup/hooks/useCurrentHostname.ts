import { useMemo } from 'react';

const readHostname = (): string => {
  try {
    return new URLSearchParams(window.location.search).get('host') ?? '';
  } catch {
    return '';
  }
};

/**
 * Hostname of the page the overlay iframe was mounted on. The content script
 * passes it as the `host` query param; it never changes for a given iframe.
 */
const useCurrentHostname = (): string => useMemo(() => readHostname(), []);

export default useCurrentHostname;
