export const HIGHLIGHTER_SELECTORS_KEY = 'highlighter-selectors';

/**
 * Per-host container selector used by the highlighter, keyed by exact hostname
 * (`window.location.hostname`, no path or route). Stored in `chrome.storage.local`
 * because both the popup iframe and the page content script must read it.
 */
export type HighlighterSelectors = Record<string, string>;

export const normalizeHighlighterSelectors = (
  value: unknown,
): HighlighterSelectors => {
  if (!value || typeof value !== 'object') return {};

  const selectors: HighlighterSelectors = {};

  for (const [host, selector] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (typeof selector === 'string' && selector.trim() !== '') {
      selectors[host] = selector;
    }
  }

  return selectors;
};

export const getSelectorForHost = (
  selectors: HighlighterSelectors,
  hostname: string | null | undefined,
): string => (hostname ? (selectors[hostname] ?? '') : '');

export const readHighlighterSelectors =
  async (): Promise<HighlighterSelectors> => {
    try {
      const result = await chrome.storage?.local?.get(
        HIGHLIGHTER_SELECTORS_KEY,
      );
      return normalizeHighlighterSelectors(result?.[HIGHLIGHTER_SELECTORS_KEY]);
    } catch {
      return {};
    }
  };

export const setHighlighterSelector = async (
  hostname: string,
  selector: string,
): Promise<void> => {
  if (!hostname) return;

  const selectors = await readHighlighterSelectors();
  const trimmed = selector.trim();

  if (trimmed === '') {
    delete selectors[hostname];
  } else {
    selectors[hostname] = trimmed;
  }

  try {
    await chrome.storage?.local?.set({
      [HIGHLIGHTER_SELECTORS_KEY]: selectors,
    });
  } catch {
    /* storage unavailable; nothing to persist */
  }
};

export const subscribeHighlighterSelectors = (
  listener: (selectors: HighlighterSelectors) => void,
): (() => void) => {
  if (!chrome.storage?.onChanged) return () => {};

  const handler = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: string,
  ) => {
    if (area !== 'local' || !changes[HIGHLIGHTER_SELECTORS_KEY]) return;
    listener(
      normalizeHighlighterSelectors(
        changes[HIGHLIGHTER_SELECTORS_KEY].newValue,
      ),
    );
  };

  chrome.storage.onChanged.addListener(handler);
  return () => chrome.storage.onChanged.removeListener(handler);
};
