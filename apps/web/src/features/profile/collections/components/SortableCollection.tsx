import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortableCollection } from '../hooks/useSortableCollection';

export type SortableCollectionProps<T> = {
  items: T[];
  getId: (item: T) => string;
  onReorder: (oldIndex: number, newIndex: number) => void;
  children: (item: T, index: number) => React.ReactNode;
  id?: string;
};

export function SortableCollection<T>({
  items,
  getId,
  onReorder,
  children,
  id,
}: SortableCollectionProps<T>) {
  const ids = items.map(getId);
  const { sensors, handleDragEnd } = useSortableCollection({
    items: ids,
    onReorder,
  });

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => children(item, index))}
      </SortableContext>
    </DndContext>
  );
}

export default SortableCollection;
