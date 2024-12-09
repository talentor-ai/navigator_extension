import { getResumeHistory } from '@popup:api';
import { useMutation } from '@tanstack/react-query';

const useApplyApi = () => {
  const { data, error, isPending } = useMutation({
    mutationFn: (body: any) => getResumeHistory(body),
    onSuccess: () => {},
  });

  return {
    data,
    error,
    isPending,
  };
};

export default useApplyApi;
