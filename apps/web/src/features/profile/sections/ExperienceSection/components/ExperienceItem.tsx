import { EditableField } from '@/components/EditableField';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
} from '../../../profile.constants';
import type { ExperienceItemProps } from '../types';

export const ExperienceItem = ({
  item,
  pending,
  readOnly,
  onCompanySubmit,
  onPositionSubmit,
  onEmploymentTypeSubmit,
  onLocationTypeSubmit,
  onStartDateSubmit,
  onEndDateSubmit,
  onSummarySubmit,
  onResponsibilitySubmit,
  onAchievementSubmit,
}: ExperienceItemProps) => {
  return (
    <div className="flex flex-col gap-3 pt-4 first:pt-0">
      <EditableField
        value={item.company}
        label="Company"
        displayAs="p"
        purpose="title"
        weight="semibold"
        pending={pending}
        disabled={readOnly}
        onSubmit={onCompanySubmit}
      />
      <EditableField
        value={item.position}
        label="Position"
        displayAs="p"
        purpose="subtitle"
        weight="medium"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onPositionSubmit}
      />

      <div className="flex flex-wrap gap-2">
        <EditableField
          value={item.employmentType ?? ''}
          label="Employment type"
          purpose="meta"
          tone="muted"
          editor="select"
          options={EMPLOYMENT_TYPE_OPTIONS}
          pending={pending}
          disabled={readOnly}
          onSubmit={onEmploymentTypeSubmit}
        />
        <EditableField
          value={item.locationType ?? ''}
          label="Location type"
          purpose="meta"
          tone="muted"
          editor="select"
          options={LOCATION_TYPE_OPTIONS}
          pending={pending}
          disabled={readOnly}
          onSubmit={onLocationTypeSubmit}
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
        value={item.summary ?? ''}
        label="Experience summary"
        displayAs="p"
        purpose="body"
        tone="muted"
        editor="textarea"
        rows={2}
        pending={pending}
        disabled={readOnly}
        onSubmit={onSummarySubmit}
      />

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
              pending={pending}
              disabled={readOnly}
              onSubmit={(value) => onResponsibilitySubmit(idx, value)}
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
