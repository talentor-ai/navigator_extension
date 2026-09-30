/**
 * A content script (and any extension page) keeps executing after the extension
 * is reloaded or updated, but its `chrome.*` bindings are dead: every call then
 * throws "Extension context invalidated" and storage listeners never fire again.
 *
 * Guard `chrome.*` access with these helpers and tear the UI down instead of
 * letting orphaned scripts throw uncaught errors.
 */
export const isExtensionContextValid = (): boolean => {
  try {
    return typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id);
  } catch {
    return false;
  }
};

/**
 * Registers a `chrome.storage.local` change listener and returns its
 * unsubscribe. Returns a no-op when the context is already invalidated or when
 * storage is unavailable, and unsubscribing after invalidation never throws.
 */
export const subscribeStorageChanges = (
  listener: (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string,
  ) => void,
): (() => void) => {
  try {
    const onChanged = chrome.storage?.onChanged;
    if (!onChanged) return () => {};

    onChanged.addListener(listener);

    return () => {
      try {
        chrome.storage.onChanged.removeListener(listener);
      } catch {
        /* context gone; the listener died with it */
      }
    };
  } catch {
    return () => {};
  }
};
