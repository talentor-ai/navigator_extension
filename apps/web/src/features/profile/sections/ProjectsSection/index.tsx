import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  CollectionSectionHeader,
  ConfirmRemoveDialog,
  SortableCollection,
  SortableCollectionItem,
} from '@/features/profile/collections';
import { ProjectAddDialog } from './components/ProjectAddDialog';
import { ProjectItem } from './components/ProjectItem';
import { useProjectEditor } from './hooks/useProjectEditor';
import type { ProjectsSectionProps } from './types';

const ProjectsSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: ProjectsSectionProps) => {
  const projects = profile.projects;
  const {
    updateName,
    updateRole,
    updateDescription,
    updateStartDate,
    updateEndDate,
    updateUrl,
    updateRepository,
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
  } = useProjectEditor(profile, onProfileChange);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CollectionSectionHeader
          title="Projects"
          onAdd={openAdd}
          pending={pending}
          readOnly={readOnly}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 divide-y divide-border">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet</p>
        ) : (
          <SortableCollection
            items={projects}
            getId={(p) => p.id}
            onReorder={handleReorder}
          >
            {(project) => (
              <SortableCollectionItem
                key={project.id}
                id={project.id}
                pending={pending}
                readOnly={readOnly}
                dragLabel="Drag to reorder project"
                removeLabel="Remove project"
                onRemove={() => requestRemove(project.id)}
                className="pt-4 first:pt-0"
              >
                <ProjectItem
                  item={project}
                  pending={pending}
                  readOnly={readOnly}
                  onNameSubmit={(value) => updateName(project.id, value)}
                  onRoleSubmit={(value) => updateRole(project.id, value)}
                  onDescriptionSubmit={(value) =>
                    updateDescription(project.id, value)
                  }
                  onStartDateSubmit={(value) =>
                    updateStartDate(project.id, value)
                  }
                  onEndDateSubmit={(value) => updateEndDate(project.id, value)}
                  onUrlSubmit={(value) => updateUrl(project.id, value)}
                  onRepositorySubmit={(value) =>
                    updateRepository(project.id, value)
                  }
                  onAchievementSubmit={(idx, value) =>
                    updateAchievement(project.id, idx, value)
                  }
                />
              </SortableCollectionItem>
            )}
          </SortableCollection>
        )}
        <ProjectAddDialog
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
          title="Remove project?"
          description="This will remove the project entry."
          pending={pending}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;
export { ProjectsSection };
