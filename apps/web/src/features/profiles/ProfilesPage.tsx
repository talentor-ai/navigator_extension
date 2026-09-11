import { lazy, Suspense } from 'react';
import { useProfilesPage } from './hooks/useProfilesPage';
import ProfilesHeader from './components/ProfilesHeader';
import ProfilesGrid from './components/ProfilesGrid';
import ProfilesLoadingView from './components/ProfilesLoadingView';
import ProfilesErrorView from './components/ProfilesErrorView';
import ProfilesEmptyView from './components/ProfilesEmptyView';

const CreateProfileDialog = lazy(
  () => import('@/features/profile/components/CreateProfileDialog'),
);

const ProfilesPage = () => {
  const {
    profiles,
    profilesQuery,
    createOpen,
    setCreateOpen,
    createMutation,
    createError,
    handleCreateSubmit,
    handleRetry,
  } = useProfilesPage();

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

  let content: React.ReactNode;

  if (profilesQuery.isLoading) {
    content = <ProfilesLoadingView />;
  } else if (profilesQuery.isError) {
    const message =
      (profilesQuery.error as Error)?.message ?? 'Failed to load profiles';
    content = (
      <ProfilesErrorView
        message={message}
        onRetry={handleRetry}
        retrying={profilesQuery.isFetching}
      />
    );
  } else if (profiles.length === 0) {
    content = (
      <ProfilesEmptyView
        onCreate={() => setCreateOpen(true)}
        creating={createMutation.isPending}
      />
    );
  } else {
    content = <ProfilesGrid profiles={profiles} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 pt-20 space-y-6">
        <ProfilesHeader
          count={profilesQuery.isSuccess ? profiles.length : 0}
          onCreate={() => setCreateOpen(true)}
        />
        {content}
      </div>
      {renderCreateDialog()}
    </div>
  );
};

export default ProfilesPage;
