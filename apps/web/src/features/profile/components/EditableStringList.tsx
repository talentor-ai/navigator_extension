import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { EditableField } from '@/components/EditableField';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { validateNonBlank } from '../validation';

type Props = {
  items: readonly string[];
  itemLabel: string;
  addLabel: string;
  pending?: boolean;
  readOnly?: boolean;
  emptyText?: string;
  onChange: (index: number, value: string) => void | Promise<void>;
  onAdd: (value: string) => void | Promise<void>;
  onRemove: (index: number) => void | Promise<void>;
  rows?: number;
  className?: string;
};

export function EditableStringList({
  items,
  itemLabel,
  addLabel,
  pending,
  readOnly,
  emptyText,
  onChange,
  onAdd,
  onRemove,
  rows = 2,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft('');
      setLocalError(null);
    }
  }, [open]);

  const handleOpen = () => {
    if (readOnly || pending) return;
    setOpen(true);
  };

  const handleCancel = () => {
    if (pending) return;
    setOpen(false);
  };

  const handleBackdrop = () => {
    if (pending) return;
    setOpen(false);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    const err = validateNonBlank(trimmed, itemLabel);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);
    await onAdd(trimmed);
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.length === 0 ? (
        emptyText ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : null
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <div key={`${itemLabel}-${idx}-${item}`} className="flex gap-2">
              <div className="flex-1">
                <EditableField
                  value={item}
                  label={itemLabel}
                  editor="textarea"
                  rows={rows}
                  pending={pending}
                  disabled={readOnly}
                  onSubmit={(value) => onChange(idx, value)}
                />
              </div>
              {!readOnly ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={`Remove ${itemLabel.toLowerCase()}`}
                  disabled={pending}
                  onClick={() => onRemove(idx)}
                  className="shrink-0"
                >
                  <Icons type="delete" />
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {!readOnly ? (
        <Button
          type="button"
          variant="lime"
          size="sm"
          disabled={pending}
          onClick={handleOpen}
          className="self-start"
        >
          <Icons type="add" />
          {addLabel}
        </Button>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Add ${itemLabel.toLowerCase()}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleBackdrop}
        >
          <div
            role="document"
            className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-title font-semibold">{addLabel}</h2>
            <form onSubmit={handleConfirm} className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="editable-string-list-input">{itemLabel}</Label>
                <Textarea
                  id="editable-string-list-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={rows}
                  placeholder={itemLabel}
                  disabled={pending}
                  aria-label={itemLabel}
                />
              </div>
              {localError ? (
                <p role="alert" className="text-sm text-destructive">
                  {localError}
                </p>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={pending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="lime"
                  disabled={pending}
                  aria-busy={pending}
                >
                  {pending ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default EditableStringList;
