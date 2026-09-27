import type { ReactNode } from 'react';
import FloatingProfileBar from './FloatingProfileBar';
import EmptyProfileState from './EmptyProfileState';

type Props = {
  creating: boolean;
  createError: string | null;
  onCreate: () => void;
  dialog?: ReactNode;
};

const ProfilePageEmptyView = ({
  creating,
  createError,
  onCreate,
  dialog,
}: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingProfileBar />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 pt-20 space-y-4">
        <EmptyProfileState onCreate={onCreate} creating={creating} />
        {createError ? (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {createError}
          </div>
        ) : null}
      </div>
      {dialog}
    </div>
  );
};

export default ProfilePageEmptyView;
