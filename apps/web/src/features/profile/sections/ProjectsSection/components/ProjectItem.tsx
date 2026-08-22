import { EditableField } from '@/components/EditableField';
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
        onSubmit={onRepositorySubmit}
      />
      {item.achievements && item.achievements.length > 0 ? (
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
              pending={pending}
              disabled={readOnly}
              onSubmit={(value) => onAchievementSubmit(idx, value)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProjectItem;
