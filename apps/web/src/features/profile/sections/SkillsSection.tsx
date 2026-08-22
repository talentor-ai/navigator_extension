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

const SkillsSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  const skills = profile.skills;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Skills
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills yet</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="flex flex-col gap-2 pt-4 first:pt-0">
              <EditableField
                value={skill.name}
                label="Skill name"
                displayAs="p"
                purpose="title"
                weight="semibold"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextSkills = profile.skills.map((s) =>
                    s.id === skill.id ? { ...s, name: value } : s,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    skills: nextSkills,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={skill.category}
                label="Category"
                purpose="meta"
                tone="muted"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextSkills = profile.skills.map((s) =>
                    s.id === skill.id ? { ...s, category: value } : s,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    skills: nextSkills,
                  };
                  return onProfileChange(next);
                }}
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
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => {
                    const trimmed = value.trim();
                    if (trimmed === '') {
                      const nextSkills = profile.skills.map((s) =>
                        s.id === skill.id
                          ? { ...s, yearsOfExperience: null }
                          : s,
                      );
                      const next: CandidateProfileV1 = {
                        ...profile,
                        skills: nextSkills,
                      };
                      return onProfileChange(next);
                    }
                    const parsed = Number(trimmed);
                    if (!Number.isFinite(parsed) || parsed < 0) {
                      return;
                    }
                    const nextSkills = profile.skills.map((s) =>
                      s.id === skill.id
                        ? { ...s, yearsOfExperience: parsed }
                        : s,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      skills: nextSkills,
                    };
                    return onProfileChange(next);
                  }}
                />
                <EditableField
                  value={skill.lastUsed ?? ''}
                  label="Last used"
                  purpose="meta"
                  tone="muted"
                  editor="input"
                  inputType="month"
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => {
                    const nextLast = value.trim() === '' ? null : value;
                    const nextSkills = profile.skills.map((s) =>
                      s.id === skill.id ? { ...s, lastUsed: nextLast } : s,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      skills: nextSkills,
                    };
                    return onProfileChange(next);
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
export { SkillsSection };
