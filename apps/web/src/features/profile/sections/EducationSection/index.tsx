import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  CollectionSectionHeader,
  ConfirmRemoveDialog,
  SortableCollection,
  SortableCollectionItem,
} from '../../collections';
import { useEducationSection } from './hooks/useEducationSection';
import { AddEducationDialog } from './components/AddEducationDialog';
import { EducationItem } from './components/EducationItem';
import type { EducationSectionProps } from './types';

const EducationSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: EducationSectionProps) => {
  const {
    education,
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
    updateInstitution,
    updateDegree,
    updateFieldOfStudy,
    updateCity,
    updateRegion,
    updateCountryCode,
    updateStartDate,
    updateEndDate,
  } = useEducationSection(profile, onProfileChange);

  const removeItem = education.find((e) => e.id === removeTarget);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CollectionSectionHeader
          title="Education"
          onAdd={openAdd}
          pending={pending}
          readOnly={readOnly}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {education.length === 0 ? (
          <p className="text-sm text-muted-foreground">No education yet</p>
        ) : (
          <SortableCollection
            items={education}
            getId={(e) => e.id}
            onReorder={handleReorder}
            id="education-collection"
          >
            {(item) => (
              <SortableCollectionItem
                key={item.id}
                id={item.id}
                pending={pending}
                readOnly={readOnly}
                onRemove={() => requestRemove(item.id)}
                removeLabel={`Remove ${item.institution}`}
                dragLabel={`Drag ${item.institution} to reorder`}
                className="pt-4 first:pt-0 border-t first:border-t-0 border-border"
              >
                <EducationItem
                  item={item}
                  pending={pending}
                  readOnly={readOnly}
                  onInstitutionSubmit={(value) =>
                    updateInstitution(item.id, value)
                  }
                  onDegreeSubmit={(value) => updateDegree(item.id, value)}
                  onFieldOfStudySubmit={(value) =>
                    updateFieldOfStudy(item.id, value)
                  }
                  onCitySubmit={(value) => updateCity(item.id, value)}
                  onRegionSubmit={(value) => updateRegion(item.id, value)}
                  onCountryCodeSubmit={(value) =>
                    updateCountryCode(item.id, value)
                  }
                  onStartDateSubmit={(value) => updateStartDate(item.id, value)}
                  onEndDateSubmit={(value) => updateEndDate(item.id, value)}
                />
              </SortableCollectionItem>
            )}
          </SortableCollection>
        )}
        <AddEducationDialog
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
            removeItem
              ? `Remove ${removeItem.institution}?`
              : 'Remove education?'
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

export default EducationSection;
export { EducationSection };
