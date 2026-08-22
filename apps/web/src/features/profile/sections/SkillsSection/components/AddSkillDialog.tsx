import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (name: string, category: string) => void;
  pending?: boolean;
  error?: string | null;
};

export const AddSkillDialog = ({
  open,
  onCancel,
  onSubmit,
  pending = false,
  error,
}: Props) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setCategory('');
      setLocalError(null);
    }
  }, [open]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    } else if (error == null) {
      setLocalError((prev) => {
        if (prev === null) return null;
        if (prev === 'Name and category are required') return prev;
        return null;
      });
    }
  }, [error]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    if (!trimmedName || !trimmedCategory) {
      setLocalError('Name and category are required');
      return;
    }
    setLocalError(null);
    onSubmit(trimmedName, trimmedCategory);
  };

  const handleBackdropClick = () => {
    if (pending) return;
    onCancel();
  };

  const displayError = localError ?? error;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add skill"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="document"
        className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title font-semibold">Add skill</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new skill to your profile.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="skill-name">Name</Label>
            <Input
              id="skill-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React"
              disabled={pending}
              aria-label="Name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="skill-category">Category</Label>
            <Input
              id="skill-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Frontend"
              disabled={pending}
              aria-label="Category"
            />
          </div>
          {displayError ? (
            <p role="alert" className="text-sm text-destructive">
              {displayError}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending} aria-busy={pending}>
              {pending ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
