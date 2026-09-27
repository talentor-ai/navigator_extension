import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { Icons } from '@/components/Icons';

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
        <span className="flex items-center gap-2.5">
          <Icons
            type="summary"
            aria-hidden="true"
            strokeWidth={2.5}
            className="h-5 w-5 shrink-0 text-lime"
          />
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Summary
          </h2>
        </span>
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
