import type { ReactNode } from 'react';
import type { components } from '@talentor/contracts';
import FloatingProfileBar from './FloatingProfileBar';
import ProfileErrorState from './ProfileErrorState';
import ProfilePageSelectorControls from './ProfilePageSelectorControls';

type ProfileMetadata = components['schemas']['ProfileMetadata'];

type Props = {
  profiles: ProfileMetadata[];
  profileId: string | undefined;
  onSelect: (id: string) => void;
  onCreate: () => void;
  message: string;
  onRetry: () => void;
  retrying?: boolean;
  children?: ReactNode;
  dialog?: ReactNode;
};

const ProfilePageSelectorErrorView = ({
  profiles,
  profileId,
  onSelect,
  onCreate,
  message,
  onRetry,
  retrying,
  children,
  dialog,
}: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingProfileBar />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 pt-20 space-y-4">
        <ProfilePageSelectorControls
          profiles={profiles}
          profileId={profileId}
          onSelect={onSelect}
          onCreate={onCreate}
        />
        <ProfileErrorState
          message={message}
          onRetry={onRetry}
          retrying={retrying}
        />
        {children}
      </div>
      {dialog}
    </div>
  );
};

export default ProfilePageSelectorErrorView;
