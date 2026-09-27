import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CollectionItemActions } from './CollectionItemActions';

export type SortableCollectionItemProps = {
  id: string;
  disabled?: boolean;
  pending?: boolean;
  readOnly?: boolean;
  dragLabel?: string;
  onRemove?: () => void;
  removeLabel?: string;
  children: React.ReactNode;
  className?: string;
};

export function SortableCollectionItem({
  id,
  disabled = false,
  pending = false,
  readOnly = false,
  dragLabel = 'Drag to reorder',
  onRemove,
  removeLabel = 'Remove item',
  children,
  className,
}: SortableCollectionItemProps) {
  const isDragDisabled = Boolean(disabled || pending || readOnly);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isDragDisabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      data-sortable-id={id}
    >
      <div className="flex items-start gap-2">
        <CollectionItemActions
          dragAttributes={attributes as unknown as Record<string, unknown>}
          dragListeners={listeners as unknown as Record<string, unknown>}
          onRemove={onRemove}
          disabled={disabled}
          pending={pending}
          readOnly={readOnly}
          dragLabel={dragLabel}
          removeLabel={removeLabel}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export default SortableCollectionItem;
