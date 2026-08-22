import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { editableTextVariants } from '../constants';
import type { EditableFieldProps, EditableOption } from '../types';

type UseEditableFieldOptions = Pick<
  EditableFieldProps,
  | 'value'
  | 'label'
  | 'editor'
  | 'inputType'
  | 'options'
  | 'rows'
  | 'pending'
  | 'disabled'
  | 'onSubmit'
  | 'purpose'
  | 'weight'
  | 'tone'
  | 'align'
>;

export function useEditableField({
  value,
  editor = 'input',
  options,
  pending = false,
  disabled = false,
  onSubmit,
  purpose,
  weight,
  tone,
  align,
}: UseEditableFieldOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const displayRef = useRef<HTMLElement>(null);
  const submittingRef = useRef(false);
  const styles = editableTextVariants({ purpose, weight, tone, align });

  const isBlocked = disabled || pending;

  const beginEditing = () => {
    if (isBlocked) return;
    setIsEditing(true);
  };

  const handleDisplayKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isBlocked) return;
    if (event.key === 'Enter' || event.key === 'F2') {
      event.preventDefault();
      beginEditing();
    }
  };

  const focusDisplay = () => {
    setTimeout(() => {
      displayRef.current?.focus();
    }, 0);
  };

  const submitValue = async (nextValue: string) => {
    if (pending || submittingRef.current) return;
    submittingRef.current = true;
    try {
      await onSubmit?.(nextValue);
    } catch {
      focusDisplay();
    } finally {
      submittingRef.current = false;
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || submittingRef.current) return;
    const nextValue = String(
      new FormData(event.currentTarget).get('value') ?? '',
    );
    setIsEditing(false);
    void submitValue(nextValue);
  };

  const handleSelectChange = (nextValue: string) => {
    if (pending || submittingRef.current) return;
    setIsEditing(false);
    void submitValue(nextValue);
  };

  const handleBlurCancel = () => {
    if (pending) return;
    setIsEditing(false);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (pending) return;
      setIsEditing(false);
    }
  };

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (pending) return;
      setIsEditing(false);
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (pending || submittingRef.current) return;
      const nextValue = event.currentTarget.value;
      setIsEditing(false);
      void submitValue(nextValue);
    }
  };

  const displayValue =
    editor === 'select' && (options as readonly EditableOption[] | undefined)
      ? ((options as readonly EditableOption[]).find(
          (opt) => opt.value === value,
        )?.label ?? value)
      : value;

  const isEmptyDisplay = displayValue === '';

  return {
    isEditing,
    setIsEditing,
    displayRef,
    submittingRef,
    styles,
    isBlocked,
    displayValue,
    isEmptyDisplay,
    beginEditing,
    handleDisplayKeyDown,
    handleSubmit,
    handleSelectChange,
    handleBlurCancel,
    handleInputKeyDown,
    handleTextareaKeyDown,
  };
}
