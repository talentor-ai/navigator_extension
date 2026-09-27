import { EditableField } from '@/components/EditableField';
import { validateNonBlank } from '@/features/profile/validation';
import type { CertificationItemProps } from '../types';

export const CertificationItem = ({
  item,
  pending,
  readOnly,
  onNameSubmit,
  onIssuerSubmit,
  onIssueDateSubmit,
  onExpirationDateSubmit,
}: CertificationItemProps) => {
  return (
    <div className="flex flex-col gap-3">
      <EditableField
        value={item.name}
        label="Certification name"
        displayAs="p"
        purpose="title"
        weight="semibold"
        pending={pending}
        disabled={readOnly}
        validate={(v) => validateNonBlank(v, 'Certification name')}
        onSubmit={onNameSubmit}
      />
      <EditableField
        value={item.issuer}
        label="Issuer"
        displayAs="p"
        purpose="subtitle"
        weight="medium"
        tone="muted"
        pending={pending}
        disabled={readOnly}
        validate={(v) => validateNonBlank(v, 'Issuer')}
        onSubmit={onIssuerSubmit}
      />
      <div className="flex flex-wrap gap-2">
        <EditableField
          value={item.issueDate ?? ''}
          label="Issue date"
          purpose="meta"
          tone="muted"
          editor="input"
          inputType="month"
          pending={pending}
          disabled={readOnly}
          onSubmit={onIssueDateSubmit}
        />
        <EditableField
          value={item.expirationDate ?? ''}
          label="Expiration date"
          purpose="meta"
          tone="muted"
          editor="input"
          inputType="month"
          pending={pending}
          disabled={readOnly}
          onSubmit={onExpirationDateSubmit}
        />
      </div>
    </div>
  );
};
