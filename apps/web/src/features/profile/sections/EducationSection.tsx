import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

type Props = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

const EducationSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  const education = profile.education;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Education
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {education.length === 0 ? (
          <p className="text-sm text-muted-foreground">No education yet</p>
        ) : (
          education.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 pt-4 first:pt-0">
              <EditableField
                value={item.institution}
                label="Institution"
                displayAs="p"
                purpose="title"
                weight="semibold"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextEducation = profile.education.map((e) =>
                    e.id === item.id ? { ...e, institution: value } : e,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    education: nextEducation,
                  };
                  return onProfileChange(next);
                }}
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
                onSubmit={(value) => {
                  const nextDegree = value.trim() === '' ? null : value;
                  const nextEducation = profile.education.map((e) =>
                    e.id === item.id ? { ...e, degree: nextDegree } : e,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    education: nextEducation,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={item.fieldOfStudy ?? ''}
                label="Field of study"
                displayAs="p"
                purpose="body"
                tone="muted"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextField = value.trim() === '' ? null : value;
                  const nextEducation = profile.education.map((e) =>
                    e.id === item.id ? { ...e, fieldOfStudy: nextField } : e,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    education: nextEducation,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={item.location?.city ?? ''}
                label="City"
                purpose="meta"
                tone="muted"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextCity = value.trim() === '' ? null : value;
                  const nextEducation = profile.education.map((e) => {
                    if (e.id !== item.id) return e;
                    const baseLoc = e.location ?? {};
                    const nextLoc = {
                      ...baseLoc,
                      city: nextCity,
                    } as components['schemas']['Location'];
                    return { ...e, location: nextLoc };
                  });
                  const next: CandidateProfileV1 = {
                    ...profile,
                    education: nextEducation,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={item.location?.region ?? ''}
                label="Region"
                purpose="meta"
                tone="muted"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextRegion = value.trim() === '' ? null : value;
                  const nextEducation = profile.education.map((e) => {
                    if (e.id !== item.id) return e;
                    const baseLoc = e.location ?? {};
                    const nextLoc = {
                      ...baseLoc,
                      region: nextRegion,
                    } as components['schemas']['Location'];
                    return { ...e, location: nextLoc };
                  });
                  const next: CandidateProfileV1 = {
                    ...profile,
                    education: nextEducation,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={item.location?.countryCode ?? ''}
                label="Country code"
                purpose="meta"
                tone="muted"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextCountry = value.trim() === '' ? null : value;
                  const nextEducation = profile.education.map((e) => {
                    if (e.id !== item.id) return e;
                    const baseLoc = e.location ?? {};
                    const nextLoc = {
                      ...baseLoc,
                      countryCode: nextCountry,
                    } as components['schemas']['Location'];
                    return { ...e, location: nextLoc };
                  });
                  const next: CandidateProfileV1 = {
                    ...profile,
                    education: nextEducation,
                  };
                  return onProfileChange(next);
                }}
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
                  onSubmit={(value) => {
                    const nextStart = value.trim() === '' ? null : value;
                    const nextEducation = profile.education.map((e) =>
                      e.id === item.id ? { ...e, startDate: nextStart } : e,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      education: nextEducation,
                    };
                    return onProfileChange(next);
                  }}
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
                  onSubmit={(value) => {
                    const nextEnd = value.trim() === '' ? null : value;
                    const nextEducation = profile.education.map((e) =>
                      e.id === item.id ? { ...e, endDate: nextEnd } : e,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      education: nextEducation,
                    };
                    return onProfileChange(next);
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default EducationSection;
export { EducationSection };
