import type { components } from '@talentor/contracts';
import { Card, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

type Props = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

const ProfileHeader = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-col space-y-2">
        <EditableField
          value={profile.personalInfo.fullName}
          label="Full name"
          displayAs="h1"
          purpose="display"
          weight="bold"
          pending={pending}
          disabled={readOnly}
          onSubmit={(value) => {
            const next: CandidateProfileV1 = {
              ...profile,
              personalInfo: {
                ...profile.personalInfo,
                fullName: value,
              },
            };
            return onProfileChange(next);
          }}
        />
        <EditableField
          value={profile.defaultRole ?? ''}
          label="Default role"
          displayAs="p"
          purpose="role"
          weight="medium"
          tone="muted"
          pending={pending}
          disabled={readOnly}
          onSubmit={(value) => {
            const nextDefaultRole = value.trim() === '' ? null : value;
            const next: CandidateProfileV1 = {
              ...profile,
              defaultRole: nextDefaultRole,
            };
            return onProfileChange(next);
          }}
        />
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
export { ProfileHeader };
