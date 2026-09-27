import { getUserApi } from '@modules/popup/api';
import { useSessionStore } from '@modules/popup/store';
import { useQuery } from '@tanstack/react-query';

const useProfile = () => {
  const token = useSessionStore((s) => s.token);

  const { data, error, isLoading, isFetched } = useQuery({
    queryKey: ['USER_INFO'],
    queryFn: getUserApi,
    enabled: !!token,
    retry: false,
  });

  return {
    data,
    error,
    isLoading,
    isFetched,
  };
};

export default useProfile;
