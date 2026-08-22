import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { LINK_TYPE_OPTIONS, MOCK_PROFILE } from '../profile.constants';

type PersonalInfo = components['schemas']['PersonalInfo'];

type ContactDetailsProps = {
  personalInfo?: PersonalInfo;
};

const ContactDetails = ({
  personalInfo = MOCK_PROFILE.profile.personalInfo,
}: ContactDetailsProps) => {
  const location = personalInfo.location;
  const city = location?.city ?? '';
  const region = location?.region ?? '';
  const countryCode = location?.countryCode ?? '';
  const locationLine = [city, region, countryCode].filter(Boolean).join(', ');

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <EditableField
          value="Contact"
          label="Contact section title"
          purpose="section"
          weight="semibold"
          tone="muted"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <EditableField
            value={personalInfo.email}
            label="Email"
            purpose="body"
            editor="input"
            inputType="email"
          />
          <EditableField
            value={personalInfo.phone ?? ''}
            label="Phone"
            purpose="body"
            editor="input"
            inputType="tel"
          />
        </div>

        <div className="flex flex-col gap-1">
          <EditableField
            value={locationLine}
            label="Location"
            displayAs="p"
            purpose="meta"
            tone="muted"
          />
          <EditableField
            value={city}
            label="City"
            purpose="meta"
            tone="muted"
          />
          <EditableField
            value={region}
            label="Region"
            purpose="meta"
            tone="muted"
          />
          <EditableField
            value={countryCode}
            label="Country code"
            purpose="meta"
            tone="muted"
          />
        </div>

        <div className="flex flex-col gap-3">
          {personalInfo.links.map((link) => (
            <div key={link.url} className="flex flex-col gap-1">
              <EditableField
                value={link.type}
                label="Link type"
                purpose="label"
                weight="medium"
                tone="muted"
                editor="select"
                options={LINK_TYPE_OPTIONS}
              />
              <EditableField
                value={link.url}
                label={link.label ?? link.type}
                purpose="body"
                editor="input"
                inputType="url"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
export { ContactDetails };
