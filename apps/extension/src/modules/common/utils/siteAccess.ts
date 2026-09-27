export const ENABLED_HOSTS_KEY = 'enabled-hosts';

export type EnabledHosts = Record<string, true>;

export const SITE_PING = 'talentor:site-ping';
export const SITE_CHANGED = 'talentor:site-changed';

export const getHostname = (url: string | undefined | null): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.hostname || null;
  } catch {
    return null;
  }
};

export const readEnabledHosts = async (): Promise<EnabledHosts> => {
  try {
    const result = await chrome.storage?.local?.get(ENABLED_HOSTS_KEY);
    const stored = result?.[ENABLED_HOSTS_KEY];
    if (stored && typeof stored === 'object') {
      return stored as EnabledHosts;
    }
  } catch {
    /* storage unavailable; treat every site as disabled */
  }
  return {};
};

export const isHostEnabled = async (
  hostname: string | null,
): Promise<boolean> => {
  if (!hostname) return false;
  const hosts = await readEnabledHosts();
  return hosts[hostname] === true;
};

export const setHostEnabled = async (
  hostname: string,
  enabled: boolean,
): Promise<void> => {
  const hosts = await readEnabledHosts();
  if (enabled) {
    hosts[hostname] = true;
  } else {
    delete hosts[hostname];
  }
  try {
    await chrome.storage?.local?.set({ [ENABLED_HOSTS_KEY]: hosts });
  } catch {
    /* storage unavailable; nothing to persist */
  }
};

export const subscribeEnabledHosts = (
  listener: (hosts: EnabledHosts) => void,
): (() => void) => {
  if (!chrome.storage?.onChanged) return () => {};
  const handler = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: string,
  ) => {
    if (area !== 'local' || !changes[ENABLED_HOSTS_KEY]) return;
    const next = changes[ENABLED_HOSTS_KEY].newValue;
    listener(next && typeof next === 'object' ? (next as EnabledHosts) : {});
  };
  chrome.storage.onChanged.addListener(handler);
  return () => chrome.storage.onChanged.removeListener(handler);
};
