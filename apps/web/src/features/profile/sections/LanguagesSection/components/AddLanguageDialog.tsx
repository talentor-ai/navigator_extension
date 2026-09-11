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
import { LANGUAGE_PROFICIENCY_OPTIONS } from '../../../profile.constants';

type Props = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (language: string, proficiency: string) => void;
  pending?: boolean;
  error?: string | null;
};

export const AddLanguageDialog = ({
  open,
  onCancel,
  onSubmit,
  pending = false,
  error,
}: Props) => {
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLanguage('');
      setProficiency('');
      setLocalError(null);
    }
  }, [open]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    } else if (error == null) {
      setLocalError((prev) => {
        if (prev === null) return null;
        if (prev === 'Language and proficiency are required') return prev;
        return null;
      });
    }
  }, [error]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLanguage = language.trim();
    const trimmedProficiency = proficiency.trim();
    if (!trimmedLanguage || !trimmedProficiency) {
      setLocalError('Language and proficiency are required');
      return;
    }
    setLocalError(null);
    onSubmit(trimmedLanguage, trimmedProficiency);
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
      aria-label="Add language"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="document"
        className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title font-semibold">Add language</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new language to your profile.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="language-name">Language</Label>
            <Input
              id="language-name"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English"
              disabled={pending}
              aria-label="Language"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="language-proficiency">Proficiency</Label>
            <Select
              value={proficiency}
              onValueChange={setProficiency}
              disabled={pending}
            >
              <SelectTrigger id="language-proficiency" aria-label="Proficiency">
                <SelectValue placeholder="Select proficiency" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_PROFICIENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
