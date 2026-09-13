/* eslint-disable react-refresh/only-export-components */
import { useEditableField } from './hooks/useEditableField';
import { EditableDisplay } from './components/EditableDisplay';
import { EditableError } from './components/EditableError';
import { EditableInputEditor } from './components/EditableInputEditor';
import { EditableSelectEditor } from './components/EditableSelectEditor';
import { EditableTextareaEditor } from './components/EditableTextareaEditor';
import type { EditableFieldProps } from './types';

export { editableTextVariants } from './constants';
export type {
  EditableEditor,
  EditableFieldProps,
  EditableInputType,
  EditableOption,
} from './types';

export function EditableField({
  value,
  label,
  emptyText,
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
  pending = false,
  error,
  validate,
  onSubmit,
}: EditableFieldProps) {
  const {
    isEditing,
    displayRef,
    styles,
    isBlocked,
    displayValue,
    isEmptyDisplay,
    validationError,
    beginEditing,
    handleDisplayKeyDown,
    handleSubmit,
    handleSelectChange,
    handleBlurCancel,
    handleInputKeyDown,
    handleTextareaKeyDown,
  } = useEditableField({
    value,
    label,
    editor,
    inputType,
    options,
    rows,
    pending,
    disabled,
    onSubmit,
    validate,
    purpose,
    weight,
    tone,
    align,
  });

  const defaultEmptyText = `Add ${label.charAt(0).toLowerCase()}${label.slice(1)}`;

  const displayContent = isEmptyDisplay ? (
    <span className="text-muted-foreground/70 italic">
      {emptyText ?? defaultEmptyText}
    </span>
  ) : (
    displayValue
  );

  const errorNode = <EditableError error={error ?? validationError} />;

  if (isEditing) {
    if (editor === 'select') {
      return (
        <>
          <EditableSelectEditor
            value={value}
            label={label}
            pending={pending}
            styles={styles}
            className={className}
            options={options}
            onValueChange={handleSelectChange}
            onBlur={handleBlurCancel}
          />
          {errorNode}
        </>
      );
    }

    if (editor === 'textarea') {
      return (
        <>
          <EditableTextareaEditor
            value={value}
            label={label}
            rows={rows}
            pending={pending}
            styles={styles}
            className={className}
            onSubmit={handleSubmit}
            onBlur={handleBlurCancel}
            onKeyDown={handleTextareaKeyDown}
          />
          {errorNode}
        </>
      );
    }

    return (
      <>
        <EditableInputEditor
          value={value}
          label={label}
          inputType={inputType}
          pending={pending}
          styles={styles}
          className={className}
          onSubmit={handleSubmit}
          onBlur={handleBlurCancel}
          onKeyDown={handleInputKeyDown}
        />
        {errorNode}
      </>
    );
  }

  return (
    <>
      <EditableDisplay
        displayAs={Display}
        displayRef={displayRef}
        label={label}
        styles={styles}
        className={className}
        isBlocked={isBlocked}
        pending={pending}
        displayContent={displayContent}
        onDoubleClick={beginEditing}
        onKeyDown={handleDisplayKeyDown}
      />
      {errorNode}
    </>
  );
}
