import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { MOCK_PROFILE } from '../profile.constants';

type CandidateProfile = components['schemas']['CandidateProfileV1'];

type SummarySectionProps = {
  baseSummary?: string | null;
  defaultRole?: string | null;
  profile?: CandidateProfile;
};

const SummarySection = ({
  baseSummary: baseSummaryProp,
  defaultRole: defaultRoleProp,
  profile,
}: SummarySectionProps) => {
  const baseSummary =
    baseSummaryProp ??
    profile?.baseSummary ??
    MOCK_PROFILE.profile.baseSummary ??
    '';
  const defaultRole =
    defaultRoleProp ??
    profile?.defaultRole ??
    MOCK_PROFILE.profile.defaultRole ??
    '';

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <EditableField
          value="Summary"
          label="Summary section title"
          purpose="section"
          weight="semibold"
          tone="muted"
        />
        {defaultRole ? (
          <EditableField
            value={defaultRole}
            label="Default role"
            purpose="role"
            weight="medium"
            tone="muted"
          />
        ) : null}
      </CardHeader>
      <CardContent>
        <EditableField
          value={baseSummary ?? ''}
          label="Summary"
          displayAs="p"
          purpose="body"
          editor="textarea"
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

export default SummarySection;
export { SummarySection };
