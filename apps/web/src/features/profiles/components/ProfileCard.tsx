import { Link } from 'react-router-dom';
import type { components } from '@talentor/contracts';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/date';

type ProfileMetadata = components['schemas']['ProfileMetadata'];

type Props = {
  profile: ProfileMetadata;
};

const ProfileCard = ({ profile }: Props) => {
  return (
    <li className="list-none">
      <Link
        to={`/profile/${profile.id}`}
        aria-label={`View profile ${profile.name}`}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Card className="rounded-2xl bg-card border-border hover:bg-[#262626] transition-colors h-full">
          <CardContent className="p-5 md:p-6 space-y-3">
            <h2 className="text-title font-semibold text-foreground truncate">
              {profile.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#262626] border border-[#404040] px-2.5 py-1 text-label font-medium text-foreground">
                v{profile.currentVersion}
              </span>
              <span className="text-meta text-[#a3a3a3]">
                Updated {formatDate(profile.updatedAt)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              Created {formatDate(profile.createdAt)}
            </p>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
};

export default ProfileCard;
