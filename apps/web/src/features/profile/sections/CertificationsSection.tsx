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

const CertificationsSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: Props) => {
  const certifications = profile.certifications;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <h2 className="text-section font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Certifications
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {certifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No certifications yet</p>
        ) : (
          certifications.map((cert) => (
            <div key={cert.id} className="flex flex-col gap-3 pt-4 first:pt-0">
              <EditableField
                value={cert.name}
                label="Certification name"
                displayAs="p"
                purpose="title"
                weight="semibold"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextCerts = profile.certifications.map((c) =>
                    c.id === cert.id ? { ...c, name: value } : c,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    certifications: nextCerts,
                  };
                  return onProfileChange(next);
                }}
              />
              <EditableField
                value={cert.issuer}
                label="Issuer"
                displayAs="p"
                purpose="subtitle"
                weight="medium"
                tone="muted"
                pending={pending}
                disabled={readOnly}
                onSubmit={(value) => {
                  const nextCerts = profile.certifications.map((c) =>
                    c.id === cert.id ? { ...c, issuer: value } : c,
                  );
                  const next: CandidateProfileV1 = {
                    ...profile,
                    certifications: nextCerts,
                  };
                  return onProfileChange(next);
                }}
              />
              <div className="flex flex-wrap gap-2">
                <EditableField
                  value={cert.issueDate ?? ''}
                  label="Issue date"
                  purpose="meta"
                  tone="muted"
                  editor="input"
                  inputType="month"
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => {
                    const nextDate = value.trim() === '' ? null : value;
                    const nextCerts = profile.certifications.map((c) =>
                      c.id === cert.id ? { ...c, issueDate: nextDate } : c,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      certifications: nextCerts,
                    };
                    return onProfileChange(next);
                  }}
                />
                <EditableField
                  value={cert.expirationDate ?? ''}
                  label="Expiration date"
                  purpose="meta"
                  tone="muted"
                  editor="input"
                  inputType="month"
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => {
                    const nextDate = value.trim() === '' ? null : value;
                    const nextCerts = profile.certifications.map((c) =>
                      c.id === cert.id ? { ...c, expirationDate: nextDate } : c,
                    );
                    const next: CandidateProfileV1 = {
                      ...profile,
                      certifications: nextCerts,
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

export default CertificationsSection;
export { CertificationsSection };
