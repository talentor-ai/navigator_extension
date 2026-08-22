import { EditableField } from '@/components/EditableField';
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
      <EditableField
        value={item.location?.city ?? ''}
        label="City"
        purpose="meta"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onCitySubmit}
      />
      <EditableField
        value={item.location?.region ?? ''}
        label="Region"
        purpose="meta"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onRegionSubmit}
      />
      <EditableField
        value={item.location?.countryCode ?? ''}
        label="Country code"
        purpose="meta"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onCountryCodeSubmit}
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
    </div>
  );
};
