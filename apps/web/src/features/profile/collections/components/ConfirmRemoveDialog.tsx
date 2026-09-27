import { Button } from '@/components/ui/button';

export type ConfirmRemoveDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
};

export function ConfirmRemoveDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Remove item?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Remove',
  cancelLabel = 'Cancel',
  pending = false,
}: ConfirmRemoveDialogProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-busy={pending ? 'true' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!pending) onCancel();
      }}
    >
      <div
        role="document"
        className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={pending}
            aria-busy={pending ? 'true' : undefined}
          >
            {pending ? 'Removing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRemoveDialog;
