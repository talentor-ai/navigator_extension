import type { components } from '@talentor/contracts';
import { Card, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { MOCK_PROFILE } from '../profile.constants';

type PersonalInfo = components['schemas']['PersonalInfo'];

type ProfileHeaderProps = {
  personalInfo?: PersonalInfo;
  defaultRole?: string | null;
  name?: string;
  currentVersion?: number;
  updatedAt?: string;
};

const ProfileHeader = ({
  personalInfo = MOCK_PROFILE.profile.personalInfo,
  defaultRole = MOCK_PROFILE.profile.defaultRole,
  name = MOCK_PROFILE.name,
  currentVersion = MOCK_PROFILE.currentVersion,
  updatedAt = MOCK_PROFILE.updatedAt,
}: ProfileHeaderProps) => {
  const versionLabel =
    currentVersion !== null && currentVersion !== undefined
      ? `v${currentVersion}`
      : '';

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-col space-y-2">
        <EditableField
          value={personalInfo.fullName}
          label="Full name"
          displayAs="h1"
          purpose="display"
          weight="bold"
        />
        <EditableField
          value={defaultRole ?? ''}
          label="Default role"
          displayAs="p"
          purpose="role"
          weight="medium"
          tone="muted"
        />
        <div className="flex flex-wrap items-center gap-2">
          <EditableField
            value={name}
            label="Profile name"
            displayAs="p"
            purpose="meta"
            tone="muted"
          />
          <EditableField
            value={versionLabel}
            label="Profile version"
            displayAs="p"
            purpose="meta"
            tone="muted"
          />
          <EditableField
            value={updatedAt}
            label="Updated at"
            displayAs="p"
            purpose="meta"
            tone="muted"
          />
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
export { ProfileHeader };
