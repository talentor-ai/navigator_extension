import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

type Props = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

const SummarySection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Summary
        </h2>
      </CardHeader>
      <CardContent>
        <EditableField
          value={profile.baseSummary ?? ''}
          label="Summary"
          displayAs="p"
          purpose="body"
          editor="textarea"
          rows={4}
          pending={pending}
          disabled={readOnly}
          onSubmit={(value) => {
            const nextSummary = value.trim() === '' ? null : value;
            const next: CandidateProfileV1 = {
              ...profile,
              baseSummary: nextSummary,
            };
            return onProfileChange(next);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SummarySection;
export { SummarySection };
