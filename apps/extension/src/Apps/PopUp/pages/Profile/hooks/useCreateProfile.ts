import { createJobProfileApi } from '@popup:api';
import { UserJobProfile } from '@popup:models/model.user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserJobProfile) => createJobProfileApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['RESUME_HISTORY', 'USER_INFO'],
      });
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

export default useCreateProfile;
