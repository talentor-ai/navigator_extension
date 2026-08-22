import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { MOCK_PROFILE } from '../profile.constants';

type Education = components['schemas']['Education'];

type EducationSectionProps = {
  education?: Education[];
  profile?: components['schemas']['CandidateProfileV1'];
};

const EducationSection = ({
  education: educationProp,
  profile,
}: EducationSectionProps) => {
  const education =
    educationProp ?? profile?.education ?? MOCK_PROFILE.profile.education;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <EditableField
          value="Education"
          label="Education section title"
          purpose="section"
          weight="semibold"
          tone="muted"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {education.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 pt-4 first:pt-0">
            <EditableField
              value={item.institution}
              label="Institution"
              displayAs="p"
              purpose="title"
              weight="semibold"
            />
            {item.degree ? (
              <EditableField
                value={item.degree}
                label="Degree"
                displayAs="p"
                purpose="subtitle"
                weight="medium"
                tone="muted"
              />
            ) : null}
            {item.fieldOfStudy ? (
              <EditableField
                value={item.fieldOfStudy}
                label="Field of study"
                displayAs="p"
                purpose="body"
                tone="muted"
              />
            ) : null}
            {item.location ? (
              <EditableField
                value={
                  [
                    item.location.city,
                    item.location.region,
                    item.location.countryCode,
                  ]
                    .filter(Boolean)
                    .join(', ') ?? ''
                }
                label="Location"
                purpose="meta"
                tone="muted"
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <EditableField
                value={item.startDate ?? ''}
                label="Start date"
                purpose="meta"
                tone="muted"
                editor="input"
                inputType="month"
              />
              <EditableField
                value={item.endDate ?? ''}
                label="End date"
                purpose="meta"
                tone="muted"
                editor="input"
                inputType="month"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EducationSection;
export { EducationSection };
