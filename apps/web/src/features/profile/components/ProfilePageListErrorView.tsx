import type { ReactNode } from 'react';
import FloatingProfileBar from './FloatingProfileBar';
import ProfileErrorState from './ProfileErrorState';

type Props = {
  message: string;
  onRetry: () => void;
  retrying?: boolean;
  dialog?: ReactNode;
};

const ProfilePageListErrorView = ({
  message,
  onRetry,
  retrying,
  dialog,
}: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingProfileBar />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 pt-20">
        <ProfileErrorState
          message={message}
          onRetry={onRetry}
          retrying={retrying}
        />
      </div>
      {dialog}
    </div>
  );
};

export default ProfilePageListErrorView;
