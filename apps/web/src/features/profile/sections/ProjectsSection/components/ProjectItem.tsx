import { EditableField } from '@/components/EditableField';
import { EditableStringList } from '@/features/profile/components/EditableStringList';
import {
  validateNonBlank,
  validateOptionalHttpUrl,
  validateOptionalYearMonth,
} from '@/features/profile/validation';
import type { ProjectItemProps } from '../types';

export const ProjectItem = ({
  item,
  pending,
  readOnly,
  onNameSubmit,
  onRoleSubmit,
  onDescriptionSubmit,
  onStartDateSubmit,
  onEndDateSubmit,
  onUrlSubmit,
  onRepositorySubmit,
  onAchievementSubmit,
  onAchievementAdd,
  onAchievementRemove,
}: ProjectItemProps) => {
  return (
    <div className="flex flex-col gap-3 pt-4 first:pt-0">
      <EditableField
        value={item.name}
        label="Project name"
        displayAs="p"
        purpose="title"
        weight="semibold"
        pending={pending}
        disabled={readOnly}
        validate={(v) => validateNonBlank(v, 'Project name')}
        onSubmit={onNameSubmit}
      />
      <EditableField
        value={item.role ?? ''}
        label="Project role"
        displayAs="p"
        purpose="subtitle"
        weight="medium"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onRoleSubmit}
      />
      <EditableField
        value={item.description}
        label="Project description"
        displayAs="p"
        purpose="body"
        editor="textarea"
        rows={3}
        pending={pending}
        disabled={readOnly}
        validate={(value) => validateNonBlank(value, 'Description')}
        onSubmit={onDescriptionSubmit}
      />
      <div className="flex flex-wrap gap-2">
        <EditableField
          value={item.startDate ?? ''}
          label="Start date"
          purpose="meta"
          tone="muted"
          editor="input"
          inputType="month"
          pending={pending}
          disabled={readOnly}
          validate={validateOptionalYearMonth}
          onSubmit={onStartDateSubmit}
        />
        <EditableField
          value={item.endDate ?? ''}
          label="End date"
          purpose="meta"
          tone="muted"
          editor="input"
          inputType="month"
          pending={pending}
          disabled={readOnly}
          validate={validateOptionalYearMonth}
          onSubmit={onEndDateSubmit}
        />
      </div>
      <EditableField
        value={item.url ?? ''}
        label="Project URL"
        purpose="body"
        tone="muted"
        editor="input"
        inputType="url"
        pending={pending}
        disabled={readOnly}
        validate={validateOptionalHttpUrl}
        onSubmit={onUrlSubmit}
      />
      <EditableField
        value={item.repository ?? ''}
        label="Repository URL"
        purpose="body"
        tone="muted"
        editor="input"
        inputType="url"
        pending={pending}
        disabled={readOnly}
        validate={validateOptionalHttpUrl}
        onSubmit={onRepositorySubmit}
      />
      <EditableStringList
        itemLabel="Achievement"
        addLabel="Add achievement"
        items={item.achievements ?? []}
        pending={pending}
        readOnly={readOnly}
        onChange={onAchievementSubmit}
        onAdd={onAchievementAdd}
        onRemove={onAchievementRemove}
      />
    </div>
  );
};

export default ProjectItem;
