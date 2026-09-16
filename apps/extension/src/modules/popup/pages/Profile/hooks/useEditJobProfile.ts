import { updateJobProfileApi } from '@modules/popup/api';
import { UserJobProfile } from '@modules/popup/models/model.user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useEditJobProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserJobProfile) => updateJobProfileApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['USER_INFO'],
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

export default useEditJobProfile;
