import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import FloatingProfileBar from './components/FloatingProfileBar';
import ProfilePageLoadingView from './components/ProfilePageLoadingView';
import ProfilePageSelectorErrorView from './components/ProfilePageSelectorErrorView';
import ProfilePageContentView from './components/ProfilePageContentView';
import ProfilePageListErrorView from './components/ProfilePageListErrorView';
import ProfilePageEmptyView from './components/ProfilePageEmptyView';
import { useProfilePage } from './hooks/useProfilePage';
import { Button } from '@/components/ui/button';

const CreateProfileDialog = lazy(
  () => import('./components/CreateProfileDialog'),
);

const ProfilePage = () => {
  const {
    profileId,
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
    versionDetailQuery,
    createMutation,
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
  } = useProfilePage();

  const renderCreateDialog = () => (
    <Suspense fallback={null}>
      <CreateProfileDialog
        open={createOpen}
        pending={createMutation.isPending}
        error={createError}
        onCancel={() => setCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </Suspense>
  );

  if (profilesQuery.isLoading) return <ProfilePageLoadingView />;

  if (profilesQuery.isError) {
    const message =
      (profilesQuery.error as Error)?.message ?? 'Failed to load profiles';
    return (
      <ProfilePageListErrorView
        message={message}
        onRetry={() => void profilesQuery.refetch()}
        retrying={profilesQuery.isFetching}
        dialog={renderCreateDialog()}
      />
    );
  }

  if (profiles.length === 0) {
    return (
      <ProfilePageEmptyView
        creating={createMutation.isPending}
        createError={createError}
        onCreate={() => setCreateOpen(true)}
        dialog={renderCreateDialog()}
      />
    );
  }

  if (!profileId) return <Navigate replace to={`/profile/${profiles[0].id}`} />;

  if (detailQuery.isLoading) return <ProfilePageLoadingView />;

  if (detailQuery.isError) {
    const message =
      (detailQuery.error as Error)?.message ?? 'Failed to load profile';
    return (
      <ProfilePageSelectorErrorView
        profiles={profiles}
        profileId={profileId}
        onSelect={handleSelectProfile}
        onCreate={() => setCreateOpen(true)}
        message={message}
        onRetry={() => void detailQuery.refetch()}
        retrying={detailQuery.isFetching}
        dialog={renderCreateDialog()}
      />
    );
  }

  if (!snapshot) {
    return (
      <ProfilePageSelectorErrorView
        profiles={profiles}
        profileId={profileId}
        onSelect={handleSelectProfile}
        onCreate={() => setCreateOpen(true)}
        message="Profile not found"
        onRetry={() => void detailQuery.refetch()}
        retrying={detailQuery.isFetching}
        dialog={renderCreateDialog()}
      />
    );
  }

  if (isPreviewing && versionDetailQuery.isLoading)
    return <ProfilePageLoadingView />;

  if (isPreviewing && versionDetailQuery.isError) {
    const msg =
      (versionDetailQuery.error as Error)?.message ?? 'Failed to load version';
    return (
      <ProfilePageSelectorErrorView
        profiles={profiles}
        profileId={profileId}
        onSelect={handleSelectProfile}
        onCreate={() => setCreateOpen(true)}
        message={msg}
        onRetry={() => void versionDetailQuery.refetch()}
        retrying={versionDetailQuery.isFetching}
        dialog={renderCreateDialog()}
      >
        <Button type="button" variant="outline" onClick={handleExitPreview}>
          Exit preview
        </Button>
      </ProfilePageSelectorErrorView>
    );
  }

  if (!displayProfile) {
    if (isPreviewing) return <ProfilePageLoadingView />;
    return (
      <ProfilePageSelectorErrorView
        profiles={profiles}
        profileId={profileId}
        onSelect={handleSelectProfile}
        onCreate={() => setCreateOpen(true)}
        message="Profile data unavailable"
        onRetry={() => void detailQuery.refetch()}
        retrying={detailQuery.isFetching}
        dialog={renderCreateDialog()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingProfileBar />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 pt-20 space-y-4">
        <ProfilePageContentView
          profiles={profiles}
          profileId={profileId}
          onSelect={handleSelectProfile}
          onCreate={() => setCreateOpen(true)}
          saveError={saveError}
          versionsLoading={versionsLoading}
          versions={versions}
          currentVersion={currentVersion!}
          previewVersion={previewVersion}
          pendingVersion={pendingVersion}
          combinedVersionError={combinedVersionError}
          onPreview={handlePreview}
          onActivate={handleActivate}
          onExitPreview={handleExitPreview}
          profile={displayProfile}
          pending={isSaving}
          readOnly={isPreviewing}
          onProfileChange={handleProfileChange}
        />
      </div>
      {renderCreateDialog()}
    </div>
  );
};

export default ProfilePage;
