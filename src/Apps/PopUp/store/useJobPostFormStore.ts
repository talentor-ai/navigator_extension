import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FormState = {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  clearFormData: () => void;
};

const useJobPostFormStore = create(
  persist<FormState>(
    (set) => ({
      formData: {}, // Initial state
      setFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      clearFormData: () => set({ formData: {} }),
    }),
    {
      name: 'job-post-form',
    },
  ),
);

export default useJobPostFormStore;
