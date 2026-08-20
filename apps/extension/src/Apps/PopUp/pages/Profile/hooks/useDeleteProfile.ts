import { deleteJobProfileApi } from '@popup:api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobProfileId: string) => deleteJobProfileApi(jobProfileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['RESUME_HISTORY', 'USER_INFO'],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Delete profile error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['RESUME_HISTORY', 'USER_INFO'],
      });
    },
  });
};

export default useDeleteProfile;
