import { EditableField } from '@/components/EditableField';
import { cn } from '@/lib/utils';
import { validateOptionalCountryCode } from '../validation';

type LocationValue = {
  city?: string | null;
  region?: string | null;
  countryCode?: string | null;
};

type Props = {
  location?: LocationValue | null;
  pending?: boolean;
  readOnly?: boolean;
  onCitySubmit: (value: string) => void | Promise<void>;
  onRegionSubmit: (value: string) => void | Promise<void>;
  onCountryCodeSubmit: (value: string) => void | Promise<void>;
  labels?: {
    city?: string;
    region?: string;
    countryCode?: string;
  };
  className?: string;
};

export function LocationFields({
  location,
  pending,
  readOnly,
  onCitySubmit,
  onRegionSubmit,
  onCountryCodeSubmit,
  labels,
  className,
}: Props) {
  const city = location?.city ?? '';
  const region = location?.region ?? '';
  const countryCode = location?.countryCode ?? '';

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <EditableField
        value={city}
        label={labels?.city ?? 'City'}
        purpose="meta"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onCitySubmit}
      />
      <EditableField
        value={region}
        label={labels?.region ?? 'Region'}
        purpose="meta"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        onSubmit={onRegionSubmit}
      />
      <EditableField
        value={countryCode}
        label={labels?.countryCode ?? 'Country code'}
        purpose="meta"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        validate={validateOptionalCountryCode}
        onSubmit={onCountryCodeSubmit}
      />
    </div>
  );
}

export default LocationFields;
