import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { EditableOption } from '../types';

type Props = {
  value: string;
  label: string;
  pending?: boolean;
  styles: string;
  className?: string;
  options?: readonly EditableOption[];
  onValueChange: (value: string) => void;
  onBlur: () => void;
};

export function EditableSelectEditor({
  value,
  label,
  pending,
  styles,
  className,
  options,
  onValueChange,
  onBlur,
}: Props) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={pending}>
      <SelectTrigger
        aria-label={label}
        aria-busy={pending ? true : undefined}
        className={cn('h-auto min-h-9 min-w-24 px-1 py-1', styles, className)}
        onBlur={onBlur}
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
