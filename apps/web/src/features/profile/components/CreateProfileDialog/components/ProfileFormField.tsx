import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ProfileFormFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
};

export const ProfileFormField = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled,
  error,
  placeholder,
  autoComplete,
  type,
}: ProfileFormFieldProps) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        autoComplete={autoComplete}
        type={type}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
};
