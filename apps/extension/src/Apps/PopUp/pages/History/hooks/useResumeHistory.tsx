import { getResumeHistory } from '@popup:api';
import { useQuery } from '@tanstack/react-query';

const useResumeHistory = (jobProfileId: string) => {
  return useQuery({
    queryKey: ['RESUME_HISTORY'],
    queryFn: () => getResumeHistory(jobProfileId),
    retry: false,
  });
};

export default useResumeHistory;
