import type { FormEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { EditableInputType } from '../types';

type Props = {
  value: string;
  label: string;
  inputType?: EditableInputType;
  pending?: boolean;
  styles: string;
  className?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export function EditableInputEditor({
  value,
  label,
  inputType = 'text',
  pending,
  styles,
  className,
  onSubmit,
  onBlur,
  onKeyDown,
}: Props) {
  return (
    <form className="inline" onSubmit={onSubmit}>
      <Input
        autoFocus
        name="value"
        type={inputType}
        defaultValue={value}
        aria-label={label}
        aria-busy={pending ? true : undefined}
        disabled={pending}
        className={cn(
          'inline h-auto min-w-24 bg-input px-1 py-0',
          styles,
          className,
        )}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </form>
  );
}
