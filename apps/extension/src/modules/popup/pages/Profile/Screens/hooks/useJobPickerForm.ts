import { useForm } from 'react-hook-form';
import useJobPicker from '../components/hooks/useJobPicker';

export interface JobPickerFormValues {
  jobDescription: string;
}

/**
 * Owns the job-description form plus the host-page picker, so the picker
 * trigger and the textarea it fills can live in different sections.
 */
const useJobPickerForm = () => {
  const { register, setValue } = useForm<JobPickerFormValues>({
    defaultValues: { jobDescription: '' },
  });
  const { isPickingAJob, startPicking } = useJobPicker({ setValue });

  return { register, isPickingAJob, startPicking };
};

export default useJobPickerForm;
