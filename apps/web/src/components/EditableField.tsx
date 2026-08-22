/* eslint-disable react-refresh/only-export-components */
import {
  startTransition,
  useOptimistic,
  useState,
  type ElementType,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const editableTextVariants = cva(
  'rounded-sm border border-transparent px-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70',
  {
    variants: {
      purpose: {
        display: 'text-display tracking-tight',
        role: 'text-role',
        section: 'text-section uppercase tracking-[0.14em]',
        title: 'text-title',
        subtitle: 'text-subtitle',
        body: 'text-body',
        meta: 'text-meta',
        label: 'text-label',
      },
      weight: {
        regular: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      tone: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        accent: 'text-accent',
        destructive: 'text-destructive',
        success: 'text-success',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      purpose: 'body',
      weight: 'regular',
      tone: 'default',
      align: 'left',
    },
  },
);

type EditableInputType = 'text' | 'email' | 'tel' | 'url' | 'month' | 'number';

type EditableOption = { value: string; label: string };

type EditableEditor =
  | { editor: 'input'; inputType?: EditableInputType }
  | { editor: 'textarea'; rows?: number }
  | { editor: 'select'; options: readonly EditableOption[] };

type EditableFieldProps = VariantProps<typeof editableTextVariants> & {
  value: string;
  label: string;
  displayAs?: ElementType;
  className?: string;
  disabled?: boolean;
  onSubmit?: (value: string) => void | Promise<void>;
  editor?: 'input' | 'textarea' | 'select';
  inputType?: EditableInputType;
  options?: readonly EditableOption[];
  rows?: number;
};

const EditableField = ({
  value,
  label,
  editor = 'input',
  inputType = 'text',
  options,
  rows,
  displayAs: Display = 'span',
  purpose,
  weight,
  tone,
  align,
  className,
  disabled = false,
  onSubmit,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const styles = editableTextVariants({ purpose, weight, tone, align });

  const beginEditing = () => {
    if (!disabled) setIsEditing(true);
  };

  const handleDisplayKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === 'F2') {
      event.preventDefault();
      beginEditing();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextValue = String(
      new FormData(event.currentTarget).get('value') ?? '',
    );
    setIsEditing(false);

    startTransition(async () => {
      setOptimisticValue(nextValue);
      await onSubmit?.(nextValue);
    });
  };

  const handleSelectChange = (nextValue: string) => {
    setIsEditing(false);
    startTransition(async () => {
      setOptimisticValue(nextValue);
      await onSubmit?.(nextValue);
    });
  };

  const displayValue =
    editor === 'select' && options
      ? (options.find((opt) => opt.value === optimisticValue)?.label ??
        optimisticValue)
      : optimisticValue;

  if (isEditing) {
    if (editor === 'select') {
      return (
        <Select
          defaultValue={optimisticValue}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger
            aria-label={label}
            className={cn(
              'h-auto min-h-9 min-w-24 px-1 py-1',
              styles,
              className,
            )}
            onBlur={() => setIsEditing(false)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(options ?? []).map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (editor === 'textarea') {
      return (
        <form className="inline" onSubmit={handleSubmit}>
          <Textarea
            autoFocus
            name="value"
            defaultValue={optimisticValue}
            rows={rows}
            aria-label={label}
            className={cn('min-w-24 bg-input px-1 py-1', styles, className)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                setIsEditing(false);
              }
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const nextValue = event.currentTarget.value;
                setIsEditing(false);
                startTransition(async () => {
                  setOptimisticValue(nextValue);
                  await onSubmit?.(nextValue);
                });
              }
            }}
          />
        </form>
      );
    }

    return (
      <form className="inline" onSubmit={handleSubmit}>
        <Input
          autoFocus
          name="value"
          type={inputType}
          defaultValue={optimisticValue}
          aria-label={label}
          className={cn(
            'inline h-auto min-w-24 bg-input px-1 py-0',
            styles,
            className,
          )}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              setIsEditing(false);
            }
          }}
        />
      </form>
    );
  }

  return (
    <Display
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Edit ${label}`}
      aria-disabled={disabled}
      className={cn(
        styles,
        !disabled && 'cursor-text hover:bg-secondary',
        disabled && 'cursor-default opacity-70',
        className,
      )}
      onDoubleClick={beginEditing}
      onKeyDown={handleDisplayKeyDown}
    >
      {displayValue}
    </Display>
  );
};

export {
  EditableField,
  editableTextVariants,
  type EditableFieldProps,
  type EditableInputType,
  type EditableOption,
  type EditableEditor,
};
