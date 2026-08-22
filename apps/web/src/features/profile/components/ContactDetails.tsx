import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { LINK_TYPE_OPTIONS } from '../profile.constants';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

type Props = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

const ContactDetails = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  const personalInfo = profile.personalInfo;
  const location = personalInfo.location;
  const city = location?.city ?? '';
  const region = location?.region ?? '';
  const countryCode = location?.countryCode ?? '';

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Contact
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <EditableField
            value={personalInfo.email}
            label="Email"
            purpose="body"
            editor="input"
            inputType="email"
            pending={pending}
            disabled={readOnly}
            onSubmit={(value) => {
              const next: CandidateProfileV1 = {
                ...profile,
                personalInfo: {
                  ...profile.personalInfo,
                  email: value,
                },
              };
              return onProfileChange(next);
            }}
          />
          <EditableField
            value={personalInfo.phone ?? ''}
            label="Phone"
            purpose="body"
            editor="input"
            inputType="tel"
            pending={pending}
            disabled={readOnly}
            onSubmit={(value) => {
              const nextPhone = value.trim() === '' ? null : value;
              const next: CandidateProfileV1 = {
                ...profile,
                personalInfo: {
                  ...profile.personalInfo,
                  phone: nextPhone,
                },
              };
              return onProfileChange(next);
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <EditableField
            value={city}
            label="City"
            purpose="meta"
            tone="muted"
            pending={pending}
            disabled={readOnly}
            onSubmit={(value) => {
              const nextCity = value.trim() === '' ? null : value;
              const baseLoc = profile.personalInfo.location ?? {};
              const nextLoc = {
                ...baseLoc,
                city: nextCity,
              } as components['schemas']['Location'];
              const next: CandidateProfileV1 = {
                ...profile,
                personalInfo: {
                  ...profile.personalInfo,
                  location: nextLoc,
                },
              };
              return onProfileChange(next);
            }}
          />
          <EditableField
            value={region}
            label="Region"
            purpose="meta"
            tone="muted"
            pending={pending}
            disabled={readOnly}
            onSubmit={(value) => {
              const nextRegion = value.trim() === '' ? null : value;
              const baseLoc = profile.personalInfo.location ?? {};
              const nextLoc = {
                ...baseLoc,
                region: nextRegion,
              } as components['schemas']['Location'];
              const next: CandidateProfileV1 = {
                ...profile,
                personalInfo: {
                  ...profile.personalInfo,
                  location: nextLoc,
                },
              };
              return onProfileChange(next);
            }}
          />
          <EditableField
            value={countryCode}
            label="Country code"
            purpose="meta"
            tone="muted"
            pending={pending}
            disabled={readOnly}
            onSubmit={(value) => {
              const nextCountry = value.trim() === '' ? null : value;
              const baseLoc = profile.personalInfo.location ?? {};
              const nextLoc = {
                ...baseLoc,
                countryCode: nextCountry,
              } as components['schemas']['Location'];
              const next: CandidateProfileV1 = {
                ...profile,
                personalInfo: {
                  ...profile.personalInfo,
                  location: nextLoc,
                },
              };
              return onProfileChange(next);
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          {personalInfo.links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet</p>
          ) : (
            personalInfo.links.map((link, idx) => (
              <div
                key={`${link.type}-${link.url}-${idx}`}
                className="flex flex-col gap-1"
              >
                <EditableField
                  value={link.type}
                  label="Link type"
                  purpose="label"
                  weight="medium"
                  tone="muted"
                  editor="select"
                  options={LINK_TYPE_OPTIONS}
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => {
                    const nextLinks = profile.personalInfo.links.map((l, i) =>
                      i === idx
                        ? {
                            ...l,
                            type: value as components['schemas']['LinkType'],
                          }
                        : l,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      personalInfo: {
                        ...profile.personalInfo,
                        links: nextLinks,
                      },
                    };
                    return onProfileChange(next);
                  }}
                />
                <EditableField
                  value={link.url}
                  label={link.label ?? link.type}
                  purpose="body"
                  editor="input"
                  inputType="url"
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => {
                    const nextLinks = profile.personalInfo.links.map((l, i) =>
                      i === idx ? { ...l, url: value } : l,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      personalInfo: {
                        ...profile.personalInfo,
                        links: nextLinks,
                      },
                    };
                    return onProfileChange(next);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
export { ContactDetails };
