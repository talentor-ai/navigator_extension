import { useState } from 'react';
import { EditableField } from '@/components/EditableField';
import { EditableStringList } from '@/features/profile/components/EditableStringList';
import { LocationFields } from '@/features/profile/components/LocationFields';
import {
  validateNonBlank,
  validateOptionalYearMonth,
  validateYearMonth,
} from '@/features/profile/validation';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
} from '@/features/profile/profile.constants';
import type { ExperienceItemProps } from '../../types';

export const ExperienceItem = ({
  item,
  pending,
  readOnly,
  onCompanySubmit,
  onPositionSubmit,
  onEmploymentTypeSubmit,
  onLocationTypeSubmit,
  onCompanyLocationCitySubmit,
  onCompanyLocationRegionSubmit,
  onCompanyLocationCountryCodeSubmit,
  onStartDateSubmit,
  onEndDateSubmit,
  onSummarySubmit,
  onResponsibilitySubmit,
  onResponsibilityAdd,
  onResponsibilityRemove,
  onAchievementSubmit,
  onAchievementAdd,
  onAchievementRemove,
}: ExperienceItemProps) => {
  const [stillWorking, setStillWorking] = useState(false);

  const handleStillWorkingChange = (checked: boolean) => {
    setStillWorking(checked);
    if (checked) {
      void onEndDateSubmit('');
    }
  };

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
        validate={(v) => validateNonBlank(v, 'Company')}
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
        validate={(v) => validateNonBlank(v, 'Position')}
        onSubmit={onPositionSubmit}
      />
      <LocationFields
        location={item.companyLocation}
        pending={pending}
        readOnly={readOnly}
        onCitySubmit={onCompanyLocationCitySubmit}
        onRegionSubmit={onCompanyLocationRegionSubmit}
        onCountryCodeSubmit={onCompanyLocationCountryCodeSubmit}
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <EditableField
            value={item.startDate ?? ''}
            label="Start date"
            purpose="meta"
            tone="muted"
            editor="input"
            inputType="month"
            pending={pending}
            disabled={readOnly}
            validate={validateYearMonth}
            onSubmit={onStartDateSubmit}
          />
          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={stillWorking}
              disabled={pending || readOnly}
              onChange={(event) =>
                handleStillWorkingChange(event.target.checked)
              }
              className="h-3.5 w-3.5 rounded border-border accent-primary"
            />
            Still working
          </label>
        </div>
        {!stillWorking ? (
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
        ) : null}
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
      <EditableStringList
        items={item.responsibilities ?? []}
        itemLabel="Responsibility"
        addLabel="Add responsibility"
        pending={pending}
        readOnly={readOnly}
        onChange={onResponsibilitySubmit}
        onAdd={onResponsibilityAdd}
        onRemove={onResponsibilityRemove}
      />
      <EditableStringList
        items={item.achievements}
        itemLabel="Achievement"
        addLabel="Add achievement"
        pending={pending}
        readOnly={readOnly}
        onChange={onAchievementSubmit}
        onAdd={onAchievementAdd}
        onRemove={onAchievementRemove}
      />
    </div>
  );
};

export { ExperienceItem as default };
