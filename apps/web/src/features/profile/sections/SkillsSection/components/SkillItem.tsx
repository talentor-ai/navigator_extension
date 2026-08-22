import { EditableField } from '@/components/EditableField';
import type { Skill } from '../types';

type Props = {
  skill: Skill;
  pending?: boolean;
  readOnly?: boolean;
  onNameSubmit: (value: string) => void | Promise<void>;
  onCategorySubmit: (value: string) => void | Promise<void>;
  onYearsSubmit: (value: string) => void | Promise<void>;
  onLastUsedSubmit: (value: string) => void | Promise<void>;
};

export const SkillItem = ({
  skill,
  pending,
  readOnly,
  onNameSubmit,
  onCategorySubmit,
  onYearsSubmit,
  onLastUsedSubmit,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <EditableField
        value={skill.name}
        label="Skill name"
        displayAs="p"
        purpose="title"
        weight="semibold"
        pending={pending}
        disabled={readOnly}
        onSubmit={onNameSubmit}
      />
      <EditableField
        value={skill.category}
        label="Category"
        purpose="meta"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onCategorySubmit}
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
          onSubmit={onYearsSubmit}
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
          onSubmit={onLastUsedSubmit}
        />
      </div>
    </div>
  );
};
