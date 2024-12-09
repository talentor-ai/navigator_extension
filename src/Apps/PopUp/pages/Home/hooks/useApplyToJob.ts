import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyToJob } from '@popup:api';
import { useNavigate } from 'react-router-dom';
import { HISTORY_PATH } from '@popup:constants/paths';
import { useJobPostFormStore } from '@popup:store';

const useApplyToJob = () => {
  const { clearFormData } = useJobPostFormStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: any) => applyToJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['RESUME_HISTORY'] });
      navigate(HISTORY_PATH);
      clearFormData()
      useJobPostFormStore.getState().clearFormData();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Register error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    },
  });
};

export default useApplyToJob;
