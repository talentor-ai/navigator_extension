import type { components } from '@talentor/contracts';
import { getProfilesApi } from '@modules/popup/api';
import { useSessionStore } from '@modules/popup/store';
import { useQuery } from '@tanstack/react-query';

type ProfileMetadata = components['schemas']['ProfileMetadata'];

const useProfilesList = () => {
  const token = useSessionStore((s) => s.token);

  const { data, isLoading, error } = useQuery({
    queryKey: ['PROFILES'],
    queryFn: getProfilesApi,
    enabled: !!token,
    retry: false,
  });

  const profileList: ProfileMetadata[] = data?.response ?? [];

  return { profileList, isLoading, error };
};

export default useProfilesList;
