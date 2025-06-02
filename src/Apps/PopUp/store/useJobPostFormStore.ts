import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FormState = {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  clearFormData: () => void;
};

const INITIAL_STATE = {
  title: '',
  position: '',
  jobType: '',
  description: '',
  location: '',
  companyName: '',
  companyBriefDescription: '',
  companyDescription: '',
  companyLogoUrl: '',
  companyWorkers: 0,
  datePosted: '',
  applicants: 0,
  skills: '',
};

const useJobPostFormStore = create(
  persist<FormState>(
    (set) => ({
      formData: INITIAL_STATE, // Initial state
      setFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      clearFormData: () => set({ formData: INITIAL_STATE }),
    }),
    {
      name: 'job-post-form',
    },
  ),
);

export default useJobPostFormStore;
