import { create } from 'zustand';
import type { FocusTasks } from '@modules/focus';
import {
  readFocusTasks,
  setFocusTaskSettings,
  subscribeFocusTasks,
} from '@modules/focus';

// chrome.storage.local (not localStorage) is required because the popup iframe
// (extension origin) and the YouTube content script (youtube.com origin) have
// different origins and do not share localStorage. This store is the single
// writer of the `focus-tasks` chrome.storage.local key.

interface FocusTasksStore {
  tasks: FocusTasks;
  isHydrated: boolean;
  setRemoveShorts: (hostname: string, value: boolean) => Promise<void>;
}

const useFocusTasksStore = create<FocusTasksStore>((set) => ({
  tasks: {},
  isHydrated: false,
  setRemoveShorts: async (hostname, value) => {
    set((state) => {
      const next: FocusTasks = { ...state.tasks };
      if (value) {
        next[hostname] = { removeShorts: true };
      } else {
        delete next[hostname];
      }
      return { tasks: next };
    });
    await setFocusTaskSettings(hostname, { removeShorts: value });
  },
}));

let isSyncStarted = false;

export const startFocusTasksStoreSync = (): void => {
  if (isSyncStarted) return;
  isSyncStarted = true;

  void readFocusTasks().then((tasks) => {
    useFocusTasksStore.setState({ tasks, isHydrated: true });
  });

  subscribeFocusTasks((tasks) => {
    useFocusTasksStore.setState({ tasks, isHydrated: true });
  });
};

export default useFocusTasksStore;
