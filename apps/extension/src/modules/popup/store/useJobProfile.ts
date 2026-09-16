import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JobProfileStore {
  jobProfileIdSelected: string | null;
  setJobProfile: (jobProfile: string) => void;
  resetJobProfile: () => void;
}

const useJobProfile = create(
  persist<JobProfileStore>(
    (set: any) => ({
      jobProfileIdSelected: null,
      setJobProfile: (jobProfile: string) =>
        set((store: JobProfileStore) => ({
          ...store,
          jobProfileIdSelected: jobProfile,
        })),
      resetJobProfile: () =>
        set((store: JobProfileStore) => ({
          ...store,
          jobProfileIdSelected: null,
        })),
    }),
    { name: 'jobProfile' },
  ),
);

export default useJobProfile;
