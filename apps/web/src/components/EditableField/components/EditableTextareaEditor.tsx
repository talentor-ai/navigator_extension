import type { FormEvent, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Props = {
  value: string;
  label: string;
  rows?: number;
  pending?: boolean;
  styles: string;
  className?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function EditableTextareaEditor({
  value,
  label,
  rows,
  pending,
  styles,
  className,
  onSubmit,
  onBlur,
  onKeyDown,
}: Props) {
  return (
    <form className="inline" onSubmit={onSubmit}>
      <Textarea
        autoFocus
        name="value"
        defaultValue={value}
        rows={rows}
        aria-label={label}
        aria-busy={pending ? true : undefined}
        disabled={pending}
        className={cn('min-w-24 bg-input px-1 py-1', styles, className)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </form>
  );
}
