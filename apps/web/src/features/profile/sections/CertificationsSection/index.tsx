import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  CollectionSectionHeader,
  ConfirmRemoveDialog,
  SortableCollection,
  SortableCollectionItem,
} from '../../collections';
import { useCertificationsSection } from './hooks/useCertificationsSection';
import { AddCertificationDialog } from './components/AddCertificationDialog';
import { CertificationItem } from './components/CertificationItem';
import type { CertificationsSectionProps } from './types';

const CertificationsSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: CertificationsSectionProps) => {
  const {
    certifications,
    isAddOpen,
    addError,
    openAdd,
    closeAdd,
    handleAdd,
    removeTarget,
    requestRemove,
    cancelRemove,
    confirmRemove,
    handleReorder,
    updateName,
    updateIssuer,
    updateIssueDate,
    updateExpirationDate,
  } = useCertificationsSection(profile, onProfileChange);

  const removeItem = certifications.find((c) => c.id === removeTarget);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CollectionSectionHeader
          title="Certifications"
          onAdd={openAdd}
          pending={pending}
          readOnly={readOnly}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {certifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No certifications yet</p>
        ) : (
          <SortableCollection
            items={certifications}
            getId={(c) => c.id}
            onReorder={handleReorder}
            id="certifications-collection"
          >
            {(cert) => (
              <SortableCollectionItem
                key={cert.id}
                id={cert.id}
                pending={pending}
                readOnly={readOnly}
                onRemove={() => requestRemove(cert.id)}
                removeLabel={`Remove ${cert.name}`}
                dragLabel={`Drag ${cert.name} to reorder`}
                className="pt-4 first:pt-0 border-t first:border-t-0 border-border"
              >
                <CertificationItem
                  item={cert}
                  pending={pending}
                  readOnly={readOnly}
                  onNameSubmit={(value) => updateName(cert.id, value)}
                  onIssuerSubmit={(value) => updateIssuer(cert.id, value)}
                  onIssueDateSubmit={(value) => updateIssueDate(cert.id, value)}
                  onExpirationDateSubmit={(value) =>
                    updateExpirationDate(cert.id, value)
                  }
                />
              </SortableCollectionItem>
            )}
          </SortableCollection>
        )}
        <AddCertificationDialog
          open={isAddOpen}
          onCancel={closeAdd}
          onSubmit={handleAdd}
          pending={pending}
          error={addError}
        />
        <ConfirmRemoveDialog
          open={Boolean(removeTarget)}
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
          title={
            removeItem ? `Remove ${removeItem.name}?` : 'Remove certification?'
          }
          description="This action cannot be undone."
          confirmLabel="Remove"
          cancelLabel="Cancel"
          pending={pending}
        />
      </CardContent>
    </Card>
  );
};

export default CertificationsSection;
export { CertificationsSection };
