import { getUserApi } from '@popup:api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useProfile = () => {
  const [enabled, setEnabled] = useState(false);

  const { data, error, isLoading, isFetched } = useQuery({
    queryKey: ['USER_INFO'],
    queryFn: getUserApi,
    enabled,
    retry: false,
  });

  const handleFetchUser = () => {
    setEnabled(true); // Enable the query to run
  };

  useEffect(() => {
    if (isFetched) {
      setEnabled(false); // Disable the query after fetching
    }
  }, [isFetched]);

  return {
    data,
    error,
    isLoading,
    handleFetchUser,
    isFetched,
  };
};

export default useProfile;
