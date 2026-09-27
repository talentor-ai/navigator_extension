import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (name: string, issuer: string) => void;
  pending?: boolean;
  error?: string | null;
};

export const AddCertificationDialog = ({
  open,
  onCancel,
  onSubmit,
  pending = false,
  error,
}: Props) => {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setIssuer('');
      setLocalError(null);
    }
  }, [open]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    } else if (error === null) {
      setLocalError(null);
    }
  }, [error]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedIssuer = issuer.trim();
    if (!trimmedName || !trimmedIssuer) {
      setLocalError('Name and issuer are required');
      return;
    }
    setLocalError(null);
    onSubmit(trimmedName, trimmedIssuer);
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
      aria-label="Add certification"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="document"
        className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title font-semibold">Add certification</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new certification to your profile.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-name">Certification name</Label>
            <Input
              id="cert-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AWS Certified"
              disabled={pending}
              aria-label="Name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-issuer">Issuer</Label>
            <Input
              id="cert-issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. Amazon"
              disabled={pending}
              aria-label="Issuer"
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
  );
};
