import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  CollectionSectionHeader,
  ConfirmRemoveDialog,
  SortableCollection,
  SortableCollectionItem,
} from '../../collections';
import { useSkillsSection } from './hooks/useSkillsSection';
import { AddSkillDialog } from './components/AddSkillDialog';
import { SkillItem } from './components/SkillItem';
import type { SkillsSectionProps } from './types';

const SkillsSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: SkillsSectionProps) => {
  const {
    skills,
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
    updateSkillName,
    updateSkillCategory,
    updateSkillYears,
    updateSkillLastUsed,
  } = useSkillsSection(profile, onProfileChange);

  const removeSkill = skills.find((s) => s.id === removeTarget);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CollectionSectionHeader
          title="Skills"
          onAdd={openAdd}
          pending={pending}
          readOnly={readOnly}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills yet</p>
        ) : (
          <SortableCollection
            items={skills}
            getId={(s) => s.id}
            onReorder={handleReorder}
            id="skills-collection"
          >
            {(skill) => (
              <SortableCollectionItem
                key={skill.id}
                id={skill.id}
                pending={pending}
                readOnly={readOnly}
                onRemove={() => requestRemove(skill.id)}
                removeLabel={`Remove ${skill.name}`}
                dragLabel={`Drag ${skill.name} to reorder`}
                className="pt-4 first:pt-0 border-t first:border-t-0 border-border"
              >
                <SkillItem
                  skill={skill}
                  pending={pending}
                  readOnly={readOnly}
                  onNameSubmit={(v) => updateSkillName(skill.id, v)}
                  onCategorySubmit={(v) => updateSkillCategory(skill.id, v)}
                  onYearsSubmit={(v) => updateSkillYears(skill.id, v)}
                  onLastUsedSubmit={(v) => updateSkillLastUsed(skill.id, v)}
                />
              </SortableCollectionItem>
            )}
          </SortableCollection>
        )}
        <AddSkillDialog
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
          title={removeSkill ? `Remove ${removeSkill.name}?` : 'Remove skill?'}
          description="This will remove the skill and its references. This action cannot be undone."
          confirmLabel="Remove"
          cancelLabel="Cancel"
          pending={pending}
        />
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
export { SkillsSection };
