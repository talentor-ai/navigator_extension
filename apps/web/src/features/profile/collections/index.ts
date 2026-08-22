export { CollectionSectionHeader } from './components/CollectionSectionHeader';
export type { CollectionSectionHeaderProps } from './components/CollectionSectionHeader';

export { SortableCollection } from './components/SortableCollection';
export type { SortableCollectionProps } from './components/SortableCollection';

export { SortableCollectionItem } from './components/SortableCollectionItem';
export type { SortableCollectionItemProps } from './components/SortableCollectionItem';

export { CollectionItemActions } from './components/CollectionItemActions';
export type { CollectionItemActionsProps } from './components/CollectionItemActions';

export { ConfirmRemoveDialog } from './components/ConfirmRemoveDialog';
export type { ConfirmRemoveDialogProps } from './components/ConfirmRemoveDialog';

export { useSortableCollection } from './hooks/useSortableCollection';
export type {
  UseSortableCollectionOptions,
  UseSortableCollectionReturn,
} from './hooks/useSortableCollection';

export {
  reorder,
  reorderById,
  removeSkill,
  removeExperience,
  removeProject,
  removeEducation,
  removeLanguage,
  removeCertification,
} from './utils';
