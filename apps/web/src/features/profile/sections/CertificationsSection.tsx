import type { components } from '@talentor/contracts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EditableField } from '@/components/EditableField';
import { MOCK_PROFILE } from '../profile.constants';

type Certification = components['schemas']['Certification'];

type CertificationsSectionProps = {
  certifications?: Certification[];
  profile?: components['schemas']['CandidateProfileV1'];
};

const CertificationsSection = ({
  certifications: certificationsProp,
  profile,
}: CertificationsSectionProps) => {
  const certifications =
    certificationsProp ??
    profile?.certifications ??
    MOCK_PROFILE.profile.certifications;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <EditableField
          value="Certifications"
          label="Certifications section title"
          purpose="section"
          weight="semibold"
          tone="muted"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {certifications.map((cert) => (
          <div key={cert.id} className="flex flex-col gap-3 pt-4 first:pt-0">
            <EditableField
              value={cert.name}
              label="Certification name"
              displayAs="p"
              purpose="title"
              weight="semibold"
            />
            <EditableField
              value={cert.issuer}
              label="Issuer"
              displayAs="p"
              purpose="subtitle"
              weight="medium"
              tone="muted"
            />
            <div className="flex flex-wrap gap-2">
              <EditableField
                value={cert.issueDate ?? ''}
                label="Issue date"
                purpose="meta"
                tone="muted"
                editor="input"
                inputType="month"
              />
              <EditableField
                value={cert.expirationDate ?? ''}
                label="Expiration date"
                purpose="meta"
                tone="muted"
                editor="input"
                inputType="month"
              />
            </div>
            <EditableField
              value={cert.credentialId ?? ''}
              label="Credential ID"
              purpose="meta"
              tone="muted"
            />
            <EditableField
              value={cert.credentialUrl ?? ''}
              label="Credential URL"
              purpose="body"
              tone="muted"
              editor="input"
              inputType="url"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CertificationsSection;
export { CertificationsSection };
