import { Suspense } from 'react';
import { lazy } from 'react';
import type { components } from '@talentor/contracts';
import ProfilePageSelectorControls from './ProfilePageSelectorControls';
import ProfilePageEditorLayout from './ProfilePageEditorLayout';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
type ProfileMetadata = components['schemas']['ProfileMetadata'];
type ProfileVersionMetadata = components['schemas']['ProfileVersionMetadata'];

const VersionSwitcher = lazy(() => import('./VersionSwitcher'));

type Props = {
  profiles: ProfileMetadata[];
  profileId: string | undefined;
  onSelect: (id: string) => void;
  onCreate: () => void;
  saveError: string | null;
  versionsLoading: boolean;
  versions: ProfileVersionMetadata[];
  currentVersion: number;
  previewVersion: number | null;
  pendingVersion: number | null;
  combinedVersionError: string | null;
  onPreview: (version: number) => void;
  onActivate: (version: number) => void;
  onExitPreview: () => void;
  profile: CandidateProfileV1;
  pending: boolean;
  readOnly: boolean;
  onProfileChange: (next: CandidateProfileV1) => Promise<void>;
};

const ProfilePageContentView = ({
  profiles,
  profileId,
  onSelect,
  onCreate,
  saveError,
  versionsLoading,
  versions,
  currentVersion,
  previewVersion,
  pendingVersion,
  combinedVersionError,
  onPreview,
  onActivate,
  onExitPreview,
  profile,
  pending,
  readOnly,
  onProfileChange,
}: Props) => {
  return (
    <>
      <ProfilePageSelectorControls
        profiles={profiles}
        profileId={profileId}
        onSelect={onSelect}
        onCreate={onCreate}
      />

      {saveError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {saveError}
        </div>
      ) : null}

      {versionsLoading ? (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading versions"
          className="py-2 text-center text-sm text-muted-foreground"
        >
          Loading versions...
        </div>
      ) : (
        <Suspense fallback={null}>
          <VersionSwitcher
            versions={versions}
            currentVersion={currentVersion}
            previewVersion={previewVersion}
            pendingVersion={pendingVersion}
            error={combinedVersionError}
            onPreview={onPreview}
            onActivate={onActivate}
            onExitPreview={onExitPreview}
          />
        </Suspense>
      )}

      <ProfilePageEditorLayout
        profile={profile}
        pending={pending}
        readOnly={readOnly}
        onProfileChange={onProfileChange}
      />
    </>
  );
};

export default ProfilePageContentView;
