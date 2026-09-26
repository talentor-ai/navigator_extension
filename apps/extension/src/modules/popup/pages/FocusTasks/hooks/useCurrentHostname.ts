import { useMemo } from 'react';

const readHostname = (): string => {
  try {
    return new URLSearchParams(window.location.search).get('host') ?? '';
  } catch {
    return '';
  }
};

const useCurrentHostname = (): string => {
  const hostname = useMemo(() => readHostname(), []);
  return hostname;
};

export default useCurrentHostname;
