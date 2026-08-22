import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  MOCK_PROFILE,
} from '../profile.constants';

type Experience = components['schemas']['Experience'];

type ExperienceSectionProps = {
  experiences?: Experience[];
  profile?: components['schemas']['CandidateProfileV1'];
};

const ExperienceSection = ({
  experiences: experiencesProp,
  profile,
}: ExperienceSectionProps) => {
  const experiences =
    experiencesProp ?? profile?.experience ?? MOCK_PROFILE.profile.experience;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <EditableField
          value="Experience"
          label="Experience section title"
          purpose="section"
          weight="semibold"
          tone="muted"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {experiences.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 pt-4 first:pt-0">
            <EditableField
              value={`${item.position} — ${item.company}`}
              label="Position and company"
              displayAs="p"
              purpose="title"
              weight="semibold"
            />

            <div className="flex flex-wrap gap-2">
              <EditableField
                value={item.employmentType ?? ''}
                label="Employment type"
                purpose="meta"
                tone="muted"
                editor="select"
                options={EMPLOYMENT_TYPE_OPTIONS}
              />
              <EditableField
                value={item.locationType ?? ''}
                label="Location type"
                purpose="meta"
                tone="muted"
                editor="select"
                options={LOCATION_TYPE_OPTIONS}
              />
            </div>

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

            {item.summary ? (
              <EditableField
                value={item.summary}
                label="Experience summary"
                displayAs="p"
                purpose="body"
                tone="muted"
                editor="textarea"
                rows={2}
              />
            ) : null}

            {item.responsibilities && item.responsibilities.length > 0 ? (
              <div className="flex flex-col gap-2">
                {item.responsibilities.map((resp, idx) => (
                  <EditableField
                    key={`${item.id}-resp-${idx}`}
                    value={resp}
                    label="Responsibility"
                    displayAs="p"
                    purpose="body"
                    editor="textarea"
                    rows={2}
                  />
                ))}
              </div>
            ) : null}

            {item.achievements.length > 0 ? (
              <div className="flex flex-col gap-2">
                {item.achievements.map((ach, idx) => (
                  <EditableField
                    key={`${item.id}-ach-${idx}`}
                    value={ach}
                    label="Achievement"
                    displayAs="p"
                    purpose="body"
                    editor="textarea"
                    rows={2}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
export { ExperienceSection };
