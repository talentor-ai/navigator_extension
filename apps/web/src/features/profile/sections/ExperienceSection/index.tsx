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
    updateCompanyLocationCity,
    updateCompanyLocationRegion,
    updateCompanyLocationCountryCode,
    updateStartDate,
    updateEndDate,
    updateSummary,
    updateResponsibility,
    addResponsibility,
    removeResponsibility,
    updateAchievement,
    addAchievement,
    removeAchievement,
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
      <CardContent className="flex flex-col gap-4">
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experience yet</p>
        ) : (
          <SortableCollection
            items={experiences}
            getId={(e) => e.id}
            onReorder={handleReorder}
          >
            {(item, index) => (
              <SortableCollectionItem
                key={item.id}
                id={item.id}
                pending={pending}
                readOnly={readOnly}
                dragLabel="Drag to reorder experience"
                removeLabel="Remove experience"
                onRemove={() => requestRemove(item.id)}
                className={
                  index === 0 ? 'pt-0' : 'border-t border-border mt-8 pt-8'
                }
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
                  onCompanyLocationCitySubmit={(value) =>
                    updateCompanyLocationCity(item.id, value)
                  }
                  onCompanyLocationRegionSubmit={(value) =>
                    updateCompanyLocationRegion(item.id, value)
                  }
                  onCompanyLocationCountryCodeSubmit={(value) =>
                    updateCompanyLocationCountryCode(item.id, value)
                  }
                  onStartDateSubmit={(value) => updateStartDate(item.id, value)}
                  onEndDateSubmit={(value) => updateEndDate(item.id, value)}
                  onSummarySubmit={(value) => updateSummary(item.id, value)}
                  onResponsibilitySubmit={(index, value) =>
                    updateResponsibility(item.id, index, value)
                  }
                  onResponsibilityAdd={(value) =>
                    addResponsibility(item.id, value)
                  }
                  onResponsibilityRemove={(index) =>
                    removeResponsibility(item.id, index)
                  }
                  onAchievementSubmit={(index, value) =>
                    updateAchievement(item.id, index, value)
                  }
                  onAchievementAdd={(value) => addAchievement(item.id, value)}
                  onAchievementRemove={(index) =>
                    removeAchievement(item.id, index)
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
