import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  CollectionSectionHeader,
  ConfirmRemoveDialog,
  SortableCollection,
  SortableCollectionItem,
} from '@/features/profile/collections';
import { ExperienceAddDialog } from './components/ExperienceAddDialog';
import { ExperienceItem } from './components/ExperienceItem';
import { useExperienceEditor } from './hooks/useExperienceEditor';
import type { ExperienceSectionProps } from './types';

const ExperienceSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: ExperienceSectionProps) => {
  const experiences = profile.experience;
  const {
    updateCompany,
    updatePosition,
    updateEmploymentType,
    updateLocationType,
    updateStartDate,
    updateEndDate,
    updateSummary,
    updateResponsibility,
    updateAchievement,
    isAddOpen,
    openAdd,
    closeAdd,
    draft,
    addErrors,
    handleDraftChange,
    handleAddConfirm,
    pendingRemoveId,
    requestRemove,
    cancelRemove,
    confirmRemove,
    handleReorder,
  } = useExperienceEditor(profile, onProfileChange);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CollectionSectionHeader
          title="Experience"
          onAdd={openAdd}
          pending={pending}
          readOnly={readOnly}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experience yet</p>
        ) : (
          <SortableCollection
            items={experiences}
            getId={(e) => e.id}
            onReorder={handleReorder}
          >
            {(item) => (
              <SortableCollectionItem
                key={item.id}
                id={item.id}
                pending={pending}
                readOnly={readOnly}
                dragLabel="Drag to reorder experience"
                removeLabel="Remove experience"
                onRemove={() => requestRemove(item.id)}
                className="pt-4 first:pt-0"
              >
                <ExperienceItem
                  item={item}
                  pending={pending}
                  readOnly={readOnly}
                  onCompanySubmit={(value) => updateCompany(item.id, value)}
                  onPositionSubmit={(value) => updatePosition(item.id, value)}
                  onEmploymentTypeSubmit={(value) =>
                    updateEmploymentType(item.id, value)
                  }
                  onLocationTypeSubmit={(value) =>
                    updateLocationType(item.id, value)
                  }
                  onStartDateSubmit={(value) => updateStartDate(item.id, value)}
                  onEndDateSubmit={(value) => updateEndDate(item.id, value)}
                  onSummarySubmit={(value) => updateSummary(item.id, value)}
                  onResponsibilitySubmit={(index, value) =>
                    updateResponsibility(item.id, index, value)
                  }
                  onAchievementSubmit={(index, value) =>
                    updateAchievement(item.id, index, value)
                  }
                />
              </SortableCollectionItem>
            )}
          </SortableCollection>
        )}
        <ExperienceAddDialog
          open={isAddOpen}
          pending={pending}
          draft={draft}
          errors={addErrors}
          onDraftChange={handleDraftChange}
          onConfirm={handleAddConfirm}
          onCancel={closeAdd}
        />
        <ConfirmRemoveDialog
          open={pendingRemoveId !== null}
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
          title="Remove experience?"
          description="This will remove the experience entry."
          pending={pending}
        />
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
export { ExperienceSection };
