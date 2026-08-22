import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ExperienceAddDialogProps = {
  open: boolean;
  pending?: boolean;
  draft: { company: string; position: string; startDate: string };
  errors: Partial<Record<'company' | 'position' | 'startDate', string>>;
  onDraftChange: (
    field: 'company' | 'position' | 'startDate',
    value: string,
  ) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ExperienceAddDialog({
  open,
  pending = false,
  draft,
  errors,
  onDraftChange,
  onConfirm,
  onCancel,
}: ExperienceAddDialogProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add experience"
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
        <h2 className="text-title font-semibold">Add experience</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="exp-add-company">Company</Label>
            <Input
              id="exp-add-company"
              value={draft.company}
              onChange={(e) => onDraftChange('company', e.target.value)}
              placeholder="Acme Corp"
              disabled={pending}
              aria-invalid={Boolean(errors.company)}
            />
            {errors.company ? (
              <p className="text-xs text-destructive">{errors.company}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="exp-add-position">Position</Label>
            <Input
              id="exp-add-position"
              value={draft.position}
              onChange={(e) => onDraftChange('position', e.target.value)}
              placeholder="Engineer"
              disabled={pending}
              aria-invalid={Boolean(errors.position)}
            />
            {errors.position ? (
              <p className="text-xs text-destructive">{errors.position}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="exp-add-startDate">Start date</Label>
            <Input
              id="exp-add-startDate"
              type="text"
              placeholder="YYYY-MM"
              value={draft.startDate}
              onChange={(e) => onDraftChange('startDate', e.target.value)}
              disabled={pending}
              aria-invalid={Boolean(errors.startDate)}
            />
            {errors.startDate ? (
              <p className="text-xs text-destructive">{errors.startDate}</p>
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

export default ExperienceAddDialog;
