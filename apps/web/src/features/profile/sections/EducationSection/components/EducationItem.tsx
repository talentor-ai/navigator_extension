import { EditableField } from '@/components/EditableField';
import { LocationFields } from '@/features/profile/components/LocationFields';
import {
  validateNonBlank,
  validateOptionalYearMonth,
} from '@/features/profile/validation';
import type { EducationItemProps } from '../types';

export const EducationItem = ({
  item,
  pending,
  readOnly,
  onInstitutionSubmit,
  onDegreeSubmit,
  onFieldOfStudySubmit,
  onCitySubmit,
  onRegionSubmit,
  onCountryCodeSubmit,
  onStartDateSubmit,
  onEndDateSubmit,
}: EducationItemProps) => {
  return (
    <div className="flex flex-col gap-3">
      <EditableField
        value={item.institution}
        label="Institution"
        displayAs="p"
        purpose="title"
        weight="semibold"
        pending={pending}
        disabled={readOnly}
        validate={(v) => validateNonBlank(v, 'Institution')}
        onSubmit={onInstitutionSubmit}
      />
      <EditableField
        value={item.degree ?? ''}
        label="Degree"
        displayAs="p"
        purpose="subtitle"
        weight="medium"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onDegreeSubmit}
      />
      <EditableField
        value={item.fieldOfStudy ?? ''}
        label="Field of study"
        displayAs="p"
        purpose="body"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onFieldOfStudySubmit}
      />
      <LocationFields
        location={item.location}
        pending={pending}
        readOnly={readOnly}
        onCitySubmit={onCitySubmit}
        onRegionSubmit={onRegionSubmit}
        onCountryCodeSubmit={onCountryCodeSubmit}
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
    </div>
  );
};
