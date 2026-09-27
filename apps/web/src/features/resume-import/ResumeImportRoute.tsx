import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileKeys } from '@/features/profile/profile.api';
import ResumeImportPage from './ResumeImportPage';
import type { ProfileSnapshot } from './types';

const ResumeImportRoute = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCreated = (snapshot: ProfileSnapshot) => {
    queryClient.setQueryData(profileKeys.detail(snapshot.id), snapshot);
    void queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    toast.success('Profile created from resume.');
    navigate(`/profile/${snapshot.id}`);
  };

  const handleError = (message: string) => {
    toast.error(message);
  };

  return <ResumeImportPage onCreated={handleCreated} onError={handleError} />;
};

export default ResumeImportRoute;
