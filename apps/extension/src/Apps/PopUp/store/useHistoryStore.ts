import { create } from 'zustand';

interface HistoryStore {
  resumeHistory: any[];
  setResumeHistory: (resumeList: any[]) => void;
  resetResumeList: () => void;
}

const useHistoryStore = create<HistoryStore>()((set: any) => ({
  resumeHistory: [],
  setResumeHistory: (resumeList: any[]) =>
    set((store: HistoryStore) => ({
      ...store,
      resumeHistory: resumeList,
    })),
  resetResumeList: () =>
    set((store: HistoryStore) => ({
      ...store,
      resumeHistory: [],
    })),
}));

export default useHistoryStore;
