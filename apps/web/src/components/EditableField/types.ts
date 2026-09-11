import type { VariantProps } from 'class-variance-authority';
import type { ElementType } from 'react';
import type { editableTextVariants } from './constants';

export type EditableInputType =
  'text' | 'email' | 'tel' | 'url' | 'month' | 'number';

export type EditableOption = { value: string; label: string };

export type EditableEditor =
  | { editor: 'input'; inputType?: EditableInputType }
  | { editor: 'textarea'; rows?: number }
  | { editor: 'select'; options: readonly EditableOption[] };

export type EditableFieldProps = VariantProps<typeof editableTextVariants> & {
  value: string;
  label: string;
  emptyText?: string;
  displayAs?: ElementType;
  className?: string;
  disabled?: boolean;
  pending?: boolean;
  error?: string | null;
  onSubmit?: (value: string) => void | Promise<void>;
  editor?: 'input' | 'textarea' | 'select';
  inputType?: EditableInputType;
  options?: readonly EditableOption[];
  rows?: number;
};
