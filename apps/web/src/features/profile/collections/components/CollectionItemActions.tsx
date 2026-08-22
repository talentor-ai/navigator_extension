import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';

export type CollectionItemActionsProps = {
  dragAttributes?: Record<string, unknown>;
  dragListeners?: Record<string, unknown>;
  onRemove?: () => void;
  disabled?: boolean;
  pending?: boolean;
  readOnly?: boolean;
  removeLabel?: string;
  dragLabel?: string;
};

export function CollectionItemActions({
  dragAttributes,
  dragListeners,
  onRemove,
  disabled = false,
  pending = false,
  readOnly = false,
  removeLabel = 'Remove item',
  dragLabel = 'Drag to reorder',
}: CollectionItemActionsProps) {
  const isDragDisabled = disabled || pending || readOnly;
  const isDeleteDisabled = disabled || pending;
  const showDelete = Boolean(onRemove) && !readOnly;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={dragLabel}
        disabled={isDragDisabled}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        {...dragAttributes}
        {...dragListeners}
      >
        <Icons type="drag" aria-hidden="true" />
      </button>
      {showDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isDeleteDisabled}
          aria-label={removeLabel}
        >
          <Icons type="delete" aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}

export default CollectionItemActions;
