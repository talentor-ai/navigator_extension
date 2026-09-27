import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LINK_TYPE_OPTIONS } from '../../../profile.constants';
import { validateHttpUrl } from '../../../validation';

type Props = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (payload: {
    type: string;
    url: string;
    label: string | null;
  }) => void;
  pending?: boolean;
  error?: string | null;
};

const DEFAULT_TYPE =
  LINK_TYPE_OPTIONS.find((o) => o.value === 'other')?.value ??
  LINK_TYPE_OPTIONS[0].value;

export function AddLinkDialog({
  open,
  onCancel,
  onSubmit,
  pending = false,
  error,
}: Props) {
  const [type, setType] = useState<string>(DEFAULT_TYPE);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setType(DEFAULT_TYPE);
      setUrl('');
      setLabel('');
      setLocalError(null);
    }
  }, [open]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    } else if (error == null) {
      setLocalError((prev) => {
        if (prev === null) return null;
        if (prev === 'Type and URL are required') return prev;
        return null;
      });
    }
  }, [error]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedType = type.trim();
    const trimmedUrl = url.trim();
    const trimmedLabel = label.trim();
    if (!trimmedType || !trimmedUrl) {
      setLocalError('Type and URL are required');
      return;
    }
    const urlError = validateHttpUrl(trimmedUrl);
    if (urlError) {
      setLocalError(urlError);
      return;
    }
    setLocalError(null);
    onSubmit({
      type: trimmedType,
      url: trimmedUrl,
      label: trimmedLabel === '' ? null : trimmedLabel,
    });
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
      aria-label="Add link"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="document"
        className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title font-semibold">Add link</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new link to your profile.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-type">Type</Label>
            <Select value={type} onValueChange={setType} disabled={pending}>
              <SelectTrigger id="link-type" aria-label="Type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {LINK_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={pending}
              aria-label="URL"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-label">Label</Label>
            <Input
              id="link-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. My portfolio"
              disabled={pending}
              aria-label="Label"
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
}

export default AddLinkDialog;
