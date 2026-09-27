import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { components } from '@talentor/contracts';
import {
  useActivateProfileVersion,
  useCreateProfile,
  useProfile,
  useProfiles,
  useProfileVersion,
  useProfileVersions,
  useUpdateProfile,
} from '../profile.api';
import { buildCreateProfilePayload } from '../profile.utils';
import type { CreateProfileFormValues } from '../profile.utils';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

export function useProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  const profilesQuery = useProfiles();
  const detailQuery = useProfile(profileId);
  const versionsQuery = useProfileVersions(profileId);

  const [previewVersion, setPreviewVersion] = useState<number | null>(null);
  const [pendingVersion, setPendingVersion] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile(profileId);
  const activateMutation = useActivateProfileVersion(profileId);
  const versionDetailQuery = useProfileVersion(profileId, previewVersion);

  useEffect(() => {
    setPreviewVersion(null);
    setPendingVersion(null);
  }, [profileId]);

  const handleCreateSubmit = async (values: CreateProfileFormValues) => {
    const payload = buildCreateProfilePayload(values);
    try {
      const snapshot = await createMutation.mutateAsync(payload);
      setCreateOpen(false);
      navigate(`/profile/${snapshot.id}`);
    } catch {
      // keep dialog open, error shown via mutation.error
    }
  };

  const handlePreview = (version: number) => {
    setPreviewVersion(version);
  };

  const handleExitPreview = () => {
    setPreviewVersion(null);
  };

  const handleActivate = async (version: number) => {
    setPendingVersion(version);
    try {
      await activateMutation.mutateAsync(version);
      setPreviewVersion(null);
    } catch {
      // error displayed via activateMutation.error
    } finally {
      setPendingVersion(null);
    }
  };

  const handleProfileChange = async (next: CandidateProfileV1) => {
    await updateMutation.mutateAsync(next);
  };

  const handleSelectProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const profiles = profilesQuery.data ?? [];
  const snapshot = detailQuery.data;
  const versions = versionsQuery.data ?? [];

  const isPreviewing = previewVersion !== null;
  const previewSnapshot = versionDetailQuery.data;
  const displayProfile: CandidateProfileV1 | undefined = isPreviewing
    ? previewSnapshot?.profile
    : snapshot?.profile;

  const isSaving = updateMutation.isPending;
  const saveError = updateMutation.error
    ? (updateMutation.error as Error).message
    : null;
  const versionError = activateMutation.error
    ? (activateMutation.error as Error).message
    : null;
  const versionsListError = versionsQuery.error
    ? (versionsQuery.error as Error).message
    : null;
  const combinedVersionError = versionError ?? versionsListError ?? null;
  const versionsLoading = versionsQuery.isLoading;
  const createError = createMutation.error
    ? (createMutation.error as Error).message
    : null;

  const currentVersion = snapshot?.currentVersion;

  return {
    profileId,
    navigate,
    profiles,
    snapshot,
    versions,
    displayProfile,
    currentVersion,
    isPreviewing,
    previewVersion,
    pendingVersion,
    createOpen,
    setCreateOpen,
    profilesQuery,
    detailQuery,
    versionsQuery,
    versionDetailQuery,
    createMutation,
    updateMutation,
    activateMutation,
    isSaving,
    saveError,
    combinedVersionError,
    versionsLoading,
    createError,
    handleCreateSubmit,
    handlePreview,
    handleExitPreview,
    handleActivate,
    handleProfileChange,
    handleSelectProfile,
  };
}
