import FloatingProfileBar from './FloatingProfileBar';
import ProfileSkeleton from './ProfileSkeleton';

const ProfilePageLoadingView = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingProfileBar />
      <ProfileSkeleton />
    </div>
  );
};

export default ProfilePageLoadingView;
