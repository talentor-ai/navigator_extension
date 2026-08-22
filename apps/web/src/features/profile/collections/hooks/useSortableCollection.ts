import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export type UseSortableCollectionOptions = {
  items: string[];
  onReorder: (oldIndex: number, newIndex: number) => void;
};

export type UseSortableCollectionReturn = {
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (event: DragEndEvent) => void;
};

export function useSortableCollection({
  items,
  onReorder,
}: UseSortableCollectionOptions): UseSortableCollectionReturn {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;
    const oldIndex = items.indexOf(activeId);
    const newIndex = items.indexOf(overId);
    if (oldIndex === -1 || newIndex === -1) return;
    if (oldIndex === newIndex) return;
    onReorder(oldIndex, newIndex);
  };

  return { sensors, handleDragEnd };
}
