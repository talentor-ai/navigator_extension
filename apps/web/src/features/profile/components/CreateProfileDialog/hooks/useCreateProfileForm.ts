import { useEffect, useRef, useState } from 'react';
import { INITIAL_VALUES } from '../constants';
import type { FieldErrors, FormValues } from '../types';
import { validate } from '../utils';

type UseCreateProfileFormArgs = {
  open: boolean;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void | Promise<void>;
};

export const useCreateProfileForm = ({
  open,
  pending,
  onCancel,
  onSubmit,
}: UseCreateProfileFormArgs) => {
  const [values, setValues] = useState<FormValues>({ ...INITIAL_VALUES });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const hadOpenRef = useRef(false);

  useEffect(() => {
    if (open) {
      hadOpenRef.current = true;
    }
    if (!open && hadOpenRef.current) {
      // Reset only after close; keeps values on failed submit (open stays true)
      setValues({ ...INITIAL_VALUES });
      setFieldErrors({});
      hadOpenRef.current = false;
    }
  }, [open]);

  const handleChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    const trimmed: FormValues = {
      name: values.name.trim(),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      locale: values.locale.trim(),
    };
    await onSubmit(trimmed);
    // Do not reset here; parent controls open and reset happens on close
  };

  const handleCancel = () => {
    if (pending) return;
    onCancel();
  };

  return {
    values,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleCancel,
  };
};
