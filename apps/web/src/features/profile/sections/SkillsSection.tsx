import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { MOCK_PROFILE } from '../profile.constants';

type Skill = components['schemas']['Skill'];

type SkillsSectionProps = {
  skills?: Skill[];
  profile?: components['schemas']['CandidateProfileV1'];
};

const SkillsSection = ({ skills: skillsProp, profile }: SkillsSectionProps) => {
  const skills = skillsProp ?? profile?.skills ?? MOCK_PROFILE.profile.skills;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <EditableField
          value="Skills"
          label="Skills section title"
          purpose="section"
          weight="semibold"
          tone="muted"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {skills.map((skill) => (
          <div key={skill.id} className="flex flex-col gap-2 pt-4 first:pt-0">
            <EditableField
              value={skill.name}
              label="Skill name"
              displayAs="p"
              purpose="title"
              weight="semibold"
            />
            <EditableField
              value={skill.category}
              label="Category"
              purpose="meta"
              tone="muted"
            />
            <div className="flex flex-wrap gap-2">
              <EditableField
                value={
                  skill.yearsOfExperience != null
                    ? String(skill.yearsOfExperience)
                    : ''
                }
                label="Years of experience"
                purpose="meta"
                tone="muted"
                editor="input"
                inputType="number"
              />
              <EditableField
                value={skill.lastUsed ?? ''}
                label="Last used"
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

export default SkillsSection;
export { SkillsSection };
