import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  CollectionSectionHeader,
  ConfirmRemoveDialog,
  SortableCollection,
  SortableCollectionItem,
} from '../../collections';
import { useLanguagesSection } from './hooks/useLanguagesSection';
import { AddLanguageDialog } from './components/AddLanguageDialog';
import { LanguageItem } from './components/LanguageItem';
import type { LanguagesSectionProps } from './types';

const LanguagesSection = ({
  profile,
  onProfileChange,
  pending,
  readOnly,
}: LanguagesSectionProps) => {
  const {
    languages,
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
    updateLanguage,
    updateProficiency,
  } = useLanguagesSection(profile, onProfileChange);

  const removeItem = languages.find((l) => l.id === removeTarget);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CollectionSectionHeader
          title="Languages"
          onAdd={openAdd}
          pending={pending}
          readOnly={readOnly}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {languages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No languages yet</p>
        ) : (
          <SortableCollection
            items={languages}
            getId={(l) => l.id}
            onReorder={handleReorder}
            id="languages-collection"
          >
            {(item) => (
              <SortableCollectionItem
                key={item.id}
                id={item.id}
                pending={pending}
                readOnly={readOnly}
                onRemove={() => requestRemove(item.id)}
                removeLabel={`Remove ${item.language}`}
                dragLabel={`Drag ${item.language} to reorder`}
                className="pt-4 first:pt-0 border-t first:border-t-0 border-border"
              >
                <LanguageItem
                  item={item}
                  pending={pending}
                  readOnly={readOnly}
                  onLanguageSubmit={(v) => updateLanguage(item.id, v)}
                  onProficiencySubmit={(v) => updateProficiency(item.id, v)}
                />
              </SortableCollectionItem>
            )}
          </SortableCollection>
        )}
        <AddLanguageDialog
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
            removeItem ? `Remove ${removeItem.language}?` : 'Remove language?'
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

export default LanguagesSection;
export { LanguagesSection };
