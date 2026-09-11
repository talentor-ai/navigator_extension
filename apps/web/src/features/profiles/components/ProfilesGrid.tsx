import type { components } from '@talentor/contracts';
import ProfileCard from './ProfileCard';

type ProfileMetadata = components['schemas']['ProfileMetadata'];

type Props = {
  profiles: ProfileMetadata[];
};

const ProfilesGrid = ({ profiles }: Props) => {
  return (
    <ul
      aria-label="Profiles"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </ul>
  );
};

export default ProfilesGrid;
