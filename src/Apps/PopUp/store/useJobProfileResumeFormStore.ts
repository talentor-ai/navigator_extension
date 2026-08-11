import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FormState = {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  clearFormData: () => void;
};

const FORM_INITIAL_STATE = {
  id: '',
  briefDescription: '',
  aboutMe: '',
  additionalSkills: [],
  softSkills: [],
  languages: [],
  linkedInUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  userJobProfileExperiences: [],
  userJobProfileSkills: [],
  userId: '',
};

const useJobProfileResumeFormStore = create(
  persist<FormState>(
    (set) => ({
      formData: FORM_INITIAL_STATE,
      setFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      clearFormData: () => set({ formData: FORM_INITIAL_STATE }),
    }),
    {
      name: 'job-post-form',
    },
  ),
);

export default useJobProfileResumeFormStore;
