import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ProjectAddDialogProps = {
  open: boolean;
  pending?: boolean;
  draft: { name: string; description: string };
  errors: Partial<Record<'name' | 'description', string>>;
  onDraftChange: (field: 'name' | 'description', value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ProjectAddDialog({
  open,
  pending = false,
  draft,
  errors,
  onDraftChange,
  onConfirm,
  onCancel,
}: ProjectAddDialogProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add project"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (pending) return;
        onCancel();
      }}
    >
      <div
        role="document"
        className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title font-semibold">Add project</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="proj-add-name">Project name</Label>
            <Input
              id="proj-add-name"
              value={draft.name}
              onChange={(e) => onDraftChange('name', e.target.value)}
              placeholder="Project name"
              disabled={pending}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="proj-add-desc">Project description</Label>
            <Textarea
              id="proj-add-desc"
              value={draft.description}
              onChange={(e) => onDraftChange('description', e.target.value)}
              placeholder="Description"
              rows={3}
              disabled={pending}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description ? (
              <p className="text-xs text-destructive">{errors.description}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="lime"
            onClick={onConfirm}
            disabled={pending}
            aria-busy={pending ? 'true' : undefined}
          >
            {pending ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProjectAddDialog;
