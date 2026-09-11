import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProfile, useProfiles } from '@/features/profile/profile.api';
import { buildCreateProfilePayload } from '@/features/profile/profile.utils';
import type { CreateProfileFormValues } from '@/features/profile/profile.utils';

export function useProfilesPage() {
  const navigate = useNavigate();
  const profilesQuery = useProfiles();
  const createMutation = useCreateProfile();
  const [createOpen, setCreateOpen] = useState(false);

  const createError = createMutation.error
    ? (createMutation.error as Error).message
    : null;

  const handleCreateSubmit = async (values: CreateProfileFormValues) => {
    const payload = buildCreateProfilePayload(values);
    try {
      const snapshot = await createMutation.mutateAsync(payload);
      setCreateOpen(false);
      navigate(`/profile/${snapshot.id}`);
    } catch {
      // keep dialog open, error shown via createError
    }
  };

  const handleRetry = () => {
    void profilesQuery.refetch();
  };

  return {
    profiles: profilesQuery.data ?? [],
    profilesQuery,
    createOpen,
    setCreateOpen,
    createMutation,
    createError,
    handleCreateSubmit,
    handleRetry,
  };
}
